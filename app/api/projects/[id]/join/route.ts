import { NextResponse } from "next/server";
import { z } from "zod";
import { pool } from "@/lib/db";

const joinSchema = z.object({
  email: z.string().email(),
  full_name: z.string().min(2),
  role_id: z.string().uuid().nullable().optional(),
  motivation: z.string().min(20),
  hours_per_week: z.number().int().min(1).max(40)
});

type Params = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, { params }: Params) {
  const { id: projectId } = await params;
  const payload = await request.json();
  const parsed = joinSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid payload", errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { email, full_name, role_id, motivation, hours_per_week } = parsed.data;
  let client: import("pg").PoolClient | null = null;

  try {
    client = await pool.connect();
    await client.query("begin");

    await client.query(
      `
      insert into users (email, full_name, timezone, weekly_hours)
      values ($1, $2, 'Europe/Copenhagen', $3)
      on conflict (email) do update set
        full_name = excluded.full_name,
        weekly_hours = excluded.weekly_hours
      `,
      [email, full_name, hours_per_week]
    );

    await client.query(
      `
      insert into project_join_requests (
        project_id, role_id, applicant_email, applicant_name, motivation, hours_per_week, status
      )
      values ($1, $2, $3, $4, $5, $6, 'pending')
      `,
      [projectId, role_id ?? null, email, full_name, motivation, hours_per_week]
    );

    await client.query("commit");
    return NextResponse.json({ ok: true });
  } catch {
    if (client) {
      try {
        await client.query("rollback");
      } catch {
        // ignore
      }
    }

    return NextResponse.json({ ok: true, demo: true });
  } finally {
    if (client) {
      client.release();
    }
  }
}

