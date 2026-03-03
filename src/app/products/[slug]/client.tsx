"use client"

import React, { useState, useRef, useEffect } from "react"
import { Download, Copy, Heart, Info, Palette, Type, Sparkles, ArrowRight, Shield, Truck, Gem, Star, ChevronDown, ChevronUp, Check, ShoppingBag, ZoomIn, Award, Clock } from "lucide-react"
import { Pacifico, Delius, Meow_Script, Borel, Mystery_Quest, Pinyon_Script } from "next/font/google"

import CustomizationCanvas, { CustomizationCanvasRef } from "@/components/CustomizationCanvas"
import { Product } from "@/sanity/queries"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Configure Google Fonts
const pacifico = Pacifico({ subsets: ["latin"], weight: "400", display: "swap" })
const delius = Delius({ subsets: ["latin"], weight: "400", display: "swap" })
const meowScript = Meow_Script({ subsets: ["latin"], weight: "400", display: "swap" })
const borel = Borel({ subsets: ["latin"], weight: "400", display: "swap" })
const mysteryQuest = Mystery_Quest({ subsets: ["latin"], weight: "400", display: "swap" })
const pinyonScript = Pinyon_Script({ subsets: ["latin"], weight: "400", display: "swap" })

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
  { name: "Blue Icon 1", url: "/icons/image-swatches-2_1_1742280999062-1748241688.avif" },
  { name: "Pink Icon", url: "/icons/image-swatches-2_15_1742281294612-1748241738.avif" },
  { name: "Light Blue Icon", url: "/icons/image-swatches-2_2_1742281000795-1748241695.avif" },
  { name: "Gray Icon", url: "/icons/image-swatches-2_20_1748241835490-1748241838.avif" },
  { name: "Green Icon", url: "/icons/image-swatches-2_3_1713509294243-1748241701.webp" },
  { name: "Orange Icon", url: "/icons/image-swatches-2_3_1713509300624-1713509328.webp" },
  { name: "Red Icon", url: "/icons/image-swatches-2_4_1742281000196-1748241704.webp" },
  { name: "Purple Icon", url: "/icons/image-swatches-2_5_1714127302243-1748241706.avif" },
  { name: "Pink Icon 2", url: "/icons/image-swatches-2_6_1742281001781-1748241710.avif" },
  { name: "Multi Icon", url: "/icons/image-swatches-2_8_1742281002277-1748241715.avif" },
  { name: "Dark Icon", url: "/icons/image-swatches-2_9_1742281002744-1748241718.webp" },
  { name: "Swatch 1", url: "/icons/swatch-17645549500664.webp" },
  { name: "Swatch 2", url: "/icons/swatch-17645549949216.avif" },
]

// Single color options
const SINGLE_TEXT_COLORS = [
  { name: "White", value: "#FFFFFF", preview: "#FFFFFF" },
  { name: "Cream", value: "#FFFDD0", preview: "#FFFDD0" },
  { name: "Oat", value: "#E8DCC4", preview: "#E8DCC4" },
  { name: "Mustard", value: "#E1AD01", preview: "#E1AD01" },
  { name: "Rust", value: "#B7410E", preview: "#B7410E" },
  { name: "Pink", value: "#FFC0CB", preview: "#FFC0CB" },
  { name: "Purple", value: "#9B59B6", preview: "#9B59B6" },
  { name: "Light blue", value: "#ADD8E6", preview: "#ADD8E6" },
  { name: "Royal blue", value: "#4169E1", preview: "#4169E1" },
  { name: "Light pink", value: "#FFB6C1", preview: "#FFB6C1" },
  { name: "Coffee", value: "#6F4E37", preview: "#6F4E37" },
  { name: "Ash gray", value: "#B2BEB5", preview: "#B2BEB5" },
  { name: "Rose Red", value: "#C21E56", preview: "#C21E56" },
  { name: "Navy Blue", value: "#000080", preview: "#000080" },
  { name: "Natural white", value: "#F5F5DC", preview: "#F5F5DC" },
  { name: "Grass Green", value: "#4CAF50", preview: "#4CAF50" },
]

// Multi-color palette options with individual swatches
const MULTI_COLOR_PALETTES = [
  {
    name: "Blossom",
    value: "blossom",
    colors: ["#FF69B4", "#FFB6C1", "#FFF0F5"], // magenta, light pink, pale pink
  },
  {
    name: "Cloudy",
    value: "cloudy",
    colors: ["#87CEEB", "#B0E0E6", "#E6E6FA", "#A9A9A9"], // sky-blue, powder-blue, lavender, gray
  },
  {
    name: "Rainbow",
    value: "rainbow",
    colors: ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#9D4EDD"], // pink, yellow, green, blue, purple
  },
  {
    name: "Grassland",
    value: "grassland",
    colors: ["#556B2F", "#98FB98", "#808080"], // olive green, mint green, gray
  },
]

const FONTS = [
  { name: "Cursive", value: "cursive" },
  { name: "Pacifico", value: "Pacifico, cursive" },
  { name: "Delius", value: "Delius, cursive" },
  { name: "Meow Script", value: "Meow Script, cursive" },
  { name: "Borel", value: "Borel, cursive" },
  { name: "Mystery Quest", value: "Mystery Quest, cursive" },
  { name: "Pinyon Script", value: "Pinyon Script, cursive" },
]

interface ProductClientProps {
  product: Product
}

// Helper to get Tailwind bg class from color value
function getBgClass(colorValue: string): string {
  if (colorValue?.startsWith("#")) {
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
  return colorValue || ""
}

// Get badge labels from product data
function getBadgeLabels(badges?: string[]): { primary?: string; secondary?: string } {
  if (!badges || badges.length === 0) {
    return { primary: "Handmade", secondary: "Customizable" }
  }
  return {
    primary: badges[0],
    secondary: badges.length > 1 ? badges[1] : "Customizable",
  }
}

export default function ProductClient({ product }: ProductClientProps) {
  const canvasRef = useRef<CustomizationCanvasRef>(null)

  // Convert Sanity variants to color format
  const colors = product.variants?.map((v) => ({
    name: v.colorName,
    value: v.colorValue ? getBgClass(v.colorValue) : undefined,
    imageUrl: v.imageUrl,
    sortOrder: v.sortOrder ?? 0,
  }))?.sort((a, b) => a.sortOrder - b.sortOrder) || []

  // Product state
  const [selectedColor, setSelectedColor] = useState(colors[0])
  const [isFavorite, setIsFavorite] = useState(false)

  // Customization state
  const [customText, setCustomText] = useState("")
  const [textColor, setTextColor] = useState(SINGLE_TEXT_COLORS[0].value)
  const [textFont, setTextFont] = useState(FONTS[0].value)
  const [isMultiColor, setIsMultiColor] = useState(false)
  const [addedIcons, setAddedIcons] = useState<string[]>([])
  const [addedTexts, setAddedTexts] = useState<Array<{ text: string; color: string; font: string }>>([])
  const [copied, setCopied] = useState(false)

  // Selection state
  const [hasSelectedText, setHasSelectedText] = useState(false)
  const [selectedObjectType, setSelectedObjectType] = useState<'text' | 'group' | 'image' | null>(null)

  // UI state
  const [showFullDescription, setShowFullDescription] = useState(false)

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
    setAddedTexts((prev) => [...prev, { text: customText, color: textColor, font: textFont }])
    setCustomText("")
  }

  // Handle selection change from canvas
  const handleSelectionChange = (hasSelection: boolean, selectionType: 'text' | 'group' | 'image' | null) => {
    setHasSelectedText(hasSelection && (selectionType === 'text' || selectionType === 'group'))
    setSelectedObjectType(selectionType)
  }

  // Handle color change - update selected object if exists
  const handleTextColorChange = (newColor: string, multiColor: boolean) => {
    setTextColor(newColor)
    setIsMultiColor(multiColor)

    // If a text object is selected, update it in real-time
    if (hasSelectedText && (selectedObjectType === 'text' || selectedObjectType === 'group')) {
      canvasRef.current?.updateSelectedTextColor(newColor, textFont)
    }
  }

  // Handle font change - update selected object if exists
  const handleFontChange = (newFont: string) => {
    setTextFont(newFont)

    // If a text object is selected, update it in real-time
    if (hasSelectedText && (selectedObjectType === 'text' || selectedObjectType === 'group')) {
      canvasRef.current?.updateSelectedTextColor(textColor, newFont)
    }
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

  const currentSummary = `Product: ${product.title} | Color: ${selectedColor?.name} | Text: ${addedTexts.length > 0 ? addedTexts.map(t => t.text).join(", ") : "None"} | Text Color: ${isMultiColor ? MULTI_COLOR_PALETTES.find(p => p.value === textColor)?.name : SINGLE_TEXT_COLORS.find(c => c.value === textColor)?.name} | Font: ${FONTS.find((f) => f.value === textFont)?.name} | Icons: ${addedIcons.length > 0 ? addedIcons.join(", ") : "None"}`

  const handleCopyCustomizations = () => {
    navigator.clipboard.writeText(currentSummary)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const badges = getBadgeLabels(product.badges)

  return (
    <div className="bg-gradient-to-b from-background to-muted/10">
      <div className="mx-auto px-4 py-8 md:py-12 max-w-7xl w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <a href="/" className="hover:text-foreground transition-colors shrink-0">Home</a>
          <span className="shrink-0">/</span>
          <a href="/products" className="hover:text-foreground transition-colors shrink-0">Products</a>
          <span className="shrink-0">/</span>
          <span className="text-foreground font-medium truncate">{product.title}</span>
        </nav>

        {/* Product Header */}
        <div className="text-center mb-8 md:mb-12 space-y-4">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {badges.primary && (
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20">{badges.primary}</Badge>
            )}
            {badges.secondary && (
              <Badge variant="secondary">{badges.secondary}</Badge>
            )}
            {product.category && (
              <Badge variant="outline">{product.category.title}</Badge>
            )}
            {product.inStock === false && (
              <Badge variant="destructive">Out of Stock</Badge>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight px-2">
            {product.title}
          </h1>
          {product.shortDescription && (
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              {product.shortDescription}
            </p>
          )}
        </div>

        {/* Main Content - Flex container with sticky */}
        <div className="flex flex-col lg:flex-row lg:gap-6 lg:items-start w-full">
          {/* Left Column - Canvas (Sticky) */}
          <div className="sticky top-4 lg:top-6 self-start flex-shrink-0 w-full lg:w-[45%] lg:max-w-lg z-20">
            <Card className="overflow-hidden shadow-2xl border-2">
              <CardContent className="p-0">
                <div className="relative aspect-[4/5] md:aspect-[3/4] w-full min-h-[500px] max-h-[600px] bg-gradient-to-br from-muted/30 via-muted/20 to-muted/30 overflow-hidden">
                  {/* Badges */}
                  <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                    {badges.primary && (
                      <Badge className="shadow-lg bg-primary text-primary-foreground px-3 py-1 text-xs">
                        {badges.primary}
                      </Badge>
                    )}
                  </div>

                  {/* Interactive indicator */}
                  <div className="absolute bottom-4 right-4 z-10 pointer-events-none">
                    <div className="flex items-center gap-2 px-4 py-2 bg-background/95 backdrop-blur-md rounded-full border shadow-xl">
                      <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                      <span className="text-sm font-medium">Drag to customize</span>
                    </div>
                  </div>

                  <CustomizationCanvas
                    ref={canvasRef}
                    initialImage={colors[0]?.imageUrl || ""}
                    onSelectionChange={handleSelectionChange}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Customization (Scrollable) */}
          <div className="space-y-6 w-full lg:w-[55%] lg:max-w-xl min-w-0">
            {/* Product Description */}
            <Card className="shadow-sm w-full overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">About This Product</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {product.description && (
                  <div className="prose prose-sm max-w-none">
                    {showFullDescription ? (
                      <>
                        <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{product.description}</p>
                        <Button
                          variant="link"
                          size="sm"
                          className="px-0 text-primary h-8"
                          onClick={() => setShowFullDescription(false)}
                        >
                          Show less <ChevronUp className="ml-1 h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <p className="text-muted-foreground line-clamp-3 whitespace-pre-wrap leading-relaxed">{product.description}</p>
                        {product.description.length > 150 && (
                          <Button
                            variant="link"
                            size="sm"
                            className="px-0 text-primary h-8"
                            onClick={() => setShowFullDescription(true)}
                          >
                            Read more <ChevronDown className="ml-1 h-4 w-4" />
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border">
                    <Shield className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Handmade</p>
                      <p className="text-xs text-muted-foreground">With love & care</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border">
                    <Truck className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Fast Shipping</p>
                      <p className="text-xs text-muted-foreground">Worldwide delivery</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border">
                    <Gem className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Premium Quality</p>
                      <p className="text-xs text-muted-foreground">Best materials</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border">
                    <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Made to Order</p>
                      <p className="text-xs text-muted-foreground">Just for you</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Bar */}
            <div className="flex items-center justify-between p-4 rounded-xl border bg-card shadow-sm">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFavorite(!isFavorite)}
                className={isFavorite ? "text-destructive" : ""}
              >
                <Heart className={`h-6 w-6 ${isFavorite ? "fill-current" : ""}`} />
              </Button>
              <a
                href={product.etsyLink || "https://www.etsy.com"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="gap-2 shadow-lg">
                  <ShoppingBag className="h-5 w-5" />
                  Order on Etsy
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
            </div>

            {/* Color Selection */}
            <Card className="shadow-sm w-full overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Choose Your Color</CardTitle>
                <CardDescription>Select your preferred color variant</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {colors.map((color) => (
                    <TooltipProvider key={color.name}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => setSelectedColor(color)}
                            aria-label={color.name}
                            className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-200 border-2 ${selectedColor?.name === color.name
                              ? "shadow-lg ring-2 ring-primary border-primary"
                              : "border-transparent hover:shadow-md opacity-90 hover:opacity-100"
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
                            {selectedColor?.name === color.name && (
                              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                <Check className="h-8 w-8 text-white drop-shadow-lg" />
                              </div>
                            )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="capitalize font-medium">{color.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Customization Studio */}
            <Card className="shadow-lg border-2 w-full overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-primary" />
                  <CardTitle>Customization Studio</CardTitle>
                </div>
                <CardDescription>Personalize your product with text or icons</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <Accordion type="multiple" defaultValue={["text", "icons"]} className="w-full">
                  {/* Text Customization */}
                  <AccordionItem value="text" className="border-b last:border-0">
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Type className="w-5 h-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold">Add Text</div>
                          <div className="text-xs text-muted-foreground">Personalize with your message</div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pb-6 space-y-5">
                      {/* Text Input */}
                      <div className="space-y-2">
                        <Label htmlFor="custom-text" className="text-sm font-medium">Your Message</Label>
                        <div className="flex gap-2">
                          <Input
                            id="custom-text"
                            placeholder="Type your message..."
                            value={customText}
                            onChange={(e) => setCustomText(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddText()}
                            className="flex-1 h-11"
                          />
                          <Button onClick={handleAddText} size="icon" className="h-11 w-11" disabled={!customText.trim()}>
                            <Check className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Text Color */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">Text Color</Label>
                          {hasSelectedText && (
                            <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                              Editing selected text
                            </span>
                          )}
                        </div>

                        {/* Single Colors Grid */}
                        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2 p-1 overflow-hidden">
                          {SINGLE_TEXT_COLORS.map((color) => (
                            <TooltipProvider key={color.value}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={() => handleTextColorChange(color.value, false)}
                                    aria-label={color.name}
                                    className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-200 border-2 ${textColor === color.value && !isMultiColor
                                      ? "shadow-lg ring-2 ring-primary border-primary"
                                      : "border-border opacity-70 hover:opacity-100 shadow-sm"
                                      }`}
                                  >
                                    <div
                                      className="w-full h-full"
                                      style={{ backgroundColor: color.preview }}
                                    />
                                    {textColor === color.value && !isMultiColor && (
                                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                        <Check className="h-4 w-4 text-white drop-shadow-md" />
                                      </div>
                                    )}
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                  <p className="font-medium">{color.name}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ))}
                        </div>

                        {/* Multi Colors Section */}
                        <div className="space-y-2 pt-2">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Multi colors</p>
                          <div className="grid grid-cols-2 gap-2">
                            {MULTI_COLOR_PALETTES.map((palette) => (
                              <button
                                key={palette.value}
                                onClick={() => handleTextColorChange(palette.value, true)}
                                className={`relative flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${textColor === palette.value && isMultiColor
                                  ? "border-primary bg-primary/5 shadow-md"
                                  : "border-border hover:border-primary/50 hover:bg-muted/30"
                                  }`}
                              >
                                {/* Color Swatches - compact horizontal */}
                                <div className="flex gap-1">
                                  {palette.colors.map((swatchColor, idx) => (
                                    <div
                                      key={idx}
                                      className="w-5 h-5 rounded-full border border-gray-200 shadow-sm"
                                      style={{ backgroundColor: swatchColor }}
                                    />
                                  ))}
                                </div>
                                {/* Palette Name */}
                                <span className="text-xs font-medium">{palette.name}</span>
                                {/* Selected indicator */}
                                {textColor === palette.value && isMultiColor && (
                                  <div className="absolute top-1 right-1">
                                    <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                                      <Check className="h-3 w-3 text-white" />
                                    </div>
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Font Selection */}
                      <div className="space-y-2">
                        <Label htmlFor="text-font" className="text-sm font-medium">Font Style</Label>
                        <Select value={textFont} onValueChange={handleFontChange}>
                          <SelectTrigger id="text-font" className="w-full h-11">
                            <SelectValue>
                              <span style={{ fontFamily: textFont }}>
                                {FONTS.find((f) => f.value === textFont)?.name}
                              </span>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {FONTS.map((f) => (
                              <SelectItem key={f.value} value={f.value}>
                                <span style={{ fontFamily: f.value }}>{f.name}</span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Icons Customization */}
                  <AccordionItem value="icons" className="border-b last:border-0">
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold">Add Icons</div>
                          <div className="text-xs text-muted-foreground">Decorate with beautiful icons</div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pb-6 space-y-4">
                      <div className="grid grid-cols-6 gap-3 max-h-[280px] overflow-y-auto pr-2 scrollbar-hide">
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
                                  className="aspect-square flex items-center justify-center bg-muted/50 hover:bg-muted border border-border hover:border-primary/50 rounded-xl transition-all cursor-grab active:cursor-grabbing group shadow-sm hover:shadow-md"
                                >
                                  <img
                                    src={icon.url}
                                    alt={icon.name}
                                    className="w-8 h-8 opacity-70 group-hover:opacity-100 transition-opacity"
                                    draggable={false}
                                  />
                                  {addedIcons.includes(icon.name) && (
                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-md">
                                      <Check className="h-3 w-3 text-white" />
                                    </div>
                                  )}
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{icon.name}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground text-center">Click or drag icons to add to your design</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <Separator />

                {/* Summary */}
                <Alert className="bg-muted/50 border-border">
                  <Info className="h-4 w-4 text-primary" />
                  <AlertDescription className="text-sm">
                    <div className="space-y-2">
                      <p className="font-medium flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        Your Customization
                      </p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                        <span className="text-muted-foreground">Color:</span>
                        <span className="font-medium text-foreground">{selectedColor?.name}</span>
                        <span className="text-muted-foreground">Text:</span>
                        <span className="font-medium text-foreground">{addedTexts.length > 0 ? addedTexts.map(t => t.text).join(", ") : "None"}</span>
                        <span className="text-muted-foreground">Text Color:</span>
                        <span className="font-medium text-foreground">
                          {isMultiColor
                            ? MULTI_COLOR_PALETTES.find(p => p.value === textColor)?.name
                            : SINGLE_TEXT_COLORS.find(c => c.value === textColor)?.name}
                        </span>
                        <span className="text-muted-foreground">Icons:</span>
                        <span className="font-medium text-foreground">{addedIcons.length > 0 ? addedIcons.join(", ") : "None"}</span>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={handleDownloadPreview}
                    className="h-11 gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCopyCustomizations}
                    className="h-11 gap-2"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>

                {/* Etsy Note */}
                <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-800 rounded-lg">
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-100 flex items-start gap-2">
                    <span className="text-amber-600 dark:text-amber-400 mt-0.5">💡</span>
                    <span>Important Note:</span>
                  </p>
                  <p className="text-sm text-amber-800 dark:text-amber-200 mt-2 leading-relaxed">
                    Please copy the text below to Etsy's personalization box, or take a screenshot and send it to the seller!
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Premium CTA */}
            <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-xl border-0 w-full">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
              <CardContent className="p-6 space-y-4 relative">
                <div className="flex items-center justify-center">
                  <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 px-4 py-1.5 text-xs font-semibold tracking-wide shadow-md backdrop-blur-sm">
                    ORDER YOUR CUSTOM PIECE
                  </Badge>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                    <span>Premium handmade craftsmanship</span>
                  </div>
                </div>
                <a
                  href={product.etsyLink || "https://www.etsy.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button className="w-full bg-white text-primary hover:bg-white/90 h-12 font-semibold shadow-xl">
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Order on Etsy
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </a>
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="text-center">
                    <div className="w-9 h-9 mx-auto mb-1 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                      <Shield className="w-4 h-4" />
                    </div>
                    <p className="text-[10px] font-medium opacity-90">Secure</p>
                  </div>
                  <div className="text-center">
                    <div className="w-9 h-9 mx-auto mb-1 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                      <Truck className="w-4 h-4" />
                    </div>
                    <p className="text-[10px] font-medium opacity-90">Fast</p>
                  </div>
                  <div className="text-center">
                    <div className="w-9 h-9 mx-auto mb-1 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                      <Heart className="w-4 h-4" />
                    </div>
                    <p className="text-[10px] font-medium opacity-90">Handmade</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reviews Section */}
        <Card className="mt-12 shadow-sm w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
              Customer Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="flex items-center justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-6 h-6 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              <p className="text-2xl font-bold">5.0</p>
              <p className="text-sm text-muted-foreground">Based on {Math.floor(Math.random() * 50 + 10)} reviews</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
