import Link from "next/link"
import { Grid3x3, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { ProductCard, ProductCardCompact } from "@/components/ProductCard"
import { getProducts, getCategories, getCollections } from "@/sanity/queries"
import { Suspense } from "react"

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string
    collection?: string
    sort?: string
    view?: "grid" | "list"
  }>
}

async function ProductsContent({ searchParams }: { searchParams: { category?: string; collection?: string; sort?: string; view?: "grid" | "list" } }) {
  const { category, collection, sort = "featured", view = "grid" } = searchParams

  // Fetch data
  const [products, categories, collectionsData] = await Promise.all([
    getProducts(50), // Get more for filtering
    getCategories(),
    getCollections(),
  ])

  // Get filtered/sorted products
  let filteredProducts = [...products]

  // Filter by category
  if (category) {
    filteredProducts = filteredProducts.filter(
      (p) => p.category?.slug.current === category
    )
  }

  // Filter by collection
  if (collection) {
    filteredProducts = filteredProducts.filter(
      (p) => p.collections?.some((c) => c.slug.current === collection)
    )
  }

  // Sort products
  switch (sort) {
    case "new":
      filteredProducts = filteredProducts.filter((p) => p.isNew).sort((a, b) => a.sortOrder - b.sortOrder)
      break
    case "featured":
      filteredProducts = filteredProducts.filter((p) => p.featured).sort((a, b) => a.sortOrder - b.sortOrder)
      break
    case "az":
      filteredProducts.sort((a, b) => a.title.localeCompare(b.title))
      break
    case "za":
      filteredProducts.sort((a, b) => b.title.localeCompare(a.title))
      break
    default:
      filteredProducts.sort((a, b) => a.sortOrder - b.sortOrder)
  }

  const activeCategory = categories.find((c) => c.slug.current === category)
  const activeCollection = collectionsData.find((c) => c.slug.current === collection)

  // Helper to build query string
  const buildQueryString = (params: Record<string, string>) => {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.set(key, value)
    })
    return searchParams.toString()
  }

  return (
    <>
      <main className="min-h-screen bg-background">
        {/* Page Header */}
        <div className="border-b border-border/40 bg-muted/30">
          <div className="container mx-auto px-4 py-8 md:px-6">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-foreground">Products</span>
              {activeCategory && (
                <>
                  <span>/</span>
                  <span className="text-foreground">{activeCategory.title}</span>
                </>
              )}
              {activeCollection && (
                <>
                  <span>/</span>
                  <span className="text-foreground">{activeCollection.title}</span>
                </>
              )}
            </nav>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {activeCollection?.title || activeCategory?.title || "All Products"}
            </h1>
            {activeCollection?.description && (
              <p className="text-muted-foreground mt-2 max-w-2xl">
                {activeCollection.description}
              </p>
            )}
            {activeCategory?.description && (
              <p className="text-muted-foreground mt-2 max-w-2xl">
                {activeCategory.description}
              </p>
            )}
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 md:px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:w-64 flex-shrink-0 space-y-8">
              {/* Categories */}
              <div>
                <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">
                  Categories
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/products"
                      className={`text-sm hover:text-primary transition-colors block py-1 ${!category && !collection ? "text-primary font-medium" : "text-muted-foreground"
                        }`}
                    >
                      All Products
                    </Link>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat._id}>
                      <Link
                        href={`/products?category=${cat.slug.current}`}
                        className={`text-sm hover:text-primary transition-colors block py-1 ${category === cat.slug.current ? "text-primary font-medium" : "text-muted-foreground"
                          }`}
                      >
                        {cat.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Collections */}
              {collectionsData.length > 0 && (
                <div>
                  <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">
                    Collections
                  </h3>
                  <ul className="space-y-2">
                    {collectionsData.map((col) => (
                      <li key={col._id}>
                        <Link
                          href={`/products?collection=${col.slug.current}`}
                          className={`text-sm hover:text-primary transition-colors block py-1 ${collection === col.slug.current ? "text-primary font-medium" : "text-muted-foreground"
                            }`}
                        >
                          {col.title}
                          {col.badge && (
                            <Badge variant="secondary" className="ml-2 text-[10px]">
                              {col.badge}
                            </Badge>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quick Filters */}
              <div>
                <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">
                  Quick Filters
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href={`/products?${buildQueryString({ sort: "featured", category: category || "", collection: collection || "" })}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors block py-1"
                    >
                      Featured
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/products?${buildQueryString({ sort: "new", category: category || "", collection: collection || "" })}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors block py-1"
                    >
                      New Arrivals
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/products?${buildQueryString({ sort: "az", category: category || "", collection: collection || "" })}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors block py-1"
                    >
                      A-Z
                    </Link>
                  </li>
                </ul>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/40">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant={view === "grid" ? "default" : "outline"}
                    size="icon"
                    asChild
                  >
                    <Link href={`/products?${buildQueryString({ view: "grid", category: category || "", collection: collection || "", sort: sort || "" })}`}>
                      <Grid3x3 className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button
                    variant={view === "list" ? "default" : "outline"}
                    size="icon"
                    asChild
                  >
                    <Link href={`/products?${buildQueryString({ view: "list", category: category || "", collection: collection || "", sort: sort || "" })}`}>
                      <List className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Grid View */}
              {view === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  <Suspense fallback={<div>Loading...</div>}>
                    {filteredProducts.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </Suspense>
                </div>
              ) : (
                /* List View */
                <div className="space-y-4">
                  <Suspense fallback={<div>Loading...</div>}>
                    {filteredProducts.map((product) => (
                      <ProductCardCompact key={product._id} product={product} />
                    ))}
                  </Suspense>
                </div>
              )}

              {/* No Results */}
              {filteredProducts.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-lg text-muted-foreground mb-4">
                    No products found in this category.
                  </p>
                  <Button variant="outline" asChild>
                    <Link href="/products">View All Products</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams
  return <ProductsContent searchParams={resolvedSearchParams} />
}
