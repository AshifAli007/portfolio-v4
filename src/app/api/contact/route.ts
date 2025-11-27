import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactsData } from "@/data/contactsData";

export const dynamic = "force-dynamic";

const resendApiKey = process.env.RESEND_API_KEY;
const fromAddress = process.env.RESEND_FROM_EMAIL;
const toAddress = process.env.RESEND_TO_EMAIL ?? contactsData.email;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const emailOk = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
const escape = (value: string) =>
  value.replace(/[&<>"']/g, (char) =>
    ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[char] ?? char),
  );

export async function POST(req: Request) {
  if (!resend || !fromAddress) {
    return NextResponse.json({ error: "Email service is not configured." }, { status: 500 });
  }

  const body = (await req.json().catch(() => null)) as
    | { name?: string; email?: string; message?: string }
    | null;

  const name = (body?.name ?? "").trim();
  const email = (body?.email ?? "").trim();
  const message = (body?.message ?? "").trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Please include name, email, and message." }, { status: 400 });
  }

  if (!emailOk(email)) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }

  if (message.length > 2000) {
    return NextResponse.json({ error: "Message is too long (max 2000 characters)." }, { status: 400 });
  }

  try {
    await resend.emails.send({
      from: fromAddress,
      to: [toAddress],
      replyTo: email,
      subject: `Portfolio contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #0f172a; line-height: 1.6;">
        <p style="font-size: 16px; margin: 0 0 12px;">You received a new message from your portfolio contact form.</p>
        <p style="margin: 0 0 8px;"><strong>Name:</strong> ${escape(name)}</p>
        <p style="margin: 0 0 8px;"><strong>Email:</strong> ${escape(email)}</p>
        <p style="margin: 16px 0 8px;"><strong>Message:</strong></p>
        <p style="white-space: pre-wrap; background: #f8fafc; padding: 12px; border-radius: 10px; border: 1px solid #e2e8f0;">${escape(message)}</p>
      </div>`,
    });

    // Friendly acknowledgement to sender (best effort)
    await resend.emails.send({
      from: fromAddress,
      to: [email],
      subject: "Thanks for reaching out — I got your message",
      text: `Hi ${name || "there"},\n\nThanks for getting in touch. I received your message and will reply within 3 days.\n\nYou sent:\n${message}\n\n— Ashif`,
      html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #0f172a; line-height: 1.6;">
        <p style="margin: 0 0 10px;">Hi ${escape(name || "there")},</p>
        <p style="margin: 0 0 10px;">Thanks for getting in touch. I received your message and will reply within 3 days.</p>
        <p style="margin: 12px 0 6px;"><strong>Your message:</strong></p>
        <p style="white-space: pre-wrap; background: #f8fafc; padding: 12px; border-radius: 10px; border: 1px solid #e2e8f0;">${escape(message)}</p>
        <p style="margin: 16px 0 0;">— Ashif</p>
      </div>`,
    }).catch((err) => {
      console.error("Failed to send confirmation email", err);
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to send contact email", error);
    return NextResponse.json(
      { error: "Unable to send email right now. Please try again shortly." },
      { status: 500 },
    );
  }
}
