---
name: meta-pixel
description: Meta (Facebook) Pixel integration for Next.js App Router. Covers correct inline script setup, noscript fallback, SSR guards, client-side route tracking, environment variable best practices, and common pitfalls to avoid.
---

# Meta Pixel Integration for Next.js App Router

You are an expert in integrating Meta (Facebook) Pixel into Next.js 14+ App Router projects with full SSR safety, client-side SPA route tracking, and compliance with Meta's official pixel specification.

## Core Principles

- Always inject the pixel using an inline `dangerouslySetInnerHTML` `<Script>` — never load a `.ts` or custom external script
- Always place `<FacebookPixel />` as a direct child of `<body>`, not inside `<main>` or any layout wrapper
- Always include a `<noscript>` fallback `<img>` tag for non-JS environments
- Always guard `window.fbq` calls with runtime checks for SSR compatibility
- Always store the Pixel ID as a **quoted string** in `.env.local` to prevent integer precision loss
- Track client-side route changes via `usePathname` + `useEffect` inside a `<Suspense>` boundary

## Required File Structure

```
src/
├── components/
│   └── FacebookPixel.tsx     ← Inline script + noscript + route tracker
├── lib/
│   └── fpixel.ts             ← pageview() and event() helpers with SSR guards
└── types/
    └── fbq.d.ts              ← TypeScript Window interface extension

.env.local                    ← NEXT_PUBLIC_FACEBOOK_PIXEL_ID="your_id_here"
```

## Environment Variable

```env
# .env.local
# IMPORTANT: Always quote the Pixel ID — it's a 16-digit number that
# can lose precision if parsed as a JavaScript Number (IEEE 754 float64).
NEXT_PUBLIC_FACEBOOK_PIXEL_ID="your_pixel_id_here"
```

## TypeScript Type Declaration

```typescript
// src/types/fbq.d.ts
// Extends the global Window interface so TypeScript knows fbq exists at runtime.
interface Window {
  fbq: (...args: unknown[]) => void;
  _fbq: unknown;
}
```

## fpixel.ts — Helper Utilities

```typescript
// src/lib/fpixel.ts

export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

// Guard 1: typeof window !== "undefined" → prevents SSR crash (window doesn't exist on server)
// Guard 2: typeof window.fbq === "function" → prevents crash if called before <Script> has executed
export const pageview = () => {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "PageView");
  }
};

// https://developers.facebook.com/docs/facebook-pixel/advanced/
export const event = (name: string, options = {}) => {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", name, options);
  }
};
```

## FacebookPixel Component

```tsx
// src/components/FacebookPixel.tsx
"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useEffect, Suspense } from "react";
import * as pixel from "@/lib/fpixel";

// Must be a separate component wrapped in Suspense because useSearchParams()
// requires a Suspense boundary in Next.js App Router.
function PixelPageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    pixel.pageview();
  }, [pathname, searchParams]);

  return null;
}

const FacebookPixel = () => {
  const pixelId = pixel.FB_PIXEL_ID;

  // Do nothing if Pixel ID is not configured (prevents errors in dev/staging)
  if (!pixelId) return null;

  return (
    <>
      {/* Step 1: Inject the official Meta Pixel base code inline.
          - strategy="afterInteractive" ensures it runs after hydration.
          - dangerouslySetInnerHTML is required because Next.js <Script> does
            not support children for inline scripts in App Router.
          - The pixelId is interpolated server-side — no data-* tricks needed. */}
      <Script
        id="fb-pixel-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
          `,
        }}
      />

      {/* Step 2: noscript fallback for users with JavaScript disabled.
          Required by Meta's official pixel specification.
          Must render a 1x1 transparent pixel image. */}
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>

      {/* Step 3: Track subsequent client-side route navigations.
          Wrapped in Suspense because useSearchParams() requires it. */}
      <Suspense fallback={null}>
        <PixelPageTracker />
      </Suspense>
    </>
  );
};

export default FacebookPixel;
```

## layout.tsx Integration

```tsx
// src/app/layout.tsx
import FacebookPixel from "@/components/FacebookPixel";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* CRITICAL: FacebookPixel must be a direct child of <body>.
            Placing it inside <main> or any wrapper is semantically wrong
            and causes the noscript tag to be in an invalid DOM position. */}
        <FacebookPixel />

        {/* All other layout content follows */}
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

## Tracking Custom Events

Use the `event()` helper from `fpixel.ts` to track any custom Meta Pixel standard events:

```tsx
import * as pixel from "@/lib/fpixel";

// Purchase event (e-commerce)
pixel.event("Purchase", { currency: "USD", value: 29.99 });

// Add to cart
pixel.event("AddToCart", { content_ids: ["product-123"], value: 19.99, currency: "USD" });

// Lead form submission
pixel.event("Lead");

// View content (product page)
pixel.event("ViewContent", { content_name: "Blue Crochet Tray", content_ids: ["tray-01"] });

// Search
pixel.event("Search", { search_string: "crochet bags" });
```

Full list of standard events: https://developers.facebook.com/docs/meta-pixel/reference

## Common Mistakes to Avoid

| ❌ Wrong | ✅ Correct |
|---------|----------|
| `src="/scripts/pixel.ts"` in `<Script>` | Use `dangerouslySetInnerHTML` inline |
| `.ts` file in `public/` folder | Browsers can't run TypeScript — use `.js` or inline |
| `document.currentScript.getAttribute(...)` to pass Pixel ID | Interpolate `${pixelId}` directly into the inline script string |
| `window.fbq(...)` without guards | Always check `typeof window !== 'undefined' && typeof window.fbq === 'function'` |
| `<FacebookPixel />` inside `<main>` | Must be a direct child of `<body>` |
| `PIXEL_ID=1234567890123456` (unquoted) | Always quote: `PIXEL_ID="1234567890123456"` |
| No `<noscript>` tag | Always add the `<noscript><img>` fallback |
| `useSearchParams()` without `<Suspense>` | Wrap the tracking component in `<Suspense fallback={null}>` |

## How to Verify the Pixel is Working

### Method 1 — Meta Pixel Helper (Recommended)
1. Install the [Meta Pixel Helper](https://chromewebstore.google.com/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc) Chrome extension
2. Visit any page of the site
3. Click the extension icon — you should see a green checkmark with your Pixel ID and a `PageView` event

### Method 2 — Browser DevTools Network Tab
1. Open DevTools → **Network** tab
2. Filter by `facebook.net` → confirm `fbevents.js` loads with status `200`
3. Filter by `facebook.com/tr` → confirm pixel fire requests appear on each navigation

### Method 3 — Meta Events Manager
1. Go to [Meta Events Manager](https://business.facebook.com/events_manager)
2. Select your pixel → open **Test Events** tab
3. Enter your site URL and watch `PageView` events appear in real time

## Best Practices

- Use `strategy="afterInteractive"` for the pixel `<Script>` — never `beforeInteractive` (blocks page render) or `lazyOnload` (too slow for tracking)
- Always check `if (!pixelId) return null` to prevent errors when the env variable is missing in dev/staging environments
- Do not fire `pixel.pageview()` on the initial mount — the inline `fbq('track', 'PageView')` in the base code already handles it. Only call it on subsequent navigations
- For e-commerce tracking, fire `Purchase` events server-side via the [Meta Conversions API](https://developers.facebook.com/docs/marketing-api/conversions-api/) alongside the browser pixel for deduplication
- Never log or expose the Pixel ID in error messages — treat it as a semi-sensitive configuration value
