import { NextResponse } from "next/server";

const baseLink =
  process.env.STRIPE_COFFEE_LINK ??
  process.env.STRIPE_PAYMENT_LINK ??
  "https://buy.stripe.com/3cI7sLdeQc3x7dy6Gg6kg00";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { quantity?: number };
  const quantity = Math.max(1, body.quantity ?? 1);

  const separator = baseLink.includes("?") ? "&" : "?";
  const url = `${baseLink}${separator}prefilled_quantity=${quantity}`;

  return NextResponse.json({ url });
}
