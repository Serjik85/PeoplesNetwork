import { NextResponse } from "next/server";
import { getPublicStats } from "@/lib/queries";

export async function GET() {
  const data = await getPublicStats();
  return NextResponse.json(data);
}

