import { NextResponse } from "next/server";
import { query } from "@/lib/db";

type Params = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, { params }: Params) {
  const { id } = await params;

  try {
    const updated = await query<{ id: string; status: string }>(
      `
      update matches
      set status = 'accepted'
      where id = $1
      returning id, status::text
      `,
      [id]
    );

    if (!updated[0]) {
      return NextResponse.json({ message: "Match not found" }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch {
    return NextResponse.json(
      { message: "Database is unavailable. Start Postgres to save team actions." },
      { status: 503 }
    );
  }
}

