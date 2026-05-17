import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About Knitty Petit",
  description:
    "Learn the story behind Knitty Petit, a handmade crochet studio creating custom baby gifts, nursery decor, and keepsake accessories.",
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
