import { NextRequest, NextResponse } from "next/server";
import { getProjects } from "@/lib/queries";

export async function GET(request: NextRequest) {
  const stage = request.nextUrl.searchParams.get("stage") ?? undefined;
  const projects = await getProjects(stage);
  return NextResponse.json(projects);
}

