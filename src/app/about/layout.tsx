import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About Our Personalized Sweater Studio",
  description:
    "Meet Knitty Petit and discover the care behind our personalized baby name sweaters, hand embroidery, and custom gifts.",
  path: "/about",
  image: "/about-hero.png",
});

export default function AboutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
