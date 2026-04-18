import { searchProducts } from "@/sanity/queries"
import { ProductCard } from "@/components/home/ProductCard"
import Link from "next/link"

interface SearchResultsProps {
  query: string
}

export async function SearchResults({ query }: SearchResultsProps) {
  const products = await searchProducts(query)

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2">No products found</h2>
        <p className="text-muted-foreground mb-6">
          We couldn&apos;t find any products matching &quot;{query}&quot;
        </p>
        <p className="text-sm text-muted-foreground">
          Try searching for &quot;crochet&quot;, &quot;sweater&quot;, &quot;basket&quot;, or browse our{" "}
          <Link href="/products" className="text-primary hover:underline">
            all products
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-6">
        Found {products.length} product{products.length !== 1 ? "s" : ""}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  )
}
