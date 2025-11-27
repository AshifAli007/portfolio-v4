import { NextResponse } from "next/server";
import { fetchAnalyticsSummary } from "@/lib/analytics";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const summary = await fetchAnalyticsSummary();
    return NextResponse.json(summary);
  } catch (error) {
    console.error("Failed to load analytics summary", error);
    return NextResponse.json({ error: "Unable to load analytics" }, { status: 500 });
  }
}
