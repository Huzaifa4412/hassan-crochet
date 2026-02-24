"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, Heart, Minus, Plus } from "lucide-react"

// Color Selector Component
export interface ColorOption {
  name: string
  value: string
  imageUrl?: string
}

interface ColorSelectorProps {
  colors: ColorOption[]
  selectedColor: ColorOption
  onSelectColor: (color: ColorOption) => void
  className?: string
}

export function ColorSelector({ colors, selectedColor, onSelectColor, className }: ColorSelectorProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium">Select Color</label>
        <span className="text-sm text-muted-foreground capitalize">{selectedColor?.name}</span>
      </div>
      <div className="flex gap-3">
        {colors.map((color) => (
          <TooltipWrapper key={color.name} content={color.name}>
            <button
              onClick={() => onSelectColor(color)}
              aria-label={color.name}
              className={cn(
                "relative w-12 h-12 rounded-full transition-all duration-200 flex items-center justify-center",
                selectedColor?.name === color.name
                  ? "scale-110 shadow-lg ring-2 ring-ring ring-offset-2"
                  : "hover:scale-105 opacity-80 hover:opacity-100"
              )}
            >
              {color.imageUrl ? (
                <img
                  src={color.imageUrl}
                  alt={color.name}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div
                  className="w-full h-full rounded-full"
                  style={{ backgroundColor: color.value }}
                />
              )}
              {selectedColor?.name === color.name && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full shadow-sm" />
                </div>
              )}
            </button>
          </TooltipWrapper>
        ))}
      </div>
    </div>
  )
}

// Quantity Selector Component
interface QuantitySelectorProps {
  quantity: number
  onQuantityChange: (quantity: number) => void
  min?: number
  max?: number
  className?: string
}

export function QuantitySelector({
  quantity,
  onQuantityChange,
  min = 1,
  max = 99,
  className
}: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1)
    }
  }

  const handleIncrement = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    if (!isNaN(value) && value >= min && value <= max) {
      onQuantityChange(value)
    }
  }

  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex items-center border border-input rounded-lg overflow-hidden">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleDecrement}
          disabled={quantity <= min}
          className="h-10 w-10 rounded-none"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          value={quantity}
          onChange={handleInputChange}
          min={min}
          max={max}
          className="h-10 w-16 border-0 text-center focus-visible:ring-0"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleIncrement}
          disabled={quantity >= max}
          className="h-10 w-10 rounded-none"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// Image Gallery Component
interface ImageGalleryProps {
  images: string[]
  currentIndex: number
  onIndexChange: (index: number) => void
  badges?: Array<{ label: string; variant?: "default" | "secondary" | "destructive" | "outline" }>
  className?: string
}

export function ImageGallery({
  images,
  currentIndex,
  onIndexChange,
  badges = [],
  className
}: ImageGalleryProps) {
  const goToPrevious = () => {
    onIndexChange((currentIndex - 1 + images.length) % images.length)
  }

  const goToNext = () => {
    onIndexChange((currentIndex + 1) % images.length)
  }

  return (
    <div className={cn("space-y-4", className)}>
      <Card className="overflow-hidden">
        <CardContent className="p-0 relative aspect-square">
          {/* Badges */}
          {badges.length > 0 && (
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
              {badges.map((badge, index) => (
                <Badge key={index} variant={badge.variant || "default"}>
                  {badge.label}
                </Badge>
              ))}
            </div>
          )}

          {/* Main Image */}
          <img
            src={images[currentIndex]}
            alt={`Product view ${currentIndex + 1}`}
            className="w-full h-full object-cover"
          />

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full shadow-lg"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full shadow-lg"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => onIndexChange(index)}
              className={cn(
                "relative flex-shrink-0 w-20 aspect-square rounded-lg overflow-hidden transition-all",
                currentIndex === index
                  ? "ring-2 ring-primary ring-offset-2"
                  : "hover:ring-2 hover:ring-muted-foreground hover:ring-offset-2"
              )}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Countdown Timer Component
interface CountdownTimerProps {
  endDate: Date
  onComplete?: () => void
  className?: string
}

export function CountdownTimer({ endDate, onComplete, className }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = React.useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  React.useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = endDate.getTime() - new Date().getTime()

      if (difference <= 0) {
        onComplete?.()
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      }
    }

    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [endDate, onComplete])

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-muted rounded-lg px-4 py-3 min-w-[70px]">
        <span className="text-2xl font-semibold tabular-nums">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-xs text-muted-foreground mt-1">{label}</span>
    </div>
  )

  return (
    <div className={cn("space-y-3", className)}>
      <p className="text-sm font-medium">Offer expires in:</p>
      <div className="flex gap-3">
        <TimeBlock value={timeLeft.days} label="Days" />
        <TimeBlock value={timeLeft.hours} label="Hours" />
        <TimeBlock value={timeLeft.minutes} label="Minutes" />
        <TimeBlock value={timeLeft.seconds} label="Seconds" />
      </div>
    </div>
  )
}

// Add to Cart Button Component
interface AddToCartButtonProps {
  isFavorite?: boolean
  onToggleFavorite?: () => void
  onAddToCart?: () => void
  showWishlist?: boolean
  className?: string
}

export function AddToCartButton({
  isFavorite = false,
  onToggleFavorite,
  onAddToCart,
  showWishlist = true,
  className
}: AddToCartButtonProps) {
  return (
    <div className={cn("flex gap-3", className)}>
      <Button onClick={onAddToCart} size="lg" className="flex-1">
        Add to Cart
      </Button>
      {showWishlist && (
        <Button
          variant="outline"
          size="lg"
          onClick={onToggleFavorite}
          className="shrink-0"
        >
          <Heart
            className={cn(
              "h-5 w-5",
              isFavorite && "fill-current text-destructive"
            )}
          />
        </Button>
      )}
    </div>
  )
}

// Tooltip Wrapper (simple inline tooltip)
function TooltipWrapper({ children, content }: { children: React.ReactNode; content: string }) {
  return (
    <div className="group relative inline-block">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-primary text-primary-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        {content}
      </div>
    </div>
  )
}

// Product Price Component
interface ProductPriceProps {
  price: number
  comparePrice?: number
  className?: string
}

export function ProductPrice({ price, comparePrice, className }: ProductPriceProps) {
  return (
    <div className={cn("flex items-baseline gap-3", className)}>
      <span className="text-3xl font-bold">${price.toFixed(2)}</span>
      {comparePrice && (
        <span className="text-lg text-muted-foreground line-through">
          ${comparePrice.toFixed(2)}
        </span>
      )}
    </div>
  )
}

// Product Rating Component
interface ProductRatingProps {
  rating: number
  reviewCount?: number
  className?: string
}

export function ProductRating({ rating = 5, reviewCount, className }: ProductRatingProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={cn(
              "h-4 w-4",
              i < rating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"
            )}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      {reviewCount && (
        <span className="text-sm text-muted-foreground">({reviewCount} reviews)</span>
      )}
    </div>
  )
}
