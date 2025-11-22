import { NextResponse } from "next/server";
import { buildAuthUrl } from "@/lib/spotify/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = buildAuthUrl("portfolio-spotify");
  return NextResponse.json({ url });
}
