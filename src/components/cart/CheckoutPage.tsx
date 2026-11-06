"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ExternalLink, Copy, Download, Check } from "lucide-react";
import { useCart, useCartReady } from "@/lib/cart-store";
import { cartValue, type CartItem } from "@/lib/cart";
import { formatPrice } from "@/lib/pricing";
import { trackShoppingEvent, trackEtsyHandoff } from "@/lib/shopping-events";
import type { ReviewedItem } from "@/app/api/checkout/route";
import { Button } from "@/components/ui/button";

export function CheckoutPage() {
  const items = useCart();
  const hydrated = useCartReady();
  const tracked = useRef(false);
  const [review, setReview] = useState<{ key: string; items: ReviewedItem[] } | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const key = JSON.stringify(items.map(({ id, slug, iconCount, quantity }) => ({ id, slug, iconCount, quantity })));

  useEffect(() => {
    if (key === "[]") return;
    const controller = new AbortController();
    fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: key, signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Availability check failed");
        const result = await response.json();
        if (!controller.signal.aborted) { setReview({ key, items: result.items }); setError(""); }
      })
      .catch(() => { if (!controller.signal.aborted) setError("We couldn’t check these listings. Try again before continuing to Etsy."); });
    return () => controller.abort();
  }, [key, attempt]);

  const ready = review?.key === key && review.items.length === items.length;
  useEffect(() => {
    if (!ready || tracked.current || !review?.items.every((item) => item.available)) return;
    tracked.current = true;
    trackShoppingEvent("begin_checkout", items);
  }, [ready, review, items]);

  async function copy(item: CartItem) {
    try {
      await navigator.clipboard.writeText(`${item.details}\nQuantity: ${item.quantity}\nChoose and confirm size on Etsy. Website subtotal: ${formatPrice(cartValue([item]))} USD; free shipping; Etsy confirms taxes and final total.`);
      setCopied(item.id);
    } catch { setError("Copy is unavailable in this browser. Select and copy the personalization details shown below."); }
  }

  return (
    <div className="min-h-[60vh] bg-[#fffaf4] px-4 py-10 text-[#31211b] sm:px-6 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <Link href="/cart" className="text-sm font-semibold text-[#a94f2c] underline underline-offset-4">Back to your cart</Link>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">Your design, ready for Etsy.</h1>
        <p className="mt-4 max-w-2xl leading-7 text-[#6f5a50]">No payment is taken here. For each design, copy the details, open the Etsy listing, choose the matching options and size, then paste the details into its personalization field.</p>
        {!hydrated ? <p role="status" className="mt-8">Loading your saved designs…</p> : items.length === 0 ? <div className="mt-8 rounded-3xl border border-[#ead7c7] bg-white p-8"><h2 className="text-xl font-semibold">Add a design to get started.</h2><Button asChild className="mt-5"><Link href="/category/sweaters">Shop name sweaters</Link></Button></div> : <>
          <ol className="mt-8 grid gap-4 rounded-3xl bg-[#f3dfcf] p-6 text-sm leading-6 sm:grid-cols-3">
            <li><strong>1. Save your details</strong><br />Copy each design and download its preview.</li>
            <li><strong>2. Add each on Etsy</strong><br />Set quantity and options for every design in your Etsy basket.</li>
            <li><strong>3. Pay on Etsy</strong><br />Check shipping, delivery, taxes, and your final total.</li>
          </ol>
          <p className="mt-5 text-sm leading-6 text-[#6f5a50]">Your website cart does not automatically transfer to Etsy. Keep this page open while you build your Etsy basket. If needed, share the downloaded preview with the seller through Etsy.</p>
          {error && <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">{error}<Button variant="outline" className="ml-3" onClick={() => { setError(""); setAttempt((value) => value + 1); }}>Retry listing check</Button></div>}
          <ul className="mt-8 space-y-5">
            {items.map((item, index) => {
              const checked = ready ? review.items.find((entry) => entry.id === item.id) : undefined;
              return <li key={item.id} className="rounded-3xl border border-[#ead7c7] bg-white p-5 sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1"><p className="text-xs font-semibold uppercase tracking-widest text-[#a94f2c]">Design {index + 1} · Quantity {item.quantity}</p><h2 className="mt-2 text-xl font-semibold">{checked?.title || item.title}</h2><p className="mt-2 text-sm text-[#6f5a50]">{item.color} · Choose size on Etsy</p></div>
                  {item.preview && <div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.preview} alt={`Saved preview for design ${index + 1}`} width={100} height={100} className="h-24 w-24 rounded-xl object-contain" />
                  </div>}
                </div>
                <p className="mt-5 select-text whitespace-pre-wrap break-words rounded-2xl bg-[#fffaf4] p-4 text-sm leading-7 text-[#6f5a50]">{item.details}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Button variant="outline" onClick={() => copy(item)}>{copied === item.id ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}{copied === item.id ? "Copied details" : "Copy details"}</Button>
                  {item.preview && <Button variant="outline" asChild><a href={item.preview} download={`knitty-petit-design-${index + 1}.jpg`}><Download className="mr-2 h-4 w-4" />Save preview</a></Button>}
                  {checked?.available && checked.etsyLink ? <Button asChild className="bg-[#a94f2c] text-white hover:bg-[#8e4024]"><a href={checked.etsyLink} target="_blank" rel="noopener noreferrer" onClick={() => trackEtsyHandoff(item)}>Open design {index + 1} on Etsy<ExternalLink className="ml-2 h-4 w-4" /></a></Button> : <Button disabled>{checked ? "Listing unavailable" : "Checking listing…"}</Button>}
                </div>
                {checked && !checked.available && <p role="status" className="mt-3 text-sm text-red-800">This listing is unavailable. Remove it from your cart or check back later.</p>}
              </li>;
            })}
          </ul>
          <div className="mt-8 rounded-3xl bg-[#31211b] p-6 text-white"><div className="flex flex-wrap justify-between gap-4 text-xl font-semibold"><h2>Website subtotal</h2><p>{formatPrice(cartValue(items))} USD</p></div><p className="mt-3 text-sm leading-6 text-[#f3dfcf]">Name included · Icons $4 each · Free shipping. Etsy confirms the final price, any taxes, and delivery availability before you pay. Your saved designs remain here when you return.</p></div>
        </>}
      </div>
    </div>
  );
}
