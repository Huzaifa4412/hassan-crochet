import { fetchSanity, fetchSanityArray } from "./lib/fetch";

// ============================================================================
// PRODUCT TYPES & QUERIES
// ============================================================================

export interface ProductVariant {
  colorName: string;
  colorValue?: string;
  imageUrl?: string | null;
  sortOrder: number;
  image?: any;
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

  return fetchSanity<Product>(query, { slug });
}

// Get all products (for static generation)
export async function getAllProducts(): Promise<Pick<Product, "title" | "slug">[]> {
  const query = `*[_type == "product" && !(_id in path("drafts.**"))]{
    title,
    slug
  }`;

  return fetchSanityArray(query);
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

  return fetchSanityArray<Product>(query);
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

  return fetchSanityArray<Product>(query);
}

// Get all products with basic info
export async function getProducts(limit = 12, offset = 0): Promise<Product[]> {
  const query = `*[_type == "product" && inStock != false && !(_id in path("drafts.**"))] | order(sortOrder asc){
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
  }[${offset}...${offset + limit}]`;

  return fetchSanityArray<Product>(query);
}

// Get products by category
export async function getProductsByCategory(categorySlug: string, limit = 12): Promise<Product[]> {
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
  }[0...${limit}]`;

  return fetchSanityArray<Product>(query, { categorySlug });
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

  return fetchSanityArray<Product>(query, { collectionSlug });
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
  const query = `*[_type == "category" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
    _id,
    title,
    slug,
    description,
    icon,
    image{"url": asset->url},
    sortOrder,
    isActive
  }`;

  return fetchSanity<Category>(query, { slug });
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

  return fetchSanity<Collection>(query, { slug });
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

  return fetchSanityArray<Product>(searchQuery, { searchTerm: `*${searchTerm}*` });
}
