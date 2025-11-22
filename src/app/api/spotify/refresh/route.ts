import { NextResponse } from "next/server";
import { refreshAccessToken } from "@/lib/spotify/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const token = await refreshAccessToken();
  if (!token) return NextResponse.json({ error: "Unable to refresh" }, { status: 400 });
  return NextResponse.json(token);
}
