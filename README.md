# Hassan Crochet

A modern e-commerce application for customizable handmade crochet products, built with Next.js 16, Sanity CMS, and Tailwind CSS v4.

## Features

- 🛍️ **Product Catalog** - Browse customizable crochet products with multiple color variants
- 🔍 **Live Search** - Instant search with dropdown suggestions and full search page
- 🎨 **Product Customization** - Interactive canvas for adding custom text and icons (Fabric.js)
- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop
- 🎯 **Category & Collection Filtering** - Organized product navigation
- ⭐ **Customer Reviews** - Testimonials with ratings and images
- 📢 **Sanity CMS Integration** - Headless CMS for content management
- 🔐 **Etsy Integration** - Direct links to Etsy shop for purchases

## Tech Stack

### Framework & Runtime
- **Next.js 16.1.6** (App Router with Turbopack)
- **React 19.2.3** with TypeScript 5

### Styling & UI
- **Tailwind CSS v4** - Utility-first CSS with custom design tokens
- **shadcn/ui** - High-quality React components
- **SwiperJS 12** - Banner carousel and testimonials slider
- **Lucide React** - Beautiful icon library

### Canvas & Customization
- **Fabric.js 7.2** - Interactive product customization canvas

### CMS
- **Sanity v4** - Headless CMS for content management
- **next-sanity** - Optimized Sanity integration for Next.js

### Fonts
- **Plus Jakarta Sans** - Primary font (headings)
- **Geist Sans & Geist Mono** - Additional fonts from Next.js

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Homepage with hero, new arrivals, featured products
│   ├── layout.tsx                # Root layout with fonts
│   ├── globals.css               # Global styles and Tailwind imports
│   ├── products/
│   │   ├── page.tsx              # Products listing page with filters
│   │   └── [slug]/
│   │       ├── page.tsx          # Server component (data fetching)
│   │       └── client.tsx        # Client component (product + canvas)
│   ├── search/
│   │   └── page.tsx              # Search results page
│   ├── category/[slug]/          # Category pages
│   ├── collection/[slug]/        # Collection pages
│   ├── collections/              # All collections page
│   └── studio/                   # Sanity Studio admin
├── components/
│   ├── layout/                   # Layout components
│   │   ├── Header.tsx            # Main header with navigation and search
│   │   ├── Footer.tsx            # Footer with newsletter and links
│   │   └── AnnouncementBar.tsx   # Announcement banner
│   ├── home/                     # Homepage components
│   │   ├── BannerSlider.tsx      # Hero banner with SwiperJS
│   │   ├── ProductCard.tsx       # Product card with variants
│   │   ├── BentoGrid.tsx         # Feature highlights grid
│   │   └── TestimonialsCarousel.tsx  # Customer reviews carousel
│   ├── search/                   # Search components
│   │   └── SearchDropdown.tsx    # Live search dropdown
│   ├── ui/                       # shadcn/ui components
│   └── ui/ecommerce.tsx          # E-commerce specific components
├── sanity/
│   ├── schemaTypes/              # Sanity CMS schema definitions
│   │   ├── products.ts           # Product schema with variants
│   │   ├── collection.ts         # Collection schema
│   │   ├── category.ts           # Category schema
│   │   ├── banner.ts             # Banner schema
│   │   └── testimonial.ts        # Testimonial schema
│   ├── queries.ts                # GROQ queries and type definitions
│   ├── lib/                      # Sanity client utilities
│   └── env.ts                    # Environment configuration
└── Data.js                       # Legacy product data (being phased out)
```

## Getting Started

### Prerequisites

- Node.js 18+
- bun, npm, or yarn
- Sanity CMS account (for content management)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hassan-crochet
```

2. Install dependencies:
```bash
bun install
# or
npm install
# or
yarn install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory:

```bash
# Sanity CMS Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-02-23
```

Get your Sanity project ID from [sanity.io/manage](https://www.sanity.io/manage).

### Development

Run the development server:

```bash
bun dev
# or
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Sanity CMS Setup

1. Deploy the Sanity schema:
```bash
bunx sanity@latest schema deploy
```

2. Access Sanity Studio at [http://localhost:3000/studio](http://localhost:3000/studio)

3. Create content:
   - Add products with variants (colors, images)
   - Create categories and collections
   - Set up banners for the hero slider
   - Add customer testimonials

## Available Scripts

```bash
bun dev          # Start development server
bun run build    # Build for production
bun run start    # Start production server
bun run lint     # Run ESLint
bunx sanity@latest schema deploy  # Deploy Sanity schema
bunx sanity@latest docs           # Open Sanity documentation
```

## Key Features Explained

### 1. Product Customization Studio

Located at `/products/[slug]`, this feature uses Fabric.js to create an interactive canvas where customers can:
- Choose product color variants
- Add custom text with font selection
- Overlay icons from a preset library
- Download the customized design as PNG

### 2. Live Search

- **Dropdown Search**: Type 2+ characters to see instant product suggestions
- **Full Search Page**: Press Enter or click "View all results"
- API endpoint: `/api/search?q=your-query`

### 3. Product Management

Products in Sanity support:
- **Variants**: Multiple color options with images
- **Badges**: New, Bestseller, Sale, Limited Edition, etc.
- **Categories**: For filtering and navigation
- **Collections**: Curated product groupings
- **Gallery Images**: Additional product photos
- **Etsy Link**: Direct purchase link

## Design System

### Colors

```css
--primary: #0FABCA (cyan)
--background: oklch(0.9940 0 0)
--foreground: oklch(0 0 0)
--muted: oklch(0.9702 0 0)
```

### Typography

- **Headings**: Plus Jakarta Sans
- **Body**: System font stack
- **Border Radius**: 0.75rem (12px)

### Components

The project uses shadcn/ui components with custom styling. Available components:

- Accordion, Alert, Avatar, Badge, Button, Card, Dialog, Dropdown Menu
- Input, Label, Select, Separator, Tabs, Tooltip, Skeleton
- And more from the shadcn registry

## Performance Optimizations

- **Static Generation**: Products pages use ISR with 1-minute revalidation
- **Image Optimization**: Next.js Image with Sanity CDN domains configured
- **Code Splitting**: Automatic with Next.js App Router
- **CSS Optimization**: Tailwind CSS v4 with @import syntax

## Deployment

### Vercel (Recommended)

```bash
vercel deploy
```

### Other Platforms

1. Build the application:
```bash
bun run build
```

2. Start the production server:
```bash
bun run start
```

The application will be available at `http://localhost:3000`.

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID | Yes |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset name | Yes |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Sanity API version | Yes |

## Troubleshooting

### Images Not Displaying

1. Check Sanity project configuration in `.env.local`
2. Verify products have variants with images in Sanity Studio
3. Ensure Sanity CDN domains are in `next.config.ts`

### Build Errors

1. Clear `.next` folder: `rm -rf .next`
2. Reinstall dependencies: `rm -rf node_modules && bun install`
3. Check for TypeScript errors: `bun run lint`

### Sanity Studio Issues

1. Verify environment variables are set
2. Run schema deploy: `bunx sanity@latest schema deploy`
3. Check schema types match queries in `src/sanity/queries.ts`

## License

This project is open source and available under the MIT License.

## Credits

- Built with [Next.js](https://nextjs.org)
- Content managed with [Sanity](https://www.sanity.io)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)
- Fonts from [Vercel](https://vercel.com/font) and [Google Fonts](https://fonts.google.com)
