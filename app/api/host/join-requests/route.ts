import { NextResponse } from "next/server";
import { getHostJoinRequests } from "@/lib/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const q = searchParams.get("q") ?? undefined;

  const isValidStatus =
    status === "pending" || status === "approved" || status === "rejected";

  const items = await getHostJoinRequests({
    status: isValidStatus ? status : undefined,
    q
  });

  return NextResponse.json(items);
}

