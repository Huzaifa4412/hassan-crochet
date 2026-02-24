import { Suspense } from "react"
import { searchProducts } from "@/sanity/queries"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { ProductCard } from "@/components/home/ProductCard"
import { SearchResults } from "@/components/search/SearchResults"

interface SearchPageProps {
  searchParams: { q?: string }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ""

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">
              {query ? `Search results for "${query}"` : "Search"}
            </h1>
            <p className="text-muted-foreground mb-8">
              {query ? "Find the perfect customizable product" : "Search for products by name"}
            </p>

            {query ? (
              <Suspense fallback={<SearchLoading />}>
                <SearchResults query={query} />
              </Suspense>
            ) : (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold mb-2">Start searching</h2>
                <p className="text-muted-foreground">Enter a keyword to find products</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

function SearchLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-square bg-muted rounded-xl mb-3" />
          <div className="h-4 bg-muted rounded w-3/4 mb-2" />
          <div className="h-3 bg-muted rounded w-1/2" />
        </div>
      ))}
    </div>
  )
}
