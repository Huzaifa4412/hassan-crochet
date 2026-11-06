import { getCustomizationPrice, PRODUCT_CURRENCY } from "@/lib/pricing";

export const CART_KEY = "knitty-petit-cart-v1";
export const MAX_CART_LINES = 12;
export const MAX_QUANTITY = 20;

export interface CartItem {
  id: string;
  productId: string;
  slug: string;
  title: string;
  category: string;
  color: string;
  iconCount: number;
  details: string;
  design: string;
  preview?: string;
  quantity: number;
}

export function unitPrice(item: Pick<CartItem, "iconCount">) {
  return getCustomizationPrice(item.iconCount);
}

export function cartValue(items: CartItem[]) {
  return items.reduce((sum, item) => sum + unitPrice(item) * item.quantity, 0);
}

export function parseCart(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];
  const ids = new Set<string>();
  return value.slice(0, MAX_CART_LINES).filter((item): item is CartItem => {
    if (!item || typeof item !== "object") return false;
    const valid = ["id", "productId", "slug", "title", "category", "color", "details", "design"].every(
      (key) => typeof item[key] === "string" && item[key].length <= 16000,
    ) && item.id.length > 0 && item.productId.length > 0
      && /^[a-z0-9-]+$/.test(item.slug)
      && Number.isInteger(item.iconCount) && item.iconCount >= 0 && item.iconCount <= 30
      && Number.isInteger(item.quantity) && item.quantity >= 1 && item.quantity <= MAX_QUANTITY
      && (item.preview === undefined || (typeof item.preview === "string"
        && item.preview.length <= 250000 && /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(item.preview)));
    if (!valid || ids.has(item.id)) return false;
    ids.add(item.id);
    return true;
  });
}

// Personalization text and design previews must never enter analytics payloads.
export function gaCartPayload(items: CartItem[]) {
  return {
    currency: PRODUCT_CURRENCY,
    value: cartValue(items),
    items: items.map((item) => ({
      item_id: item.productId,
      item_name: item.title,
      item_brand: "Knitty Petit",
      item_category: item.category,
      item_variant: item.color,
      price: unitPrice(item),
      quantity: item.quantity,
    })),
  };
}

export function metaCartPayload(items: CartItem[]) {
  return {
    currency: PRODUCT_CURRENCY,
    value: cartValue(items),
    content_type: "product",
    content_ids: [...new Set(items.map((item) => item.productId))],
    contents: items.map((item) => ({ id: item.productId, quantity: item.quantity, item_price: unitPrice(item) })),
    num_items: items.reduce((sum, item) => sum + item.quantity, 0),
  };
}
