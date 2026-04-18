"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Facebook, Instagram, Youtube, Mail, Heart } from "lucide-react"
import { getNavigationMenu, getNewsletter } from "@/sanity/queries"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface MenuItem {
  label: string
  link?: string
  dropdownItems?: Array<{
    label: string
    link?: string
  }>
}

export function Footer() {
  const [footerMenu, setFooterMenu] = useState<MenuItem[]>([])
  const [newsletter, setNewsletter] = useState<any>(null)
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    getNavigationMenu("footer").then((data) => {
      if (data?.menuItems) {
        setFooterMenu(data.menuItems)
      }
    })
    getNewsletter().then((data) => {
      if (data) {
        setNewsletter(data)
      }
    })
  }, [])

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      // Here you would integrate with your newsletter service
      setSubscribed(true)
      setTimeout(() => setSubscribed(false), 3000)
      setEmail("")
    }
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/40 bg-muted/30">
      {/* Newsletter Section */}
      {newsletter && (
        <div
          className={cn(
            "py-16 px-4",
            newsletter.backgroundColor === "orange-gradient" && "bg-gradient-to-r from-orange-50 via-background to-orange-50",
            newsletter.backgroundColor === "pink-gradient" && "bg-gradient-to-r from-pink-50 via-background to-pink-50",
            newsletter.backgroundColor === "muted" && "bg-muted",
            newsletter.backgroundColor === "image" && "relative"
          )}
          style={
            newsletter.backgroundColor === "custom" && newsletter.customBackgroundColor
              ? { backgroundColor: newsletter.customBackgroundColor }
              : {}
          }
        >
          {newsletter.image && (
            <div
              className="absolute inset-0 opacity-10 -z-10"
              style={{
                backgroundImage: `url(${newsletter.image.url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          )}
          <div className="container mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              {newsletter.headline}
            </h2>
            {newsletter.description && (
              <p className="text-muted-foreground mb-6">{newsletter.description}</p>
            )}
            {newsletter.discountOffer && (
              <p className="text-orange-600 font-semibold mb-6">{newsletter.discountOffer}</p>
            )}
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md mx-auto">
              <Input
                type="email"
                placeholder={newsletter.placeholderText || "Enter your email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
              />
              <Button type="submit" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                {newsletter.buttonText || "Subscribe"}
              </Button>
            </form>
            {subscribed && (
              <p className="text-sm text-green-600 mt-4 animate-in fade-in slide-in-from-bottom-2">
                {newsletter.successMessage || "Thank you for subscribing!"}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 text-white font-bold text-xl">
                H
              </div>
              <span className="text-xl font-bold tracking-tight">Knitty Petit</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Handmade crochet treasures crafted with love and attention to detail.
              Each piece tells a story of tradition and artistry.
            </p>
            {/* Social Links */}
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" asChild className="h-9 w-9">
                <Link href="https://instagram.com/knittypetit" target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild className="h-9 w-9">
                <Link href="https://instagram.com/knittypetit" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-4 w-4" />
                </Link>
              </Button>



            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/collections" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shipping" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Size Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Dynamic Menu Items */}
          {footerMenu.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-sm uppercase tracking-wider">Information</h3>
              <ul className="space-y-2">
                {footerMenu.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.link || "#"}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>

        <Separator className="my-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p className="flex items-center gap-1">
            © {currentYear} Knitty Petit. Made with
            <Heart className="w-3 h-3 fill-red-500 text-red-500" />
            and lots of yarn.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="https://etsy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <span>Shop on Etsy</span>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 14.954c-.083.425-.26.833-.529 1.182-.268.35-.607.634-.995.832-.387.198-.812.304-1.245.312-.433.009-.862-.081-1.256-.267-.395-.186-.744-.462-1.024-.808-.28-.347-.486-.751-.603-1.186-.118-.434-.144-.889-.077-1.335l.846-5.073c.033-.198.011-.4-.065-.586-.076-.186-.202-.349-.367-.471-.165-.123-.362-.199-.569-.22-.206-.021-.415.014-.603.101-.188.087-.349.224-.463.396l-.633.903c-.234.333-.548.603-.911.786-.363.183-.766.273-1.172.262-.407-.011-.804-.123-1.156-.326-.352-.202-.652-.489-.868-.835-.216-.346-.342-.742-.366-1.149-.025-.407.056-.815.236-1.184.18-.369.452-.685.792-.914.34-.229.735-.363 1.143-.389.408-.026.817.056 1.186.236.369.18.685.452.914.792l.633.903c.114.172.275.309.463.396.188.087.397.122.603.101.207-.021.404-.097.569-.22.165-.123.291-.285.367-.471.076-.186.098-.388.065-.586l-.846-5.073c-.067-.446-.041-.901.077-1.335.117-.435.323-.839.603-1.186.28-.346.629-.622 1.024-.808.394-.186.823-.276 1.256-.267.433.008.858.114 1.245.312.388.198.727.482.995.832.269.349.446.757.529 1.182l.846 5.073c.23 1.377-.076 2.785-.846 3.956-.77 1.171-1.952 2.031-3.311 2.436z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
