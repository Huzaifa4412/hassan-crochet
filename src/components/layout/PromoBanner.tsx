import { getBanners } from "@/sanity/queries"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface PromoBannerProps {
  className?: string
  position?: number
}

export async function PromoBanner({ className, position = 0 }: PromoBannerProps) {
  const banners = await getBanners("promo")

  if (!banners || banners.length <= position) {
    return null
  }

  const banner = banners[position]

  const getBgColorClass = (bgColor?: string) => {
    switch (bgColor) {
      case "muted":
        return "bg-muted"
      case "orange-light":
        return "bg-orange-50"
      case "pink-light":
        return "bg-pink-50"
      case "custom":
        return ""
      default:
        return "bg-background"
    }
  }

  const bgColorClass = getBgColorClass(banner.backgroundColor)

  const customBg =
    banner.backgroundColor === "custom" && banner.customBackgroundColor
      ? { backgroundColor: banner.customBackgroundColor }
      : {}

  return (
    <section
      className={cn(
        "py-12 md:py-16",
        bgColorClass,
        className
      )}
      style={customBg}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {banner.headline && (
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              {banner.headline}
            </h2>
          )}
          {banner.subheadline && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {banner.subheadline}
            </p>
          )}
          {banner.ctaText && banner.ctaLink && (
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/25 mt-4"
            >
              <Link href={banner.ctaLink} className="flex items-center gap-2 group">
                {banner.ctaText}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}

export default PromoBanner
