import { NextResponse } from "next/server";
import { getStravaActivities } from "@/lib/strava/aggregator";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const activities = await getStravaActivities();
    return NextResponse.json(activities, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch Strava activities", error);
    return NextResponse.json({ error: "Unable to fetch Strava activities" }, { status: 500 });
  }
}
