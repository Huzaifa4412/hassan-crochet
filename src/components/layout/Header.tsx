"use client"

import Link from "next/link"
import { useState, useEffect, Suspense } from "react"
import { Menu, Search, User, ShoppingBag, Heart, X } from "lucide-react"
import { getNavigationMenu } from "@/sanity/queries"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { AnnouncementBar } from "./AnnouncementBar"
import { SearchDropdown } from "@/components/search/SearchDropdown"

interface MenuItem {
  label: string
  link?: string
  openInNewTab?: boolean
  icon?: string
  isDropdown?: boolean
  dropdownItems?: Array<{
    label: string
    link?: string
    description?: string
    image?: {
      url: string
    }
    isFeatured?: boolean
  }>
  category?: {
    _id: string
    title: string
    slug: { current: string }
  }
  collection?: {
    _id: string
    title: string
    slug: { current: string }
  }
}

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    getNavigationMenu("main").then((data) => {
      if (data?.menuItems) {
        setMenuItems(data.menuItems)
      }
    })
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const getLinkFromItem = (item: MenuItem): string => {
    if (item.link) return item.link
    if (item.category) return `/category/${item.category.slug.current}`
    if (item.collection) return `/collection/${item.collection.slug.current}`
    return "#"
  }

  return (
    <>
      <AnnouncementBar />
      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-shadow",
          scrolled && "shadow-sm",
          className
        )}
      >
        <div className="container mx-auto px-4 md:px-6">
          {/* Top bar */}
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 text-white font-bold text-xl">
                H
              </div>
              <span className="text-xl font-bold tracking-tight hidden sm:inline-block">
                Hassan Crochet
              </span>
            </Link>

            {/* Desktop Navigation */}
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList>
                {menuItems.map((item, index) => (
                  <NavigationMenuItem key={index}>
                    {item.isDropdown && item.dropdownItems && item.dropdownItems.length > 0 ? (
                      <>
                        <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                            {item.dropdownItems.map((subItem, subIndex) => (
                              <li
                                key={subIndex}
                                className={cn(
                                  "rounded-md p-3 hover:bg-accent transition-colors",
                                  subItem.isFeatured && "md:col-span-2 bg-muted/50"
                                )}
                              >
                                <NavigationMenuLink asChild>
                                  <Link
                                    href={subItem.link || "#"}
                                    className="flex flex-col gap-1"
                                  >
                                    {subItem.image && (
                                      <div className="aspect-video rounded-md overflow-hidden bg-muted mb-2">
                                        <img
                                          src={subItem.image.url}
                                          alt={subItem.label}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    )}
                                    <div className="text-sm font-medium">{subItem.label}</div>
                                    {subItem.description && (
                                      <p className="text-sm text-muted-foreground line-clamp-2">
                                        {subItem.description}
                                      </p>
                                    )}
                                    {subItem.isFeatured && (
                                      <Badge className="w-fit mt-1" variant="secondary">
                                        Featured
                                      </Badge>
                                    )}
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <NavigationMenuLink asChild>
                        <Link
                          href={getLinkFromItem(item)}
                          target={item.openInNewTab ? "_blank" : undefined}
                          rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                          className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {item.label}
                        </Link>
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            {/* Right Actions */}
            <div className="flex items-center gap-1 md:gap-2">
              {/* Search Dropdown */}
              <div className="hidden md:block">
                <Suspense fallback={<SearchButtonFallback />}>
                  <SearchDropdown />
                </Suspense>
              </div>



              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border/40 bg-background">
            <nav className="container mx-auto px-4 py-4 space-y-1">
              {menuItems.map((item, index) => (
                <div key={index}>
                  {item.isDropdown && item.dropdownItems && item.dropdownItems.length > 0 ? (
                    <div className="space-y-1">
                      <div className="px-4 py-2 text-sm font-semibold text-muted-foreground">
                        {item.label}
                      </div>
                      {item.dropdownItems.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          href={subItem.link || "#"}
                          className="block px-8 py-2 text-sm hover:bg-accent rounded-md transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      href={getLinkFromItem(item)}
                      className="block px-4 py-2 text-sm font-medium hover:bg-accent rounded-md transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              <div className="pt-4 border-t border-border/40 mt-4">
                <Suspense fallback={<SearchInputFallback />}>
                  <SearchDropdown className="w-full" />
                </Suspense>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  )
}

// Fallback components for Suspense
function SearchButtonFallback() {
  return (
    <Button variant="ghost" size="icon" className="hidden md:flex">
      <Search className="h-5 w-5" />
    </Button>
  )
}

function SearchInputFallback() {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search products..."
        className="pl-10"
        disabled
      />
    </div>
  )
}

export default Header
