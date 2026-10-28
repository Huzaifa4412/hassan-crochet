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
    default: "Knitty Petit - Personalized Baby Name Sweaters",
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  keywords: [
    "baby name sweaters",
    "hand embroidered sweaters",
    "personalized baby gifts",
    "Knitty Petit",
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Knitty Petit - Personalized Baby Name Sweaters",
    description: defaultDescription,
    url: "/",
    siteName,
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Knitty Petit personalized sweaters",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Knitty Petit - Personalized Baby Name Sweaters",
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
  verification: {
    google: "googleccafd8d40a15f51e",
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
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
              var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
              s1.async=true;
              s1.src='https://embed.tawk.to/6ae2331cf6cefc34708d5c0d/1k61pfadb';
              s1.charset='UTF-8';
              s1.setAttribute('crossorigin','*');
              s0.parentNode.insertBefore(s1,s0);
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
