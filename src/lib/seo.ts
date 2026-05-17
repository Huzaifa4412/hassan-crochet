import type { Metadata } from "next";

export const siteName = "Knitty Petit";
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://knittypetit.shop"
).replace(/\/$/, "");

export const defaultDescription =
  "Shop handmade crochet products, personalized baby gifts, nursery decor, and custom accessories made with soft yarn and thoughtful detail.";

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
    title,
    description: metaDescription,
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
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
