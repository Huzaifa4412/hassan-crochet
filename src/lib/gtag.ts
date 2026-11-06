export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "G-7QW1LRELTS";
// Enhanced measurement owns history changes by default; never run both trackers.
export const MANUAL_PAGEVIEWS = process.env.NEXT_PUBLIC_GA_MANUAL_PAGEVIEWS === "true";

export const pageview = (url: string) => {
  if (typeof window === "undefined") return;
  event("page_view", { page_location: `${window.location.origin}${url}`, page_title: document.title });
};

export const event = (
  action: string,
  params: Record<string, unknown> = {},
) => {
  if (typeof window === "undefined" || !GA_MEASUREMENT_ID || process.env.NEXT_PUBLIC_TRACKING_ENABLED === "false") return;
  window.dataLayer = window.dataLayer || [];
  // Queue early interactions before next/script has initialized the Google tag.
  // Google's loader expects queued IArguments objects.
  // eslint-disable-next-line prefer-rest-params
  window.gtag = window.gtag || function () { window.dataLayer!.push(arguments); };
  if (!window.knittyGoogleInitialized) {
    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID, { send_page_view: !MANUAL_PAGEVIEWS });
    window.knittyGoogleInitialized = true;
  }
  window.gtag("event", action, { ...params, send_to: GA_MEASUREMENT_ID });
};
