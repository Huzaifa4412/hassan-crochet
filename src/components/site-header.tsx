"use client"

import Link from "next/link"
import { ShoppingCart, Menu, X, Search, User, Heart } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <ShoppingCart className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Knitty Petit
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/products" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Products
          </Link>
          <Link href="/collections" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Collections
          </Link>
          <Link href="/about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            About
          </Link>
          <Link href="/contact" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Contact
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
              0
            </span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background p-4 space-y-4 animate-in slide-in-from-top-2">
          <Link href="/products" className="block font-medium text-muted-foreground py-2" onClick={() => setMobileMenuOpen(false)}>
            Products
          </Link>
          <Link href="/collections" className="block font-medium text-muted-foreground py-2" onClick={() => setMobileMenuOpen(false)}>
            Collections
          </Link>
          <Link href="/about" className="block font-medium text-muted-foreground py-2" onClick={() => setMobileMenuOpen(false)}>
            About
          </Link>
          <Link href="/contact" className="block font-medium text-muted-foreground py-2" onClick={() => setMobileMenuOpen(false)}>
            Contact
          </Link>
          <div className="flex gap-2 pt-2 border-t">
            <Button variant="outline" size="sm" className="flex-1">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <User className="h-4 w-4 mr-2" />
              Account
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
