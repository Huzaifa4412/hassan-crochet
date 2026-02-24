import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { getCollections } from "@/sanity/queries"

export default async function CollectionsPage() {
  const collections = await getCollections()

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Page Header */}
        <div className="border-b border-border/40 bg-muted/30">
          <div className="container mx-auto px-4 py-12 md:px-6 text-center">
            <Badge variant="outline" className="mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              Collections
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Our Collections
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our carefully curated collections, each featuring unique handmade pieces
            </p>
          </div>
        </div>

        {/* Collections Grid */}
        <div className="container mx-auto px-4 py-12 md:px-6">
          {collections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {collections.map((collection) => (
                <Link
                  key={collection._id}
                  href={`/collection/${collection.slug.current}`}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-2xl aspect-[4/3] shadow-lg hover:shadow-xl transition-all duration-300">
                    {collection.image && (
                      <img
                        src={collection.image.url}
                        alt={collection.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      {collection.badge && (
                        <Badge
                          className={`mb-3 ${
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
                      <h2 className="text-2xl font-bold mb-2">{collection.title}</h2>
                      {collection.description && (
                        <p className="text-white/80 text-sm line-clamp-2 mb-3">
                          {collection.description}
                        </p>
                      )}
                      <span className="inline-flex items-center gap-1 text-sm font-medium">
                        Explore Collection
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground mb-4">
                No collections available yet.
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
