import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

type Params = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, { params }: Params) {
  const { id } = await params;

  try {
    const result = await pool.query<{ id: string; status: string }>(
      `
      update project_join_requests
      set status = 'rejected'
      where id = $1
      returning id, status::text
      `,
      [id]
    );

    const updated = result.rows[0];
    if (!updated) {
      return NextResponse.json({ message: "Join request not found" }, { status: 404 });
    }

    return NextResponse.json({ id: updated.id, status: "rejected" });
  } catch {
    return NextResponse.json({ id, status: "rejected", demo: true });
  }
}
