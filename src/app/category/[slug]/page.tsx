import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/ProductCard"
import { getProductsByCategory, getCategoryBySlug } from "@/sanity/queries"
import { absoluteUrl, buildMetadata, serializeJsonLd } from "@/lib/seo"

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params

  const [category, products] = await Promise.all([
    getCategoryBySlug(slug),
    getProductsByCategory(slug, null),
  ])

  if (!category) {
    notFound()
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: absoluteUrl("/products"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: category.title,
        item: absoluteUrl(`/category/${category.slug.current}`),
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />
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
                  {slug === "sweaters" ? "Personalized Baby & Kids Name Sweaters" : category.title}
                </h1>
                {slug === "sweaters" && (
                  <div className="max-w-2xl space-y-3 py-4 text-muted-foreground">
                    <p>Explore personalized baby and kids name sweaters with hand-embroidered lettering. Choose a sweater color, try a lettering style and add optional motifs in the preview before placing your order on Etsy.</p>
                    <p>Shopping for a baby shower or birthday? Read our <Link href="/blog/what-size-baby-name-sweater-should-you-get" className="underline underline-offset-4">sweater sizing guide</Link> and <Link href="/blog/how-to-wash-hand-embroidered-baby-sweater" className="underline underline-offset-4">embroidery care guide</Link>. Check the Etsy listing for current sizes, prices and delivery options.</p>
                  </div>
                )}
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
    </>
  )
}

export async function generateStaticParams() {
  // This will be populated when you have categories in Sanity
  return []
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) {
    return buildMetadata({
      title: "Category Not Found",
      description: "This Knitty Petit product category could not be found.",
      path: `/category/${slug}`,
      noIndex: true,
    })
  }

  return buildMetadata({
    title: slug === "sweaters" ? "Personalized Baby Name Sweaters" : `${category.title} & Personalized Gifts`,
    description:
      category.description ||
      `Explore ${category.title.toLowerCase()} and personalized gifts from Knitty Petit. Preview available designs and check the Etsy listing for final options.`,
    path: `/category/${category.slug.current}`,
    image: category.image?.url || "/logo.png",
    // Categories with no matching products stay out of the index.
    noIndex: slug === "crochet",
  })
}
