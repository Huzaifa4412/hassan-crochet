import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About Knitty Petit, Name Sweaters Embroidered in Texas",
  description:
    "Knitty Petit hand-embroiders personalized baby and kids name sweaters by hand. How each sweater is made, materials, sizes and shipping.",
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
