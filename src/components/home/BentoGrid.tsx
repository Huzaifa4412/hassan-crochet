import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Scissors, Palette, Package, Truck, Sparkles, Shield, Gem } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface BentoItem {
  title: string
  description: string
  icon: React.ReactNode
  image?: string
  span: string
  link?: string
  badge?: string
}

const bentoItems: BentoItem[] = [
  {
    title: "Custom Embroidery",
    description: "Add your name, initials, or custom text to any product",
    icon: <Scissors className="w-6 h-6" />,
    span: "col-span-1 row-span-2",
    badge: "Popular",
  },
  {
    title: "Icon Packs",
    description: "Choose from 50+ premium icons and designs",
    icon: <Palette className="w-6 h-6" />,
    span: "col-span-1",
  },
  {
    title: "Premium Fabrics",
    description: "100% cotton, eco-friendly materials",
    icon: <Sparkles className="w-6 h-6" />,
    span: "col-span-1",
  },
  {
    title: "Fast Shipping",
    description: "Worldwide delivery in 3-5 business days",
    icon: <Truck className="w-6 h-6" />,
    span: "col-span-1",
  },
  {
    title: "Quality Guarantee",
    description: "Handcrafted with love, backed by our satisfaction guarantee",
    icon: <Shield className="w-6 h-6" />,
    span: "col-span-2",
  },
]

interface BentoGridProps {
  className?: string
}

export function BentoGrid({ className }: BentoGridProps) {
  return (
    <section className={cn("py-12 md:py-16 lg:py-24 bg-muted/30", className)}>
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-12 space-y-4">
          <Badge variant="outline" className="mb-2">
            Why Choose Us
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            Crafted With Care
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every piece is lovingly handmade with premium materials and attention to detail
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[200px]">
          {bentoItems.map((item, index) => (
            <BentoCard key={index} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}

interface BentoCardProps {
  item: BentoItem
}

function BentoCard({ item }: BentoCardProps) {
  const baseClasses = "group relative overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-xl"
  const contentClasses = "absolute inset-0 p-6 flex flex-col justify-between z-10"

  const cardContent = (
    <>
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/50" />

      {/* Decorative Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      {/* Content */}
      <div className={contentClasses}>
        <div className="space-y-3">
          {/* Icon */}
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
            {item.icon}
          </div>

          {/* Badge */}
          {item.badge && (
            <Badge className="w-fit bg-primary/20 text-primary hover:bg-primary/30">
              {item.badge}
            </Badge>
          )}
        </div>

        <div className="space-y-1">
          <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
            {item.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {item.description}
          </p>
        </div>
      </div>

      {/* Hover Effect - Animated Border */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-transparent to-primary/20 animate-pulse" />
      </div>
    </>
  )

  if (item.link) {
    return (
      <Link href={item.link} className={cn(baseClasses, item.span, "cursor-pointer")}>
        {cardContent}
      </Link>
    )
  }

  return (
    <Card className={cn(baseClasses, item.span, "border-0")}>
      <CardContent className="p-0 h-full">
        {cardContent}
      </CardContent>
    </Card>
  )
}

// Feature Highlights Section - Alternative layout
interface FeatureHighlightProps {
  className?: string
}

export function FeatureHighlight({ className }: FeatureHighlightProps) {
  const features = [
    {
      icon: <Scissors className="w-8 h-8" />,
      title: "Custom Embroidery",
      description: "Personalize with names, dates, or special messages",
      color: "from-pink-500 to-rose-500",
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "50+ Icon Designs",
      description: "Flowers, animals, symbols and more to choose from",
      color: "from-purple-500 to-indigo-500",
    },
    {
      icon: <Gem className="w-8 h-8" />,
      title: "Premium Materials",
      description: "Soft, durable cotton that lasts for years",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Express Shipping",
      description: "Fast, secure delivery to your doorstep",
      color: "from-cyan-500 to-blue-500",
    },
  ]

  return (
    <section className={cn("py-12 md:py-16 lg:py-24 bg-background", className)}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 space-y-4">
          <Badge variant="outline" className="mb-2">
            Features
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            What Makes Us Special
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 group">
              <CardContent className="p-6 text-center space-y-4">
                <div className={cn(
                  "w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300",
                  feature.color
                )}>
                  {feature.icon}
                </div>
                <h3 className="font-bold text-lg">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
