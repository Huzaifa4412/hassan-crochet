"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Testimonial } from "@/sanity/queries"

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"

interface TestimonialsCarouselProps {
  testimonials: Testimonial[]
  className?: string
}

export function TestimonialsCarousel({ testimonials, className }: TestimonialsCarouselProps) {
  const [swiper, setSwiper] = useState<any>(null)

  if (!testimonials || testimonials.length === 0) {
    return null
  }

  return (
    <section className={cn("py-12 md:py-16 lg:py-24 bg-muted/30", className)}>
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2">
            <Quote className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Customer Love</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real reviews from real customers who love their custom pieces
          </p>
        </div>

        {/* Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <Swiper
            onSwiper={setSwiper}
            modules={[Autoplay, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            autoplay={{
              delay: 6000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              bulletClass: "w-2 h-2 rounded-full bg-primary/30 opacity-100 transition-all",
              bulletActiveClass: "w-6 bg-primary",
            }}
            loop={true}
            className="testimonials-swiper"
            breakpoints={{
              640: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
            }}
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial._id}>
                <TestimonialCard testimonial={testimonial} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => swiper?.slidePrev()}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex rounded-full shadow-lg"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => swiper?.slideNext()}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex rounded-full shadow-lg"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}

interface TestimonialCardProps {
  testimonial: Testimonial
}

function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
      <CardContent className="p-6 md:p-8 flex flex-col h-full">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-4 h-4",
                i < testimonial.rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-muted text-muted"
              )}
            />
          ))}
        </div>

        {/* Review Text */}
        <blockquote className="flex-1 mb-6">
          <p className="text-base leading-relaxed text-foreground/90">
            &ldquo;{testimonial.review}&rdquo;
          </p>
        </blockquote>

        {/* Author */}
        <div className="flex items-center gap-3 pt-4 border-t border-border/50">
          <Avatar className="w-12 h-12 ring-2 ring-primary/10">
            {testimonial.customerImage ? (
              <AvatarImage src={testimonial.customerImage.url} alt={testimonial.customerName} />
            ) : null}
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white font-semibold">
              {testimonial.customerName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm">{testimonial.customerName}</p>
            {testimonial.isVerified && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-green-500" />
                Verified Purchase
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Static Testimonial Grid (alternative layout)
interface TestimonialGridProps {
  testimonials: Testimonial[]
  className?: string
}

export function TestimonialGrid({ testimonials, className }: TestimonialGridProps) {
  if (!testimonials || testimonials.length === 0) {
    return null
  }

  return (
    <section className={cn("py-12 md:py-16 lg:py-24 bg-muted/30", className)}>
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2">
            <Quote className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Customer Love</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            What Our Customers Say
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial._id} className="border-0 shadow-sm hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-3.5 h-3.5",
                        i < testimonial.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-muted text-muted"
                      )}
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-sm leading-relaxed text-foreground/80 mb-4 line-clamp-4">
                  &ldquo;{testimonial.review}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    {testimonial.customerImage ? (
                      <AvatarImage src={testimonial.customerImage.url} alt={testimonial.customerName} />
                    ) : null}
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {testimonial.customerName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{testimonial.customerName}</p>
                    {testimonial.isVerified && (
                      <p className="text-xs text-muted-foreground">Verified</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
