"use client";

import { useEffect, useRef, useState } from "react";
import { Mail, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CartItem } from "@/lib/cart";

export function EmailSummaryForm({ items, ready }: { items: CartItem[]; ready: boolean }) {
  const [available, setAvailable] = useState<boolean | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const request = useRef<{ signature: string; id: string } | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/checkout/email", { signal: controller.signal, cache: "no-store" })
      .then(async (response) => response.ok ? response.json() : { available: false })
      .then((result) => { if (!controller.signal.aborted) setAvailable(result.available === true); })
      .catch(() => { if (!controller.signal.aborted) setAvailable(false); });
    return () => controller.abort();
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !ready || !available) return;
    setBusy(true); setMessage(""); setSent(false);
    const designs = items.map(({ id, slug, color, iconCount, quantity, details, preview }) =>
      ({ id, slug, color, iconCount, quantity, details, preview }));
    const signature = JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), items: designs });
    if (request.current?.signature !== signature) request.current = { signature, id: crypto.randomUUID() };
    try {
      const response = await fetch("/api/checkout/email", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, items: designs, website, requestId: request.current.id }) });
      const result = await response.json();
      if (!response.ok || !result.accepted) throw new Error(result.message || "Your summary could not be emailed. Please try again.");
      setSent(true);
      setMessage(`Your summary is on its way. Check your inbox and spam folder. Reference: ${result.reference}. Complete payment on Etsy when you’re ready.`);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Email is unavailable. You can continue to Etsy."); }
    finally { setBusy(false); }
  }

  return (
    <section className="mt-8 rounded-3xl border border-[#ead7c7] bg-white p-5 sm:p-7" aria-labelledby="email-summary-heading">
      <div className="flex items-center gap-3"><Mail className="h-6 w-6 text-[#a94f2c]" /><h2 id="email-summary-heading" className="text-xl font-semibold">Keep a copy in your inbox</h2></div>
      <p className="mt-3 text-sm leading-7 text-[#6f5a50]">We’ll email your design details, preview images, and Etsy links. Knitty Petit receives a copy to help with your request. Payment and order confirmation happen on Etsy.</p>
      {available === false ? <p role="status" className="mt-4 text-sm text-[#6f5a50]">Email summaries are temporarily unavailable. You can still copy your details, save the previews, and continue to Etsy below.</p> : (
        <form onSubmit={submit} className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="summary-name">Your name (optional)</Label><Input id="summary-name" name="name" autoComplete="given-name" maxLength={80} value={name} disabled={busy} onChange={(event) => { setName(event.target.value); setSent(false); setMessage(""); }} className="h-12" /></div>
            <div className="space-y-2"><Label htmlFor="summary-email">Email address</Label><Input id="summary-email" name="email" type="email" autoComplete="email" required maxLength={254} value={email} disabled={busy} onChange={(event) => { setEmail(event.target.value); setSent(false); setMessage(""); }} className="h-12" /></div>
          </div>
          <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"><label htmlFor="summary-website">Website</label><input id="summary-website" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} /></div>
          <Button type="submit" disabled={busy || sent || !ready || available !== true} className="h-12 rounded-full bg-[#a94f2c] px-6 text-white hover:bg-[#8e4024]">
            {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : sent ? <Check className="mr-2 h-4 w-4" /> : <Mail className="mr-2 h-4 w-4" />}
            {busy ? "Sending your summary…" : sent ? "Summary sent" : available === null ? "Checking email availability…" : "Email my design summary"}
          </Button>
          <p className="text-xs leading-6 text-[#6f5a50]">This sends the requested summary only. It does not subscribe you to marketing emails or place an order.</p>
        </form>
      )}
      {message && <p role={sent ? "status" : "alert"} className={`mt-4 rounded-xl p-4 text-sm leading-6 ${sent ? "bg-green-50 text-green-900" : "bg-red-50 text-red-900"}`}>{message}</p>}
    </section>
  );
}
