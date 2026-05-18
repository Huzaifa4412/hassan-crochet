export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

const MAX_EVENT_RETRIES = 10;
const EVENT_RETRY_DELAY_MS = 200;

type PixelEventData = Record<string, unknown>;
type PixelEventOptions = Record<string, unknown>;

export const pageview = () => {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "PageView");
  }
};

export const event = (
  name: string,
  options: PixelEventData = {},
  eventOptions?: PixelEventOptions,
  retryCount = 0,
) => {
  if (typeof window === "undefined") return;

  if (typeof window.fbq === "function") {
    if (eventOptions) {
      window.fbq("track", name, options, eventOptions);
    } else {
      window.fbq("track", name, options);
    }
    return;
  }

  if (retryCount < MAX_EVENT_RETRIES) {
    window.setTimeout(
      () => event(name, options, eventOptions, retryCount + 1),
      EVENT_RETRY_DELAY_MS,
    );
  }
};

export const customEvent = (
  name: string,
  options: PixelEventData = {},
  retryCount = 0,
) => {
  if (typeof window === "undefined") return;

  if (typeof window.fbq === "function") {
    window.fbq("trackCustom", name, options);
    return;
  }

  if (retryCount < MAX_EVENT_RETRIES) {
    window.setTimeout(
      () => customEvent(name, options, retryCount + 1),
      EVENT_RETRY_DELAY_MS,
    );
  }
};
