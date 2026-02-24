import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { ProductCard } from "@/components/ProductCard"
import { getProductsByCategory, getCategoryBySlug } from "@/sanity/queries"

interface CategoryPageProps {
  params: { slug: string }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params

  const [category, products] = await Promise.all([
    getCategoryBySlug(slug),
    getProductsByCategory(slug),
  ])

  if (!category) {
    notFound()
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border/40 bg-muted/30">
          <div className="container mx-auto px-4 py-8 md:px-6">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/products">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Products
              </Link>
            </Button>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                  {category.title}
                </h1>
                {category.description && (
                  <p className="text-muted-foreground max-w-2xl">
                    {category.description}
                  </p>
                )}
              </div>
              {category.icon && (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                  <span className="text-3xl">{category.icon}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="container mx-auto px-4 py-8 md:px-6">
          <p className="text-sm text-muted-foreground mb-6">
            {products.length} product{products.length !== 1 ? "s" : ""}
          </p>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
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
      </main>
      <Footer />
    </>
  )
}

export async function generateStaticParams() {
  // This will be populated when you have categories in Sanity
  return []
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const category = await getCategoryBySlug(params.slug)

  if (!category) {
    return {
      title: "Category Not Found",
    }
  }

  return {
    title: `${category.title} - Hassan Crochet`,
    description: category.description,
  }
}
