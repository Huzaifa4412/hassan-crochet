'use client'

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Heart, Star, ShoppingCart, Eye } from "lucide-react"
import type { Product } from "@/sanity/queries"

interface ProductCardProps {
  product: Product
  variant?: "default" | "featured" | "compact"
  className?: string
  price?: number
  comparePrice?: number
  rating?: number
  reviewCount?: number
}

export function ProductCard({
  product,
  variant = "default",
  className,
  price,
  comparePrice,
  rating,
  reviewCount
}: ProductCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)

  const firstVariant = product.variants?.[0]
  const productImage = firstVariant?.imageUrl
  const productSlug = product.slug?.current
  const isSale = comparePrice && price != null && comparePrice > price
  const isNew = product.badges?.some(b => b.toLowerCase() === "new")
  const isBestseller = product.badges?.some(b => b.toLowerCase().includes("best"))

  if (!productSlug) return null

  const getBadgeColor = (badge: string) => {
    switch (badge.toLowerCase()) {
      case "new":
        return "bg-teal-500 text-white hover:bg-teal-600"
      case "bestseller":
        return "bg-primary/20 text-primary border-primary hover:bg-primary/30"
      case "sale":
        return "bg-red-500 text-white hover:bg-red-600 animate-pulse"
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
      "group overflow-hidden border-0 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500",
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
                className="object-cover group-hover:scale-105 group-hover:brightness-105 transition-all duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-sm text-muted-foreground">No image available</span>
              </div>
            )}

            {/* Badges - Priority 1 at top left */}
            {product.badges && product.badges.length > 0 && (
              <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                {product.badges.slice(0, 2).map((badge, index) => (
                  <Badge key={index} className={cn("text-xs px-2 py-1 shadow-sm", getBadgeColor(badge))}>
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
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white hover:scale-110 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
              aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={cn("w-4 h-4 transition-colors", isFavorited ? "fill-red-500 text-red-500" : "text-foreground")} />
            </button>

            {/* Quick Actions Overlay - Appears on Hover */}
            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <Button
                  size="sm"
                  className="flex-1 bg-white text-foreground hover:bg-white/90 shadow-lg text-xs font-medium"
                  onClick={(e) => {
                    e.preventDefault()
                    // Handle quick add
                  }}
                >
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  Quick Add
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="px-3 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
                  onClick={(e) => e.preventDefault()}
                >
                  <Eye className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4 space-y-3">
            {/* Rating for Bestsellers */}
            {isBestseller && rating && (
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-3 h-3",
                        i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"
                      )}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  {rating} {reviewCount && `(${reviewCount})`}
                </span>
              </div>
            )}

            <h3 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors">
              {product.title}
            </h3>

            {product.shortDescription && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {product.shortDescription}
              </p>
            )}

            {/* Price Display */}
            <div className="flex items-center gap-2">
              {price && (
                <>
                  <span className={cn(
                    "text-lg font-bold",
                    isSale ? "text-red-500" : ""
                  )}>
                    ${price.toFixed(2)}
                  </span>
                  {isSale && comparePrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      ${comparePrice.toFixed(2)}
                    </span>
                  )}
                  {isSale && (
                    <Badge variant="destructive" className="text-xs">
                      Save {Math.round((1 - price / comparePrice) * 100)}%
                    </Badge>
                  )}
                </>
              )}
              {!price && (
                <span className="text-lg font-bold">Custom</span>
              )}
            </div>

            {/* Color Swatches */}
            {product.variants && product.variants.length > 1 && (
              <div className="flex items-center gap-1.5">
                {product.variants.slice(0, 4).map((variant, index) => (
                  <div
                    key={index}
                    className="w-5 h-5 rounded-full border-2 border-transparent hover:scale-110 hover:border-primary transition-all cursor-pointer shadow-sm"
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
  price?: number
  comparePrice?: number
  rating?: number
  reviewCount?: number
}

export function FeaturedProductCard({
  product,
  className,
  price,
  comparePrice,
  rating,
  reviewCount
}: FeaturedProductCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const firstVariant = product.variants?.[0]
  const productImage = firstVariant?.imageUrl
  const productSlug = product.slug?.current
  const isSale = comparePrice && price != null && comparePrice > price

  if (!productSlug) return null

  return (
    <Card className={cn(
      "group overflow-hidden border-0 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-500",
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
                className="object-cover group-hover:scale-105 group-hover:brightness-105 transition-all duration-700"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-sm text-muted-foreground">No image available</span>
              </div>
            )}

            {/* Featured Badge */}
            <div className="absolute top-4 left-4">
              <Badge className="bg-gradient-to-r from-primary to-accent text-white border-0 px-3 py-1 text-sm font-semibold shadow-lg">
                ⭐ Best Seller
              </Badge>
            </div>

            {/* Rating Overlay */}
            {rating && (
              <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold">{rating}</span>
              </div>
            )}

            {/* Favorite Button */}
            <button
              onClick={(e) => {
                e.preventDefault()
                setIsFavorited(!isFavorited)
              }}
              className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white hover:scale-110 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
              aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={cn("w-5 h-5 transition-colors", isFavorited ? "fill-red-500 text-red-500" : "text-foreground")} />
            </button>
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

            {/* Price Display */}
            {price && (
              <div className="flex items-center gap-2">
                <span className={cn("text-2xl font-bold", isSale ? "text-red-500" : "")}>
                  ${price.toFixed(2)}
                </span>
                {isSale && comparePrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    ${comparePrice.toFixed(2)}
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <Button className="flex-1 bg-foreground text-background hover:bg-foreground/90">
                Customize
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="shrink-0"
                onClick={(e) => {
                  e.preventDefault()
                  // Handle quick add
                }}
              >
                <ShoppingCart className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  )
}
