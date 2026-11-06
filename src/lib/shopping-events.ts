import * as google from "@/lib/gtag";
import * as meta from "@/lib/fpixel";
import { gaCartPayload, metaCartPayload, type CartItem } from "@/lib/cart";

type ShoppingEvent = "view_item" | "add_to_cart" | "remove_from_cart" | "view_cart" | "begin_checkout";
const metaEvents: Partial<Record<ShoppingEvent, string>> = {
  view_item: "ViewContent", add_to_cart: "AddToCart", begin_checkout: "InitiateCheckout",
};

export function trackShoppingEvent(name: ShoppingEvent, items: CartItem[]) {
  if (items.length === 0) return;
  google.event(name, gaCartPayload(items));
  const payload = metaCartPayload(items);
  if (metaEvents[name]) meta.event(metaEvents[name], payload, { eventID: crypto.randomUUID() });
  else meta.customEvent(name === "view_cart" ? "ViewCart" : "RemoveFromCart", payload);
}

export function trackEtsyHandoff(item: CartItem) {
  google.event("etsy_checkout_click", { ...gaCartPayload([item]), destination: "etsy" });
  meta.customEvent("EtsyCheckoutClick", { ...metaCartPayload([item]), destination: "etsy" });
}
