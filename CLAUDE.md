# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 e-commerce application for Hassan Crochet with Sanity CMS headless backend. The app features an interactive product customization canvas using Fabric.js, displaying products with color variants, image galleries, and a customization studio where users can overlay text and icons on product images. Includes full e-commerce features with categories, collections, testimonials, newsletter signup, navigation menus, and search functionality.

## Development Commands

**Note**: This project uses **bun** as the preferred package manager (`bun.lock` present). npm works as an alternative.

```bash
# Install dependencies
bun install

# Start development server on http://localhost:3000
bun dev

# Production build
bun run build

# Start production server
bun run start

# Run ESLint
bun run lint

# Sanity CMS commands (requires .env.local with project credentials)
bunx sanity@latest schema deploy   # Deploy schema changes to Sanity
bunx sanity@latest docs            # Open Sanity documentation
```

**Note**: The `package.json` has `ignoreScripts: ["sharp", "unrs-resolver"]` configured. If encountering image-related build issues, these scripts may need to be enabled.

## Tech Stack

- **Framework**: Next.js 16.1.6 with App Router (`src/app/` directory)
- **React**: 19.2.3 with TypeScript 5
- **Headless CMS**: Sanity v4 with next-sanity integration
- **Styling**: Tailwind CSS v4 with `@tailwindcss/postcss`, shadcn/ui components, `tw-animate-css`
- **Canvas Library**: Fabric.js 7.2.0 (imported as `import * as fabric from "fabric"`)
- **Icons**: Lucide React and react-icons
- **UI Components**: shadcn/ui (Radix UI primitives with Tailwind styling)
- **Swiper**: Swiper 12.1.2 for carousels/sliders
- **Utilities**: class-variance-authority, clsx, tailwind-merge for conditional styling
- **Fonts**: Geist Sans and Geist Mono (via `next/font/google`), Plus Jakarta Sans, Lora, IBM Plex Mono (via shadcn)

## Environment Variables

The project requires a `.env.local` file (create manually, no template exists):

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-02-23
```

Get your Sanity project ID from [sanity.io/manage](https://www.sanity.io/manage).

Access Sanity Studio at `http://localhost:3000/studio` to manage content.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                # Root layout with fonts, TooltipProvider, Header, SiteFooter
│   ├── page.tsx                  # Home page - Sanity-powered with banners, new arrivals, featured products
│   ├── globals.css               # Global styles with Tailwind, shadcn, CSS variables
│   ├── studio/
│   │   └── [[...tool]]/page.tsx  # Sanity Studio admin interface
│   ├── products/
│   │   ├── page.tsx              # Products listing with sidebar filters (category, collection, sort)
│   │   └── [slug]/
│   │       ├── page.tsx          # Server component - fetches product from Sanity
│   │       └── client.tsx        # Client component - product UI with Fabric canvas
│   ├── category/[slug]/page.tsx  # Category page with filtered products
│   ├── search/page.tsx           # Search results page
│   └── test-sanity/page.tsx      # Sanity connection test page
├── components/
│   ├── ui/                       # shadcn/ui components (button, tooltip, etc.) + ecommerce.tsx
│   ├── layout/                   # Layout components
│   │   ├── Header.tsx            # Main header with navigation and search dropdown
│   │   ├── Footer.tsx            # Footer with links and newsletter
│   │   ├── AnnouncementBar.tsx   # Announcement banner from Sanity CMS
│   │   ├── PromoBanner.tsx       # Promotional banner component
│   │   └── HeroBanner.tsx        # Hero banner component
│   ├── home/                     # Homepage-specific components
│   │   ├── BannerSlider.tsx      # Hero banner carousel with SwiperJS
│   │   ├── ProductCard.tsx       # Product card with variants (regular + compact)
│   │   ├── BentoGrid.tsx         # Feature highlights grid layout
│   │   └── TestimonialsCarousel.tsx  # Customer reviews carousel
│   ├── search/                   # Search components
│   │   ├── SearchDropdown.tsx    # Live search dropdown in header
│   │   └── SearchResults.tsx     # Search results display
│   ├── CustomizationCanvas.tsx   # Fabric.js canvas wrapper
│   ├── ProductCard.tsx           # Shared product card component
│   ├── Testimonials.tsx          # Testimonials display component
│   ├── Newsletter.tsx            # Newsletter signup component
│   ├── site-header.tsx           # Alternative header component
│   └── site-footer.tsx           # Alternative footer component
├── sanity/
│   ├── env.ts                    # Sanity environment variables
│   ├── schemaTypes/
│   │   ├── products.ts           # Product schema with variants
│   │   ├── category.ts           # Category schema
│   │   ├── banner.ts             # Banner/Hero schema
│   │   ├── testimonial.ts        # Testimonial schema
│   │   ├── newsletter.ts         # Newsletter schema
│   │   ├── navigationMenu.ts     # Navigation menu schema
│   │   └── index.ts              # Schema registry
│   ├── queries.ts                # GROQ queries for all content types + TypeScript interfaces
│   ├── structure.ts              # Sanity Studio structure
│   └── lib/
│       ├── client.ts             # Sanity client instance (useCdn: false for ISR)
│       └── fetch.ts              # Fetch wrapper with error handling (cache: 'no-store')
└── Data.js                       # Legacy hardcoded images/colors (deprecated)
```

## Architecture Notes

### Path Aliases
Imports use `@/*` alias for `src/*`:
```tsx
import CustomizationCanvas from "@/components/CustomizationCanvas";
import { getProductBySlug } from "@/sanity/queries";
```

### Client Components
All components using hooks or interactivity are marked with `'use client'` at the top. This includes:
- All components in `src/components/`
- `src/app/products/[slug]/client.tsx`

### Server/Client Component Pattern for Dynamic Routes

Dynamic product routes use a split pattern:

1. **Server component** (`page.tsx`): Fetches data from Sanity using `getProductBySlug()`, handles `notFound()` for missing products, implements ISR with `revalidate: 60`, and generates `generateStaticParams()` for static builds.

2. **Client component** (`client.tsx`): Receives product data as props, handles all interactivity (state, events, canvas operations), and renders the Fabric.js canvas.

```tsx
// page.tsx (server)
export default async function ProductPage({ params }) {
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  return <ProductClient product={product} />;
}

// client.tsx (client)
"use client";
export default function ProductClient({ product }) {
  // Interactive logic here
}
```

### Fabric.js Integration

The project uses **Fabric.js v7** with namespace imports:
```tsx
import * as fabric from "fabric";
```

**Key patterns used in this codebase:**

1. **Canvas initialization** - Must be done in `useEffect` with cleanup via `canvas.dispose()`
2. **Image loading** - Uses `fabric.FabricImage.fromURL()` with `{ crossOrigin: "anonymous" }` for CORS
3. **Text objects** - Uses `fabric.Textbox` for user-editable, wrapping text
4. **Multicolor text** - Supports color palettes (rainbow, blossom, cloudy, grassland) that create grouped text with per-character colors
5. **Custom controls** - Delete control is added globally via `object:added` event
6. **Imperative handles** - `CustomizationCanvasRef` interface exposes methods (`addText`, `addIcon`, `download`, `updateBaseImage`)
7. **Responsive canvas** - Uses `ResizeObserver` to handle container resizing
8. **Drag and drop** - Supports dropping icons from external elements onto the canvas

**Important**: Fabric.js mutates its internal state directly. Keep React state separate from Fabric canvas state. Use `useRef` for the canvas instance to avoid re-renders.

### Sanity CMS Integration

**Schema Structure** (`src/sanity/schemaTypes/`):
- `products.ts`: Products with variants (colorName, colorValue, image, sortOrder), gallery images, badges, stock status, featured flags, SEO fields
- `category.ts`: Categories with icon, image, sortOrder, isActive toggle
- `banner.ts`: Hero/announcement/promo banners with scheduling (startDate/endDate)
- `testimonial.ts`: Customer reviews with ratings, images, product reference
- `newsletter.ts`: Newsletter signup configuration with discount offers
- `navigationMenu.ts`: Main/footer/mobile navigation with dropdown support

**Data Fetching** (`src/sanity/queries.ts`):
```tsx
import {
  getProductBySlug,
  getAllProducts,
  getFeaturedProducts,
  getNewProducts,
  getProductsByCategory,
  getProductsByCollection,
  getCategories,
  getCollections,
  getBanners,
  getTestimonials,
  getNewsletter,
  getNavigationMenu,
  searchProducts
} from "@/sanity/queries";

const product = await getProductBySlug("tray-table");
// Returns: { _id, title, description, shortDescription, category, collections,
//            badges, etsyLink, variants: [{ colorName, colorValue, imageUrl, sortOrder }],
//            galleryImages, inStock, featured, isNew, sortOrder, slug, seoTitle, seoDescription, saleEndDate }
```

**Error Handling** (`src/sanity/lib/fetch.ts`):
- `fetchSanity<T>()`: Fetches single item, returns `null` on error with console logging
- `fetchSanityArray<T>()`: Fetches arrays, returns `[]` on error with console logging
- All Sanity query functions use these wrappers, so handle `null` returns appropriately

**Client Configuration** (`src/sanity/lib/client.ts`):
- `useCdn: false` - Disabled for ISR to get fresh content on revalidation
- `perspective: 'published'` - Only fetch published content
- `stega` - Enabled for preview deployments

**Sanity Studio**: Access at `/studio` route to:
- Create/edit products with variants, categories, banners, testimonials, newsletters, navigation menus
- Upload product images per color variant and gallery images
- Set badges, categories, stock status, featured flags, sort orders
- Use Vision plugin to test GROQ queries

**Image URLs**: Sanity images must be projected with `"imageUrl": image.asset->url` or `"url": asset->url` to get the actual URL. Sanity CDN domains are already whitelisted in `next.config.ts`.

**Draft Exclusion**: All queries include `!(_id in path("drafts.**"))` to exclude draft documents from production queries.

**ISR Revalidation**: Product pages use ISR with `revalidate: 60` (60 seconds). Content updates appear within 1 minute.

### Customization Canvas Features

The `CustomizationCanvas` component (`src/components/CustomizationCanvas.tsx`) provides:
- Background product image that updates when color changes
- Text overlay with custom font and color (including multicolor palettes)
- Icon drag-and-drop from a toolbar
- Custom delete control on all objects
- Download/export to PNG with 2x multiplier for high resolution
- Responsive resizing via `ResizeObserver`

### Page Architecture

1. **Home page** (`src/app/page.tsx`): Sanity-powered with:
   - BannerSlider with hero banners from CMS
   - New Arrivals section (8 products)
   - Featured Products horizontal scroll
   - BentoGrid feature highlights
   - TestimonialsCarousel
   - CTA section

2. **Products listing** (`/products`): Displays all products with:
   - Sidebar filters: Categories, Collections, Quick Filters (featured, new, A-Z)
   - View toggle: Grid or List layout
   - Sort options: featured, new, A-Z, Z-A
   - Breadcrumb navigation

3. **Dynamic product pages** (`/products/[slug]`): Full-featured customization studio powered by Sanity CMS. Fetches product data including variants via GROQ, renders Fabric.js canvas with text/icon customization, modern UI with shadcn components.

4. **Category pages** (`/category/[slug]`): Products filtered by category with header, icon, and description.

5. **Search page** (`/search`): Search results with product filtering.

6. **Sanity Studio** (`/studio`): Admin interface for managing all content types.

### Data Structure

**Legacy Data** (`src/Data.js` - deprecated, kept for reference):
- `images`: Array of 4 product image URLs (indexed to match colors)
- `colors`: Array of color objects with `name` and Tailwind `value` (black, beige, red, white)

**Sanity Product Data** (preferred for all products):
- `Product` interface includes `_id`, `title`, `description`, `shortDescription`, `category`, `collections`, `badges`, `etsyLink`, `slug`, `seoTitle`, `seoDescription`, `saleEndDate`, `inStock`, `featured`, `isNew`, `sortOrder`, and `variants`
- `ProductVariant` interface includes `colorName`, `colorValue`, `imageUrl`, `sortOrder`, and `image`
- Variants array contains one object per color with associated product image
- Gallery images are stored separately in `galleryImages` array

### Components Reference

**ProductCard** (`src/components/ProductCard.tsx`):
- Exports `ProductCard` (full card) and `ProductCardCompact` (list view)
- Displays product image, title, badges, color variants
- Links to product detail page

**Header** (`src/components/layout/Header.tsx`):
- Sticky header with scroll shadow effect
- Navigation menu from Sanity CMS
- SearchDropdown integration
- Mobile menu with responsive toggle
- AnnouncementBar above header

**SearchDropdown** (`src/components/search/SearchDropdown.tsx`):
- Live search with 2+ character minimum
- Dropdown results with product thumbnails
- Keyboard navigation support
- Links to full search page

## Styling Notes

- Tailwind CSS v4 uses `@import "tailwindcss"` in `globals.css`
- shadcn/ui components with custom CSS variables for theming (`--primary`, `--secondary`, `--muted`, etc.)
- Dark mode support via `.dark` class with CSS custom properties (`--background`, `--foreground`)
- Font variables: `--font-sans` (Plus Jakarta Sans), `--font-serif` (Lora), `--font-mono` (IBM Plex Mono)
- Geist Sans and Geist Mono fonts loaded via `next/font/google` with CSS variable pattern
- Custom shadow utilities (`--shadow-2xs` through `--shadow-2xl`)
- `tw-animate-css` for Tailwind-compatible animations
- Custom scrollbar-hide utility class
- Number input spin buttons hidden via CSS

## TypeScript Configuration

- `strict: true` - Strict mode enabled for better type safety
- Path alias `@/*` maps to `./src/*` (configured in `tsconfig.json`)

## ESLint Configuration

Uses `eslint.config.mjs` (flat config format) with `eslint-config-next` presets:
- `nextVitals`: Core web vitals rules
- `nextTs`: TypeScript-specific rules
- Custom global ignores for build outputs

## Testing

No testing framework is currently configured.

## References

See `docs/FABRIC_GUIDE.md` and `docs/FABRIC_IMAGES_TEXT_GUIDE.md` for comprehensive Fabric.js v7 usage patterns.

For Sanity CMS:
- `docs/SANITY_QUICKSTART.md` - Getting started guide with Sanity CMS
- `docs/SANITY_SCHEMA_REFERENCE.md` - Complete schema and GROQ query reference
- `docs/SANITY_TROUBLESHOOTING.md` - Common issues and debugging guide

**Debug Route**: Access `/test-sanity` to verify Sanity connection and test queries.
