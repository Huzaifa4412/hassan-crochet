# Sanity CMS Quick Start Guide

This guide will help you get started with Sanity CMS in your Next.js e-commerce project.

## Prerequisites

- Node.js and npm/bun installed
- Sanity account (free at https://www.sanity.io/)
- Project environment variables configured

## Environment Setup

### 1. Configure Environment Variables

Create or update `.env.local` in your project root:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-02-23
```

Get your `PROJECT_ID` from:
- Sanity project dashboard at https://www.sanity.io/manage
- Or run `npx sanity init` and follow prompts

### 2. Verify Configuration

Run the development server:
```bash
npm run dev
```

Navigate to `http://localhost:3000/test-sanity` to verify:
- Environment variables are loaded
- Connection to Sanity is working
- Sample queries return data

## Sanity Studio

### Accessing the Studio

Start the development server and navigate to:
```
http://localhost:3000/studio
```

### Creating Your First Product

1. Open Sanity Studio at `/studio`
2. Click "Products" in the left sidebar
3. Click the "+" button to create a new product
4. Fill in the required fields:
   - **Product Title**: "Tray Table" (or any name)
   - **Slug**: Auto-generated from title (e.g., "tray-table")
   - **Etsy Link**: Your Etsy listing URL
5. Add Color Variants:
   - Click "Add variant"
   - Enter color name (e.g., "Beige")
   - Optionally enter color value (e.g., "#D2C4B5")
   - Upload product image
   - Set sort order (0 for first)
6. Add more variants for different colors
7. Click "Publish" (green checkmark)

### Creating Categories

1. Click "Categories" in Studio
2. Click "+" to create
3. Fill in:
   - **Category Title**: e.g., "Home Decor"
   - **Slug**: Auto-generated
   - **Icon**: Lucide icon name (e.g., "home")
   - Upload category image (optional)
4. Set **Active** to true
5. Publish

### Creating Collections

1. Click "Collections" in Studio
2. Click "+" to create
3. Fill in:
   - **Collection Title**: e.g., "Summer Collection"
   - **Slug**: Auto-generated
   - Upload collection image
   - Add products to the collection
4. Publish

### Creating Banners

1. Click "Banners" in Studio
2. Click "+" to create
3. Fill in:
   - **Banner Type**: Choose from hero, announcement, promo, or category
   - **Headline**: Main text
   - **Subheadline**: Supporting text
   - **Image**: Banner image
   - **CTA Text/Button**: Call-to-action
   - **Background/Text Colors**: Style options
4. Set **Active** to true
5. Publish

## Using Data in Your Application

### Importing Query Functions

```typescript
// Import from main module
import {
  getProductBySlug,
  getFeaturedProducts,
  getCategories,
  getProducts,
  type Product,
  type Category,
} from '@/sanity';

// Or import specific functions
import { getProductBySlug } from '@/sanity/queries';
```

### Fetching a Single Product

```typescript
// In a Server Component
import { getProductBySlug } from '@/sanity';

export default async function ProductPage({ params }) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return <ProductView product={product} />;
}
```

### Fetching Multiple Products

```typescript
// Featured products
const featuredProducts = await getFeaturedProducts(4);

// New products
const newProducts = await getNewProducts(8);

// All products with pagination
const products = await getProducts(12, 0);
```

### Fetching Categories and Collections

```typescript
// All active categories
const categories = await getCategories();

// All active collections
const collections = await getCollections();

// Products by category
const categoryProducts = await getProductsByCategory('home-decor', 12);

// Products by collection
const collectionProducts = await getProductsByCollection('summer', 12);
```

### Fetching Banners and Testimonials

```typescript
// Hero banners
const heroBanners = await getHeroBanners();

// Announcement bar
const announcement = await getAnnouncementBar();

// Testimonials
const testimonials = await getTestimonials(true, 6); // featured, limit 6
```

## Client Component Usage

For client components, fetch data in a parent server component and pass as props:

```typescript
// Server Component (page.tsx)
import { getProductBySlug } from '@/sanity';
import ProductClient from './client';

export default async function Page({ params }) {
  const product = await getProductBySlug(params.slug);
  return <ProductClient product={product} />;
}

// Client Component (client.tsx)
'use client';

export default function ProductClient({ product }) {
  // Interactive logic here
  return <div>{product.title}</div>;
}
```

## Data Structure Reference

### Product Object

```typescript
{
  _id: string;
  title: string;
  description: string;
  shortDescription: string;
  slug: { current: string };
  category: {
    _id: string;
    title: string;
    slug: { current: string };
    icon: string;
  };
  variants: [
    {
      colorName: string;
      colorValue: string;
      imageUrl: string;
      sortOrder: number;
    }
  ];
  galleryImages: [
    { url: string }
  ];
  badges: string[];
  etsyLink: string;
  inStock: boolean;
  featured: boolean;
  isNew: boolean;
  sortOrder: number;
}
```

## Common Patterns

### Displaying Product Variants

```typescript
function VariantSelector({ variants, selectedVariant, onSelect }) {
  return (
    <div className="flex gap-2">
      {variants.map((variant) => (
        <button
          key={variant.colorName}
          onClick={() => onSelect(variant)}
          className={selectedVariant?.colorName === variant.colorName ? 'ring-2' : ''}
        >
          {variant.colorName}
        </button>
      ))}
    </div>
  );
}
```

### Displaying Product Images

```typescript
function ProductGallery({ variants, selectedVariant }) {
  const imageUrl = selectedVariant?.imageUrl || variants[0]?.imageUrl;

  return (
    <img
      src={imageUrl}
      alt={selectedVariant?.colorName || 'Product'}
      className="w-full h-auto"
    />
  );
}
```

### Checking Stock Status

```typescript
function ProductStatus({ inStock }) {
  return (
    <span className={inStock ? 'text-green-600' : 'text-red-600'}>
      {inStock ? 'In Stock' : 'Out of Stock'}
    </span>
  );
}
```

## Testing Queries

### Using Sanity Studio Vision Plugin

1. Open Studio at `/studio`
2. Click "Vision" in the left sidebar
3. Enter your GROQ query
4. Click "Run" to see results

Example query:
```groq
*[_type == "product" && featured == true]{
  title,
  slug,
  variants[]{
    colorName,
    "imageUrl": image.asset->url
  }
}
```

### Using the Test Page

Navigate to `/test-sanity` to see:
- Configuration status
- Sample queries and results
- Error messages if any

## Deployment

### Environment Variables on Vercel

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add the following:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `NEXT_PUBLIC_SANITY_API_VERSION`

### Revalidating Content

The project uses ISR (Incremental Static Regeneration):
```typescript
export const revalidate = 60; // Revalidate every 60 seconds
```

For instant updates, consider using On-Demand Revalidation or Sanity's webhooks.

## Troubleshooting

### Data Not Loading

1. Check browser console for errors
2. Verify environment variables are set
3. Ensure documents are published (not drafts)
4. Check the test page at `/test-sanity`

### Images Not Loading

1. Verify images are attached in Studio
2. Check query uses correct projection: `"imageUrl": image.asset->url`
3. Ensure dataset name is correct

### TypeScript Errors

1. Clear node_modules and reinstall
2. Restart TypeScript server in your IDE
3. Check that interfaces match query projections

## Additional Resources

- **Sanity Documentation**: https://www.sanity.io/docs
- **GROQ Query Reference**: https://www.sanity.io/docs/groq
- **Next-Sanity Documentation**: https://github.com/sanity-io/next-sanity
- **Project-Specific**: See `docs/SANITY_TROUBLESHOOTING.md`
- **Schema Reference**: See `docs/SANITY_SCHEMA_REFERENCE.md`
