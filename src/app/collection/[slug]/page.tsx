import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { ProductCard } from "@/components/ProductCard"
import { getCollectionBySlug } from "@/sanity/queries"

interface CollectionPageProps {
  params: { slug: string }
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = params

  const collection = await getCollectionBySlug(slug)

  if (!collection) {
    notFound()
  }

  const products = collection.products || []

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="relative -mt-16">
          {collection.image && typeof collection.image === "object" && (
            <div className="absolute inset-0 h-[400px] lg:h-[500px]">
              <img
                src={collection.image.url}
                alt={collection.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
            </div>
          )}

          <div className="container mx-auto px-4 pt-24 pb-8 md:px-6 relative">
            <div className="max-w-2xl">
              <Button variant="ghost" asChild className="mb-4">
                <Link href="/products">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Products
                </Link>
              </Button>
              {collection.badge && (
                <Badge
                  className={`mb-4 ${
                    collection.badgeColor === "pink"
                      ? "bg-pink-500"
                      : collection.badgeColor === "blue"
                      ? "bg-blue-500"
                      : collection.badgeColor === "green"
                      ? "bg-green-500"
                      : collection.badgeColor === "purple"
                      ? "bg-purple-500"
                      : collection.badgeColor === "red"
                      ? "bg-red-500"
                      : "bg-orange-500"
                  } text-white`}
                >
                  {collection.badge}
                </Badge>
              )}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
                {collection.title}
              </h1>
              {collection.description && (
                <p className="text-lg text-muted-foreground">
                  {collection.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="container mx-auto px-4 py-8 md:px-6">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              {products.length} product{products.length !== 1 ? "s" : ""}
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground mb-4">
                No products found in this collection yet.
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
  // This will be populated when you have collections in Sanity
  return []
}

export async function generateMetadata({ params }: CollectionPageProps) {
  const collection = await getCollectionBySlug(params.slug)

  if (!collection) {
    return {
      title: "Collection Not Found",
    }
  }

  return {
    title: `${collection.title} Collection - Hassan Crochet`,
    description: collection.description,
  }
}
