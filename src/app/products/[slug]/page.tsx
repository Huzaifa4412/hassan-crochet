import { notFound } from "next/navigation";
import { getProductBySlug } from "@/sanity/queries";
import ProductClient from "./client";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductClient product={product} />;
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
