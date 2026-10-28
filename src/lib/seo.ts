import type { Metadata } from "next";

export const siteName = "Knitty Petit";
const configuredUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.knittypetit.shop",
);
// The verified Search Console property and public links use www.
if (["knittypetit.shop", "www.knittypetit.shop"].includes(configuredUrl.hostname)) {
  configuredUrl.protocol = "https:";
  configuredUrl.hostname = "www.knittypetit.shop";
}
export const siteUrl = configuredUrl.origin;

export const defaultDescription =
  "Explore personalized baby name sweaters and hand-embroidered gifts. Preview lettering, colors, and motifs at Knitty Petit, then complete your order on Etsy.";

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalizedPath}`;
}

export function truncateDescription(value?: string, fallback = defaultDescription) {
  const text = (value || fallback).replace(/\s+/g, " ").trim();
  return text.length > 160 ? `${text.slice(0, 157).trim()}...` : text;
}

export function buildMetadata({
  title,
  description,
  path = "/",
  image = "/logo.png",
  type = "website",
  noIndex = false,
}: {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
}): Metadata {
  const metaDescription = truncateDescription(description);
  const url = absoluteUrl(path);
  const imageUrl = image.startsWith("http") ? image : absoluteUrl(image);

  return {
    title: { absolute: `${title} | ${siteName}` },
    description: metaDescription,
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? {
          index: false,
          follow: true,
          googleBot: { index: false, follow: true },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      title,
      description: metaDescription,
      url,
      siteName,
      type,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: metaDescription,
      images: [imageUrl],
    },
  };
}
