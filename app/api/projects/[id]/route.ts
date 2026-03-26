import { NextResponse } from "next/server";
import { getProjectById } from "@/lib/queries";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    return NextResponse.json({ message: "Project not found" }, { status: 404 });
  }

  return NextResponse.json(project);
}

