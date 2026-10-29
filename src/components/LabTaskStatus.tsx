import { db } from "@/lib/db";
import { currentUser } from "@/lib/user";
import { LabDone } from "@/components/ProgramActions";
import { hasProof } from "@/lib/program";
import type { Sql } from "@/lib/assign";

// "Mark this lab task as completed" for a library lesson. The state is saved per person and shows on the facilitator Results page.
export default async function LabTaskStatus({ day }: { day: number }) {
  const user = await currentUser();
  let done = false;
  let note = "";
  let proofSaved = false;
  if (user) {
    try {
      const sql = await db();
      const rows = await sql`SELECT note FROM completions WHERE email = ${user.email} AND activity = ${`lab-${day}`}`;
      done = rows.length > 0;
      note = (rows[0]?.note as string | null) ?? "";
      proofSaved = await hasProof(sql as unknown as Sql, user.email, `lab-${day}`);
    } catch {
      // The lesson still works if the status cannot be read; the button just starts unchecked.
    }
  }
  return (
    <section className="card p-5">
      <h2 className="text-lg font-bold">Lab task</h2>
      <p className="text-sm text-muted">Finished the lab for this lesson? Mark it so your facilitator can see your progress. You can undo it.</p>
      <LabDone id={`lab-${day}`} label="Mark lab task as completed" initialDone={done} initialNote={note} proof hasProof={proofSaved} />
    </section>
  );
}
