"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Heart, Instagram } from "lucide-react"
import { cn } from "@/lib/utils"

interface SocialFeedProps {
  className?: string
}

interface SocialPost {
  id: string
  url: string
  caption?: string
  likes?: number
  username?: string
}

// Hardcoded featured posts for Phase 1
const featuredPosts: SocialPost[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
    caption: "Love my new customized tray table!",
    likes: 234,
    username: "@happy_customer",
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80",
    caption: "Perfect addition to my bedroom",
    likes: 189,
    username: "@home_decor_lover",
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&q=80",
    caption: "Handmade quality is amazing!",
    likes: 312,
    username: "@craft_fanatic",
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80",
    caption: "Custom names turned out perfect",
    likes: 156,
    username: "@satisfied_mom",
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
    caption: "Best gift for my sister!",
    likes: 278,
    username: "@gift_ideas_2024",
  },
  {
    id: "6",
    url: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&q=80",
    caption: "Colors are even better in person",
    likes: 145,
    username: "@color_lover",
  },
  {
    id: "7",
    url: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=600&q=80",
    caption: "Amazing craftsmanship",
    likes: 198,
    username: "@quality_first",
  },
  {
    id: "8",
    url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80",
    caption: "So happy with my purchase!",
    likes: 267,
    username: "@repeat_customer",
  },
]

export function SocialFeed({ className }: SocialFeedProps) {
  return (
    <section className={cn("py-12 md:py-16 lg:py-24 bg-background", className)}>
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
            Social Feed
          </Badge>
          <h2 className=" text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Loved by Our Customers
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            See how our customers style their personalized pieces. Share yours with
            @hassancrochet for a chance to be featured!
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredPosts.map((post, index) => (
            <div
              key={post.id}
              className={cn(
                "group relative rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 animate-in fade-in zoom-in-95 duration-700",
                // Create masonry effect with varying aspect ratios
                index % 5 === 0 ? "row-span-2 aspect-[3/4]" : "aspect-square"
              )}
              style={{
                animationDelay: `${index * 150}ms`,
              }}
            >
              {/* Image */}
              <Image
                src={post.url}
                alt={post.caption || "Customer photo"}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />

              {/* Overlay - Appears on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  {/* Caption */}
                  {post.caption && (
                    <p className="text-sm font-medium line-clamp-2 mb-2">{post.caption}</p>
                  )}

                  {/* Username & Likes */}
                  <div className="flex items-center justify-between">
                    {post.username && (
                      <div className="flex items-center gap-1 text-xs">
                        <Instagram className="w-3 h-3" />
                        <span>{post.username}</span>
                      </div>
                    )}
                    {post.likes && (
                      <div className="flex items-center gap-1 text-xs">
                        <Heart className="w-3 h-3 fill-red-500 text-red-500" />
                        <span>{post.likes}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Heart Button - Always Visible on Desktop */}
              <button
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center"
                aria-label="Like post"
              >
                <Heart className="w-4 h-4 text-foreground" />
              </button>
            </div>
          ))}
        </div>

        {/* Instagram CTA */}
        <div className="text-center mt-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <a
            href="https://instagram.com/hassancrochet"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <Instagram className="w-5 h-5" />
            Follow @hassancrochet on Instagram
          </a>
        </div>
      </div>
    </section>
  )
}
