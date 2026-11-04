import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllProducts, getProductBySlug } from "@/sanity/queries";
import ProductClient from "./client";
import { absoluteUrl, buildMetadata, serializeJsonLd, truncateDescription } from "@/lib/seo";
import { canonicalSweaterSlug } from "@/lib/catalog-routes";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return buildMetadata({
      title: "Product Not Found",
      description: "This Knitty Petit product could not be found.",
      path: `/products/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: product.seoTitle || (slug === canonicalSweaterSlug ? "Personalized Baby Name Sweater with Hand Embroidery" : product.title),
    description:
      product.seoDescription ||
      (slug === canonicalSweaterSlug ? "Preview a personalized baby name sweater with your choice of lettering, thread colors, and icons. Review sizes and complete your custom order on Etsy." : undefined) ||
      product.shortDescription ||
      product.description ||
      `Personalize ${product.title} at Knitty Petit. Preview your design and complete your order on Etsy.`,
    path: `/products/${product.slug.current}`,
    image: product.mainImageUrl || product.variants?.[0]?.imageUrl || "/logo.png",
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const productImage =
    product.mainImageUrl || product.variants?.[0]?.imageUrl || undefined;
  const productUrl = absoluteUrl(`/products/${product.slug.current}`);
  // Emit page/breadcrumb markup until verified visible pricing is available.
  // A partial Offer without a price causes Google product rich-result errors.
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemPage",
    name: product.title,
    description: truncateDescription(
      product.seoDescription || product.shortDescription || product.description,
    ),
    primaryImageOfPage: productImage ? { "@type": "ImageObject", url: productImage } : undefined,
    url: productUrl,
    relatedLink: product.etsyLink,
  };

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
        name: product.title,
        item: productUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />
      <ProductClient product={product} />
      {product.description && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8" aria-labelledby="product-details">
          <h2 id="product-details" className="text-2xl font-semibold">Product details</h2>
          <p className="mt-4 max-w-3xl whitespace-pre-line leading-8 text-muted-foreground">
            {product.description}
          </p>
          {product.category?.slug.current === "sweaters" && (
            <nav aria-label="Sweater buying advice" className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-[#a94f2c]">
              <Link href="/blog/what-size-baby-name-sweater-should-you-get" className="underline underline-offset-4">Choose a sweater size</Link>
              <Link href="/blog/how-to-wash-hand-embroidered-baby-sweater" className="underline underline-offset-4">Care for hand embroidery</Link>
              <Link href="/category/sweaters#sweater-buying-guide" className="underline underline-offset-4">Name sweater buying questions</Link>
            </nav>
          )}
        </section>
      )}
    </>
  );
}

// Generate static params for all products (optional, for static generation)
export async function generateStaticParams() {
  const products = await getAllProducts();

  return products.map((product: { slug: { current: string } }) => ({
    slug: product.slug.current,
  }));
}

// ISR revalidation (optional)
export const revalidate = 60; // Revalidate every 60 seconds
