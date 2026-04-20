"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ArrowRight, Eye, Sparkles } from "lucide-react"
import type { Product } from "@/sanity/queries"

interface ProductCardProps {
  product: Product
  className?: string
  showQuickView?: boolean
  onQuickView?: (product: Product) => void
}

export function ProductCard({ product, className, showQuickView = false, onQuickView }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = React.useState(false)
  const [isImageLoaded, setIsImageLoaded] = React.useState(false)

  // Use mainImage from the product, fallback to first variant image
  const mainImage = product.mainImageUrl || product.variants?.[0]?.imageUrl || ""
  const variants = product.variants || []

  return (
    <div className={cn("group", className)}>
      <Card className="overflow-hidden border-border/40 bg-background hover:shadow-xl transition-all duration-500 hover:border-primary/30 relative">
        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault()
            setIsFavorite(!isFavorite)
          }}
          className={cn(
            "absolute top-3 right-3 z-20 h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110",
            isFavorite && "opacity-100"
          )}
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-all",
              isFavorite ? "fill-current text-destructive" : "text-foreground"
            )}
          />
        </Button>

        {/* Badges */}
        {product.badges && product.badges.length > 0 && (
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            {product.badges.map((badge, index) => (
              <Badge
                key={index}
                variant={index === 0 ? "default" : "secondary"}
                className="text-[10px] px-2.5 py-0.5 font-medium shadow-sm backdrop-blur-sm"
              >
                {badge}
              </Badge>
            ))}
          </div>
        )}

        {/* Image Container */}
        <div className="block relative aspect-square overflow-hidden bg-muted/30">
          {/* Primary Image */}
          {mainImage && (
            <Image
              src={mainImage}
              alt={product.title}
              fill
              className={cn(
                "object-cover transition-all duration-700 group-hover:scale-110",
                !isImageLoaded && "scale-110 blur-xl"
              )}
              onLoad={() => setIsImageLoaded(true)}
            />
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Quick Action Buttons on Hover */}
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex gap-2">


            <Button
              asChild
              size="sm"
              className={cn(
                "flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium shadow-lg shadow-orange-500/25",
                !showQuickView && "w-full"
              )}
            >
              <a
                href={product.etsyLink || "#"}
                target="_blank"
              >
                View On Etsy
                <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </Button>
          </div>

          {/* Sparkle Effect on Hover */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="relative">
              <Sparkles className="w-16 h-16 text-primary/20 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-4 space-y-3">
          {/* Category */}
          {product.category && (
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              {product.category.title}
            </p>
          )}

          {/* Title */}
          <Link href={`/products/${product.slug.current}`}>
            <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
              {product.title}
            </h3>
          </Link>

          {/* Description - Optional */}
          {product.shortDescription && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.shortDescription}
            </p>
          )}

          {/* Color Variants Preview */}
          {variants.length > 0 && (
            <div className="flex items-center gap-1.5 pt-1">
              {variants.slice(0, 4).map((variant, index) => {
                const bgColor = variant.colorValue?.startsWith("bg-")
                  ? variant.colorValue
                  : undefined
                const styleColor = variant.colorValue && !variant.colorValue.startsWith("bg-")
                  ? { backgroundColor: variant.colorValue }
                  : undefined

                return (
                  <div
                    key={index}
                    className={cn(
                      "w-5 h-5 rounded-full border-2 border-background shadow-sm",
                      bgColor
                    )}
                    style={styleColor}
                    title={variant.colorName}
                  />
                )
              })}
              {variants.length > 4 && (
                <span className="text-xs text-muted-foreground ml-1">
                  +{variants.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Premium CTA Button */}
          <Link
            href={`/products/${product.slug.current}`}
            rel="noopener noreferrer"
            className="group/btn relative block"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 rounded-lg blur opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300"></div>
            <button className="relative w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium py-2.5 px-4 rounded-lg shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 flex items-center justify-center gap-2 text-sm group-hover/btn:scale-[1.02] active:scale-[0.98]">
              <span>Customize Now</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </Link>
        </CardContent>
      </Card>
    </div >
  )
}

// Compact Product Card for Side/Grid Layouts
interface ProductCardCompactProps {
  product: Product
  className?: string
}

export function ProductCardCompact({ product, className }: ProductCardCompactProps) {
  const [isFavorite, setIsFavorite] = React.useState(false)

  const mainImage = product.mainImageUrl || product.variants?.[0]?.imageUrl || ""
  const variants = product.variants || []

  return (
    <div className={cn("group", className)}>
      <Card className="overflow-hidden border-border/40 bg-background hover:shadow-lg transition-all duration-300 hover:border-primary/30">
        <CardContent className="p-3 flex gap-4">
          {/* Image */}
          <Link href={`/products/${product.slug.current}`} className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted/30">
            {mainImage && (
              <Image
                src={mainImage}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            )}
            {product.badges && product.badges.length > 0 && (
              <Badge className="absolute top-1 left-1 text-[9px] px-1.5 py-0 h-4">
                {product.badges[0]}
              </Badge>
            )}
          </Link>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-1">
            {product.category && (
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                {product.category.title}
              </p>
            )}
            <Link href={`/products/${product.slug.current}`}>
              <h4 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">
                {product.title}
              </h4>
            </Link>
            {product.shortDescription && (
              <p className="text-xs text-muted-foreground line-clamp-1">
                {product.shortDescription}
              </p>
            )}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                {variants.length > 0 && (
                  <div className="flex gap-1">
                    {variants.slice(0, 3).map((variant, index) => {
                      const bgColor = variant.colorValue?.startsWith("bg-")
                        ? variant.colorValue
                        : undefined
                      const styleColor = variant.colorValue && !variant.colorValue.startsWith("bg-")
                        ? { backgroundColor: variant.colorValue }
                        : undefined

                      return (
                        <div
                          key={index}
                          className={cn(
                            "w-3 h-3 rounded-full border border-background shadow-sm",
                            bgColor
                          )}
                          style={styleColor}
                        />
                      )
                    })}
                  </div>
                )}
                {product.etsyLink && (
                  <a
                    href={product.etsyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold text-orange-600 hover:text-orange-700 flex items-center gap-0.5 ml-1"
                  >
                    Etsy <ArrowRight className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={(e) => {
                  e.preventDefault()
                  setIsFavorite(!isFavorite)
                }}
              >
                <Heart
                  className={cn(
                    "h-3.5 w-3.5",
                    isFavorite ? "fill-current text-destructive" : ""
                  )}
                />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Featured Product Card - Larger, More Prominent
interface ProductCardFeaturedProps {
  product: Product
  className?: string
}

export function ProductCardFeatured({ product, className }: ProductCardFeaturedProps) {
  const [isFavorite, setIsFavorite] = React.useState(false)

  const mainImage = product.mainImageUrl || product.variants?.[0]?.imageUrl || ""

  return (
    <div className={cn("group", className)}>
      <Card className="overflow-hidden border-border/40 bg-background hover:shadow-2xl transition-all duration-500 hover:border-primary/30 relative">
        {/* Featured Badge */}
        <div className="absolute top-4 left-4 z-20">
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 text-xs font-semibold shadow-lg">
            <Sparkles className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        </div>

        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-4 right-4 z-20 h-10 w-10 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background hover:scale-110 transition-all"
        >
          <Heart
            className={cn(
              "h-5 w-5 transition-all",
              isFavorite ? "fill-current text-destructive" : ""
            )}
          />
        </Button>

        {/* Image */}
        <Link href={`/products/${product.slug.current}`} className="block relative aspect-[4/3] overflow-hidden bg-muted/30">
          {mainImage && (
            <Image
              src={mainImage}
              alt={product.title}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-60" />

          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
            {product.category && (
              <p className="text-xs font-medium text-primary uppercase tracking-widest">
                {product.category.title}
              </p>
            )}
            <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
              {product.title}
            </h2>
            {product.shortDescription && (
              <p className="text-sm text-white/90 line-clamp-2 max-w-md">
                {product.shortDescription}
              </p>
            )}
          </div>
        </Link>

        {/* Actions */}
        <CardContent className="p-6 flex gap-3">
          <Link href={`/products/${product.slug.current}`} className="flex-1">
            <Button
              variant="outline"
              size="lg"
              className="w-full group/btn"
            >
              Customize
              <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <a
            href={product.etsyLink || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 group/btn relative block"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 rounded-lg blur opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300"></div>
            <Button
              size="lg"
              className="relative w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/25"
            >
              Order on Etsy
            </Button>
          </a>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProductCard
