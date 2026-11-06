export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

type PixelEventData = Record<string, unknown>;
type PixelEventOptions = Record<string, unknown>;
type PendingEvent = ["track" | "trackCustom", string, PixelEventData, PixelEventOptions?];
const pendingEvents: PendingEvent[] = [];

function enabled() {
  return typeof window !== "undefined" && Boolean(FB_PIXEL_ID)
    && process.env.NEXT_PUBLIC_TRACKING_ENABLED !== "false";
}

// Preserve early interactions until Meta's inline bootstrap installs its queue.
export function flushQueuedEvents() {
  if (!enabled() || typeof window.fbq !== "function") return;
  while (pendingEvents.length) {
    const [command, name, data, options] = pendingEvents.shift()!;
    if (options) window.fbq(command, name, data, options);
    else window.fbq(command, name, data);
  }
}

function dispatch(args: PendingEvent) {
  if (!enabled()) return;
  // Bound the queue if the tracking script is blocked entirely.
  if (pendingEvents.length >= 100) pendingEvents.shift();
  pendingEvents.push(args);
  flushQueuedEvents();
}

export const pageview = () => dispatch(["track", "PageView", {}]);

export const event = (name: string, data: PixelEventData = {}, options?: PixelEventOptions) => {
  dispatch(["track", name, data, options]);
};

export const customEvent = (name: string, data: PixelEventData = {}) => {
  dispatch(["trackCustom", name, data]);
};
