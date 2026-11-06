import { NextResponse } from "next/server";
import { parseEmailSubmission } from "@/lib/checkout-email";
import { emailConfigured, EmailRequestError, sendDesignSummary } from "@/lib/email-delivery.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;
const headers = { "Cache-Control": "no-store" };

export function GET() { return NextResponse.json({ available: emailConfigured() }, { headers }); }

export async function POST(request: Request) {
  try {
    const origin = request.headers.get("origin");
    if (!origin || origin !== new URL(request.url).origin) return NextResponse.json({ message: "Please send your summary from the checkout page." }, { status: 403, headers });
    if (!request.headers.get("content-type")?.startsWith("application/json")) return NextResponse.json({ message: "Invalid request." }, { status: 415, headers });
    if (Number(request.headers.get("content-length") || 0) > 3500000) return NextResponse.json({ message: "This summary is too large. Please reduce the number of designs." }, { status: 413, headers });
    const raw = await request.text();
    if (Buffer.byteLength(raw, "utf8") > 3500000) return NextResponse.json({ message: "This summary is too large. Please reduce the number of designs." }, { status: 413, headers });
    const submission = parseEmailSubmission(JSON.parse(raw));
    if (!submission) return NextResponse.json({ message: "Check your email address and saved designs, then try again." }, { status: 400, headers });
    const ip = (request.headers.get("x-vercel-forwarded-for") || request.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim();
    return NextResponse.json(await sendDesignSummary(submission, ip), { status: 202, headers });
  } catch (error) {
    if (error instanceof SyntaxError) return NextResponse.json({ message: "Invalid request." }, { status: 400, headers });
    if (error instanceof EmailRequestError) return NextResponse.json({ message: error.message }, { status: error.status, headers });
    // Never return provider errors, tokens, customer names, or email addresses.
    console.error("Checkout email request failed");
    return NextResponse.json({ message: "Your summary could not be emailed. Please retry, or copy your details and continue to Etsy." }, { status: 503, headers });
  }
}
