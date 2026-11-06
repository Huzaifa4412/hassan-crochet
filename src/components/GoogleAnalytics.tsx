"use client";

import Script from "next/script";
import { useEffect, useRef, Suspense } from "react";
import { usePathname } from "next/navigation";
import { GA_MEASUREMENT_ID, MANUAL_PAGEVIEWS, pageview } from "@/lib/gtag";

function PageTracker() {
  const pathname = usePathname();
  const previous = useRef<string | null>(null);
  useEffect(() => {
    if (previous.current === pathname) return;
    previous.current = pathname;
    pageview(pathname);
  }, [pathname]);
  return null;
}

export default function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID || process.env.NEXT_PUBLIC_TRACKING_ENABLED === "false") return null;

  return (
    <>
      {/* Google tag (gtag.js) */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            window.gtag = window.gtag || function(){dataLayer.push(arguments);};
            if (!window.knittyGoogleInitialized) {
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', {send_page_view: ${!MANUAL_PAGEVIEWS}});
              window.knittyGoogleInitialized = true;
            }
          `,
        }}
      />
      {MANUAL_PAGEVIEWS && <Suspense fallback={null}><PageTracker /></Suspense>}
    </>
  );
}
