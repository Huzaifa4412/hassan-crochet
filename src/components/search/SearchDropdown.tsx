"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, X, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Product } from "@/sanity/queries"

interface SearchDropdownProps {
  placeholder?: string
  className?: string
}

export function SearchDropdown({ placeholder = "Search products...", className }: SearchDropdownProps) {
  const [query, setQuery] = React.useState("")
  const [isOpen, setIsOpen] = React.useState(false)
  const [results, setResults] = React.useState<Product[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [inputRef, setInputRef] = React.useState<HTMLInputElement | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Debounced search
  React.useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsLoading(true)
        try {
          const response = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`)
          const data = await response.json()
          setResults(data.results || [])
        } catch (error) {
          console.error("Search error:", error)
          setResults([])
        } finally {
          setIsLoading(false)
        }
        setIsOpen(true)
      } else {
        setResults([])
        setIsOpen(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setIsOpen(false)
      inputRef?.blur()
    }
  }

  const handleClear = () => {
    setQuery("")
    setResults([])
    setIsOpen(false)
    inputRef?.focus()
  }

  const handleProductClick = () => {
    setIsOpen(false)
    setQuery("")
    setResults([])
  }

  return (
    <div className={cn("relative", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          ref={setInputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.trim().length >= 2) setIsOpen(true)
          }}
          placeholder={placeholder}
          className={cn("pl-10 pr-10", isOpen && "rounded-b-none border-b-0 focus-visible:rounded-b-none")}
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {/* Search Results Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Results */}
          <Card className="absolute top-full left-0 right-0 z-20 rounded-t-none shadow-lg max-h-[80vh] overflow-hidden flex flex-col">
            <CardContent className="p-0">
              {isLoading ? (
                <div className="py-8 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : results.length > 0 ? (
                <div className="py-2">
                  <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase">
                    Products ({results.length})
                  </div>
                  {results.slice(0, 6).map((product) => (
                    <Link
                      key={product._id}
                      href={`/products/${product.slug?.current}`}
                      onClick={handleProductClick}
                      className="flex items-center gap-4 px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border/40 last:border-0"
                    >
                      {/* Product Image */}
                      <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden flex-shrink-0 relative">
                        {product.variants?.[0]?.imageUrl ? (
                          <img
                            src={product.variants[0].imageUrl}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">No img</span>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{product.title}</h4>
                        {product.shortDescription && (
                          <p className="text-xs text-muted-foreground truncate">
                            {product.shortDescription}
                          </p>
                        )}
                        {product.category && (
                          <span className="text-xs text-muted-foreground">
                            {product.category.title}
                          </span>
                        )}
                      </div>

                      {/* Badges */}
                      {product.badges && product.badges.length > 0 && (
                        <Badge className="text-xs px-2 py-0.5 bg-primary/20 text-primary hover:bg-primary/30">
                          {product.badges[0]}
                        </Badge>
                      )}
                    </Link>
                  ))}

                  {/* View All Results */}
                  {results.length > 6 && (
                    <Link
                      href={`/search?q=${encodeURIComponent(query.trim())}`}
                      onClick={handleProductClick}
                      className="block px-4 py-3 text-center text-sm font-medium text-primary hover:bg-muted/50 transition-colors border-t border-border/40"
                    >
                      View all {results.length} results
                    </Link>
                  )}
                </div>
              ) : query.trim().length >= 2 ? (
                <div className="py-8 text-center">
                  <p className="text-sm text-muted-foreground">No products found</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Try different keywords
                  </p>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
