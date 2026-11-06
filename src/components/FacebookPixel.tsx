"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, Suspense, useRef } from "react";
import * as pixel from "@/lib/fpixel";

// Track route changes without duplicating the initial bootstrap PageView.
function PixelPageTracker() {
  const pathname = usePathname();
  const lastPath = useRef(pathname);

  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    pixel.pageview();
  }, [pathname]);

  return null;
}

const FacebookPixel = () => {
  const pixelId = pixel.FB_PIXEL_ID;

  if (!pixelId || process.env.NEXT_PUBLIC_TRACKING_ENABLED === "false") return null;

  return (
    <>
      {/* Meta Pixel Base Code */}
      <Script
        id="fb-pixel-init"
        strategy="afterInteractive"
        onReady={pixel.flushQueuedEvents}
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

      {/* Noscript fallback */}
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

      {/* Track subsequent client-side navigations */}
      <Suspense fallback={null}>
        <PixelPageTracker />
      </Suspense>
    </>
  );
};

export default FacebookPixel;
