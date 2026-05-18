export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

const MAX_EVENT_RETRIES = 10;
const EVENT_RETRY_DELAY_MS = 200;

export const pageview = () => {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "PageView");
  }
};

// https://developers.facebook.com/docs/facebook-pixel/advanced/
export const event = (
  name: string,
  options = {},
  retryCount = 0,
) => {
  if (typeof window === "undefined") return;

  if (typeof window.fbq === "function") {
    window.fbq("track", name, options);
    return;
  }

  if (retryCount < MAX_EVENT_RETRIES) {
    window.setTimeout(
      () => event(name, options, retryCount + 1),
      EVENT_RETRY_DELAY_MS,
    );
  }
};
