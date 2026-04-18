"use client";

import TestimonialsCard from "@/components/ui/testimonials-card";
import { Badge } from "@/components/ui/badge";
import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <section className={cn("py-12 md:py-16 lg:py-24 bg-background", className)}>
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <Badge
            variant="outline"
            className="mb-4 px-4 py-1.5 text-sm font-medium border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
          >
            <Quote className="w-3.5 h-3.5 mr-1.5" />
            Customer Love
          </Badge>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            What Our Customers Say
          </h2>

          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            Don&apos;t just take our word for it. Here&apos;s what our happy customers have to say about their
            handmade crochet pieces.
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
        </div>

        {/* Testimonials Card */}
        <div className="flex justify-center items-center  animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
          <TestimonialsCard
            items={testimonials}
            autoPlay={true}
            autoPlayInterval={4000}
            showNavigation={true}
            showCounter={true}
          />
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6  max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
          <div className="flex flex-col items-center text-center p-6 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <svg
                className="w-6 h-6 text-primary"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-foreground mb-1">Quality Guaranteed</h3>
            <p className="text-sm text-muted-foreground">Every piece is handmade with premium materials</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-foreground mb-1">Fast Delivery</h3>
            <p className="text-sm text-muted-foreground">Quick shipping with careful packaging</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-foreground mb-1">Made with Love</h3>
            <p className="text-sm text-muted-foreground">Each piece crafted with care and attention</p>
          </div>
        </div>
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
