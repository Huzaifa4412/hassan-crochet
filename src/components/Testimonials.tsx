import { getTestimonials } from "@/sanity/queries"
import { Star, Quote } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TestimonialsProps {
  featured?: boolean
  limit?: number
  className?: string
}

export async function Testimonials({ featured = true, limit = 6, className }: TestimonialsProps) {
  const testimonials = await getTestimonials(featured, limit)

  if (!testimonials || testimonials.length === 0) {
    return null
  }

  return (
    <section className={cn("py-12 md:py-16 lg:py-24", className)}>
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16 space-y-4">
          <Badge variant="outline" className="mb-2">
            Customer Reviews
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            What Our Customers Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real reviews from real customers who love their handmade crochet pieces
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial._id} testimonial={testimonial} />
          ))}
        </div>

        {/* View All Reviews Button */}
        {featured && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link href="/reviews">
                View All Reviews
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

function TestimonialCard({ testimonial }: { testimonial: any }) {
  return (
    <Card className="overflow-hidden border-border/40 hover:shadow-lg transition-all duration-300 hover:border-primary/30 h-full">
      <CardContent className="p-6 space-y-4">
        {/* Rating */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-4 h-4",
                i < testimonial.rating
                  ? "fill-amber-400 text-amber-400"
                  : "fill-gray-200 text-gray-200"
              )}
            />
          ))}
        </div>

        {/* Review Text */}
        <div className="relative">
          <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/10" />
          <p className="text-sm leading-relaxed text-foreground/90 pl-4">
            {testimonial.review}
          </p>
        </div>

        {/* Review Images */}
        {testimonial.images && testimonial.images.length > 0 && (
          <div className="flex gap-2">
            {testimonial.images.slice(0, 3).map((image: any, index: number) => (
              <div
                key={index}
                className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted"
              >
                <Image
                  src={image.asset.url}
                  alt={`Review photo ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
            {testimonial.images.length > 3 && (
              <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground">
                +{testimonial.images.length - 3}
              </div>
            )}
          </div>
        )}

        {/* Customer Info */}
        <div className="flex items-center gap-3 pt-2 border-t border-border/40">
          <Avatar className="w-10 h-10">
            {testimonial.customerImage ? (
              <AvatarImage src={testimonial.customerImage.url} alt={testimonial.customerName} />
            ) : null}
            <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-white text-sm font-medium">
              {testimonial.customerName
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{testimonial.customerName}</p>
            <div className="flex items-center gap-2">
              {testimonial.isVerified && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  Verified
                </Badge>
              )}
              {testimonial.product && (
                <Link
                  href={`/products/${testimonial.product.slug.current}`}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors truncate"
                >
                  {testimonial.product.title}
                </Link>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Featured testimonial for homepage
export async function FeaturedTestimonial() {
  const testimonials = await getTestimonials(true, 1)

  if (!testimonials || testimonials.length === 0) {
    return null
  }

  const testimonial = testimonials[0]

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border-none shadow-xl overflow-hidden">
            <CardContent className="p-8 md:p-12 space-y-6">
              <div className="flex items-center justify-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-6 h-6",
                      i < testimonial.rating
                        ? "fill-amber-400 text-amber-400"
                        : "fill-gray-200 text-gray-200"
                    )}
                  />
                ))}
              </div>

              <Quote className="w-12 h-12 text-primary/20 mx-auto" />

              <p className="text-xl md:text-2xl text-center leading-relaxed">
                {testimonial.review}
              </p>

              <div className="flex flex-col items-center gap-4 pt-4">
                <Avatar className="w-16 h-16">
                  {testimonial.customerImage ? (
                    <AvatarImage src={testimonial.customerImage.url} alt={testimonial.customerName} />
                  ) : null}
                  <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-white text-lg font-medium">
                    {testimonial.customerName
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <p className="font-semibold text-lg">{testimonial.customerName}</p>
                  {testimonial.isVerified && (
                    <Badge variant="secondary" className="mt-1">
                      Verified Purchase
                    </Badge>
                  )}
                </div>
              </div>

              {testimonial.product && (
                <div className="pt-4">
                  <Button variant="outline" asChild className="mx-auto">
                    <Link href={`/products/${testimonial.product.slug.current}`}>
                      View Their Product
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
