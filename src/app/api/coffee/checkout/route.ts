import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const priceId = process.env.STRIPE_COFFEE_PRICE_ID ?? process.env.STRIPE_PRICE_ID;
const defaultCurrency = process.env.STRIPE_COFFEE_CURRENCY ?? "usd";

const stripe = stripeSecret ? new Stripe(stripeSecret) : null;

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 500 });
  }

  const origin = req.headers.get("origin") ?? new URL(req.url).origin;
  const fallbackAmountCents = (() => {
    const envVal = Number(process.env.STRIPE_COFFEE_AMOUNT ?? "500");
    return Number.isFinite(envVal) && envVal > 0 ? Math.round(envVal) : 500;
  })();

  const body = (await req.json().catch(() => ({}))) as { quantity?: number };
  const quantity = Math.max(1, body.quantity ?? 1);

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = priceId
    ? [{ price: priceId, quantity }]
    : [
        {
          price_data: {
            currency: defaultCurrency,
            product_data: { name: "Buy me a coffee" },
            unit_amount: fallbackAmountCents,
          },
          quantity,
        },
      ];

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: process.env.STRIPE_SUCCESS_URL ?? `${origin}/?coffee=success`,
      cancel_url: process.env.STRIPE_CANCEL_URL ?? `${origin}/?coffee=cancelled`,
      metadata: { type: "coffee" },
    });

    if (!session.url) {
      throw new Error("Stripe session did not return a redirect URL");
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error", error);
    return NextResponse.json(
      { error: "Unable to start checkout. Please try again in a moment." },
      { status: 500 },
    );
  }
}
