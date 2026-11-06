import "server-only";
import { createHmac, randomUUID } from "node:crypto";
import { createClient } from "next-sanity";
import { Resend } from "resend";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { getProductBySlug } from "@/sanity/queries";
import { absoluteUrl } from "@/lib/seo";
import { getCustomizationPrice } from "@/lib/pricing";
import { validEmail, renderSummaryEmail, type EmailSubmission, type ResolvedEmailDesign } from "@/lib/checkout-email";

export class EmailRequestError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export function emailConfigured() {
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_REQUEST_SECRET && process.env.SANITY_API_TOKEN
    && from && validEmail(from.match(/<([^>]+)>$/)?.[1] || from)
    && validEmail(process.env.CHECKOUT_NOTIFICATION_EMAIL));
}

interface DispatchRecord {
  _id: string;
  _rev: string;
  _createdAt: string;
  customerId?: string;
  merchantId?: string;
  leaseUntil?: string;
  leaseOwner?: string;
  rateLimitApplied?: boolean;
}

export interface DeliveryState { customerId?: string; merchantId?: string }
export interface EmailToSend {
  from: string; to: string; replyTo: string; subject: string; html: string; text: string;
  attachments: { filename: string; content: string; contentType: string }[];
}

// Each recipient has its own durable status and provider idempotency key.
// A merchant failure can be retried without sending the customer's email again.
export async function deliverPair(options: {
  state: DeliveryState; key: string; customer: EmailToSend; merchant: EmailToSend;
  send: (email: EmailToSend, key: string) => Promise<string>;
  save: (channel: "customerId" | "merchantId", id: string) => Promise<void>;
}) {
  const result = { ...options.state };
  for (const channel of ["customerId", "merchantId"] as const) {
    if (result[channel]) continue;
    let sentId: string | undefined;
    for (let attempt = 0; attempt < 2; attempt++) {
      try { sentId = await options.send(channel === "customerId" ? options.customer : options.merchant, `${options.key}/${channel}`); break; }
      catch { if (attempt === 0) await new Promise((resolve) => setTimeout(resolve, 350)); }
    }
    if (!sentId) continue;
    await options.save(channel, sentId);
    result[channel] = sentId;
  }
  return result;
}

export async function sendDesignSummary(input: EmailSubmission, ip: string) {
  if (!emailConfigured()) throw new EmailRequestError(503, "Email summaries are temporarily unavailable. You can still copy your details and continue to Etsy.");
  const hash = (value: string) => createHmac("sha256", process.env.EMAIL_REQUEST_SECRET!).update(value).digest("hex");
  const client = createClient({ projectId, dataset, apiVersion, token: process.env.SANITY_API_TOKEN, useCdn: false });
  const resend = new Resend(process.env.RESEND_API_KEY);
  const items: ResolvedEmailDesign[] = await Promise.all(input.items.map(async (item) => {
    const product = await getProductBySlug(item.slug);
    if (!product || product.inStock === false || !product.etsyLink) throw new EmailRequestError(400, "A listing is unavailable. Review your cart before emailing it.");
    const url = new URL(product.etsyLink);
    if (url.protocol !== "https:" || !["etsy.com", "www.etsy.com"].includes(url.hostname)
      || !/^\/listing\/\d+(\/|$)/.test(url.pathname)) throw new EmailRequestError(400, "The Etsy listing is unavailable.");
    return { ...item, title: product.title, price: getCustomizationPrice(item.iconCount),
      productUrl: absoluteUrl(`/products/${product.slug.current}`), etsyLink: url.href };
  }));
  const fingerprint = hash(JSON.stringify({ ...input, items }));
  const id = `emailDispatch.${fingerprint}`;
  const reference = `KP-${fingerprint.slice(0, 12).toUpperCase()}`;
  // These public-dataset coordination records contain only HMACs, counters,
  // timestamps and provider IDs. Never persist names, addresses, or previews.
  await client.createIfNotExists({ _id: id, _type: "emailDispatch", kind: "checkout_summary" });
  const record = await client.getDocument<DispatchRecord>(id);
  if (!record) throw new EmailRequestError(503, "Your email request could not be saved. Please try again.");
  if (record.customerId && record.merchantId) return { reference, accepted: true, duplicate: true };
  if (Date.now() - Date.parse(record._createdAt) > 23 * 60 * 60 * 1000) {
    throw new EmailRequestError(409, "This email request has expired. Refresh checkout to send a new summary.");
  }
  if (record.leaseUntil && Date.parse(record.leaseUntil) > Date.now()) throw new EmailRequestError(409, "Your summary is being sent. Please wait a moment before retrying.");
  const leaseOwner = randomUUID();
  try {
    await client.patch(id).ifRevisionId(record._rev).set({ leaseOwner, leaseUntil: new Date(Date.now() + 90000).toISOString() }).commit();
  } catch { throw new EmailRequestError(409, "Your summary is being sent. Please wait a moment before retrying."); }

  async function consumeBucket(scope: string, value: string, windowMs: number, limit: number) {
    const bucketId = `emailLimit.${hash(`${scope}:${value}:${Math.floor(Date.now() / windowMs)}`)}`;
    await client.createIfNotExists({ _id: bucketId, _type: "emailRateLimit", count: 0,
      expiresAt: new Date(Date.now() + windowMs * 2).toISOString() });
    for (let attempt = 0; attempt < 5; attempt++) {
      const bucket = await client.getDocument<{ _rev: string; count: number }>(bucketId);
      if (!bucket || bucket.count >= limit) throw new EmailRequestError(429, "Too many email requests. Please try later or continue to Etsy.");
      try { await client.patch(bucketId).ifRevisionId(bucket._rev).inc({ count: 1 }).commit(); return; }
      catch { /* Retry a concurrent counter update. */ }
    }
    throw new EmailRequestError(503, "Email is busy. Please try again shortly.");
  }

  try {
    if (!record.rateLimitApplied) {
      await consumeBucket("ip", ip, 15 * 60 * 1000, 5);
      await consumeBucket("recipient", input.email, 60 * 60 * 1000, 2);
      await client.patch(id).set({ rateLimitApplied: true }).commit();
    }
    const owner = process.env.CHECKOUT_NOTIFICATION_EMAIL!;
    const shared = { from: process.env.RESEND_FROM_EMAIL! };
    const result = await deliverPair({
      state: record, key: `checkout-summary/${fingerprint}`,
      customer: { ...shared, to: input.email, replyTo: process.env.RESEND_REPLY_TO_EMAIL || owner,
        ...renderSummaryEmail({ ...input, items, reference, merchant: false }) },
      merchant: { ...shared, to: owner, replyTo: input.email,
        ...renderSummaryEmail({ ...input, items, reference, merchant: true }) },
      send: async (email, idempotencyKey) => {
        const { data, error } = await resend.emails.send(email, { idempotencyKey });
        if (error || !data?.id) {
          console.error("Checkout email provider request failed", { code: error?.name || "missing_response" });
          throw new Error("Email provider did not accept the request");
        }
        return data.id;
      },
      save: async (channel, emailId) => { await client.patch(id).set({ [channel]: emailId }).commit(); },
    });
    if (!result.customerId || !result.merchantId) throw new EmailRequestError(503, "Email sending is delayed. Please retry; copies already sent will not be duplicated. You can continue to Etsy.");
    return { reference, accepted: true, duplicate: false };
  } finally {
    const current = await client.getDocument<DispatchRecord>(id).catch(() => null);
    if (current?.leaseOwner === leaseOwner) {
      await client.patch(id).ifRevisionId(current._rev).set({ leaseUntil: new Date(0).toISOString() }).commit().catch(() => {});
    }
  }
}
