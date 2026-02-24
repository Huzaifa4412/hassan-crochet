import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { BannerSlider } from "@/components/home/BannerSlider"
import { ProductCard, FeaturedProductCard } from "@/components/home/ProductCard"
import { BentoGrid, FeatureHighlight } from "@/components/home/BentoGrid"
import { TestimonialsCarousel } from "@/components/home/TestimonialsCarousel"
import {
  getBanners,
  getNewProducts,
  getFeaturedProducts,
  getTestimonials,
  type Product,
  type Testimonial,
} from "@/sanity/queries"

export default async function Home() {
  // Fetch all data in parallel
  const [heroBanners, newProducts, featuredProducts, testimonials] = await Promise.all([
    getBanners("hero"),
    getNewProducts(8),
    getFeaturedProducts(4),
    getTestimonials(true, 6),
  ])

  return (
    <>
      <Header />
      <main>
        {/* 1. Hero Section - Full Width Banner Slider */}
        {heroBanners && heroBanners.length > 0 && (
          <BannerSlider banners={heroBanners} />
        )}

        {/* 2. New Arrivals Section */}
        {newProducts && newProducts.length > 0 && (
          <section className="py-12 md:py-16 lg:py-24 bg-background">
            <div className="container mx-auto px-4 md:px-6">
              {/* Section Header */}
              <div className="text-center mb-12 space-y-4">
                <Badge variant="outline" className="mb-2">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Just In
                </Badge>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                  New Arrivals
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Fresh from our crochet studio - the latest customizable designs
                </p>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {newProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* View All Button */}
              <div className="text-center mt-12">
                <Button variant="outline" size="lg" asChild>
                  <Link href="/products?sort=new" className="group">
                    View All New Arrivals
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* 3. Featured Products Section - Horizontal Scroll */}
        {featuredProducts && featuredProducts.length > 0 && (
          <section className="py-12 md:py-16 lg:py-24 bg-muted/30 overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
              {/* Section Header */}
              <div className="text-center mb-12 space-y-4">
                <Badge variant="outline" className="mb-2">
                  ⭐ Best Sellers
                </Badge>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                  Featured Products
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Our most loved customizable pieces
                </p>
              </div>

              {/* Horizontal Scroll Container */}
              <div className="relative -mx-4 md:mx-0">
                <div className="flex gap-6 overflow-x-auto pb-6 px-4 md:px-0 scrollbar-hide snap-x snap-mandatory">
                  {featuredProducts.map((product) => (
                    <div
                      key={product._id}
                      className="flex-shrink-0 w-[280px] md:w-[320px] snap-start"
                    >
                      <FeaturedProductCard product={product} />
                    </div>
                  ))}
                </div>

                {/* Scroll Indicators */}
                <div className="hidden md:flex justify-center gap-2 mt-4">
                  {featuredProducts.map((_, index) => (
                    <button
                      key={index}
                      className="w-2 h-2 rounded-full bg-primary/20 hover:bg-primary transition-colors"
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 4. Bento Grid Section - Creative Highlight */}
        <BentoGrid />

        {/* Alternative: Feature Highlight Section */}
        {/* <FeatureHighlight /> */}

        {/* 5. Testimonials Section */}
        {testimonials && testimonials.length > 0 && (
          <TestimonialsCarousel testimonials={testimonials} />
        )}

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-primary/5">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <Badge variant="outline" className="mb-2">
                Start Creating
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                Make It Yours Today
              </h2>
              <p className="text-lg text-muted-foreground">
                Customize any product with names, icons, and personal touches. Perfect for gifts
                or treating yourself to something unique.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="min-w-[160px]" asChild>
                  <Link href="/products">
                    Shop Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="min-w-[160px]" asChild>
                  <Link href="/collections">View Collections</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

// SEO Metadata
export async function generateMetadata() {
  return {
    title: "Hassan Crochet - Handmade Customizable Crochet Products",
    description:
      "Discover unique handmade crochet products you can customize. Add names, icons, and personal touches to sweaters, accessories, and more. Handcrafted with love.",
    keywords: "crochet, handmade, customizable, personalized, embroidery, gifts",
    openGraph: {
      title: "Hassan Crochet - Handmade Customizable Crochet Products",
      description:
        "Discover unique handmade crochet products you can customize. Add names, icons, and personal touches to sweaters, accessories, and more.",
      type: "website",
    },
  }
}
