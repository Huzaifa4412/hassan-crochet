'use client';

import { useEffect, useState } from 'react';
import {
  getProductBySlug,
  getAllProducts,
  getCategories,
  getCollections,
  checkConfig,
  type Product,
  type Category,
} from '@/sanity';

export default function TestSanityPage() {
  const [status, setStatus] = useState<{
    config: ReturnType<typeof checkConfig> | null;
    products: Pick<Product, 'slug' | 'title'>[] | null;
    categories: Category[] | null;
    product: Product | null;
    loading: boolean;
    error: string | null;
  }>({
    config: null,
    products: null,
    categories: null,
    product: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function testSanity() {
      try {
        setStatus((prev) => ({ ...prev, loading: true }));

        // Check configuration
        const config = checkConfig();

        // Test queries
        const [products, categories, product] = await Promise.all([
          getAllProducts(),
          getCategories(),
          getProductBySlug('tray-table').catch(() => null),
        ]);

        setStatus({
          config,
          products,
          categories,
          product,
          loading: false,
          error: null,
        });
      } catch (error) {
        setStatus({
          config: null,
          products: null,
          categories: null,
          product: null,
          loading: false,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    testSanity();
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Sanity CMS Test Page</h1>

        {/* Configuration */}
        <section className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Configuration</h2>
          {status.config ? (
            <div className="space-y-2">
              <div>
                <span className="font-medium">Project ID:</span>{' '}
                <code className="bg-muted px-2 py-1 rounded">
                  {status.config.projectId}
                </code>
              </div>
              <div>
                <span className="font-medium">Dataset:</span>{' '}
                <code className="bg-muted px-2 py-1 rounded">
                  {status.config.dataset}
                </code>
              </div>
              <div>
                <span className="font-medium">API Version:</span>{' '}
                <code className="bg-muted px-2 py-1 rounded">
                  {status.config.apiVersion}
                </code>
              </div>
              <div>
                <span className="font-medium">Status:</span>{' '}
                <span
                  className={
                    status.config.isConfigured
                      ? 'text-green-600'
                      : 'text-red-600'
                  }
                >
                  {status.config.isConfigured ? '✅ Configured' : '❌ Missing'}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">Loading configuration...</p>
          )}
        </section>

        {/* Error */}
        {status.error && (
          <section className="border border-red-200 bg-red-50 dark:bg-red-950 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-red-800 dark:text-red-200">
              Error
            </h2>
            <pre className="text-sm overflow-auto">
              {status.error}
            </pre>
          </section>
        )}

        {/* Loading */}
        {status.loading && (
          <section className="border rounded-lg p-6">
            <p className="text-muted-foreground">Loading data from Sanity...</p>
          </section>
        )}

        {/* Products */}
        <section className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            All Products ({status.products?.length || 0})
          </h2>
          {status.products && status.products.length > 0 ? (
            <ul className="space-y-2">
              {status.products.map((product) => (
                <li key={product.slug.current} className="text-sm">
                  <span className="font-medium">{product.title}</span>
                  <span className="text-muted-foreground ml-2">
                    ({product.slug.current})
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No products found</p>
          )}
        </section>

        {/* Categories */}
        <section className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Categories ({status.categories?.length || 0})
          </h2>
          {status.categories && status.categories.length > 0 ? (
            <ul className="space-y-2">
              {status.categories.map((category) => (
                <li key={category.slug.current} className="text-sm">
                  <span className="font-medium">{category.title}</span>
                  {category.icon && (
                    <span className="text-muted-foreground ml-2">
                      Icon: {category.icon}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No categories found</p>
          )}
        </section>

        {/* Single Product */}
        <section className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Test Product (tray-table)
          </h2>
          {status.product ? (
            <div className="space-y-4">
              <div>
                <span className="font-medium">Title:</span>{' '}
                {status.product.title}
              </div>
              <div>
                <span className="font-medium">Slug:</span>{' '}
                {status.product.slug.current}
              </div>
              <div>
                <span className="font-medium">Description:</span>{' '}
                {status.product.description || 'No description'}
              </div>
              <div>
                <span className="font-medium">Variants:</span>{' '}
                {status.product.variants?.length || 0}
              </div>
              {status.product.variants && status.product.variants.length > 0 && (
                <ul className="space-y-2 ml-4">
                  {status.product.variants.map((variant, i) => (
                    <li key={i} className="text-sm">
                      <span className="font-medium">{variant.colorName}</span>
                      {variant.imageUrl && (
                        <>
                          {' - '}
                          <a
                            href={variant.imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View Image
                          </a>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              <div>
                <span className="font-medium">Gallery Images:</span>{' '}
                {status.product.galleryImages?.length || 0}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">
              Product not found (create a product with slug &quot;tray-table&quot; in
              Sanity Studio)
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
