import Link from "next/link"
import { ShoppingCart, Heart } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t bg-background mt-auto">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <Link href="/" className="flex flex-col items-center md:items-start space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <img src="/logo.png" className="scale-150" alt="logo" />
              </div>
              <span className="font-semibold">Knitty Petit</span>
            </div>
            <p className="text-sm text-muted-foreground">Handmade crochet products crafted with love</p>
          </Link>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Knitty Petit. Made with <Heart className="h-3 w-3 inline fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  )
}
