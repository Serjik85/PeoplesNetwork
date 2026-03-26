import { NextResponse } from "next/server";
import { z } from "zod";
import { pool } from "@/lib/db";

const waitlistSchema = z.object({
  email: z.string().email(),
  full_name: z.string().min(2),
  role: z.enum(["builder", "project_owner", "both"]).default("builder"),
  stack: z.array(z.string()).default([]),
  weekly_hours: z.number().int().min(1).max(80),
  timezone: z.string().min(3)
});

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = waitlistSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid payload", errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { email, full_name, role, stack, weekly_hours, timezone } = parsed.data;
  let client: import("pg").PoolClient | null = null;

  try {
    client = await pool.connect();
    await client.query("begin");

    await client.query(
      `
      insert into waitlist_submissions (
        email, full_name, role, stack, weekly_hours, timezone
      )
      values ($1, $2, $3, $4::text[], $5, $6)
      on conflict (email) do update set
        full_name = excluded.full_name,
        role = excluded.role,
        stack = excluded.stack,
        weekly_hours = excluded.weekly_hours,
        timezone = excluded.timezone,
        updated_at = now()
      `,
      [email, full_name, role, stack, weekly_hours, timezone]
    );

    await client.query(
      `
      insert into users (email, full_name, role, timezone, weekly_hours)
      values ($1, $2, $3::user_role, $4, $5)
      on conflict (email) do update set
        full_name = excluded.full_name,
        role = excluded.role,
        timezone = excluded.timezone,
        weekly_hours = excluded.weekly_hours
      `,
      [email, full_name, role, timezone, weekly_hours]
    );

    await client.query("commit");
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (client) {
      try {
        await client.query("rollback");
      } catch {
        // ignore
      }
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: true, demo: true, message });
  } finally {
    if (client) {
      client.release();
    }
  }
}

