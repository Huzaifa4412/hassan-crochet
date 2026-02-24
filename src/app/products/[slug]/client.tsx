"use client"

import React, { useState, useRef, useEffect } from "react"

import { Download, Copy, Heart, Info, Palette, Type, Sparkles, ArrowRight, Shield, Truck, Gem } from "lucide-react"

import CustomizationCanvas, { CustomizationCanvasRef } from "@/components/CustomizationCanvas"
import { Product } from "@/sanity/queries"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const ICONS = [
  { name: "Blue Flower", url: "/icons/Blue Flower-half.png" },
  { name: "Brown Flower", url: "/icons/Brown Flower-half.png" },
  { name: "Green Flower", url: "/icons/Green Flower-half.png" },
  { name: "Orange Flower", url: "/icons/Orange Flower-half.png" },
  { name: "Pink Combo", url: "/icons/Pink Combo.png" },
  { name: "Pink Flower", url: "/icons/Pink Flower-half.png" },
  { name: "Purple Flower 2", url: "/icons/Purple Flower2-half.png" },
  { name: "Purple Flower", url: "/icons/Purple Flower-half.png" },
  { name: "White Combo", url: "/icons/White Combo.png" },
  { name: "White Flower", url: "/icons/White Flower-half.png" },
  { name: "Yellow Combo", url: "/icons/Yellow Combo.png" },
  { name: "Yellow Flower", url: "/icons/Yellow Flower-half.png" },
]

const FONTS = [
  { name: "Sans-serif", value: "Arial, sans-serif" },
  { name: "Serif", value: "Georgia, serif" },
  { name: "Cursive", value: "cursive" },
  { name: "Monospace", value: "monospace" },
]

interface ProductClientProps {
  product: Product
}

// Helper to get Tailwind bg class from color value
function getBgClass(colorValue: string): string {
  if (colorValue.startsWith("#")) {
    const hex = colorValue.toLowerCase()
    const colorMap: Record<string, string> = {
      "#000000": "bg-black",
      "#ffffff": "bg-white",
      "#d2c4b5": "bg-[#D2C4B5]",
      "#ef4444": "bg-red-500",
      "#dc2626": "bg-red-600",
    }
    return colorMap[hex] || `bg-[${colorValue}]`
  }
  return colorValue
}

// Get badge labels from product data
function getBadgeLabels(badges?: string[]): { primary?: string; secondary?: string } {
  if (!badges || badges.length === 0) {
    return { primary: "Studio Edition", secondary: "Customizable" }
  }
  return {
    primary: badges[0],
    secondary: badges.length > 1 ? badges[1] : "Customizable",
  }
}

export default function ProductClient({ product }: ProductClientProps) {
  const canvasRef = useRef<CustomizationCanvasRef>(null)

  // Convert Sanity variants to color format
  const colors = product.variants.map((v) => ({
    name: v.colorName,
    value: v.colorValue ? getBgClass(v.colorValue) : undefined,
    imageUrl: v.imageUrl,
  }))

  // Product state
  const [selectedColor, setSelectedColor] = useState(colors[0])
  const [isFavorite, setIsFavorite] = useState(false)

  // Customization state
  const [customText, setCustomText] = useState("")
  const [textColor, setTextColor] = useState("#000000")
  const [textFont, setTextFont] = useState(FONTS[0].value)
  const [addedIcons, setAddedIcons] = useState<string[]>([])
  const [copied, setCopied] = useState(false)

  // Update canvas base image when color changes
  useEffect(() => {
    if (canvasRef.current && selectedColor && selectedColor.imageUrl) {
      canvasRef.current.updateBaseImage(selectedColor.imageUrl)
    }
  }, [selectedColor])

  // Handlers
  const handleAddText = () => {
    if (!customText.trim()) return
    canvasRef.current?.addText(customText, textFont, textColor)
    setCustomText("")
  }

  const handleAddIcon = (icon: typeof ICONS[0]) => {
    canvasRef.current?.addIcon(icon.url)
    if (!addedIcons.includes(icon.name)) {
      setAddedIcons((prev) => [...prev, icon.name])
    }
  }

  const handleDownloadPreview = () => {
    canvasRef.current?.download()
  }

  const currentSummary = `Text: ${customText || "None"} | Text Color: ${textColor} | Font: ${FONTS.find((f) => f.value === textFont)?.name} | Icons Added: ${addedIcons.length > 0 ? addedIcons.join(", ") : "None"}`

  const handleCopyCustomizations = () => {
    navigator.clipboard.writeText(currentSummary)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const badges = getBadgeLabels(product.badges)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 md:px-6">
          <nav className="flex items-center justify-between">
            <a href="/" className="text-xl font-bold tracking-tight">Hassan Crochet</a>
            <div className="flex items-center gap-4">
              <a href="/products" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Products</a>
              <Button variant="outline" size="sm">Contact</Button>
            </div>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column - Canvas */}
          <div className="lg:col-span-7 space-y-6">
            {/* Mobile Title */}
            <div className="space-y-2 lg:hidden">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{product.category?.title || "Accessories"}</Badge>
                <Badge variant="secondary">Customizable</Badge>
              </div>
              <h1 className="text-3xl font-bold tracking-tight">{product.title}</h1>
            </div>

            {/* Canvas Card */}
            <Card className="overflow-hidden shadow-lg">
              <CardContent className="p-0">
                <div className="relative aspect-[4/3] lg:aspect-auto lg:h-[600px] bg-muted/30">
                  {/* Badges */}
                  <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                    <Badge className="shadow-sm">{badges.primary}</Badge>
                    <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm shadow-sm">
                      {badges.secondary}
                    </Badge>
                  </div>

                  {/* Interactive indicator */}
                  <div className="absolute bottom-4 right-4 z-10 pointer-events-none">
                    <div className="flex items-center gap-2 px-4 py-2 bg-background/90 backdrop-blur-md rounded-lg border border-border shadow-lg">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Drag to customize</span>
                    </div>
                  </div>

                  <CustomizationCanvas
                    ref={canvasRef}
                    initialImage={colors[0]?.imageUrl || ""}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Customization */}
          <div className="lg:col-span-5 space-y-6">
            {/* Desktop Title */}
            <div className="hidden lg:block space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{product.category?.title || "Accessories"}</Badge>
                <Badge variant="secondary">Customizable</Badge>
              </div>
              <div className="flex items-start justify-between">
                <h1 className="text-3xl font-bold tracking-tight">{product.title}</h1>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={isFavorite ? "text-destructive" : ""}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Color Selection */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-base font-semibold">Select Color</Label>
                <span className="text-sm text-muted-foreground capitalize">{selectedColor?.name || ""}</span>
              </div>
              <div className="flex gap-3">
                {colors.map((color) => (
                  <TooltipProvider key={color.name}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setSelectedColor(color)}
                          aria-label={color.name}
                          className={`relative w-14 h-14 rounded-2xl overflow-hidden transition-all duration-200 ${
                            selectedColor?.name === color.name
                              ? "scale-110 shadow-xl ring-2 ring-primary ring-offset-2"
                              : "hover:scale-105 opacity-80 hover:opacity-100"
                          }`}
                        >
                          {color.imageUrl ? (
                            <img
                              src={color.imageUrl}
                              alt={color.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <span className="text-xs text-muted-foreground">{color.name}</span>
                            </div>
                          )}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="capitalize">{color.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>

            <Separator />

            {/* Customization Tabs */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-primary" />
                  Customization Studio
                </CardTitle>
                <CardDescription>Personalize your product with text or icons</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs defaultValue="text" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="text" className="flex items-center gap-2">
                      <Type className="w-4 h-4" />
                      Text
                    </TabsTrigger>
                    <TabsTrigger value="icons" className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Icons
                    </TabsTrigger>
                  </TabsList>

                  {/* Text Customization */}
                  <TabsContent value="text" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="custom-text">Your Message</Label>
                      <Input
                        id="custom-text"
                        placeholder="Enter your text..."
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddText()}
                      />
                    </div>

                    <div className="grid grid-cols-[auto_1fr_auto] gap-3 items-end">
                      <div className="space-y-2">
                        <Label htmlFor="text-color">Color</Label>
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-input">
                          <input
                            id="text-color"
                            type="color"
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            className="absolute inset-0 w-full h-full cursor-pointer"
                            title="Text color"
                          />
                          <div
                            className="w-full h-full pointer-events-none"
                            style={{ backgroundColor: textColor }}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="text-font">Font</Label>
                        <Select value={textFont} onValueChange={setTextFont}>
                          <SelectTrigger id="text-font">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {FONTS.map((f) => (
                              <SelectItem key={f.value} value={f.value}>
                                {f.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <Button onClick={handleAddText} size="lg" className="h-12">
                        Add Text
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Icons Customization */}
                  <TabsContent value="icons" className="space-y-4 mt-4">
                    <ScrollArea className="h-[240px] pr-4">
                      <div className="grid grid-cols-4 gap-3">
                        {ICONS.map((icon) => (
                          <TooltipProvider key={icon.name}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => handleAddIcon(icon)}
                                  onDragStart={(e) => {
                                    e.dataTransfer.setData("text/plain", icon.url)
                                    e.dataTransfer.effectAllowed = "copy"
                                  }}
                                  draggable
                                  className="aspect-square flex items-center justify-center bg-muted/50 hover:bg-muted border border-border hover:border-primary/50 rounded-xl transition-all cursor-grab active:cursor-grabbing group hover:scale-105"
                                >
                                  <img
                                    src={icon.url}
                                    alt={icon.name}
                                    className="w-8 h-8 opacity-70 group-hover:opacity-100 transition-opacity"
                                    draggable={false}
                                  />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{icon.name}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>
                    </ScrollArea>
                    <p className="text-xs text-muted-foreground">Drag icons or click to add to canvas</p>
                  </TabsContent>
                </Tabs>

                <Separator />

                {/* Summary & Actions */}
                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
                    <div className="flex items-start gap-2 mb-2">
                      <Info className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <p className="text-sm font-medium">Your Customization</p>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{currentSummary}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={handleDownloadPreview}
                      className="flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCopyCustomizations}
                      className="flex items-center justify-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Premium Etsy CTA Card */}
            <Card className="bg-gradient-to-br from-orange-50 via-background to-orange-50 border-orange-200/50 shadow-lg overflow-hidden">
              <CardContent className="p-6 space-y-4">
                {/* Premium Badge */}
                <div className="flex items-center justify-center">
                  <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-1.5 text-xs font-semibold tracking-wide shadow-md">
                    ORDER YOUR CUSTOM PIECE
                  </Badge>
                </div>

                {/* Feature Highlights */}
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Gem className="w-4 h-4 text-orange-500" />
                    <span>Premium handmade craftsmanship</span>
                  </div>
                </div>

                {/* Premium Etsy Button */}
                <a
                  href={product.etsyLink || "https://www.etsy.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                  <button className="relative w-full bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 hover:from-orange-600 hover:via-orange-700 hover:to-orange-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 flex items-center justify-center gap-3 group-hover:scale-[1.02] active:scale-[0.98]">
                    <span className="text-lg">Order on Etsy</span>
                    <img src="/Etsy_logo.svg.png" className="h-6 brightness-0 invert" alt="Etsy" />
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </a>

                {/* Trust Indicators */}
                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="text-center">
                    <div className="w-10 h-10 mx-auto mb-1.5 rounded-full bg-orange-100 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-orange-600" />
                    </div>
                    <p className="text-[10px] font-medium text-muted-foreground">Secure</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 mx-auto mb-1.5 rounded-full bg-orange-100 flex items-center justify-center">
                      <Truck className="w-4 h-4 text-orange-600" />
                    </div>
                    <p className="text-[10px] font-medium text-muted-foreground">Fast Ship</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 mx-auto mb-1.5 rounded-full bg-orange-100 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-orange-600" />
                    </div>
                    <p className="text-[10px] font-medium text-muted-foreground">Handmade</p>
                  </div>
                </div>
              </CardContent>
            </Card>
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
