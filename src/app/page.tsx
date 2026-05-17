
import type { Metadata } from "next";
import BestSeller from "@/components/home/best-seller";
import HeroBanner from "@/components/home/HeroBanner";
import OurProducts from "@/components/home/our-products";
import Personalized from "@/components/home/Personalized";
import TestimonialsSection from "@/components/home/Testimonials";
import { Reveal } from "@/components/motion/Reveal";
import { absoluteUrl, buildMetadata, siteName, siteUrl } from "@/lib/seo";

import React from "react";

export const metadata: Metadata = buildMetadata({
  title: "Handmade Crochet Gifts & Custom Baby Decor",
  description:
    "Discover personalized crochet baby gifts, handmade nursery decor, and custom accessories from Knitty Petit.",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />

      <HeroBanner />
      <BestSeller />

      <section className="bg-[#fffaf4] px-4 py-16 sm:px-6 lg:px-8">
        <Reveal className="mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] border border-[#ead7c7] bg-white shadow-[0_28px_80px_rgba(79,48,30,0.08)] md:grid-cols-3">
          {[
            ["01", "Choose a soft base", "Start from a sweater or keepsake shape with sizes and colors that match the moment."],
            ["02", "Personalize the detail", "Add lettering, icons, and palettes with a clearer preview before checkout."],
            ["03", "Order with confidence", "Every piece is finished by hand, packed carefully, and sent through Etsy."],
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
      <TestimonialsSection />
    </div>
  );
};

export default page;
