export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "G-7QW1LRELTS";

export const pageview = (url: string) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

export const event = (
  action: string,
  params: Record<string, unknown> = {},
) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", action, params);
  }
};
