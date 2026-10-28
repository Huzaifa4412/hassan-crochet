import { fetchSanity, fetchSanityArray } from "./lib/fetch";
import { applyVariantOverrides } from "@/lib/product-variants";

// ============================================================================
// PRODUCT TYPES & QUERIES
// ============================================================================

export interface ProductVariant {
  colorName: string;
  colorValue?: string;
  imageUrl?: string | null;
  sortOrder: number;
  image?: {
    asset?: {
      _ref: string;
      _type: string;
    };
  };
}

export interface Product {
  _id: string;
  title: string;
  description?: string;
  shortDescription?: string;
  category?: {
    _id: string;
    title: string;
    slug: { current: string };
    icon?: string;
  };
  mainImageUrl?: string;
  collections?: Array<{
    _id: string;
    title: string;
    slug: { current: string };
  }>;
  badges?: string[];
  etsyLink?: string;
  variants: ProductVariant[];
  galleryImages?: Array<{ url: string }>;
  inStock?: boolean;
  featured?: boolean;
  isNew?: boolean;
  sortOrder: number;
  slug: {
    current: string;
  };
  seoTitle?: string;
  seoDescription?: string;
  saleEndDate?: string;
}

// Get a single product by slug with full details
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const query = `*[_type == "product" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
    _id,
    title,
    description,
    shortDescription,
    category->{_id, title, slug, icon},
    "mainImageUrl": mainImage.asset->url,
    collections[]->{_id, title, slug},
    badges,
    etsyLink,
    variants[]{
      colorName,
      colorValue,
      "imageUrl": image.asset->url,
      sortOrder
    },
    galleryImages[]{
      "url": asset->url
    },
    inStock,
    featured,
    isNew,
    sortOrder,
    slug,
    seoTitle,
    seoDescription,
    saleEndDate
  }`;

  const result = await fetchSanity<Product>(query, { slug }, { throwOnError: true });
  return result ? applyVariantOverrides(result) : null;
}

// Get all products (for static generation)
export async function getAllProducts(): Promise<Pick<Product, "title" | "slug">[]> {
  const query = `*[_type == "product" && defined(slug.current) && slug.current != "" && !(_id in path("drafts.**"))]{
    title,
    slug
  }`;

  return fetchSanityArray(query, undefined, { throwOnError: true });
}

// Get featured products
export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const query = `*[_type == "product" && featured == true && inStock != false && !(_id in path("drafts.**"))] | order(sortOrder asc){
    _id,
    title,
    shortDescription,
    category->{_id, title, slug, icon},
    "mainImageUrl": mainImage.asset->url,
    badges,
    etsyLink,
    variants[]{
      colorName,
      colorValue,
      "imageUrl": image.asset->url,
      image,
      sortOrder
    },
    inStock,
    featured,
    isNew,
    sortOrder,
    slug
  }[0...${limit}]`;

  const results = await fetchSanityArray<Product>(query);
  return results.map(applyVariantOverrides);
}

// Get new products
export async function getNewProducts(limit = 8): Promise<Product[]> {
  const query = `*[_type == "product" && isNew == true && inStock != false && !(_id in path("drafts.**"))] | order(sortOrder asc){
    _id,
    title,
    shortDescription,
    category->{_id, title, slug, icon},
    "mainImageUrl": mainImage.asset->url,
    badges,
    etsyLink,
    variants[]{
      colorName,
      colorValue,
      "imageUrl": image.asset->url,
      image,
      sortOrder
    },
    inStock,
    featured,
    isNew,
    sortOrder,
    slug
  }[0...${limit}]`;

  const results = await fetchSanityArray<Product>(query);
  return results.map(applyVariantOverrides);
}

// Get all products with basic info
export async function getProducts(limit: number | null = 12, offset = 0): Promise<Product[]> {
  const query = `*[_type == "product" && inStock != false && !(_id in path("drafts.**"))] | order(sortOrder asc){
    _id,
    title,
    shortDescription,
    category->{_id, title, slug, icon},
    collections[]->{_id, title, slug},
    "mainImageUrl": mainImage.asset->url,
    badges,
    etsyLink,
    variants[]{
      colorName,
      colorValue,
      "imageUrl": image.asset->url,
      image,
      sortOrder
    },
    inStock,
    featured,
    isNew,
    sortOrder,
    slug
  }${limit === null ? "" : `[${offset}...${offset + limit}]`}`;

  const results = await fetchSanityArray<Product>(query, undefined, { throwOnError: true });
  return results.map(applyVariantOverrides);
}

// Get products by category
export async function getProductsByCategory(categorySlug: string, limit: number | null = 12): Promise<Product[]> {
  const query = `*[_type == "product" && category->slug.current == $categorySlug && inStock != false && !(_id in path("drafts.**"))] | order(sortOrder asc){
    _id,
    title,
    shortDescription,
    category->{_id, title, slug, icon},
    "mainImageUrl": mainImage.asset->url,
    badges,
    etsyLink,
    variants[]{
      colorName,
      colorValue,
      "imageUrl": image.asset->url,
      image,
      sortOrder
    },
    inStock,
    featured,
    isNew,
    sortOrder,
    slug
  }${limit === null ? "" : `[0...${limit}]`}`;

  const results = await fetchSanityArray<Product>(query, { categorySlug }, { throwOnError: true });
  return results.map(applyVariantOverrides);
}

// Get products by collection
export async function getProductsByCollection(collectionSlug: string, limit = 12): Promise<Product[]> {
  const query = `*[_type == "product" && $collectionSlug in collections[].slug.current && inStock != false && !(_id in path("drafts.**"))] | order(sortOrder asc){
    _id,
    title,
    shortDescription,
    category->{_id, title, slug, icon},
    "mainImageUrl": mainImage.asset->url,
    badges,
    etsyLink,
    variants[]{
      colorName,
      colorValue,
      "imageUrl": image.asset->url,
      image,
      sortOrder
    },
    inStock,
    featured,
    isNew,
    sortOrder,
    slug
  }[0...${limit}]`;

  const results = await fetchSanityArray<Product>(query, { collectionSlug });
  return results.map(applyVariantOverrides);
}

// ============================================================================
// CATEGORY TYPES & QUERIES
// ============================================================================

export interface Category {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  description?: string;
  icon?: string;
  image?: { url: string };
  sortOrder: number;
  isActive: boolean;
}

export async function getCategories(): Promise<Category[]> {
  const query = `*[_type == "category" && isActive == true && !(_id in path("drafts.**"))] | order(sortOrder asc){
    _id,
    title,
    slug,
    description,
    icon,
    image{"url": asset->url},
    sortOrder,
    isActive
  }`;

  return fetchSanityArray<Category>(query);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const query = `*[_type == "category" && isActive == true && slug.current == $slug && !(_id in path("drafts.**"))][0]{
    _id,
    title,
    slug,
    description,
    icon,
    image{"url": asset->url},
    sortOrder,
    isActive
  }`;

  return fetchSanity<Category>(query, { slug }, { throwOnError: true });
}

// ============================================================================
// COLLECTION TYPES & QUERIES
// ============================================================================

export interface Collection {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  description?: string;
  image: { url: string };
  badge?: string;
  badgeColor?: string;
  products?: Product[];
  sortOrder: number;
  isActive: boolean;
}

export async function getCollections(): Promise<Collection[]> {
  const query = `*[_type == "collection" && isActive == true && !(_id in path("drafts.**"))] | order(sortOrder asc){
    _id,
    title,
    slug,
    description,
    image{"url": asset->url},
    badge,
    badgeColor,
    sortOrder,
    isActive
  }`;

  return fetchSanityArray<Collection>(query);
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  const query = `*[_type == "collection" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
    _id,
    title,
    slug,
    description,
    image{"url": asset->url},
    badge,
    badgeColor,
    products[]->{
      _id,
      title,
      shortDescription,
      category->{_id, title, slug, icon},
      "mainImageUrl": mainImage.asset->url,
      badges,
      etsyLink,
      variants[]{
        colorName,
        colorValue,
        "imageUrl": image.asset->url,
        image,
        sortOrder
      },
      inStock,
      featured,
      isNew,
      sortOrder,
      slug
    },
    sortOrder,
    isActive
  }`;

  const result = await fetchSanity<Collection>(query, { slug });
  if (result && result.products) {
    result.products = result.products.map(applyVariantOverrides);
  }
  return result;
}

// ============================================================================
// BANNER TYPES & QUERIES
// ============================================================================

export interface Banner {
  _id: string;
  title: string;
  type: "hero" | "announcement" | "promo" | "category";
  headline?: string;
  subheadline?: string;
  image?: { url: string };
  imagePosition?: string;
  ctaText?: string;
  ctaLink?: string;
  ctaStyle?: string;
  backgroundColor?: string;
  customBackgroundColor?: string;
  textColor?: string;
  customTextColor?: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  sortOrder: number;
}

export async function getBanners(type?: Banner["type"]): Promise<Banner[]> {
  const now = new Date().toISOString();
  const typeFilter = type ? `&& type == $type` : "";

  const query = `*[_type == "banner" && isActive == true ${typeFilter} && !(_id in path("drafts.**")) && (startDate == null || startDate <= $now) && (endDate == null || endDate >= $now)] | order(sortOrder asc){
    _id,
    title,
    type,
    headline,
    subheadline,
    image{"url": asset->url},
    imagePosition,
    ctaText,
    ctaLink,
    ctaStyle,
    backgroundColor,
    customBackgroundColor,
    textColor,
    customTextColor,
    isActive,
    startDate,
    endDate,
    sortOrder
  }`;

  return fetchSanityArray<Banner>(query, { type, now });
}

// Get hero banners
export async function getHeroBanners(): Promise<Banner[]> {
  return getBanners("hero");
}

// Get announcement bar
export async function getAnnouncementBar(): Promise<Banner | null> {
  const banners = await getBanners("announcement");
  return banners[0] || null;
}

// ============================================================================
// TESTIMONIAL TYPES & QUERIES
// ============================================================================

export interface Testimonial {
  _id: string;
  customerName: string;
  customerImage?: { url: string };
  rating: number;
  review: string;
  product?: {
    _id: string;
    title: string;
    slug: { current: string };
  };
  reviewDate: string;
  images?: Array<{ url: string }>;
  isVerified: boolean;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
}

export async function getTestimonials(featured = false, limit = 6): Promise<Testimonial[]> {
  const featuredFilter = featured ? "&& isFeatured == true" : "";

  const query = `*[_type == "testimonial" && isActive == true ${featuredFilter} && !(_id in path("drafts.**"))] | order(sortOrder asc, reviewDate desc){
    _id,
    customerName,
    customerImage{"url": asset->url},
    rating,
    review,
    product->{_id, title, slug},
    reviewDate,
    images[]{"url": asset->url},
    isVerified,
    isFeatured,
    isActive,
    sortOrder
  }[0...${limit}]`;

  return fetchSanityArray<Testimonial>(query);
}

// ============================================================================
// NEWSLETTER TYPES & QUERIES
// ============================================================================

export interface Newsletter {
  _id: string;
  title: string;
  headline: string;
  description?: string;
  discountOffer?: string;
  placeholderText?: string;
  buttonText?: string;
  successMessage?: string;
  image?: { url: string };
  backgroundColor?: string;
  isActive: boolean;
  showOnHomepage: boolean;
}

export async function getNewsletter(): Promise<Newsletter | null> {
  const query = `*[_type == "newsletter" && isActive == true && showOnHomepage == true && !(_id in path("drafts.**"))][0]{
    _id,
    title,
    headline,
    description,
    discountOffer,
    placeholderText,
    buttonText,
    successMessage,
    image{"url": asset->url},
    backgroundColor,
    isActive,
    showOnHomepage
  }`;

  return fetchSanity<Newsletter>(query);
}

// ============================================================================
// NAVIGATION MENU TYPES & QUERIES
// ============================================================================

export interface MenuItem {
  label: string;
  link?: string;
  openInNewTab?: boolean;
  icon?: string;
  isDropdown?: boolean;
  dropdownItems?: Array<{
    label: string;
    link?: string;
    description?: string;
    image?: { url: string };
    isFeatured?: boolean;
  }>;
  category?: {
    _id: string;
    title: string;
    slug: { current: string };
  };
  collection?: {
    _id: string;
    title: string;
    slug: { current: string };
  };
}

export interface NavigationMenu {
  _id: string;
  title: string;
  menuType: "main" | "footer" | "mobile";
  menuItems: MenuItem[];
  isActive: boolean;
}

export async function getNavigationMenu(menuType: NavigationMenu["menuType"]): Promise<NavigationMenu | null> {
  const query = `*[_type == "navigationMenu" && menuType == $menuType && isActive == true && !(_id in path("drafts.**"))][0]{
    _id,
    title,
    menuType,
    menuItems[]{
      label,
      link,
      openInNewTab,
      icon,
      isDropdown,
      dropdownItems[]{
        label,
        link,
        description,
        image{"url": asset->url},
        isFeatured
      },
      category->{_id, title, slug},
      collection->{_id, title, slug}
    },
    isActive
  }`;

  return fetchSanity<NavigationMenu>(query, { menuType });
}

// ============================================================================
// SEARCH QUERY
// ============================================================================

export async function searchProducts(searchTerm: string, limit = 12): Promise<Product[]> {
  const searchQuery = `*[_type == "product" && (title match $searchTerm || description match $searchTerm) && inStock != false && !(_id in path("drafts.**"))] | order(sortOrder asc){
    _id,
    title,
    shortDescription,
    category->{_id, title, slug, icon},
    "mainImageUrl": mainImage.asset->url,
    badges,
    etsyLink,
    variants[]{
      colorName,
      colorValue,
      "imageUrl": image.asset->url,
      image,
      sortOrder
    },
    inStock,
    featured,
    isNew,
    sortOrder,
    slug
  }[0...${limit}]`;

  const results = await fetchSanityArray<Product>(searchQuery, { searchTerm: `*${searchTerm}*` });
  return results.map(applyVariantOverrides);
}

// ============================================================================
// BLOG TYPES & QUERIES
// ============================================================================

/**
 * Author shape resolved inside post queries.
 * Kept separate from the full Author document for query efficiency.
 */
export interface PostAuthor {
  name: string;
  slug: { current: string };
  image?: {
    asset: { _ref: string; _type: string };
    alt?: string;
  };
  bio?: string;
}

/**
 * Category value strings stored in the post's `categories` array.
 * E.g. "crochet-tips" | "tutorials" | "inspiration" …
 */
export type BlogCategory = string;

/**
 * Minimal shape used in the blog listing grid (BlogCard component).
 * Only fetches what's needed for the card — no body content.
 */
export interface PostPreview {
  _id: string;
  _updatedAt?: string;
  title: string;
  slug: { current: string };
  mainImage?: {
    asset: { _ref: string; _type: string };
    alt?: string;
  };
  excerpt?: string;
  publishedAt?: string;
  author?: PostAuthor;
  categories?: BlogCategory[];
}

/**
 * Full post shape including portable-text body.
 * Used only on the detail page to avoid over-fetching on the listing.
 */
export interface Post extends PostPreview {
  // `body` is the raw Portable Text array consumed by @portabletext/react
  // We use `unknown[]` here because the PT block shape is complex and
  // already typed by the library itself at render time.
  body?: unknown[];
}

// -----------------------------------------------------------------------
// getAllPosts — returns PostPreview[] for the blog listing page
// -----------------------------------------------------------------------
export async function getAllPosts(): Promise<PostPreview[]> {
  const query = `*[_type == "post" && defined(slug.current) && slug.current != "" && defined(publishedAt) && dateTime(publishedAt) <= dateTime(now()) && !(_id in path("drafts.**"))] | order(publishedAt desc) {
    _id,
    _updatedAt,
    title,
    slug,
    mainImage { asset, alt },
    excerpt,
    publishedAt,
    author->{ name, slug, image { asset, alt } },
    categories
  }`;

  // ISR: revalidate every 60 s — matches the page-level `export const revalidate = 60`
  return fetchSanityArray<PostPreview>(query, undefined, { revalidate: 60, throwOnError: true });
}

// -----------------------------------------------------------------------
// getPostBySlug — returns full Post for the detail page
// -----------------------------------------------------------------------
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const query = `*[_type == "post" && slug.current == $slug && defined(publishedAt) && dateTime(publishedAt) <= dateTime(now()) && !(_id in path("drafts.**"))][0] {
    _id,
    _updatedAt,
    title,
    slug,
    mainImage { asset, alt },
    excerpt,
    publishedAt,
    author->{ name, slug, image { asset, alt }, bio },
    categories,
    body
  }`;

  // ISR: revalidate every 60 s — matches the page-level `export const revalidate = 60`
  return fetchSanity<Post>(query, { slug }, { revalidate: 60, throwOnError: true });
}

// -----------------------------------------------------------------------
// getAllPostSlugs — minimal query used by generateStaticParams
// -----------------------------------------------------------------------
export async function getAllPostSlugs(): Promise<Array<{ slug: { current: string } }>> {
  const query = `*[_type == "post" && defined(slug.current) && slug.current != "" && defined(publishedAt) && dateTime(publishedAt) <= dateTime(now()) && !(_id in path("drafts.**"))] {
    slug { current }
  }`;

  // No ISR needed for static params — build time only, cache doesn't matter
  return fetchSanityArray<{ slug: { current: string } }>(query, undefined, { throwOnError: true });
}
