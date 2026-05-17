"use client";

import TestimonialsCard from "@/components/ui/testimonials-card";
import { Badge } from "@/components/ui/badge";
import { HeartHandshake, PackageCheck, Quote, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal, StaggerItem, StaggerReveal } from "@/components/motion/Reveal";

interface TestimonialsSectionProps {
  className?: string;
}

// Testimonials data
const testimonials = [
  {
    id: "1",
    title: "Sarah M.",
    headline: "I almost cried when I opened it!",
    description: "The sweater with my baby's name on it looks absolutely beautiful. The stitching is perfect and the fabric is so soft. It feels very premium. This is something I will keep forever as a memory. Highly recommended!",
    image: "/reviews/iap_600x600.7262401728_ae9vfp81.webp",
  },
  {
    id: "2",
    title: "Amanda R.",
    headline: "Best first birthday gift ever!",
    description: "I ordered a customized sweater for my niece's 1st birthday. Adding her name and a small heart icon made it so special. My sister loved it! Everyone kept asking where we bought it from.",
    image: "/reviews/iap_600x600.7328186625_r1km0fan.webp",
  },
  {
    id: "3",
    title: "Jessica L.",
    headline: "Soft, warm and perfect fit.",
    description: "The quality exceeded my expectations. The name embroidery is clean and neat. It looks exactly like the preview. Definitely ordering again for winter.",
    image: "/reviews/iap_600x600.7339273571_jw5pkmrx.webp",
  },
  {
    id: "4",
    title: "Michael T.",
    headline: "Worth every penny.",
    description: "I was worried about ordering a customized product online, but it turned out amazing. The sweater feels durable and cozy. My daughter doesn't want to take it off!",
    image: "/reviews/iap_600x600.7350513508_e26ewa8o.webp",
  },
  {
    id: "5",
    title: "Olivia K.",
    headline: "Fast delivery and beautiful design!",
    description: "It arrived quicker than expected and looked exactly like the mockup. The font and icon placement were perfect. Customer service was very responsive too.",
    image: "/reviews/iap_600x600.7427157934_78avfdyy.webp",
  },
  {
    id: "6",
    title: "Emma W.",
    headline: "Second time ordering!",
    description: "This is my second purchase. I ordered one for my son and now one for my friend's baby. The personalization makes it feel so unique. Love it!",
    image: "/reviews/iap_600x600.7499091595_dm9fhjrt.webp",
  },
];

export function TestimonialsSection({ className }: TestimonialsSectionProps) {
  return (
    <section className={cn("bg-[#fffaf4] px-4 py-20 sm:px-6 lg:px-8", className)}>
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <Reveal className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
          <Badge
            variant="outline"
            className="mb-4 border-[#e5c7b2] bg-white px-4 py-1.5 text-sm font-semibold text-[#a94f2c] hover:bg-white"
          >
            <Quote className="w-3.5 h-3.5 mr-1.5" />
            Customer Love
          </Badge>

          <h2 className="mb-4 text-4xl font-semibold tracking-normal text-[#241814] md:text-5xl">
            Notes from homes that received one.
          </h2>

          <p className="text-base leading-7 text-[#756156] md:text-lg">
            Reviews, photos, and keepsake reactions help the shop feel less
            like a catalog and more like a studio with real care behind it.
          </p>

          {/* Rating Summary */}
          <div className="flex items-center justify-center gap-2 ">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="#facc15"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <span className="text-sm font-medium text-foreground">
              5.0 Average Rating
            </span>
            <span className="text-sm text-muted-foreground">
              from {testimonials.length}+ reviews
            </span>
          </div>
        </Reveal>

        {/* Testimonials Card */}
        <Reveal className="flex items-center justify-center">
          <TestimonialsCard
            items={testimonials}
            autoPlay={true}
            autoPlayInterval={4000}
            showNavigation={true}
            showCounter={true}
          />
        </Reveal>

        {/* Trust Indicators */}
        <StaggerReveal className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              title: "Quality guaranteed",
              copy: "Every piece is handmade with premium materials",
            },
            {
              icon: PackageCheck,
              title: "Packed carefully",
              copy: "Soft goods shipped with a keepsake-first mindset",
            },
            {
              icon: HeartHandshake,
              title: "Made with care",
              copy: "Each order is handled like a personal gift",
            },
          ].map((item) => (
            <StaggerItem key={item.title}>
              <div className="h-full rounded-[1.5rem] border border-[#ead7c7] bg-white p-6 text-center shadow-[0_14px_36px_rgba(79,48,30,0.07)] transition-transform hover:-translate-y-1">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#fff1e6] text-[#bf6036]">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-1 font-semibold text-[#2f211b]">
                  {item.title}
                </h3>
                <p className="text-sm leading-6 text-[#756156]">{item.copy}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}

// Legacy export for backwards compatibility
export function TestimonialsCardDemo() {
  return (
    <div className="flex min-h-[500px] w-full items-center justify-center">
      <TestimonialsCard items={testimonials} />
    </div>
  );
}

export default TestimonialsSection;
