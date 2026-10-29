import type { MetadataRoute } from "next";
import { getSitemapContent, type SitemapDocument } from "@/sanity/lib/sitemap";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { products, categories, posts } = await getSitemapContent();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), priority: 1 },
    { url: absoluteUrl("/products"), priority: 0.9 },
    { url: absoluteUrl("/about"), priority: 0.7 },
    { url: absoluteUrl("/blog"), priority: 0.7 },
  ];

  const routes = new Map(staticRoutes.map((route) => [route.url, route]));

  const addDocuments = (documents: SitemapDocument[], prefix: string, priority: number) => {
    for (const document of documents) {
      const slug = document?.slug;
      if (
        typeof slug !== "string" ||
        !slug ||
        slug.trim() !== slug ||
        /[\\/?#\s]/.test(slug) ||
        slug === "." ||
        slug === ".."
      ) {
        continue;
      }

      const url = absoluteUrl(`${prefix}/${slug}`);
      const updatedAt = document._updatedAt ? new Date(document._updatedAt) : undefined;
      const lastModified = updatedAt && Number.isFinite(updatedAt.getTime()) ? updatedAt : undefined;
      const previous = routes.get(url);
      if (!previous || (lastModified && (!previous.lastModified || lastModified > new Date(previous.lastModified)))) {
        routes.set(url, { url, ...(lastModified ? { lastModified } : {}), priority });
      }
    }
  };

  // Keep in sync with redirects in next.config.ts and noindexed categories.
  const redirectedProducts = new Set([
    "kids-sweater",
    "hand-embroidered-kidz-name-sweater",
    "hand-embroidered-kids-name-sweaterss",
  ]);
  const hiddenCategories = new Set(["crochet"]);
  addDocuments(products.filter((p) => !redirectedProducts.has(p.slug)), "/products", 0.8);
  addDocuments(categories.filter((c) => !hiddenCategories.has(c.slug)), "/category", 0.65);
  addDocuments(posts, "/blog", 0.6);

  return [...routes.values()];
}
