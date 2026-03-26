import { NextResponse } from "next/server";
import { getCuratorQueue } from "@/lib/queries";

export async function GET() {
  const data = await getCuratorQueue();
  return NextResponse.json(data);
}

