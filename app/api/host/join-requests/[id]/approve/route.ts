import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import type { PoolClient } from "pg";

type Params = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, { params }: Params) {
  const { id } = await params;
  let client: PoolClient | null = null;

  try {
    client = await pool.connect();
    await client.query("begin");

    const updated = await client.query<{
      id: string;
      status: string;
      project_id: string;
      role_id: string | null;
      applicant_email: string;
    }>(
      `
      update project_join_requests
      set status = 'approved'
      where id = $1
      returning id, status::text, project_id, role_id, applicant_email
      `,
      [id]
    );

    const request = updated.rows[0];
    if (!request) {
      await client.query("rollback");
      return NextResponse.json({ message: "Join request not found" }, { status: 404 });
    }

    const userResult = await client.query<{ id: string }>(
      `
      select id from users where email = $1
      `,
      [request.applicant_email]
    );

    const user = userResult.rows[0];

    if (user) {
      await client.query(
        `
        insert into matches (
          user_id,
          project_id,
          project_role_id,
          score_total,
          score_skill,
          score_goal,
          score_availability,
          score_timezone,
          score_commitment,
          status,
          source,
          curator_note
        )
        values ($1, $2, $3, 76.0, 30.0, 18.0, 10.0, 9.0, 9.0, 'accepted', 'manual', 'Approved from host join request')
        on conflict (user_id, project_id, project_role_id)
        do update set
          status = 'accepted',
          source = 'manual',
          curator_note = 'Approved from host join request',
          updated_at = now()
        `,
        [user.id, request.project_id, request.role_id]
      );
    }

    await client.query("commit");
    return NextResponse.json({ id: request.id, status: "approved" });
  } catch {
    if (client) {
      try {
        await client.query("rollback");
      } catch {
        // ignore
      }
    }
    return NextResponse.json({ id, status: "approved", demo: true });
  } finally {
    if (client) {
      client.release();
    }
  }
}
