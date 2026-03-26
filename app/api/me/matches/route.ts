import { NextRequest, NextResponse } from "next/server";
import { getMatchesByEmail } from "@/lib/queries";

export async function GET(request: NextRequest) {
  const fallbackEmail = process.env.DEMO_USER_EMAIL ?? "anna@example.com";
  const email = request.nextUrl.searchParams.get("email") ?? fallbackEmail;
  const matches = await getMatchesByEmail(email);
  return NextResponse.json(matches);
}

