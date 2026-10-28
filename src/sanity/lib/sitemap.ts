import { client } from "./client";

export interface SitemapDocument {
  slug: string;
  _updatedAt?: string;
}

interface SitemapContent {
  products: SitemapDocument[];
  categories: SitemapDocument[];
  posts: SitemapDocument[];
}

// Keep this fetch strict: a CMS outage must not replace a healthy sitemap
// with an apparently successful response missing its content URLs.
export async function getSitemapContent(): Promise<SitemapContent> {
  const content = await client.fetch<SitemapContent>(
    `{
      "products": *[_type == "product" && defined(slug.current) && slug.current != "" && !(_id in path("drafts.**"))]{
        "slug": slug.current,
        _updatedAt
      },
      "categories": *[_type == "category" && isActive == true && defined(slug.current) && slug.current != "" && !(_id in path("drafts.**"))]{
        "slug": slug.current,
        _updatedAt
      },
      "posts": *[_type == "post" && defined(slug.current) && slug.current != "" && defined(publishedAt) && dateTime(publishedAt) <= dateTime(now()) && !(_id in path("drafts.**"))]{
        "slug": slug.current,
        _updatedAt
      }
    }`,
    {},
    { next: { revalidate: 3600 } },
  );

  if (
    !content ||
    !Array.isArray(content.products) ||
    !Array.isArray(content.categories) ||
    !Array.isArray(content.posts)
  ) {
    throw new Error("Invalid sitemap content returned by Sanity.");
  }

  return content;
}
