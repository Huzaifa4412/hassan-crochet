import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/sanity/queries";
import ProductClient from "./client";
import { absoluteUrl, buildMetadata, siteName, truncateDescription } from "@/lib/seo";

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
    title: product.seoTitle || `${product.title} - Custom Crochet Product`,
    description:
      product.seoDescription ||
      product.shortDescription ||
      product.description ||
      `Customize ${product.title}, a handmade crochet product from Knitty Petit.`,
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
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: truncateDescription(
      product.seoDescription || product.shortDescription || product.description,
    ),
    image: productImage ? [productImage] : undefined,
    brand: {
      "@type": "Brand",
      name: siteName,
    },
    category: product.category?.title,
    url: productUrl,
    offers: product.etsyLink
      ? {
          "@type": "Offer",
          url: product.etsyLink,
          availability:
            product.inStock === false
              ? "https://schema.org/OutOfStock"
              : "https://schema.org/InStock",
        }
      : undefined,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductClient product={product} />
    </>
  );
}

// Generate static params for all products (optional, for static generation)
export async function generateStaticParams() {
  const { client } = await import("@/sanity/lib/client");
  const products = await client.fetch(
    `*[_type == "product"]{ slug { current } }`
  );

  return products.map((product: { slug: { current: string } }) => ({
    slug: product.slug.current,
  }));
}

// ISR revalidation (optional)
export const revalidate = 60; // Revalidate every 60 seconds
