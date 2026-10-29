// Single source of truth for public store facts shown on the site and in
// structured data. Every value here must match what shoppers see on Etsy.
// Update these when the Etsy shop changes — never invent or inflate numbers.

export const ETSY_SHOP_URL = "https://www.etsy.com/shop/knittypetit";
export const ETSY_REVIEWS_URL = `${ETSY_SHOP_URL}#reviews`;

// Commercial terms remain on Etsy until the merchant verifies them here.
export const storeFacts = {
  brandLine: "Hand-embroidered name sweaters",
  location: { label: "our studio" },
  sizes: "available sizes on Etsy",
  material: "knit fabric",
} as const;

// Real, current sale only. Set `endsAt` to null when there is no sale and the
// announcement bar hides itself automatically.
export const currentSale: { label: string; endsAt: string | null } = {
  label: "",
  endsAt: null,
};

// Paste real Etsy reviews here word for word (first name + initial only, with
// the buyer's permission for any photo). Leave empty rather than writing your own.
export interface RealReview {
  name: string;
  text: string;
  rating: number;
  date: string; // e.g. "Oct 2026"
  image?: string;
}
export const realReviews: RealReview[] = [];

export function withEtsyUtm(url: string, campaign = "product") {
  try {
    const u = new URL(url);
    u.searchParams.set("utm_source", "knittypetit");
    u.searchParams.set("utm_medium", "site");
    u.searchParams.set("utm_campaign", campaign);
    return u.toString();
  } catch {
    return url;
  }
}
