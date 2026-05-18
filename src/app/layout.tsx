import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"
import { Providers } from "@/components/providers";
import { SiteFooter } from "@/components/site-footer";
import { defaultDescription, siteName, siteUrl } from "@/lib/seo";

import "./globals.css";
import FacebookPixel from "@/components/FacebookPixel";
import Header from "@/components/home/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: {
    default: "Knitty Petit - Handmade Crochet Gifts & Custom Baby Decor",
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  keywords: [
    "handmade crochet",
    "custom crochet gifts",
    "personalized baby gifts",
    "crochet nursery decor",
    "Knitty Petit",
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Knitty Petit - Handmade Crochet Gifts & Custom Baby Decor",
    description: defaultDescription,
    url: "/",
    siteName,
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Knitty Petit handmade crochet products",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Knitty Petit - Handmade Crochet Gifts & Custom Baby Decor",
    description: defaultDescription,
    images: ["/logo.png"],
  },
  robots: {
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <FacebookPixel />
        <Providers>
          <Header />
          <main className="min-h-[calc(100vh-4rem)]">
            {children}
          </main>
          <SiteFooter />
        </Providers>
      <Analytics />
      </body>
    </html>
  );
}
