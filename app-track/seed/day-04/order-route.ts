// Day 4 (Dev) seeded bug. Paste into src/app/api/orders/[id]/route.ts of your Order Desk app
// (copy seed/orders.json to src/data/orders.json first).
// GET /api/orders/o-1001 works. GET /api/orders/nope returns a 500: use Chat to find the ROOT cause.
import { NextResponse } from "next/server";
import orders from "@/data/orders.json";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = orders.find((o) => o.id === id);
  return NextResponse.json({ id: order.id, total: order.total, status: order.status });
}
