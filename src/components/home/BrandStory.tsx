"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react"
import { cn } from "@/lib/utils"

interface BrandStoryProps {
  className?: string
}

export function BrandStory({ className }: BrandStoryProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showControls, setShowControls] = useState(false)

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100
      setProgress(currentProgress)
    }
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        videoRef.current.requestFullscreen()
      }
    }
  }

  return (
    <section
      className={cn("py-12 md:py-16 lg:py-24 bg-background", className)}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content Column */}
          <div className="space-y-6 order-2 lg:order-1 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Badge */}
            <Badge className="w-fit bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
              Our Story
            </Badge>

            {/* Heading */}
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                Handcrafted with Love Since 2020
              </h2>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                Since 2020, Knitty Petit has been creating unique, customizable crochet pieces that
                bring warmth and personality to your home. Each product is lovingly handcrafted with
                attention to detail and quality materials.
              </p>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                From cozy tray tables to decorative accessories, every piece tells a story of
                craftsmanship and care. We believe in creating products that become cherished
                parts of your home.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
                <div className="text-2xl md:text-3xl font-bold text-primary">5K+</div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">Happy Customers</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                <div className="text-2xl md:text-3xl font-bold text-primary">50+</div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">Unique Designs</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                <div className="text-2xl md:text-3xl font-bold text-primary">100%</div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">Handmade</div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
              <Button size="lg" className="group" asChild>
                <Link href="/products">
                  Explore Our Collection
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Video Column */}
          <div className="order-1 lg:order-2 animate-in fade-in slide-in-from-right-4 duration-1000">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl bg-muted group">
              <video
                ref={videoRef}
                src="/videos/video1.mp4"
                autoPlay
                loop
                playsInline
                muted={isMuted}
                onTimeUpdate={handleTimeUpdate}
                className="w-full h-full object-cover"
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />

              {/* Custom Controls */}
              <div
                className={cn(
                  "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 transition-opacity duration-300",
                  showControls || !isPlaying ? "opacity-100" : "opacity-0"
                )}
              >
                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="h-1 bg-white/30 rounded-full overflow-hidden cursor-pointer group/progress">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-100"
                      style={{
                        width: `${progress}%`
                      }}
                    />
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Play/Pause */}
                    <button
                      onClick={togglePlay}
                      className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                      aria-label={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? (
                        <Pause className="h-5 w-5 text-white" />
                      ) : (
                        <Play className="h-5 w-5 text-white" />
                      )}
                    </button>

                    {/* Mute/Unmute */}
                    <button
                      onClick={toggleMute}
                      className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                      aria-label={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? (
                        <VolumeX className="h-5 w-5 text-white" />
                      ) : (
                        <Volume2 className="h-5 w-5 text-white" />
                      )}
                    </button>
                  </div>

                  {/* Fullscreen */}
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    aria-label="Fullscreen"
                  >
                    <Maximize className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Center Play/Pause Button (shows on hover when paused) */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <button
                    onClick={togglePlay}
                    className="p-4 rounded-full bg-white/90 hover:bg-white transition-transform hover:scale-110"
                    aria-label="Play"
                  >
                    <Play className="h-8 w-8 text-primary fill-primary" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
