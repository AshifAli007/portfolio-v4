import { NextResponse } from "next/server";

import { getStravaOverview } from "@/lib/strava/aggregator";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const forceRefresh = searchParams.get("force") === "true";

  try {
    const overview = await getStravaOverview({
      forceRefresh,
    });

    return NextResponse.json(overview, {
      status: 200,
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=900",
      },
    });
  } catch (error) {
    console.error("Strava overview handler failed:", error);
    return NextResponse.json(
      { error: "Failed to load Strava data." },
      { status: 500 },
    );
  }
}
