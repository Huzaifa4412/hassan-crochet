import type { MetadataRoute } from "next";
import { getAllPostSlugs, getAllProducts, getCategories } from "@/sanity/queries";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, posts] = await Promise.all([
    getAllProducts(),
    getCategories(),
    getAllPostSlugs(),
  ]);

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, priority: 1 },
    { url: absoluteUrl("/products"), lastModified: now, priority: 0.9 },
    { url: absoluteUrl("/about"), lastModified: now, priority: 0.7 },
    { url: absoluteUrl("/blog"), lastModified: now, priority: 0.7 },
  ];

  return [
    ...staticRoutes,
    ...products.map((product) => ({
      url: absoluteUrl(`/products/${product.slug.current}`),
      lastModified: now,
      priority: 0.8,
    })),
    ...categories.map((category) => ({
      url: absoluteUrl(`/category/${category.slug.current}`),
      lastModified: now,
      priority: 0.65,
    })),
    ...posts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug.current}`),
      lastModified: now,
      priority: 0.6,
    })),
  ];
}
