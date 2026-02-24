'use client'

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Heart, Star } from "lucide-react"
import type { Product } from "@/sanity/queries"

interface ProductCardProps {
  product: Product
  variant?: "default" | "featured" | "compact"
  className?: string
}

export function ProductCard({ product, variant = "default", className }: ProductCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)

  const firstVariant = product.variants?.[0]
  const productImage = firstVariant?.imageUrl
  const productSlug = product.slug?.current

  if (!productSlug) return null

  const getBadgeColor = (badge: string) => {
    switch (badge.toLowerCase()) {
      case "new":
        return "bg-[#0FABCA] text-white hover:bg-[#0e9ab5]"
      case "bestseller":
        return "bg-orange-500 text-white hover:bg-orange-600"
      case "sale":
        return "bg-red-500 text-white hover:bg-red-600"
      case "limited edition":
        return "bg-purple-500 text-white hover:bg-purple-600"
      case "customizable":
        return "bg-green-500 text-white hover:bg-green-600"
      default:
        return "bg-muted text-foreground"
    }
  }

  if (variant === "compact") {
    return (
      <Link href={`/products/${productSlug}`} className={cn("group", className)}>
        <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex gap-4">
              {/* Thumbnail */}
              <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                {productImage ? (
                  <Image
                    src={productImage}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="96px"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">No image</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate mb-1">{product.title}</h3>
                {product.badges && product.badges.length > 0 && (
                  <Badge className={cn("text-[10px] px-1.5 py-0.5", getBadgeColor(product.badges[0]))}>
                    {product.badges[0]}
                  </Badge>
                )}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-semibold">Custom</span>
                  <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                    Customize
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }

  return (
    <Card className={cn(
      "group overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-500",
      variant === "featured" && "md:col-span-2 lg:col-span-1",
      className
    )}>
      <CardContent className="p-0">
        <Link href={`/products/${productSlug}`} className="block">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-muted">
            {productImage && productImage.length > 0 ? (
              <Image
                src={productImage}
                alt={product.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-sm text-muted-foreground">No image available</span>
              </div>
            )}

            {/* Badges */}
            {product.badges && product.badges.length > 0 && (
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {product.badges.slice(0, 2).map((badge, index) => (
                  <Badge key={index} className={cn("text-xs px-2 py-1", getBadgeColor(badge))}>
                    {badge}
                  </Badge>
                ))}
              </div>
            )}

            {/* Favorite Button */}
            <button
              onClick={(e) => {
                e.preventDefault()
                setIsFavorited(!isFavorited)
              }}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white hover:scale-110 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
              aria-label="Add to favorites"
            >
              <Heart className={cn("w-4 h-4 transition-colors", isFavorited ? "fill-red-500 text-red-500" : "text-foreground")} />
            </button>

            {/* Quick Customize Button - Appears on Hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button size="lg" className="bg-white text-foreground hover:bg-white/90 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                Customize Now
              </Button>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4 space-y-2">
            <h3 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors">
              {product.title}
            </h3>

            {product.shortDescription && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {product.shortDescription}
              </p>
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="text-lg font-bold">Custom</span>
              <Button size="sm" variant="outline" className="text-xs">
                View Options
              </Button>
            </div>

            {/* Color Swatches */}
            {product.variants && product.variants.length > 1 && (
              <div className="flex items-center gap-1.5 pt-2">
                {product.variants.slice(0, 4).map((variant, index) => (
                  <div
                    key={index}
                    className="w-5 h-5 rounded-full border border-border shadow-sm"
                    style={{
                      backgroundColor: variant.colorValue || "#ccc"
                    }}
                    title={variant.colorName}
                  />
                ))}
                {product.variants.length > 4 && (
                  <span className="text-xs text-muted-foreground ml-1">
                    +{product.variants.length - 4}
                  </span>
                )}
              </div>
            )}
          </div>
        </Link>
      </CardContent>
    </Card>
  )
}

// Featured Product Card with different layout
interface FeaturedProductCardProps {
  product: Product
  className?: string
}

export function FeaturedProductCard({ product, className }: FeaturedProductCardProps) {
  const firstVariant = product.variants?.[0]
  const productImage = firstVariant?.imageUrl
  const productSlug = product.slug?.current

  if (!productSlug) return null

  return (
    <Card className={cn(
      "group overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-500",
      className
    )}>
      <CardContent className="p-0">
        <Link href={`/products/${productSlug}`} className="block">
          {/* Larger Image for Featured */}
          <div className="relative aspect-[4/5] overflow-hidden bg-muted">
            {productImage && productImage.length > 0 ? (
              <Image
                src={productImage}
                alt={product.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-sm text-muted-foreground">No image available</span>
              </div>
            )}

            {/* Featured Badge */}
            <div className="absolute top-4 left-4">
              <Badge className="bg-gradient-to-r from-orange-500 to-pink-500 text-white border-0 px-3 py-1 text-sm font-semibold shadow-lg">
                ⭐ Best Seller
              </Badge>
            </div>

            {/* Rating Overlay */}
            {product.badges?.includes("Bestseller") && (
              <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold">4.9</span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-5 space-y-3">
            <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {product.title}
            </h3>

            {product.shortDescription && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {product.shortDescription}
              </p>
            )}

            <div className="flex items-center gap-2 pt-2">
              <Button className="flex-1 bg-foreground text-background hover:bg-foreground/90">
                Customize
              </Button>
              <Button size="icon" variant="outline" className="shrink-0">
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  )
}
