"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Users, ShoppingBag, TrendingUp, Clock, CheckCircle, Flame } from "lucide-react"
import { Card } from "@/components/ui/card"

interface RecentPurchase {
  id: string
  timeAgo: string
  location: string
}

// Generate realistic time ago strings
function getTimeAgo(): string {
  const times = [
    "Just now",
    "1 minute ago",
    "2 minutes ago",
    "3 minutes ago",
    "5 minutes ago",
    "8 minutes ago",
    "10 minutes ago",
    "12 minutes ago",
    "15 minutes ago",
    "18 minutes ago",
  ]
  return times[Math.floor(Math.random() * times.length)]
}

// Generate realistic locations
function getLocation(): string {
  const locations = [
    "New York, USA",
    "London, UK",
    "Toronto, Canada",
    "Sydney, Australia",
    "Los Angeles, USA",
    "Chicago, USA",
    "Houston, USA",
    "Miami, USA",
    "Seattle, USA",
    "Boston, USA",
    "Dallas, USA",
    "Atlanta, USA",
    "Denver, USA",
    "Phoenix, USA",
    "San Francisco, USA",
    "Berlin, Germany",
    "Paris, France",
    "Rome, Italy",
    "Madrid, Spain",
    "Amsterdam, Netherlands",
  ]
  return locations[Math.floor(Math.random() * locations.length)]
}

export function SocialProofStats({ className = "" }: { className?: string }) {
  const [viewers, setViewers] = useState(() => Math.floor(Math.random() * 25) + 8)
  const [soldToday, setSoldToday] = useState(() => Math.floor(Math.random() * 40) + 15)
  const [recentPurchases, setRecentPurchases] = useState<RecentPurchase[]>(() => {
    const purchases: RecentPurchase[] = []
    for (let i = 0; i < 5; i++) {
      purchases.push({
        id: `purchase-${i}`,
        timeAgo: getTimeAgo(),
        location: getLocation(),
      })
    }
    return purchases
  })
  const [currentPurchaseIndex, setCurrentPurchaseIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  // Update viewers with natural fluctuation
  useEffect(() => {
    const updateInterval = setInterval(() => {
      setViewers((prev) => {
        const change = Math.floor(Math.random() * 5) - 2 // -2 to +2
        const newValue = prev + change
        return Math.max(5, Math.min(40, newValue)) // Keep between 5-40
      })
    }, 4000) // Update every 4 seconds

    return () => clearInterval(updateInterval)
  }, [])

  // Occasionally increment sold today
  useEffect(() => {
    const updateInterval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance to increment
        setSoldToday((prev) => Math.min(80, prev + 1))
      }
    }, 8000) // Check every 8 seconds

    return () => clearInterval(updateInterval)
  }, [])

  // Cycle through recent purchases
  useEffect(() => {
    const cycleInterval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentPurchaseIndex((prev) => (prev + 1) % recentPurchases.length)
        setIsVisible(true)
      }, 300) // Wait for fade out
    }, 5000) // Change every 5 seconds

    return () => clearInterval(cycleInterval)
  }, [recentPurchases.length])

  // Add new purchase occasionally
  useEffect(() => {
    const addPurchaseInterval = setInterval(() => {
      if (Math.random() > 0.6) { // 40% chance
        const newPurchase: RecentPurchase = {
          id: `purchase-${Date.now()}`,
          timeAgo: "Just now",
          location: getLocation(),
        }
        setRecentPurchases((prev) => [newPurchase, ...prev.slice(0, 4)])
        setCurrentPurchaseIndex(0)
        setIsVisible(true)

        // Update time ago for older purchases
        setTimeout(() => {
          setRecentPurchases((prev) =>
            prev.map((p, i) => ({
              ...p,
              timeAgo: i === 0 ? "Just now" : getTimeAgo(),
            }))
          )
        }, 60000)
      }
    }, 12000) // Check every 12 seconds

    return () => clearInterval(addPurchaseInterval)
  }, [])

  const currentPurchase = recentPurchases[currentPurchaseIndex]

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Main Stats Bar */}
      <Card className="border-border/50 shadow-sm overflow-hidden">
        <div className="divide-y divide-border/50">
          {/* Live Viewers & Orders */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-background to-muted/20">
            {/* Live Viewers */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 flex items-center justify-center border border-green-200 dark:border-green-800">
                  <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Viewing now</p>
                <p className="text-lg font-bold text-foreground leading-none mt-0.5">{viewers}</p>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-8 bg-border/40" />

            {/* Orders Today */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/20 flex items-center justify-center border border-orange-200 dark:border-orange-800">
                <ShoppingBag className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Sold today</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <p className="text-lg font-bold text-foreground leading-none">{soldToday}</p>
                  <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-8 bg-border/40" />

            {/* Popular Badge */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800/50">
              <Flame className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">Trending</span>
            </div>
          </div>

          {/* Recent Purchase Notification */}
          <div className="px-4 py-2.5 bg-background/80 backdrop-blur-sm">
            <div
              className={`flex items-center gap-2.5 transition-opacity duration-300 ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex items-center gap-1.5 text-sm min-w-0 flex-1">
                <span className="text-muted-foreground">Someone from</span>
                <span className="font-medium text-foreground truncate">{currentPurchase?.location}</span>
                <span className="text-muted-foreground">purchased</span>
                <Clock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">{currentPurchase?.timeAgo}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Urgency Text */}
      <p className="text-xs text-center text-muted-foreground px-2">
        <span className="font-medium text-foreground">High demand:</span> Only 3 items left in stock - order soon
      </p>
    </div>
  )
}
