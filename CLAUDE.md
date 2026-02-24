# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 e-commerce application with Sanity CMS headless backend. The app features an interactive product customization canvas using Fabric.js, displaying products with color variants, image gallery, countdown timers, and a customization studio where users can overlay text and icons on product images.

## Development Commands

```bash
# Install dependencies (uses bun.lock, but npm works too)
bun install
# or
npm install

# Start development server on http://localhost:3000
bun dev
# or
npm run dev

# Production build
bun run build
# or
npm run build

# Start production server
bun run start
# or
npm run start

# Run ESLint
bun run lint
# or
npm run lint

# Sanity CMS commands (requires .env.local with project credentials)
npx sanity@latest schema deploy    # Deploy schema changes to Sanity
npx sanity@latest docs             # Open Sanity documentation
```

**Note**: The `package.json` has `ignoreScripts: ["sharp", "unrs-resolver"]` configured. If encountering image-related build issues, these scripts may need to be enabled.

## Tech Stack

- **Framework**: Next.js 16.1.6 with App Router (`src/app/` directory)
- **React**: 19.2.3 with TypeScript 5
- **Headless CMS**: Sanity v4 with next-sanity integration
- **Styling**: Tailwind CSS v4 with `@tailwindcss/postcss`
- **Canvas Library**: Fabric.js 7.2.0 (imported as `import * as fabric from "fabric"`)
- **Icons**: Lucide React and react-icons
- **Fonts**: Geist Sans and Geist Mono (via `next/font/google`)

## Environment Variables

The project requires Sanity CMS credentials in `.env.local`:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-02-23
```

Access Sanity Studio at `http://localhost:3000/studio` to manage products.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                # Root layout with fonts
│   ├── page.tsx                  # Home page (renders ProductDetail)
│   ├── globals.css               # Global styles with Tailwind import
│   ├── studio/
│   │   └── [[...tool]]/page.tsx  # Sanity Studio admin interface
│   └── products/
│       └── [slug]/
│           ├── page.tsx          # Server component - fetches product from Sanity
│           └── client.tsx        # Client component - product UI with Fabric canvas
├── components/
│   ├── ProductDetail.tsx         # Main product display component
│   └── CustomizationCanvas.tsx   # Fabric.js canvas wrapper
├── sanity/
│   ├── env.ts                    # Sanity environment variables
│   ├── schemaTypes/
│   │   ├── products.ts           # Product schema with variants
│   │   └── index.ts              # Schema registry
│   ├── queries.ts                # GROQ queries for products
│   ├── structure.ts              # Sanity Studio structure
│   └── lib/
│       ├── client.ts             # Sanity client instance
│       ├── image.ts              # Image URL builder
│       └── live.ts               # Live content support
└── Data.js                       # Legacy shared images and colors arrays
```

## Architecture Notes

### Path Aliases
Imports use `@/*` alias for `src/*`:
```tsx
import { colors, images } from "@/Data";
import CustomizationCanvas from "@/components/CustomizationCanvas";
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
4. **Custom controls** - Delete control is added globally via `object:added` event
5. **Imperative handles** - `CustomizationCanvasRef` interface exposes methods (`addText`, `addIcon`, `download`, `updateBaseImage`)

**Important**: Fabric.js mutates its internal state directly. Keep React state separate from Fabric canvas state. Use `useRef` for the canvas instance to avoid re-renders.

### Sanity CMS Integration

**Schema Structure** (`src/sanity/schemaTypes/products.ts`):
- Products have variants containing `colorName` and image asset
- Images are Sanity assets referenced via `image.asset->url` in GROQ
- Variants drive both color selector UI and canvas background updates
- Additional fields: `etsyLink` (URL), `inStock` (boolean), `featured` (boolean), `saleEndDate` (datetime)

**IMPORTANT - Schema Inconsistency**: The TypeScript interfaces in `src/sanity/queries.ts` expect fields that are missing from the schema:
- `colorValue` - Expected in `ProductVariant` interface and query, but **not defined** in the schema
- `price`, `comparePrice` - Expected in `Product` interface and query, but **not defined** in the schema

When adding new products or modifying the schema, ensure schema fields match the TypeScript interfaces and GROQ projections.

**Data Fetching** (`src/sanity/queries.ts`):
```tsx
import { getProductBySlug, getAllProducts } from "@/sanity/queries";

const product = await getProductBySlug("tray-table");
// Returns: { _id, title, price, comparePrice, description, category, badges,
//            variants: [{ colorName, colorValue, imageUrl }], slug }
```

**Sanity Studio**: Access at `/studio` route to:
- Create/edit products with variants
- Upload product images per color variant
- Set pricing, badges, categories, and stock status
- Use Vision plugin to test GROQ queries

**Image URLs**: Sanity images must be projected with `"imageUrl": image.asset->url` to get the actual URL.

### Customization Canvas Features

The `CustomizationCanvas` component (`src/components/CustomizationCanvas.tsx`) provides:
- Background product image that updates when color changes
- Text overlay with custom font and color
- Icon drag-and-drop from a toolbar
- Custom delete control on all objects
- Download/export to PNG
- Responsive resizing via `ResizeObserver`

### Product Page Architecture

1. **Home page** (`src/app/page.tsx`): Displays `ProductDetail.tsx` - uses hardcoded `Data.js` for images and colors. Standard e-commerce view with gallery, reviews, countdown timer, and color/quantity selection.

2. **Dynamic product pages** (`/products/[slug]`): Full-featured customization studio powered by Sanity CMS. Fetches product data including variants via GROQ, renders Fabric.js canvas with text/icon customization, modern UI with rose accent color.

3. **Sanity Studio** (`/studio`): Admin interface for managing products, uploading images, setting variants, and content management.

### Data Structure

**Legacy Data** (`src/Data.js` - still used by ProductDetail.tsx):
- `images`: Array of 4 product image URLs (indexed to match colors)
- `colors`: Array of color objects with `name` and Tailwind `value` (black, beige, red, white)

**Sanity Product Data** (preferred for new products):
- `Product` interface includes `_id`, `title`, `price`, `comparePrice`, `description`, `category`, `badges`, `slug`, and `variants`
- `ProductVariant` interface includes `colorName`, `colorValue`, and `imageUrl`
- Schema also supports: `etsyLink`, `inStock`, `featured`, `saleEndDate`
- Variants array contains one object per color with associated product image

## Styling Notes

- Tailwind CSS v4 uses `@import "tailwindcss"` in `globals.css`
- Dark mode support via CSS custom properties (`--background`, `--foreground`)
- Accent color: `#0FABCA` (cyan)
- Custom brutalist UI on `/products/tray-table` with `bg-slate-950` base

## ESLint Configuration

Uses `eslint-config-next` with TypeScript rules. Configuration is in `eslint.config.mjs` (flat config format).

## References

See `docs/FABRIC_GUIDE.md` and `docs/FABRIC_IMAGES_TEXT_GUIDE.md` for comprehensive Fabric.js v6+ usage patterns.
