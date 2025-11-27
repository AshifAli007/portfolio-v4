import { NextResponse } from "next/server";
import { recordEvent, type EventType } from "@/lib/analytics";

const allowedEvents: Set<EventType> = new Set([
  "page_view",
  "coffee_click",
  "contact_submit",
  "project_click",
]);

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { event?: string; page?: string; target?: string; meta?: Record<string, unknown> }
    | null;

  const eventType = body?.event as EventType | undefined;
  const page = body?.page?.slice(0, 200);
  const target = body?.target?.slice(0, 200);

  if (!eventType || !allowedEvents.has(eventType)) {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  }

  try {
    await recordEvent({ eventType, page: page ?? null, target: target ?? null, meta: body?.meta });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to record analytics event", error);
    return NextResponse.json({ error: "Failed to record event" }, { status: 500 });
  }
}
