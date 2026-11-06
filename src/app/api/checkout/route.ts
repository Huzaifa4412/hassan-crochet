import { NextResponse } from "next/server";
import { getProductBySlug } from "@/sanity/queries";
import { MAX_CART_LINES, MAX_QUANTITY } from "@/lib/cart";
import { getCustomizationPrice } from "@/lib/pricing";

export interface ReviewedItem {
  id: string;
  title: string;
  etsyLink: string | null;
  available: boolean;
  price: number;
}

export async function POST(request: Request) {
  try {
    const raw = await request.text();
    if (raw.length > 16000) return NextResponse.json({ message: "Cart is too large." }, { status: 413 });
    const items: unknown = JSON.parse(raw);
    if (!Array.isArray(items) || !items.length || items.length > MAX_CART_LINES || !items.every((item) =>
      item && typeof item.id === "string" && item.id.length <= 200
      && typeof item.slug === "string" && /^[a-z0-9-]{1,200}$/.test(item.slug)
      && Number.isInteger(item.iconCount) && item.iconCount >= 0 && item.iconCount <= 30
      && Number.isInteger(item.quantity) && item.quantity >= 1 && item.quantity <= MAX_QUANTITY)) {
      return NextResponse.json({ message: "Review your cart and try again." }, { status: 400 });
    }
    const reviewed: ReviewedItem[] = await Promise.all(items.map(async (item) => {
      const product = await getProductBySlug(item.slug);
      let etsyLink: string | null = null;
      if (product?.etsyLink) {
        const url = new URL(product.etsyLink);
        if (url.protocol === "https:" && ["etsy.com", "www.etsy.com"].includes(url.hostname)
          && /^\/listing\/\d+(\/|$)/.test(url.pathname)) etsyLink = url.href;
      }
      return { id: item.id, title: product?.title || "Unavailable product", etsyLink,
        available: Boolean(product && product.inStock !== false && etsyLink),
        price: getCustomizationPrice(item.iconCount) };
    }));
    return NextResponse.json({ items: reviewed }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof SyntaxError) return NextResponse.json({ message: "Invalid cart." }, { status: 400 });
    return NextResponse.json({ message: "We couldn’t check availability. Please try again." }, { status: 503 });
  }
}
