import { MAX_CART_LINES, MAX_QUANTITY } from "@/lib/cart";
import { formatPrice } from "@/lib/pricing";

export interface EmailDesign {
  id: string;
  slug: string;
  color: string;
  iconCount: number;
  quantity: number;
  details: string;
  preview?: string;
}

export interface EmailSubmission {
  requestId: string;
  name: string;
  email: string;
  items: EmailDesign[];
}

export interface ResolvedEmailDesign extends EmailDesign {
  title: string;
  price: number;
  productUrl: string;
  etsyLink: string;
}

export function validEmail(value: unknown): value is string {
  return typeof value === "string" && value.length <= 254
    && /^[^\s<>@,;]+@[^\s<>@,;]+\.[^\s<>@,;]+$/.test(value);
}

export function parseEmailSubmission(value: unknown): EmailSubmission | null {
  if (!value || typeof value !== "object") return null;
  const body = value as Record<string, unknown>;
  if (typeof body.requestId !== "string" || !/^[a-f0-9-]{36}$/i.test(body.requestId)
    || typeof body.name !== "string" || body.name.trim().length > 80 || /[\r\n\x00-\x1f]/.test(body.name)
    || !validEmail(body.email) || (body.website !== undefined && body.website !== "")
    || !Array.isArray(body.items) || !body.items.length || body.items.length > MAX_CART_LINES) return null;
  const ids = new Set<string>();
  const items: EmailDesign[] = [];
  for (const raw of body.items) {
    if (!raw || typeof raw !== "object") return null;
    const item = raw as Record<string, unknown>;
    if (typeof item.id !== "string" || !/^[a-z0-9-]{1,100}$/i.test(item.id) || ids.has(item.id)
      || typeof item.slug !== "string" || !/^[a-z0-9-]{1,200}$/.test(item.slug)
      || typeof item.color !== "string" || item.color.length > 100 || /[\r\n\x00-\x1f]/.test(item.color)
      || !Number.isInteger(item.iconCount) || Number(item.iconCount) < 0 || Number(item.iconCount) > 30
      || !Number.isInteger(item.quantity) || Number(item.quantity) < 1 || Number(item.quantity) > MAX_QUANTITY
      || typeof item.details !== "string" || item.details.length > 8000 || /\x00/.test(item.details)
      || (item.preview !== undefined && (typeof item.preview !== "string" || item.preview.length > 250000
        || !/^data:image\/jpeg;base64,\/9j\/[A-Za-z0-9+/=]+$/.test(item.preview)))) return null;
    ids.add(item.id);
    items.push({ id: item.id, slug: item.slug, color: item.color, iconCount: Number(item.iconCount),
      quantity: Number(item.quantity), details: item.details, ...(item.preview ? { preview: item.preview as string } : {}) });
  }
  return { requestId: body.requestId, name: body.name.trim(), email: body.email.trim().toLowerCase(), items };
}

export function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);
}

export function renderSummaryEmail(input: {
  name: string; email: string; items: ResolvedEmailDesign[]; reference: string; merchant: boolean;
}) {
  const { name, email, items, reference, merchant } = input;
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const heading = merchant ? "A new design request" : "Your design, ready for Etsy";
  const intro = merchant ? `${name || "A customer"} requested an email copy of their saved designs.`
    : `Hi${name ? ` ${name}` : ""}, here are your saved designs and the links to complete your order on Etsy.`;
  const sections = items.map((item, index) => `<section style="padding:20px 0;border-top:1px solid #ead7c7">
    <h2 style="margin:0 0 10px;font-size:19px">Design ${index + 1}: ${escapeHtml(item.title)}</h2>
    <p>${escapeHtml(item.color)} · Quantity ${item.quantity} · ${formatPrice(item.price)} USD each</p>
    <p style="font-weight:bold">${formatPrice(item.price * item.quantity)} USD</p>
    <pre style="white-space:pre-wrap;overflow-wrap:anywhere;font:14px/1.7 Arial,sans-serif;background:#fffaf4;padding:16px;border-radius:12px">${escapeHtml(item.details)}</pre>
    <p><a href="${escapeHtml(item.etsyLink)}" style="color:#a94f2c;font-weight:bold">Open this design on Etsy</a> · <a href="${escapeHtml(item.productUrl)}" style="color:#a94f2c">Product details</a></p>
    ${item.preview ? `<p style="color:#6f5a50;font-size:13px">Your preview is attached as design-${index + 1}.jpg.</p>` : ""}
  </section>`).join("");
  const disclaimer = "This is a design summary, not an order or payment confirmation. Choose the matching size and options on Etsy, paste each design’s personalization details, and set its quantity. Etsy confirms availability, delivery, any taxes, and the final total before payment.";
  const text = [heading, intro, `Reference: ${reference}`, ...(merchant ? [`Customer email: ${email}`] : []),
    ...items.map((item, index) => `Design ${index + 1}: ${item.title}\nColor: ${item.color}\nQuantity: ${item.quantity}\nUnit price: ${formatPrice(item.price)} USD\n${item.details}\nEtsy: ${item.etsyLink}\nProduct: ${item.productUrl}`),
    `Subtotal: ${formatPrice(total)} USD. Free shipping. Taxes confirmed on Etsy.`, disclaimer,
    "Reply to this email if you need help with your design."].join("\n\n");
  return {
    subject: merchant ? `New Knitty Petit design request · ${reference}` : `Your Knitty Petit design summary · ${reference}`,
    text,
    html: `<!doctype html><html lang="en"><body style="margin:0;background:#fffaf4;font:15px/1.7 Arial,sans-serif;color:#31211b"><main style="max-width:640px;margin:32px auto;padding:32px;background:#fff;border:1px solid #ead7c7;border-radius:20px"><p style="font-weight:bold;letter-spacing:2px;color:#a94f2c">KNITTY PETIT</p><h1 style="font-size:30px;line-height:1.2">${heading}</h1><p>${escapeHtml(intro)}</p><p style="color:#6f5a50">Reference: ${escapeHtml(reference)}</p>${merchant ? `<p>Customer: ${escapeHtml(name || "Not supplied")}<br>Email: ${escapeHtml(email)}</p>` : ""}${sections}<p style="font-size:21px;font-weight:bold">Subtotal: ${formatPrice(total)} USD</p><p>Free shipping · Taxes confirmed on Etsy</p><p style="background:#f3dfcf;padding:16px;border-radius:12px">${disclaimer}</p><p>Reply to this email if you need help with your design.</p></main></body></html>`,
    attachments: items.flatMap((item, index) => item.preview ? [{ filename: `design-${index + 1}.jpg`,
      content: item.preview.slice("data:image/jpeg;base64,".length), contentType: "image/jpeg" }] : []),
  };
}
