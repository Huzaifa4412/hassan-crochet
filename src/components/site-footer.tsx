import Link from "next/link"
import { Heart } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t bg-background mt-auto">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <Link href="/" className="flex flex-col items-center md:items-start space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <img src="/logo.png" className="scale-150" alt="Knitty Petit logo" />
              </div>
              <span className="font-semibold">Knitty Petit</span>
            </div>
            <p className="text-center text-sm text-muted-foreground md:text-left">Personalized name sweaters, previewed with care</p>
          </Link>

          <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-5 gap-y-3 text-sm">
            <Link href="/products" className="text-muted-foreground hover:text-foreground">All products</Link>
            <Link href="/category/sweaters" className="text-muted-foreground hover:text-foreground">Personalized sweaters</Link>
            <Link href="/blog" className="text-muted-foreground hover:text-foreground">Gift & care guides</Link>
            <Link href="/about" className="text-muted-foreground hover:text-foreground">About Knitty Petit</Link>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Knitty Petit. Made with <Heart className="h-3 w-3 inline fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  )
}
