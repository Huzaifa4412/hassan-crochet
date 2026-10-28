import type { Metadata } from "next";
import Link from "next/link";
import BestSeller from "@/components/home/best-seller";
import HeroBanner from "@/components/home/HeroBanner";
import OurProducts from "@/components/home/our-products";
import Personalized from "@/components/home/Personalized";
import TestimonialsSection from "@/components/home/Testimonials";
import { Reveal } from "@/components/motion/Reveal";
import { absoluteUrl, buildMetadata, serializeJsonLd, siteName, siteUrl } from "@/lib/seo";

import React from "react";

export const metadata: Metadata = buildMetadata({
  title: "Personalized Baby Name Sweaters & Hand Embroidery",
  description:
    "Create a personalized baby name sweater with hand embroidery. Preview colors, lettering, and motifs at Knitty Petit, then complete your order on Etsy.",
  path: "/",
  image: "/banner2.png",
});

const page = () => {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
    logo: absoluteUrl("/logo.png"),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(organizationJsonLd) }}
      />

      <HeroBanner />
      <BestSeller />

      <section className="bg-[#fffaf4] px-4 py-16 sm:px-6 lg:px-8">
        <Reveal className="mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] border border-[#ead7c7] bg-white shadow-[0_28px_80px_rgba(79,48,30,0.08)] md:grid-cols-3">
          {[
            ["01", "Choose your sweater", "Explore the available sweater styles and colors before adding your personal details."],
            ["02", "Preview the name", "Add lettering and icons, then adjust their colors and placement in the preview."],
            ["03", "Complete on Etsy", "Copy your customization details into Etsy's personalization field and review the listing before ordering."],
          ].map(([step, title, copy]) => (
            <div
              key={step}
              className="border-b border-[#ead7c7] p-6 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 lg:p-8"
            >
              <div className="font-mono text-sm font-semibold text-[#bf6036]">
                {step}
              </div>
              <h3 className="mt-5 text-2xl font-semibold text-[#2f211b]">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#756156]">{copy}</p>
            </div>
          ))}
        </Reveal>
      </section>

      <OurProducts />
      <Personalized />
      <section className="bg-[#fffaf4] px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="sweater-shopping-guide">
        <div className="mx-auto max-w-7xl">
          <h2 id="sweater-shopping-guide" className="max-w-3xl text-3xl font-semibold text-[#241814] sm:text-4xl">
            A little help choosing a personalized baby sweater
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#756156]">
            From a baby shower gift to a first birthday keepsake, start with the
            name and colors you have in mind. These guides help with the details.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-[#ead7c7] bg-white p-6">
              <h3 className="text-xl font-semibold text-[#2f211b]">Can I preview the name before ordering?</h3>
              <p className="mt-3 text-sm leading-7 text-[#756156]">
                Yes. The product customizer lets you add text and icons, choose
                colors, and adjust their placement. The website preview helps
                you plan the design; check the Etsy listing for final options
                and order details.
              </p>
              <Link href="/products/hand-embroidered-kids-name-sweaters" className="mt-4 inline-block font-semibold text-[#a94f2c] underline underline-offset-4">
                Preview a personalized name sweater
              </Link>
            </div>
            <div className="rounded-3xl border border-[#ead7c7] bg-white p-6">
              <h3 className="text-xl font-semibold text-[#2f211b]">Which size should I choose for a gift?</h3>
              <p className="mt-3 text-sm leading-7 text-[#756156]">
                Check the size options and measurements on the Etsy listing
                before ordering. Our sizing guide explains what to consider
                when choosing a baby name sweater.
              </p>
              <Link href="/blog/what-size-baby-name-sweater-should-you-get" className="mt-4 inline-block font-semibold text-[#a94f2c] underline underline-offset-4">
                Read the baby name sweater sizing guide
              </Link>
            </div>
            <div className="rounded-3xl border border-[#ead7c7] bg-white p-6">
              <h3 className="text-xl font-semibold text-[#2f211b]">Looking for gift ideas or care advice?</h3>
              <p className="mt-3 text-sm leading-7 text-[#756156]">
                Explore thoughtful gift ideas, or read our embroidery care guide.
                Follow the care instructions supplied with your sweater.
              </p>
              <Link href="/blog/baby-shower-gift-ideas" className="mt-4 block font-semibold text-[#a94f2c] underline underline-offset-4">
                Explore baby shower gift ideas
              </Link>
              <Link href="/blog/how-to-wash-hand-embroidered-baby-sweater" className="mt-3 block font-semibold text-[#a94f2c] underline underline-offset-4">
                Read the hand-embroidered sweater care guide
              </Link>
            </div>
          </div>
        </div>
      </section>
      <TestimonialsSection />
    </div>
  );
};

export default page;
