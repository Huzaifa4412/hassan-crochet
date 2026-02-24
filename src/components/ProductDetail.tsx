'use client'

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"

import { colors, images } from "@/Data"

import {
  ColorSelector,
  ImageGallery,
  ProductRating,
  ProductPrice,
  QuantitySelector,
} from "@/components/ui/ecommerce"

import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ArrowRight, ShoppingCart, Sparkles, Heart, Truck, Minus, Plus } from "lucide-react"

const ProductDetailsPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState(colors[0])
  const [isFavorite, setIsFavorite] = useState(false)
  const [quantity, setQuantity] = useState(1)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 md:px-6">
          <nav className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold tracking-tight">Hassan Crochet</Link>
            <div className="flex items-center gap-4">
              <Link href="/products" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Products</Link>
              <Button variant="outline" size="sm">Contact</Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <Card className="overflow-hidden border-0 shadow-sm">
              <CardContent className="p-0 relative aspect-square bg-muted/20">
                <img
                  src={images[currentImageIndex]}
                  alt={`Product view ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              </CardContent>
            </Card>

            {/* Thumbnails */}
            <div className="flex gap-3 justify-start">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all border-2 ${
                    currentImageIndex === index
                      ? "border-foreground"
                      : "border-transparent hover:border-muted-foreground/50"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <span>/</span>
              <Link href="/products" className="hover:text-foreground transition-colors">Products</Link>
              <span>/</span>
              <span className="text-foreground font-medium">Tray Table</span>
            </div>

            {/* Title & Badge */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Tray Table
                </h1>
                <Badge className="bg-[#0FABCA] text-white hover:bg-[#0e9ab5] mt-1">
                  New Arrival
                </Badge>
              </div>
              <ProductRating rating={4.9} reviewCount={23} />
            </div>

            {/* Price */}
            <div className="space-y-1">
              <ProductPrice price={199.99} comparePrice={249.99} />
              <p className="text-sm text-green-600 font-medium">Save $50.00</p>
            </div>

            <Separator />

            {/* Color Selection */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-base font-medium">Choose a Color</Label>
                <span className="text-sm text-muted-foreground capitalize">{selectedColor.name}</span>
              </div>
              <div className="flex gap-3">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`relative w-12 h-12 rounded-full transition-all duration-200 flex items-center justify-center ${
                      selectedColor.name === color.name
                        ? "scale-110 shadow-lg ring-2 ring-foreground ring-offset-2"
                        : "hover:scale-105 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <div
                      className={`w-full h-full rounded-full ${color.value} border border-border`}
                    />
                    {selectedColor.name === color.name && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full shadow-sm" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Quantity Selector */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Quantity</Label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-input rounded-lg overflow-hidden">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="h-10 w-10 rounded-none"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="h-10 w-16 flex items-center justify-center text-center">
                    <span className="text-base font-medium">{quantity}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-10 w-10 rounded-none"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">80 pieces available</span>
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button className="w-full h-12 text-base font-semibold bg-foreground text-background hover:bg-foreground/90">
                Add to Cart
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 h-12 text-base font-semibold border-foreground hover:bg-foreground/5">
                  Buy it now
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`h-12 w-12 ${isFavorite ? "border-destructive text-destructive" : ""}`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
                </Button>
              </div>
            </div>

            {/* Free Delivery Message */}
            <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Truck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Free Delivery</p>
                <p className="text-xs text-muted-foreground">Estimated delivery in 3-5 business days</p>
              </div>
            </div>

            <Separator />

            {/* View Details Accordion */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="details" className="border-0">
                <AccordionTrigger className="py-3 text-base font-medium hover:no-underline">
                  View Details
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-0 space-y-3">
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Buy one or buy a few and make every space where you sit more convenient.
                      Light and easy to move around with removable tray top, handy for serving snacks.
                      Each piece is lovingly handmade with premium cotton crochet thread.
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Specifications</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Material: Premium cotton crochet thread</li>
                      <li>• Base: MDF wood with removable tray top</li>
                      <li>• Care: Spot clean only, keep dry</li>
                      <li>• Measurements: 17 1/2×20 5/8"</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-16">
        <div className="container mx-auto px-4 py-8 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 Hassan Crochet. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">Privacy</Button>
              <Button variant="ghost" size="sm">Terms</Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default ProductDetailsPage
