import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { BannerSlider } from "@/components/home/BannerSlider"
import { ProductCard, FeaturedProductCard } from "@/components/home/ProductCard"
import { BentoGrid } from "@/components/home/BentoGrid"
import { TestimonialsCarousel } from "@/components/home/TestimonialsCarousel"
import { BrandStory } from "@/components/home/BrandStory"
import { HowItWorks } from "@/components/home/HowItWorks"
import { SocialFeed } from "@/components/home/SocialFeed"
import { EnhancedCTA } from "@/components/home/EnhancedCTA"
import {
  getBanners,
  getNewProducts,
  getFeaturedProducts,
  type Product,
} from "@/sanity/queries"
import { TestimonialsSection } from "@/components/home/Testimonials"

export default async function Home() {
  // Fetch all data in parallel
  const [heroBanners, newProducts, featuredProducts] = await Promise.all([
    getBanners("hero"),
    getNewProducts(8),
    getFeaturedProducts(4),
  ])

  return (
    <>
      <main>
        {/* 1. Hero Section - Full Width Banner Slider */}
        {/* {heroBanners && heroBanners.length > 0 && (
          <BannerSlider banners={heroBanners} />
        )} */}

        {/* 2. Brand Story Section - Heritage & Trust Building */}
        <BrandStory />

        {/* 3. New Arrivals Section */}
        {newProducts && newProducts.length > 0 && (
          <section className="py-12 md:py-16 lg:py-24 bg-background">
            <div className="container mx-auto px-4 md:px-6">
              {/* Section Header */}
              <div className="text-center mb-12 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <Badge variant="outline" className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Just In
                </Badge>
                <h2 className=" text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                  New Arrivals
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Fresh from our crochet studio - the latest customizable designs
                </p>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {newProducts.map((product, index) => (
                  <div
                    key={product._id}
                    className="animate-in fade-in zoom-in-95 duration-700"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* View All Button */}
              <div className="text-center mt-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
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


        {/* 5. Featured Products Section - Horizontal Scroll */}
        {featuredProducts && featuredProducts.length > 0 && (
          <section className="py-12 md:py-16 lg:py-24 bg-muted/30 overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
              {/* Section Header */}
              <div className="text-center mb-12 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <Badge variant="outline" className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                  ⭐ Best Sellers
                </Badge>
                <h2 className=" text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                  Featured Products
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Our most loved customizable pieces
                </p>
              </div>

              {/* Horizontal Scroll Container */}
              <div className="relative -mx-4 md:mx-0">
                <div className="flex gap-6 overflow-x-auto pb-6 px-4 md:px-0 scrollbar-hide snap-x snap-mandatory">
                  {featuredProducts.map((product, index) => (
                    <div
                      key={product._id}
                      className="flex-shrink-0 w-[280px] md:w-[320px] snap-start animate-in fade-in zoom-in-95 duration-700"
                      style={{ animationDelay: `${index * 100}ms` }}
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


        {/* 4. How It Works Section - 3-Step Process */}
        <HowItWorks />
        {/* 6. Bento Grid Section - Creative Highlight */}
        <BentoGrid />

{/* 7. Testimonials Section */}
<TestimonialsSection />
      </main>
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
