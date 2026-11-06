"use client";

import { useSyncExternalStore } from "react";
import { CART_KEY, MAX_CART_LINES, MAX_QUANTITY, parseCart, type CartItem } from "@/lib/cart";
import { trackShoppingEvent } from "@/lib/shopping-events";

const empty: CartItem[] = [];
let cachedRaw: string | null | undefined;
let cachedItems = empty;
const changed = "knitty-cart-changed";

function getSnapshot() {
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      try { cachedItems = parseCart(raw ? JSON.parse(raw) : []); }
      catch { cachedItems = empty; }
    }
  } catch { /* A blocked storage area still allows browsing the empty cart. */ }
  return cachedItems;
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(changed, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(changed, callback);
  };
}

function save(items: CartItem[]) {
  // Fail visibly before reporting AddToCart when storage is unavailable or full.
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(changed));
}

export function addCartItem(item: Omit<CartItem, "id" | "quantity">) {
  const current = getSnapshot();
  const existing = current.find((entry) => entry.productId === item.productId
    && entry.color === item.color && entry.design === item.design);
  if (existing && existing.quantity >= MAX_QUANTITY) throw new Error("Quantity limit reached");
  if (!existing && current.length >= MAX_CART_LINES) throw new Error("Cart is full");
  const added = { ...item, id: existing?.id || crypto.randomUUID(), quantity: 1 };
  if (parseCart([added]).length !== 1) throw new Error("Invalid design");
  save(existing ? current.map((entry) => entry.id === existing.id
    ? { ...entry, quantity: entry.quantity + 1 } : entry) : [...current, added]);
  trackShoppingEvent("add_to_cart", [added]);
}

export function setCartQuantity(id: string, quantity: number) {
  if (!Number.isInteger(quantity) || quantity < 0 || quantity > MAX_QUANTITY) return;
  const current = getSnapshot();
  const item = current.find((entry) => entry.id === id);
  if (!item || item.quantity === quantity) return;
  save(quantity === 0 ? current.filter((entry) => entry.id !== id)
    : current.map((entry) => entry.id === id ? { ...entry, quantity } : entry));
  trackShoppingEvent(quantity > item.quantity ? "add_to_cart" : "remove_from_cart",
    [{ ...item, quantity: Math.abs(quantity - item.quantity) }]);
}

export function useCart() {
  return useSyncExternalStore(subscribe, getSnapshot, () => empty);
}

const subscribeReady = () => () => {};
export function useCartReady() {
  return useSyncExternalStore(subscribeReady, () => true, () => false);
}
