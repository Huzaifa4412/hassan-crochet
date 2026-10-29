import type { Metadata } from "next";
import Link from "next/link";
import BestSeller from "@/components/home/best-seller";
import HeroBanner from "@/components/home/HeroBanner";
import OurProducts from "@/components/home/our-products";
import Personalized from "@/components/home/Personalized";
import TestimonialsSection from "@/components/home/Testimonials";
import { Reveal } from "@/components/motion/Reveal";
import { buildMetadata, serializeJsonLd } from "@/lib/seo";

import React from "react";

export const metadata: Metadata = buildMetadata({
  title: "Personalized Baby Name Sweaters, Hand Embroidered",
  description:
    "Hand-embroidered name sweaters for babies and kids. Preview the name, colors and icons, then order on Etsy. Choose lettering, thread colors and motifs.",
  path: "/",
  image: "/banner2.png",
});

const homeFaqs = [
  {
    q: "Can I preview the name before ordering?",
    a: "Yes. The customizer shows your sweater color, the name in your chosen lettering and thread color, and any icons. Copy the design, then paste it into the personalization box on Etsy when you order.",
    link: { href: "/products/hand-embroidered-kids-name-sweaters", label: "Preview a personalized name sweater" },
  },
  {
    q: "What sizes do the name sweaters come in?",
    a: "Check the Etsy listing for current size options and garment measurements before ordering. Our sizing guide explains how to choose a fit for a gift.",
    link: { href: "/blog/what-size-baby-name-sweater-should-you-get", label: "Read the sizing guide" },
  },
  {
    q: "How much does a personalized name sweater cost?",
    a: "Current prices and personalization options are shown on the Etsy listing. Check the final price for your chosen size and design before completing checkout.",
  },
  {
    q: "Is the name printed or embroidered?",
    a: "Names are hand-embroidered onto knit sweaters. Preview your lettering and optional motifs in the customizer before ordering on Etsy.",
  },
  {
    q: "Can I return or exchange it?",
    a: "Return and exchange eligibility depends on the Etsy listing and the personalization ordered. Read the listing policy and double-check the name spelling before checkout.",
  },
  {
    q: "How do I wash a hand-embroidered sweater?",
    a: "Turn it inside out, wash cold on a gentle cycle or by hand, and lay it flat to air dry.",
    link: { href: "/blog/how-to-wash-hand-embroidered-baby-sweater", label: "Read the care guide" },
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: homeFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

const page = () => {
  return (
    <div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqJsonLd) }}
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
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {homeFaqs.map((faq) => (
              <div key={faq.q} className="rounded-3xl border border-[#ead7c7] bg-white p-6">
                <h3 className="text-xl font-semibold text-[#2f211b]">{faq.q}</h3>
                <p className="mt-3 text-sm leading-7 text-[#756156]">{faq.a}</p>
                {faq.link && (
                  <Link href={faq.link.href} className="mt-4 inline-block font-semibold text-[#a94f2c] underline underline-offset-4">
                    {faq.link.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      <TestimonialsSection />
    </div>
  );
};

export default page;
