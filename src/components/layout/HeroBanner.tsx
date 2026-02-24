import { getHeroBanners } from "@/sanity/queries"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface HeroBannerProps {
  className?: string
}

export async function HeroBanner({ className }: HeroBannerProps) {
  const banners = await getHeroBanners()

  if (!banners || banners.length === 0) {
    return null
  }

  const banner = banners[0] // Get the first/primary hero banner

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

  const getTextColorClass = (textColor?: string) => {
    switch (textColor) {
      case "white":
        return "text-white"
      case "black":
        return "text-black"
      case "orange":
        return "text-orange-600"
      case "custom":
        return ""
      default:
        return "text-foreground"
    }
  }

  const getCtaStyle = (ctaStyle?: string) => {
    switch (ctaStyle) {
      case "secondary":
        return "outline"
      case "ghost":
        return "ghost"
      default:
        return "default"
    }
  }

  const bgColorClass = getBgColorClass(banner.backgroundColor)
  const textColorClass = getTextColorClass(banner.textColor)
  const ctaStyle = getCtaStyle(banner.ctaStyle)

  const customBg =
    banner.backgroundColor === "custom" && banner.customBackgroundColor
      ? { backgroundColor: banner.customBackgroundColor }
      : {}

  const customText =
    banner.textColor === "custom" && banner.customTextColor
      ? { color: banner.customTextColor }
      : {}

  return (
    <section
      className={cn(
        "relative overflow-hidden",
        bgColorClass,
        className
      )}
      style={customBg}
    >
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div
            className={cn(
              "space-y-6 lg:space-y-8",
              textColorClass
            )}
            style={customText}
          >
            {banner.headline && (
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                {banner.headline}
              </h1>
            )}
            {banner.subheadline && (
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
                {banner.subheadline}
              </p>
            )}
            {banner.ctaText && banner.ctaLink && (
              <div className="flex flex-wrap gap-4">
                <Button
                  asChild
                  variant={ctaStyle as any}
                  size="lg"
                  className={
                    ctaStyle === "default"
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/25 text-lg px-8 py-6 h-auto"
                      : "text-lg px-8 py-6 h-auto"
                  }
                >
                  <Link href={banner.ctaLink} className="flex items-center gap-2 group">
                    {banner.ctaText}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Image */}
          {banner.image && (
            <div className="relative">
              <div className="relative aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={banner.image.url}
                  alt={banner.headline || banner.title}
                  className={cn(
                    "absolute inset-0 w-full h-full object-cover",
                    banner.imagePosition === "top" && "object-top",
                    banner.imagePosition === "bottom" && "object-bottom",
                    banner.imagePosition === "left" && "object-left",
                    banner.imagePosition === "right" && "object-right",
                    (!banner.imagePosition || banner.imagePosition === "center") && "object-center"
                  )}
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-orange-200 rounded-full blur-3xl opacity-50 -z-10" />
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-pink-200 rounded-full blur-3xl opacity-50 -z-10" />
            </div>
          )}
        </div>
      </div>

      {/* Background pattern */}
      <div className="absolute inset-0 -z-10 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
    </section>
  )
}

export default HeroBanner
