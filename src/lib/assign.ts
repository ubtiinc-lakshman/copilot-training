// Random pain-point assignment. Uniqueness is enforced by the database (assignments.pain_point_id is UNIQUE and
// (email, week) is the primary key), so two people can never share one and nobody repeats one, even on double clicks.
export type Sql = (strings: TemplateStringsArray, ...values: unknown[]) => Promise<Record<string, unknown>[]>;

export type PainPoint = {
  id: string;
  title: string;
  problem: string;
  mustHave: string[];
  category: string;
  audience: string;
};

export type AssignResult = { status: "assigned"; painPoint: PainPoint } | { status: "none-left" } | { status: "busy" };

const toPainPoint = (row: Record<string, unknown>): PainPoint => ({ id: row.id as string, ...(row.data as Omit<PainPoint, "id">) });

export async function getAssignment(sql: Sql, email: string, week: number): Promise<PainPoint | null> {
  const rows = await sql`SELECT p.id, p.data FROM assignments a JOIN painpoints p ON p.id = a.pain_point_id
    WHERE a.email = ${email} AND a.week = ${week}`;
  return rows[0] ? toPainPoint(rows[0]) : null;
}

export async function assignPainPoint(sql: Sql, email: string, name: string, week: number): Promise<AssignResult> {
  // Retry: a concurrent request may take the pain point we just picked; the UNIQUE index makes our insert a no-op.
  for (let attempt = 0; attempt < 5; attempt++) {
    const existing = await getAssignment(sql, email, week);
    if (existing) return { status: "assigned", painPoint: existing };

    const inserted = await sql`INSERT INTO assignments (email, name, week, pain_point_id)
      SELECT ${email}, ${name}, ${week}, p.id FROM painpoints p
      WHERE p.week = ${week} AND NOT EXISTS (SELECT 1 FROM assignments a WHERE a.pain_point_id = p.id)
      ORDER BY random() LIMIT 1
      ON CONFLICT DO NOTHING
      RETURNING pain_point_id`;
    if (inserted.length === 0) {
      const left = await sql`SELECT count(*)::int AS n FROM painpoints p
        WHERE p.week = ${week} AND NOT EXISTS (SELECT 1 FROM assignments a WHERE a.pain_point_id = p.id)`;
      if (left[0].n === 0) return { status: "none-left" };
    }
  }
  return { status: "busy" };
}
