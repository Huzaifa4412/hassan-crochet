"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"
import type { Banner } from "@/sanity/queries"

// Swiper imports - use dynamic import for client-side only
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination, EffectFade, Navigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import "swiper/css/effect-fade"

interface BannerSliderProps {
  banners: Banner[]
  className?: string
}

export function BannerSlider({ banners, className }: BannerSliderProps) {
  const [isPlaying, setIsPlaying] = useState(true)
  const swiperRef = useRef<any>(null)

  if (!banners || banners.length === 0) {
    return null
  }

  const toggleAutoplay = () => {
    if (swiperRef.current) {
      if (isPlaying) {
        swiperRef.current.autoplay.stop()
      } else {
        swiperRef.current.autoplay.start()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div className={cn("relative w-full", className)}>
      <Swiper
        ref={swiperRef}
        modules={[Autoplay, Pagination, EffectFade, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
          bulletClass: "w-3 h-3 rounded-full bg-white/50 opacity-100 transition-all",
          bulletActiveClass: "w-8 bg-white",
        }}
        navigation={{
          nextEl: ".banner-button-next",
          prevEl: ".banner-button-prev",
        }}
        loop={true}
        className="banner-swiper"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner._id}>
            <BannerSlide banner={banner} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons */}
      <button
        className="banner-button-prev absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
      </button>
      <button
        className="banner-button-next absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
      </button>

      {/* Autoplay Toggle */}
      <button
        onClick={toggleAutoplay}
        className="absolute bottom-6 right-6 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center"
        aria-label={isPlaying ? "Pause autoplay" : "Play autoplay"}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 text-white" />
        ) : (
          <Play className="w-4 h-4 text-white ml-0.5" />
        )}
      </button>
    </div>
  )
}

interface BannerSlideProps {
  banner: Banner
}

function BannerSlide({ banner }: BannerSlideProps) {
  const getImagePosition = () => {
    switch (banner.imagePosition) {
      case "top": return "object-top"
      case "bottom": return "object-bottom"
      case "left": return "object-left"
      case "right": return "object-right"
      default: return "object-center"
    }
  }

  const getBackgroundClass = () => {
    switch (banner.backgroundColor) {
      case "muted": return "bg-muted"
      case "orange-light": return "bg-orange-50"
      case "pink-light": return "bg-pink-50"
      default: return "bg-background"
    }
  }

  const getBackgroundStyle = () => {
    if (banner.backgroundColor === "custom" && banner.customBackgroundColor) {
      return { backgroundColor: banner.customBackgroundColor }
    }
    return undefined
  }

  const getTextColorClass = () => {
    switch (banner.textColor) {
      case "white": return "text-white"
      case "black": return "text-foreground"
      case "orange": return "text-orange-500"
      default: return "text-foreground"
    }
  }

  const getTextColorStyle = () => {
    if (banner.textColor === "custom" && banner.customTextColor) {
      return { color: banner.customTextColor }
    }
    return undefined
  }

  const getCtaVariant = (): "default" | "outline" | "ghost" => {
    switch (banner.ctaStyle) {
      case "secondary": return "outline"
      case "ghost": return "ghost"
      default: return "default"
    }
  }

  return (
    <div
      className={cn("relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden", getBackgroundClass())}
      style={getBackgroundStyle()}
    >
      {/* Background Image */}
      {banner.image && (
        <div className="absolute inset-0">
          <Image
            src={banner.image.url}
            alt={banner.headline || banner.title}
            fill
            className={`w-full h-full object-cover ${getImagePosition()}`}
            priority
            quality={90}
          />
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 h-full flex items-center">
        <div className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {banner.headline && (
            <h1
              className={cn("text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight drop-shadow-lg", getTextColorClass())}
              style={getTextColorStyle()}
            >
              {banner.headline}
            </h1>
          )}

          {banner.subheadline && (
            <p
              className={cn("text-lg md:text-xl drop-shadow-md opacity-90", getTextColorClass())}
              style={getTextColorStyle()}
            >
              {banner.subheadline}
            </p>
          )}

          {banner.ctaText && banner.ctaLink && (
            <div className="pt-4">
              <Button asChild size="lg" variant={getCtaVariant()} className="min-w-[160px] text-base">
                <Link href={banner.ctaLink}>
                  {banner.ctaText}
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
