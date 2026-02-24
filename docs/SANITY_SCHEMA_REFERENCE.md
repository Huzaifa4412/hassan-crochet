# Sanity Schema Quick Reference

This document provides a quick reference for the Sanity CMS schema structure and GROQ query patterns used in this project.

## Content Types

### Product (`product`)
```typescript
interface Product {
  _id: string;
  title: string;
  description?: string;
  shortDescription?: string;
  slug: { current: string };
  category?: {
    _id: string;
    title: string;
    slug: { current: string };
    icon?: string;
  };
  collections?: Array<{
    _id: string;
    title: string;
    slug: { current: string };
  }>;
  badges?: string[];
  etsyLink?: string;
  variants: Array<{
    colorName: string;
    colorValue?: string;
    imageUrl: string;
    sortOrder: number;
  }>;
  galleryImages?: Array<{ url: string }>;
  inStock?: boolean;
  featured?: boolean;
  isNew?: boolean;
  sortOrder: number;
  seoTitle?: string;
  seoDescription?: string;
  saleEndDate?: string;
}
```

**Query Example:**
```groq
*[_type == "product" && slug.current == $slug][0]{
  _id,
  title,
  description,
  shortDescription,
  category->{_id, title, slug, icon},
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
}
```

### Category (`category`)
```typescript
interface Category {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  icon?: string;
  image?: { url: string };
  sortOrder: number;
  isActive: boolean;
}
```

**Query Example:**
```groq
*[_type == "category" && isActive == true]{
  _id,
  title,
  slug,
  description,
  icon,
  image{"url": asset->url},
  sortOrder,
  isActive
}
```

### Collection (`collection`)
```typescript
interface Collection {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  image: { url: string };
  badge?: string;
  badgeColor?: string;
  products?: Product[];
  sortOrder: number;
  isActive: boolean;
}
```

**Query Example:**
```groq
*[_type == "collection" && isActive == true]{
  _id,
  title,
  slug,
  description,
  image{"url": asset->url},
  badge,
  badgeColor,
  sortOrder,
  isActive
}
```

### Banner (`banner`)
```typescript
interface Banner {
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
```

**Query Example:**
```groq
*[_type == "banner" && isActive == true]{
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
}
```

### Testimonial (`testimonial`)
```typescript
interface Testimonial {
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
```

**Query Example:**
```groq
*[_type == "testimonial" && isActive == true]{
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
}
```

### Newsletter (`newsletter`)
```typescript
interface Newsletter {
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
```

**Query Example:**
```groq
*[_type == "newsletter" && isActive == true][0]{
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
}
```

### Navigation Menu (`navigationMenu`)
```typescript
interface NavigationMenu {
  _id: string;
  title: string;
  menuType: "main" | "footer" | "mobile";
  menuItems: Array<{
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
  }>;
  isActive: boolean;
}
```

**Query Example:**
```groq
*[_type == "navigationMenu" && menuType == $menuType][0]{
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
}
```

## GROQ Query Patterns

### Filter Drafts
```groq
// Exclude draft documents
!(_id in path("drafts.**"))

// Full example
*[_type == "product" && !(_id in path("drafts.**"))]
```

### Image Projections
```groq
// Get just the URL
"imageUrl": image.asset->url

// Get URL with nested object
image{"url": asset->url}

// Multiple images
galleryImages[]{
  "url": asset->url
}
```

### Reference Projections
```groq
// Single reference
category->{_id, title, slug, icon}

// Multiple references
collections[]->{_id, title, slug}

// Nested reference
product->{_id, title, slug{ current }}
```

### Array Operations
```groq
// Get first item
variants{...}[0]

// Slice array
products[0...10]

// Filter array
variants[colorName == "Red"]
```

### Ordering
```groq
// Ascending
| order(sortOrder asc)

// Descending
| order(sortOrder desc)

// Multiple fields
| order(sortOrder asc, title asc)
```

### Conditionals
```groq
// Boolean check
featured == true

// Null check
startDate == null || startDate <= $now

// String match
title match $searchTerm

// In array
$slug in collections[].slug.current
```

### Pagination
```groq
// Offset and limit
[offset...(offset + limit)]

// With parameters
[${offset}...${offset + limit}]
```

## Common Query Patterns

### Get Single Document by Slug
```groq
*[_type == "product" && slug.current == $slug][0]
```

### Get All Active Documents
```groq
*[_type == "category" && isActive == true]
```

### Get Featured Items
```groq
*[_type == "product" && featured == true && inStock != false]
```

### Get by Date Range
```groq
*[_type == "banner" && (startDate == null || startDate <= $now) && (endDate == null || endDate >= $now)]
```

### Search
```groq
*[_type == "product" && title match $searchTerm]
```

### Count Documents
```groq
count(*[_type == "product" && !(_id in path("drafts.**"))])
```

## Performance Tips

1. **Be selective with projections** - Only fetch fields you need
2. **Use `select` for previews** - Reduce payload size
3. **Apply filters early** - Reduce result set before projections
4. **Use pagination** - Don't fetch all records at once
5. **Leverage CDN** - Enable `useCdn: true` for published content
6. **Cache appropriately** - Use Next.js caching for static content

## Type-Safe Query Imports

```typescript
// Import from main Sanity module
import {
  getProductBySlug,
  getFeaturedProducts,
  getCategories,
  type Product,
  type Category,
} from '@/sanity';

// Or import specific functions
import { getProductBySlug } from '@/sanity/queries';
```
