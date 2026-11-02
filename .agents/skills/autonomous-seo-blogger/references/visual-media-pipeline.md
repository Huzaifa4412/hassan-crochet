# Multi-Image Visual Architecture, AI Generation & Web Sourcing Playbook

Modern high-ranking articles require rich, multi-sensory visual storytelling. Google's Search Generative Experience, Google Lens, and Google Discover heavily favor content with **multiple high-resolution, context-specific images** that answer user queries visually.

---

## 1. The Multi-Image Rule (Minimum 3–5 Visual Assets Per Article)

Never publish an article with only a single hero image. Every authority pillar article must deploy **at least 3 to 5 distinct, purposeful visual assets** distributed across key semantic sections:

```
[1. Hero Header Banner (16:9)] ➔ Sets atmosphere & primary entity identity
                 ↓
[2. Side-by-Side Comparison Pair (1:1 or 4:5)] ➔ Direct visual contrast of variants/options
                 ↓
[3. Programmatic Custom Infographic (16:10)] ➔ Complex data matrix, decision tree, or note pyramid
                 ↓
[4. Detail & Authenticity Close-Up (1:1)] ➔ Texture, atomizer, batch code, or hardware specs
                 ↓
[5. Contextual In-Situ / Lifestyle Visual (16:9 or 3:2)] ➔ Real-world occasion, styling, or application
```

---

## 2. Web Image Fetching & Internet Asset Sourcing

When writing about real-world products, brands, or entities, authentic brand photography and manufacturer press kits drastically elevate E-E-A-T.

### A. Discovering Official Image URLs via ScrapeGraph & TinyFish
1. **Locate Official Assets**:
   Use `tinyfish:fetch_content` or `scrapegraph-mcp:extract` on official vendor portals, documentation sites, brand press rooms, or product galleries:
   ```json
   {
     "url": "https://official-brand-portal.com/product-or-tech-page",
     "prompt": "Extract all high-resolution product image URLs, architecture diagrams, packshots, and editorial banners from the page."
   }
   ```
2. **Filter for Quality**:
   - Discard low-res thumbnails (< 800px).
   - Retain full-bleed studio product shots, technical architecture diagrams, and editorial banners.

### B. Direct Ingestion via Sanity CMS URL Tools
If using Sanity CMS, never download and re-upload manually. Use the native URL ingestion tools:
- **`Sanity:media_library_upload_from_url`**: Ingests directly from the external image URL into the Sanity Media Library with metadata.
- **`Sanity:dataset_assets_upload_from_url`**: Uploads image asset directly into the Sanity Content Lake, returning an asset `_id` ready for PortableText and document patching.

### C. Local Workspace Ingestion & Optimization
If using local static assets (`public/assets/images/`):
- Download high-res originals using a Node.js / fetch script or curl:
  ```bash
  curl -s -L -o public/assets/images/product-original.jpg "https://source-url.com/highres.jpg"
  ```
- Process through the local Sharp pipeline to convert to WebP, generate multi-resolution responsive variants (`320px`, `640px`, `800px`, `1080px`, `1254px`), and compress without visual loss.

---

## 3. AI Image Generation & Editing Workflows

When custom lifestyle, abstract concepts, or proprietary brand aesthetics are required, use AI generation tools:

### A. The `image-generator` Subagent
- Delegate high-fidelity lifestyle or conceptual generation to the `image-generator` subagent:
  - Specify the precise artistic direction, lighting, composition, and color palette matching the project's brand identity.
  - *Tech/SaaS Example:*
    > "Generate a photorealistic modern developer workstation with dual ultrawide monitors displaying code and cloud infrastructure metrics, warm evening ambient backlighting, architectural desk plant, 16:9 aspect ratio."
  - *Consumer/Product Example:*
    > "Generate a photorealistic luxury studio product shot of two competing flagship devices standing side-by-side on a textured dark granite pedestal, crisp dramatic rim lighting, sharp focus, 16:9 aspect ratio."
- The subagent saves the asset to the project directory and returns the exact relative path.

### B. Sanity AI Generation (`Sanity:generate_image` & `Sanity:transform_image`)
- For projects integrated with Sanity Studio AI:
  - Call `Sanity:generate_image` with prompt and aspect ratio.
  - Call `Sanity:transform_image` to crop, resize, or adjust focal points for mobile vs. desktop responsiveness.

### C. Sharp / SVG Programmatic Infographics
- For comparison matrices, architectural diagrams, workflows, and performance charts, programmatic SVG-to-PNG renders ensure 100% crisp, error-free typography that AI generators often garble:
  - Generate a 1600×1100 SVG file using the project's brand colors (e.g. brand primary `#0f172a`, accent `#3b82f6`, surface `#f8fafc`).
  - Convert to high-res PNG/WebP via `sharp`:
    ```javascript
    import sharp from 'sharp';
    await sharp('infographic.svg').png({ quality: 95 }).toFile('public/assets/images/infographic.webp');
    ```

---

## 4. Google Image SEO & Visual Search Optimization Checklist

To rank in Google Image Search, Google Lens, and AI Overviews, every image must fulfill these technical SEO criteria:

| SEO Requirement | Rule & Standard | Correct Example | Poor Example |
|---|---|---|---|
| **File Naming** | Lowercase, hyphen-separated, descriptive keywords | `nextjs-app-router-vs-pages-router-benchmarks.webp` | `IMG_0921.jpg` / `photo.png` |
| **Alt Text** | Specific entity + distinctive angle/feature + keyword context | `alt="Next.js App Router vs Pages Router architecture benchmark comparison table"` | `alt="diagram"` or stuffed `alt="best code discount buy"` |
| **Next-Gen Format** | Modern WebP or AVIF format (compression savings > 60%) | `.webp` | Uncompressed `.png` (> 3MB) |
| **Aspect Ratios** | 16:9 for banners, 1:1 or 4:5 for product shots, 16:10 for infographics | `width={1600} height={900}` | Distorted stretching |
| **CLS Prevention** | Explicit `width` and `height` attributes on HTML `<img>` tags | `<img width="1200" height="800" ... />` | `<img>` without dimensions |
| **Lazy Loading** | `loading="lazy"` on all below-the-fold images (`priority` on Hero only) | Next.js `<Image priority />` on Hero, default lazy on remainder | Eager loading all images |
| **Captions** | Visible contextual caption (`<figcaption>`) beneath complex charts | `<figcaption>Figure 1: Performance latency benchmarks across 1,000 concurrent requests</figcaption>` | No caption |

---

## 5. Multi-Image Layout Architectures in Code

### A. The 2-Column Comparison Pair (`pair`)
For "Option A vs Option B" articles, render a dedicated comparison strip early in the post:
```typescript
pair: {
  left: {
    src: '/assets/images/option-a-flagship-showcase.webp',
    alt: 'Option A flagship model front and side profile',
    label: 'Option A · Core Strengths & Key Specs',
  },
  right: {
    src: '/assets/images/option-b-flagship-showcase.webp',
    alt: 'Option B flagship model front and side profile',
    label: 'Option B · Alternative Strengths & Key Specs',
  },
}
```

### B. Inline Structured Image Object in PortableText (Sanity)
```json
{
  "_type": "image",
  "asset": {
    "_type": "reference",
    "_ref": "image-assetId-1600x1100-webp"
  },
  "alt": "Comprehensive feature matrix and performance comparison chart between Option A and Option B",
  "caption": "Benchmark testing data conducted across real-world workloads (2026)",
  "hotspot": { "x": 0.5, "y": 0.5 }
}
```

### C. Multi-Image Schema.org `ImageObject` Array
In JSON-LD structured data, include all significant images in the `@graph`:
```json
"image": [
  {
    "@type": "ImageObject",
    "url": "https://example.com/assets/images/hero.webp",
    "width": 1600,
    "height": 900,
    "caption": "Option A vs Option B complete visual comparison"
  },
  {
    "@type": "ImageObject",
    "url": "https://example.com/assets/images/architecture-infographic.webp",
    "width": 1600,
    "height": 1100,
    "caption": "System architecture flowchart and performance benchmark matrix"
  }
]
```
