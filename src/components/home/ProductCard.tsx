'use client'

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Heart, ShoppingCart, Star } from "lucide-react"
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
  const [imageLoaded, setImageLoaded] = useState(false)

  const firstVariant = product.variants?.[0]
  const productImage = firstVariant?.imageUrl
  const productSlug = product.slug?.current
  const isSale = comparePrice && price != null && comparePrice > price
  const isNew = product.badges?.some(b => b.toLowerCase() === "new")
  const isBestseller = product.badges?.some(b => b.toLowerCase().includes("best"))

  if (!productSlug) return null

  // Compact variant for list views
  if (variant === "compact") {
    return (
      <Link href={`/products/${productSlug}`} className={cn("group block", className)}>
        <div className="flex gap-4 p-4 bg-white rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all">
          {/* Thumbnail */}
          <div className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden bg-gray-50">
            {productImage ? (
              <Image
                src={productImage}
                alt={product.title}
                fill
                className="object-cover"
                sizes="80px"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <span className="text-xs text-gray-400">No img</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <h3 className="font-medium text-sm text-gray-900 line-clamp-1">
                {product.title}
              </h3>
              {product.category && (
                <p className="text-xs text-gray-500 mt-0.5">{product.category.title}</p>
              )}
            </div>
            <div className="flex items-center justify-between">
              {price ? (
                <span className="text-sm font-semibold text-gray-900">
                  ${price.toFixed(2)}
                </span>
              ) : (
                <span className="text-sm font-medium text-primary">Custom</span>
              )}
              <button
                onClick={(e) => {
                  e.preventDefault()
                  setIsFavorited(!isFavorited)
                }}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Heart className={cn("w-4 h-4", isFavorited && "fill-red-500 text-red-500")} />
              </button>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Card className={cn(
      "group border border-gray-100 bg-white overflow-hidden hover:shadow-lg transition-all duration-300",
      variant === "featured" && "md:col-span-2 lg:col-span-1",
      className
    )}>
      <CardContent className="p-0">
        <Link href={`/products/${productSlug}`}>
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-gray-50">
            {productImage && productImage.length > 0 ? (
              <Image
                src={productImage}
                alt={product.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <span className="text-sm text-gray-400">No image</span>
              </div>
            )}

            {/* Badge - Top Left */}
            {isNew && (
              <div className="absolute top-3 left-3">
                <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-2.5 py-1 rounded-md">
                  NEW
                </Badge>
              </div>
            )}

            {isBestseller && !isNew && (
              <div className="absolute top-3 left-3">
                <Badge className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-2.5 py-1 rounded-md">
                  BESTSELLER
                </Badge>
              </div>
            )}

            {/* Sale Badge */}
            {isSale && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-md">
                  -{Math.round((1 - price / comparePrice!) * 100)}%
                </Badge>
              </div>
            )}

            {/* Favorite Button */}
            <button
              onClick={(e) => {
                e.preventDefault()
                setIsFavorited(!isFavorited)
              }}
              className={cn(
                "absolute bottom-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all",
                "bg-white shadow-md hover:shadow-lg hover:scale-105",
                isFavorited && "bg-red-50"
              )}
            >
              <Heart className={cn(
                "w-4 h-4 transition-colors",
                isFavorited ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500"
              )} />
            </button>
          </div>

          {/* Product Info */}
          <div className="p-4 space-y-3">
            {/* Category */}
            {product.category && (
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                {product.category.title}
              </p>
            )}

            {/* Title */}
            <h3 className="font-medium text-base text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
              {product.title}
            </h3>

            {/* Rating */}
            {(isBestseller || rating) && rating && (
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-3.5 h-3.5",
                        i < Math.floor(rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-200"
                      )}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">
                  {rating} {reviewCount && `(${reviewCount})`}
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-2">
              {price ? (
                <>
                  <span className={cn(
                    "text-lg font-bold text-gray-900",
                    isSale && "text-red-600"
                  )}>
                    ${price.toFixed(2)}
                  </span>
                  {isSale && comparePrice && (
                    <span className="text-sm text-gray-400 line-through">
                      ${comparePrice.toFixed(2)}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-lg font-bold text-primary">Custom</span>
              )}
            </div>

            {/* Color Swatches */}
            {product.variants && product.variants.length > 1 && (
              <div className="flex items-center gap-1.5 pt-1">
                {product.variants.slice(0, 4).map((variant, index) => (
                  <button
                    key={index}
                    className="w-5 h-5 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform"
                    style={{
                      backgroundColor: variant.colorValue || "#ccc"
                    }}
                    title={variant.colorName}
                  />
                ))}
                {product.variants.length > 4 && (
                  <span className="text-xs text-gray-500">
                    +{product.variants.length - 4}
                  </span>
                )}
              </div>
            )}

            {/* Add to Cart Button */}
            <Button
              className={cn(
                "w-full h-10 font-semibold",
                product.inStock === false
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-900 text-white hover:bg-gray-800"
              )}
              disabled={product.inStock === false}
              onClick={(e) => e.preventDefault()}
            >
              {product.inStock === false ? (
                "Out of Stock"
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
        </Link>
      </CardContent>
    </Card>
  )
}

// Featured Product Card
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
      "group border border-gray-100 bg-white overflow-hidden hover:shadow-xl transition-all duration-300",
      className
    )}>
      <CardContent className="p-0">
        <Link href={`/products/${productSlug}`}>
          {/* Image */}
          <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
            {productImage && productImage.length > 0 ? (
              <Image
                src={productImage}
                alt={product.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <span className="text-sm text-gray-400">No image</span>
              </div>
            )}

            {/* Bestseller Badge */}
            <div className="absolute top-4 left-4">
              <Badge className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-3 py-1.5 rounded-md shadow-md">
                ⭐ BESTSELLER
              </Badge>
            </div>

            {/* Rating Badge */}
            {rating && (
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-semibold">{rating}</span>
              </div>
            )}

            {/* Favorite */}
            <button
              onClick={(e) => {
                e.preventDefault()
                setIsFavorited(!isFavorited)
              }}
              className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center"
            >
              <Heart className={cn(
                "w-5 h-5",
                isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"
              )} />
            </button>
          </div>

          {/* Info */}
          <div className="p-5 space-y-3">
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
              {product.title}
            </h3>

            {product.shortDescription && (
              <p className="text-sm text-gray-500 line-clamp-2">
                {product.shortDescription}
              </p>
            )}

           

            {/* Button */}
            <div className="flex gap-3 pt-2">
              <Button className="flex-1 bg-orange-600 text-white hover:bg-orange-700 h-11 font-semibold">
                Customize
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="h-11 border-gray-200 hover:bg-gray-50"
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
