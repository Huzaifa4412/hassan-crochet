"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface EnhancedCTAProps {
  className?: string
}

export function EnhancedCTA({ className }: EnhancedCTAProps) {
  return (
    <section className={cn("relative overflow-hidden py-16 md:py-24 lg:py-32", className)}>
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent animate-gradient" />

      {/* Decorative Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm animate-bounce">
            <Sparkles className="w-8 h-8 text-white" />
          </div>

          {/* Heading */}
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h2 className=" text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-white">
              Make It Yours Today
            </h2>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Customize any product with names, icons, and personal touches. Perfect for gifts
              or treating yourself to something unique.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
            <Button
              size="lg"
              variant="secondary"
              className="min-w-[160px] bg-white text-primary hover:bg-white/90 shadow-lg hover:shadow-xl transition-all group"
              asChild
            >
              <Link href="/products">
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="min-w-[160px] border-white text-white hover:bg-white/10 hover:text-white"
              asChild
            >
              <Link href="/products">View Collections</Link>
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span>Free Shipping on Orders $50+</span>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
              <span>100% Handmade with Love</span>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" style={{ animationDelay: '1s' }} />
              <span>3-5 Day Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-12 md:h-16 text-background fill-current"
          viewBox="0 0 1440 48"
          preserveAspectRatio="none"
        >
          <path d="M0,48 C240,48 480,24 720,24 C960,24 1200,48 1440,48 L1440,48 L0,48 Z" />
        </svg>
      </div>
    </section>
  )
}
