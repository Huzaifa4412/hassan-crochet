import { getNewProducts, getFeaturedProducts } from "@/sanity/queries"

export default async function DebugPage() {
  const [newProducts, featuredProducts] = await Promise.all([
    getNewProducts(4),
    getFeaturedProducts(4),
  ])

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Sanity Data Debug</h1>

        {/* New Products Debug */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">New Products ({newProducts.length})</h2>
          <div className="space-y-4">
            {newProducts.map((product) => (
              <div key={product._id} className="border rounded-lg p-4 space-y-2 bg-card">
                <h3 className="font-bold text-lg">{product.title}</h3>
                <p className="text-sm text-muted-foreground">Slug: {product.slug?.current}</p>

                {/* Variants Debug */}
                <div className="mt-4">
                  <p className="font-semibold">Variants ({product.variants?.length || 0}):</p>
                  {product.variants && product.variants.length > 0 ? (
                    <div className="mt-2 space-y-2">
                      {product.variants.map((variant, index) => (
                        <div key={index} className="pl-4 border-l-2 border-muted">
                          <p className="text-sm">Color: {variant.colorName}</p>
                          <p className="text-sm">Value: {variant.colorValue || "none"}</p>
                          <p className="text-sm">
                            Image URL:{" "}
                            {variant.imageUrl ? (
                              <a
                                href={variant.imageUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary underline"
                              >
                                {variant.imageUrl.substring(0, 60)}...
                              </a>
                            ) : (
                              <span className="text-red-500">NULL/UNDEFINED</span>
                            )}
                          </p>
                          {variant.imageUrl && (
                            <div className="mt-2">
                              <img
                                src={variant.imageUrl}
                                alt={variant.colorName}
                                className="w-32 h-32 object-cover rounded"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-red-500">No variants found!</p>
                  )}
                </div>

                {/* Badges */}
                {product.badges && product.badges.length > 0 && (
                  <div>
                    <p className="font-semibold">Badges:</p>
                    <p className="text-sm">{product.badges.join(", ")}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Featured Products Debug */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Featured Products ({featuredProducts.length})</h2>
          <div className="space-y-4">
            {featuredProducts.map((product) => (
              <div key={product._id} className="border rounded-lg p-4 space-y-2 bg-card">
                <h3 className="font-bold text-lg">{product.title}</h3>
                <p className="text-sm text-muted-foreground">Slug: {product.slug?.current}</p>

                <div className="mt-4">
                  <p className="font-semibold">Variants ({product.variants?.length || 0}):</p>
                  {product.variants && product.variants.length > 0 ? (
                    <div className="mt-2">
                      {product.variants.map((variant, index) => (
                        <div key={index} className="pl-4 border-l-2 border-muted">
                          <p className="text-sm">Color: {variant.colorName}</p>
                          <p className="text-sm">
                            Image: {variant.imageUrl ? "✓ Has URL" : "✗ No URL"}
                          </p>
                          {variant.imageUrl && (
                            <img
                              src={variant.imageUrl}
                              alt={variant.colorName}
                              className="w-32 h-32 object-cover rounded mt-2"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-red-500">No variants found!</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Environment Info */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Environment</h2>
          <div className="border rounded-lg p-4 bg-card">
            <p className="text-sm">Project ID: {process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "NOT SET"}</p>
            <p className="text-sm">Dataset: {process.env.NEXT_PUBLIC_SANITY_DATASET || "NOT SET"}</p>
            <p className="text-sm">API Version: {process.env.NEXT_PUBLIC_SANITY_API_VERSION || "NOT SET"}</p>
          </div>
        </section>
      </div>
    </div>
  )
}
