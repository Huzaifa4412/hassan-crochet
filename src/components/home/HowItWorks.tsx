"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Palette, PenTool, Package, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface HowItWorksProps {
  className?: string
}

interface Step {
  number: number
  title: string
  description: string
  icon: React.ElementType
}

const steps: Step[] = [
  {
    number: 1,
    title: "Choose",
    description: "Select from 50+ handmade products Sweaters, Cardigans, and more",
    icon: Palette,
  },
  {
    number: 2,
    title: "Customize",
    description: "Add names, icons, and personal touches to make it uniquely yours",
    icon: PenTool,
  },
  {
    number: 3,
    title: "Receive",
    description: "Get your custom piece delivered in 3-5 business days",
    icon: Package,
  },
]

export function HowItWorks({ className }: HowItWorksProps) {
  return (
    <section className={cn("py-12 md:py-16 lg:py-24 bg-muted/30", className)}>
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
            Simple Process
          </Badge>
          <h2 className=" text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Create Your Perfect Piece in 3 Steps
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Personalizing your crochet piece is easy. Choose your favorite product, customize it
            with your personal touch, and receive it at your doorstep.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div
                key={step.number}
                className="relative group animate-in fade-in slide-in-from-bottom-4 duration-1000"
                style={{ animationDelay: `${index * 300}ms` }}
              >
                {/* Step Card */}
                <div className="relative bg-background rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-border/40 h-full">
                  {/* Step Number Badge */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>

                  {/* Arrow Indicator (except last step) */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                      <div className="w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                        <ArrowRight className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-1000" style={{ animationDelay: '900ms' }}>
          <Button size="lg" className="group shadow-lg hover:shadow-xl transition-shadow" asChild>
            <Link href="/products">
              Start Customizing
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
