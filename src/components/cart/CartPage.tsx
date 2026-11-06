"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart, useCartReady, setCartQuantity } from "@/lib/cart-store";
import { cartValue, unitPrice, MAX_QUANTITY } from "@/lib/cart";
import { formatPrice } from "@/lib/pricing";
import { trackShoppingEvent } from "@/lib/shopping-events";
import { Button } from "@/components/ui/button";

export function CartPage() {
  const items = useCart();
  const hydrated = useCartReady();
  const tracked = useRef(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (items.length && !tracked.current) {
      tracked.current = true;
      trackShoppingEvent("view_cart", items);
    }
  }, [items]);

  function update(id: string, quantity: number) {
    try { setCartQuantity(id, quantity); setError(""); }
    catch { setError("Your browser could not save this change. Allow site storage and try again."); }
  }

  return (
    <div className="min-h-[60vh] bg-[#fffaf4] px-4 py-10 text-[#31211b] sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#a94f2c]">Your handmade edit</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">A little something personal.</h1>
        <p className="mt-4 max-w-2xl leading-7 text-[#6f5a50]">Review your saved designs here. You’ll choose the final size, add each design to your Etsy basket, and pay securely on Etsy.</p>
        {error && <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">{error}</p>}
        {!hydrated ? <p role="status" className="mt-10">Loading your saved designs…</p> : items.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-[#d7b9a3] p-10 text-center">
            <ShoppingBag className="mx-auto h-9 w-9 text-[#a94f2c]" />
            <h2 className="mt-4 text-2xl font-semibold">Your cart is ready for a keepsake.</h2>
            <p className="mt-3 text-[#6f5a50]">Personalize a sweater, then add your design to the cart.</p>
            <Button asChild className="mt-6"><Link href="/category/sweaters">Explore name sweaters</Link></Button>
          </div>
        ) : (
          <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1fr_340px]">
            <ul className="space-y-5">
              {items.map((item, index) => (
                <li key={item.id} className="overflow-hidden rounded-3xl border border-[#ead7c7] bg-white p-5 sm:p-6">
                  <div className="flex gap-4 sm:gap-6">
                    {item.preview && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.preview} alt={`Your saved design for ${item.title}`} width={112} height={112} className="h-24 w-24 shrink-0 rounded-2xl bg-[#f6eee8] object-contain sm:h-28 sm:w-28" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold uppercase tracking-widest text-[#a94f2c]">Design {index + 1}</p>
                      <Link href={`/products/${item.slug}`} className="mt-1 block text-lg font-semibold underline-offset-4 hover:underline">{item.title}</Link>
                      <p className="mt-2 text-sm text-[#6f5a50]">{item.color} · Name included · {item.iconCount} icons</p>
                      <p className="mt-2 font-semibold">{formatPrice(unitPrice(item))} USD each</p>
                    </div>
                  </div>
                  <details className="mt-4 text-sm text-[#6f5a50]">
                    <summary className="cursor-pointer py-2 font-semibold">Saved personalization details</summary>
                    <p className="mt-2 whitespace-pre-wrap break-words leading-6">{item.details}</p>
                  </details>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#ead7c7] pt-4">
                    <div className="inline-flex items-center rounded-full border border-[#ead7c7]">
                      <Button size="icon" variant="ghost" className="h-11 w-11 rounded-full" disabled={item.quantity === 1} aria-label={`Decrease quantity for design ${index + 1}`} onClick={() => update(item.id, item.quantity - 1)}><Minus className="h-4 w-4" /></Button>
                      <span aria-label={`Quantity for design ${index + 1}`} className="min-w-8 text-center tabular-nums">{item.quantity}</span>
                      <Button size="icon" variant="ghost" className="h-11 w-11 rounded-full" disabled={item.quantity >= MAX_QUANTITY} aria-label={`Increase quantity for design ${index + 1}`} onClick={() => update(item.id, item.quantity + 1)}><Plus className="h-4 w-4" /></Button>
                    </div>
                    <Button variant="ghost" aria-label={`Remove design ${index + 1}`} onClick={() => update(item.id, 0)}><Trash2 className="mr-2 h-4 w-4" />Remove</Button>
                    <span className="font-semibold tabular-nums">{formatPrice(unitPrice(item) * item.quantity)} USD</span>
                  </div>
                </li>
              ))}
            </ul>
            <aside className="rounded-3xl bg-[#31211b] p-6 text-white lg:sticky lg:top-40">
              <h2 className="text-xl font-semibold">Order summary</h2>
              <dl className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between"><dt>Items ({items.reduce((sum, item) => sum + item.quantity, 0)})</dt><dd>{formatPrice(cartValue(items))} USD</dd></div>
                <div className="flex justify-between"><dt>Shipping</dt><dd>Free</dd></div>
                <div className="flex justify-between"><dt>Taxes</dt><dd>Shown on Etsy</dd></div>
                <div className="flex justify-between border-t border-white/20 pt-4 text-lg font-semibold"><dt>Subtotal</dt><dd>{formatPrice(cartValue(items))} USD</dd></div>
              </dl>
              <Button asChild className="mt-6 h-12 w-full rounded-full bg-[#cf6f3f] text-white hover:bg-[#b85e37]"><Link href="/checkout">Review checkout<ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
              <p className="mt-4 text-sm leading-6 text-[#f3dfcf]">Your designs are saved in this browser. Etsy confirms availability, final options, delivery, taxes, and payment.</p>
              <Link href="/category/sweaters" className="mt-5 inline-block text-sm underline underline-offset-4">Keep browsing</Link>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
