---
name: autonomous-seo-blogger
description: Universal autonomous SEO, deep research, content writing, multi-image visual generation/fetching, and publishing engine. Use this skill whenever the user asks to write, research, generate, or publish a blog post, article, or SEO content for ANY project. Integrates Composio MCP (Google Search Console, Google Analytics, social listening, syndication), Ubersuggest MCP, Sanity MCP (with direct image URL upload & AI generation), ScrapeGraph/TinyFish MCP (competitor & image extraction), image-generator subagent, Google Developer Knowledge MCP, and BeyondSEO skill to deliver visually stunning, maximum-ranking E-E-A-T content, custom infographics, and verified production deployments.
---

# Autonomous SEO & Content Architecture Engine

A universal, project-adaptive system that orchestrates the entire lifecycle of high-ranking content—from live market research, search intent extraction, and social listening to native CMS publishing, custom visual asset generation, and verified production deployment across **any codebase or business domain**.

---

## 🧭 The 7-Phase Autonomous Quality Gate

When triggered (e.g. *"Write a blog post"*, *"Research and publish an article"*, *"Target this keyword"*, or on an autonomous recurring schedule), you MUST execute these 7 phases strictly in sequence:

```
[Phase 1: Project & Data Profiling]
                 ↓
[Phase 2: Multi-MCP Market Intelligence & Social Listening]
                 ↓
[Phase 3: High E-E-A-T Editorial Architecture]
                 ↓
[Phase 4: Branded Visual Assets & Infographics]
                 ↓
[Phase 5: Programmatic Native CMS Publishing]
                 ↓
[Phase 6: Multi-Channel Amplification & Logging (Composio)]
                 ↓
[Phase 7: Build Verification, Deployment & Health Check]
```

---

### Phase 1: Dynamic Project, Codebase & Database Profiling
*Before drafting content, establish ground-truth context and industry domain from the active workspace:*

1. **Detect Business Archetype & Domain Context:**
   - Inspect `package.json`, `README.md`, homepage copy, or site navigation to determine the project's archetype:
     - **SaaS / Cloud / DevTools:** Focus on technical architecture, developer tutorials, performance benchmarks, API integrations, and code snippets.
     - **E-Commerce / Consumer Retail:** Focus on buyer comparisons ("A vs B"), ingredient/material breakdowns, durability, live pricing, stock availability, and hands-on testing.
     - **B2B / Professional Services / Agencies:** Focus on ROI metrics, case studies, regulatory compliance, methodology walkthroughs, and client FAQs.
     - **Editorial / Media / Publishing:** Focus on deep investigative reporting, topical authority, comprehensive pillar guides, and statistical roundups.
   - Extract the brand's unique value proposition, target customer demographics, and brand tone of voice (e.g. technical authority, warm conversational, luxury editorial, or clinical/objective).
2. **Detect Tech Stack & Framework:**
   - Inspect `package.json` or root directory (Next.js App Router, Pages Router, Astro, Nuxt, Remix, Gatsby, SvelteKit, static HTML).
3. **Detect Content Management Layer:**
   - **Sanity CMS:** Check for `sanity.config.ts`, `.env.local` (`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`), schema files in `schemaTypes/` or `schemas/`.
   - **Markdown / MDX:** Check for `content/posts/`, `src/content/blog/`, or similar markdown folders.
   - **Headless APIs / Supabase / Custom DB:** Detect client endpoints and data fetching utilities.
4. **Inspect Database & Product/Service Catalog (Live Truth):**
   - If Postgres/Neon, BigQuery, or Supabase is used, query entity tables via `mcp-server-neon` or local files (e.g. `products.ts`, `services.json`, `plans.ts`) to obtain authentic pricing, in-stock items, ratings, and customer reviews.
5. **Enforce Cannibalization Guard:**
   - Query the CMS via Sanity MCP (`Sanity:query_documents`) or read the local blog repository to harvest all published slugs, titles, and target keywords.
   - **Rule:** Never duplicate an existing slug, primary keyword, or primary search intent. Target open, high-yield content gaps.

---

### Phase 2: Multi-MCP Market Intelligence & Social Listening
*Mandatory: Never write based on assumptions or static lists. Ground every article in live data:*

1. **Composio MCP Integration (GSC, Analytics, Social Listening):**
   - **Google Search Console (`google_search_console`)**:
     - Query search analytics via Composio to identify **"Striking Distance" keywords** (positions 4.0 to 20.0 with high impressions and low CTR). These yield the fastest organic traffic gains.
   - **Google Analytics (`google_analytics`)**:
     - Check top landing pages and user engagement to prioritize content formats that convert best.
   - **Social & Community Listening (Reddit, Twitter/X, Forums)**:
     - Search community discussions via Composio to capture raw customer vocabulary, real-world objections, frustrations, and authentic questions that standard SEO tools overlook.
   - *Reference:* Read [Composio Playbook](file:///C:/Users/HUZAIFA/.gemini/config/skills/autonomous-seo-blogger/references/composio-playbook.md).
2. **Ubersuggest MCP Integration:**
   - Verify connection via `ubersuggest:auth_status`.
   - Run `ubersuggest:google_suggestions` and `ubersuggest:keyword_suggestions` using high-intent seed phrases.
   - Run `ubersuggest:serp_analysis` to inspect Page 1 ranking competitors, domain authority, and content gaps.
   - Establish:
     - **Primary Keyword:** High intent, Search Volume > 100, SEO Difficulty < 40.
     - **4–6 Secondary/LSI Keywords:** Semantic variations, buyer questions, long-tail qualifiers.
3. **ScrapeGraph / TinyFish MCP (Deep Extraction):**
   - Use `scrapegraph-mcp:extract` or `tinyfish:fetch_content` on the top 2–3 competitor URLs on Page 1.
   - Extract their heading outlines, word counts, covered dimensions, and identifying weaknesses (e.g., missing comparison tables, outdated pricing, lack of direct answers).
4. **BeyondSEO Skill Alignment:**
   - Map search intent (Informational, Commercial Investigation, Transactional).
   - Formulate E-E-A-T proof points: real wear-test benchmarks, climate performance, and expert attribution.
5. **Google Developer Knowledge MCP:**
   - Verify compliance with Google's latest Search Essentials, Helpful Content criteria, and structured data specifications.
   - *Reference:* Read [MCP Context Ecosystem](file:///C:/Users/HUZAIFA/.gemini/config/skills/autonomous-seo-blogger/references/mcp-context-ecosystem.md).

---

### Phase 3: High E-E-A-T Authority Editorial Content Architecture
*Write a comprehensive, authority pillar article (1,500+ words) designed for Google Search and AI Overviews:*

1. **Google AI Overview & Position 0 Direct Answer Lead:**
   - The opening 40–50 words (immediately below H1) MUST directly, objectively answer the core query in bold text, followed by the decisive distinguishing factor.
2. **Semantic Heading & TOC Hierarchy:**
   - Single `H1` (Title containing primary keyword + CTR hook).
   - Logical `H2` and `H3` sections formatted for dynamic Table of Contents components.
3. **Side-by-Side Comparison Matrices & Data Tables:**
   - Every product or topic comparison must feature a structured comparison table (metrics, price, performance, suitability, pros/cons).
4. **Actionable Depth & Real Value:**
   - Practical step-by-step guidance, dimensional/statistical benchmarks, and expert commentary.
   - Authentic pull-quotes capturing artisanal or domain principles.
5. **Google "People Also Ask" (PAA) FAQ Section:**
   - 4 to 5 direct customer questions mined from GSC, Reddit, and Ubersuggest with concise, clear answers formatted for `FAQPage` schema.
6. **Contextual Internal Linking & Deep Backlink Architecture:**
   - **Internal Backlinks:** Build a dense link mesh by contextually linking to target product catalog pages (`/product/[id]`), brand hubs (`/brands/[slug]`), and category collections (`/collections/[slug]`). Cross-link to related buying guides (`/guides/[slug]`) and journal articles to circulate topical authority.
   - **External Authority Citations:** Link out to official manufacturer listings (e.g. official Lattafa UAE, Ahmed Al Maghribi official UAE portals) to demonstrate rigorous source verification and establish strong Google E-E-A-T trust signals.
7. **Multi-Keyword Architecture for Organic Customers & AI Search Engines (AEO/GEO):**
   - **Organic Buyer Intent:** Cluster high-intent transactional and commercial queries (`"price in pakistan"`, `"notes"`, `"longevity"`, `"original vs fake"`, `"cash on delivery"`, `"dupe of"`, `"review"`).
   - **Generative Engine Optimization (GEO/AEO):** Format definitions and direct answers so AI engines (Google AI Overviews, Perplexity, ChatGPT Search) parse key entities and cite the article as the canonical source.
   - *Reference:* Read [Schema & E-E-A-T Templates](file:///C:/Users/HUZAIFA/.gemini/config/skills/autonomous-seo-blogger/references/schema-eeat-templates.md).

---

### Phase 4: Multi-Image Visual Architecture, Authentic Assets & Knitty Petit / E-Commerce Protocol
*Never publish an article with only 1 image. Maximize visual appeal and Google Image rankings with a minimum of 4–6 strategic, authentic, high-resolution visual assets:*

1. **Mandatory Authenticity Protocol (Knitty Petit & Retail Standards):**
   - **Real & Authentic Product Photography MUST Be Used:** For Knitty Petit (Hassan Crochet) and any product e-commerce brand, **ALWAYS use authentic, real product images** drawn directly from verified project assets (`/public/`, `/public/assets/images/`), Sanity CDN, or official catalog galleries.
   - **Zero Alteration / Non-Distortion Mandate:** Do NOT modify, alter, distort, crop awkwardly, or apply synthetic generative filters over real hand-embroidered knitwear, stitch textures, yarn palettes, or branded packaging. Authentic buyers, Google Image search, and AI vision crawlers demand visual truth to inspect yarn fibers, embroidery stitch precision, ribbed cuff elasticity, and personalized name lettering.
   - **Strategic Multi-Image Deployment (4–6 Authentic Assets Minimum Per Post):**
     - **Asset 1: Atmospheric Editorial Hero (16:9 / 1:1)**: Cozy nursery setting, baby sweater flatlay on oak or linen surface with soft natural daylight.
     - **Asset 2: Dual Comparison Pair (`pair`)**: 1:1 side-by-side showcase (e.g. Chunky Knit vs Fine Gauge, Organic Cotton vs Merino Wool, or Name Font A vs Font B) with clear descriptive labels.
     - **Asset 3: Packaging & Gift-Ready Unboxing Gallery**: Multi-image grid showing tissue wrap, satin ribbon ties, personalized birth announcement tags, and kraft gift box presentation.
     - **Asset 4: High-Res Macro Stitch / Embroidery Close-Up**: High-resolution macro shot highlighting handmade chain stitches, yarn twist, tension uniformity, and collar ribbing.
     - **Asset 5: Custom Programmatic Infographic (1600×1100 Sharp/SVG)**: High-density sweater sizing chart (0–3M through 4T), delicate garment wash & blocking temperature matrix, or custom color combination palette rendered in Knitty Petit pastel brand tones.
     - **Asset 6: Contextual In-Situ / Real-World Milestone Visual**: Baby or toddler wearing personalized name sweater in a nursery milestone photoshoot or seasonal celebration.

2. **Fetching Authentic Images from the Internet:**
   - **Official Asset Discovery via ScrapeGraph / TinyFish:** Use `tinyfish:fetch_content` or `scrapegraph-mcp:extract` on official vendor portals, documentation sites, manufacturer press kits, or brand portals to extract high-res official product packshots, architectural diagrams, and verified assets.
   - **Direct CMS Ingestion via Sanity MCP URL Tools:** Ingest external high-res images directly into Sanity using `Sanity:media_library_upload_from_url` or `Sanity:dataset_assets_upload_from_url` without downloading locally.
   - **Local Asset Harvesting:** Download and store in `public/assets/images/` using hyphenated, keyword-rich filenames.

3. **AI Image Generation & Editing Workflows:**
   - **`image-generator` Subagent:** Invoke the `image-generator` subagent for bespoke, photorealistic lifestyle or conceptual shots, specifying lighting, composition, texture, and brand palette.
   - **Sanity AI Generation:** Call `Sanity:generate_image` or `Sanity:transform_image` for headless CMS asset generation and focal crop adjustments.
   - **Sharp / SVG Infographic Pipeline:** Render custom 1600×1100 SVGs with brand typography, then compile into WebP/PNG via Sharp for flawless vector clarity.

4. **Google Image SEO & Visual Ranking Optimization:**
   - **Descriptive Alt Text Formula:** Every image MUST have descriptive, keyword-rich alt text: `[Subject/Entity] + [Angle/Specific Feature] + [Keyword Context]` (e.g. `alt="Next.js App Router vs Pages Router architecture benchmark comparison diagram"` or `alt="Ergonomic mechanical keyboard with hot-swappable switches on walnut workspace"`).
   - **SEO Filenames:** Always rename images with lowercase, hyphen-separated keywords (e.g., `nextjs-vs-remix-performance-benchmarks.webp` or `cloud-database-latency-comparison.webp`).
   - **Responsive WebP Formatting:** Compress images to modern WebP with responsive widths (`320px`, `640px`, `800px`, `1080px`, `1600px`).
   - **CLS Elimination:** Always specify explicit `width` and `height` dimensions on image elements to pass Core Web Vitals.
   - **Structured Data:** Embed an array of `ImageObject` in the JSON-LD payload.
   - *Reference:* Read [Visual Media Pipeline](file:///C:/Users/HUZAIFA/.gemini/config/skills/autonomous-seo-blogger/references/visual-media-pipeline.md).

---

### Phase 5: Programmatic Native CMS Publishing
*Publish directly into the project's content system:*

- **For Sanity CMS:**
  - Inspect schemas via `Sanity:get_schema`.
  - Upload hero and infographic assets via `Sanity:media_library_upload_from_file` or `Sanity:dataset_assets_upload_from_file`.
  - Build valid PortableText blocks (headings, spans, marks, links, callout blocks, tables).
  - Draft and publish using `Sanity:create_documents` and `Sanity:publish_documents` (or fallback to Sanity Mutate API if offline).
- **For Markdown / MDX:**
  - Write frontmatter (title, slug, date, author, category, excerpt, hero image, SEO keywords) + full markdown body into the appropriate content directory.
- **For TypeScript/Code-Based CMS:**
  - Append the structured article object to the project's content file (e.g., `src/lib/content/blog.ts`).
- **Structured Data Integration:**
  - Ensure `BlogPosting`, `BreadcrumbList`, and `FAQPage` JSON-LD schemas are generated for the article route.

---

### Phase 6: Multi-Channel Amplification & Logging (Composio)
*Amplify the content immediately post-publication:*

1. **Google Sheets Sync (`googlesheets` via Composio):**
   - Append a row to the content calendar/SEO tracker with publication date, slug, primary keyword, volume, word count, and live URL.
2. **Google Search Console (`google_search_console` via Composio):**
   - Submit the new URL for inspection or record it in the indexing monitoring list.
3. **Social Derivative Generation:**
   - **X / Twitter Thread**: 5-tweet educational thread breaking down the core infographic/verdict.
   - **LinkedIn Post**: Industry-level summary for professionals.
4. **Team Notification (Slack / Discord via Composio):**
   - Send a formatted publication alert to the team channel with the article title, targeted keywords, and preview image.

---

### Phase 7: Build Verification, Deployment & Health Check
*Guarantee 100% production health before declaring completion:*

1. Run the project's type checker (`npx tsc --noEmit` or equivalent) to confirm 0 TypeScript errors.
2. Run the project's build command (`npm run build`, `bun run build`, etc.) to confirm successful static generation.
3. Verify that `sitemap.xml`, `robots.txt`, and `llms.txt` reflect the newly published post.
4. Stage modified files and newly generated assets.
5. Commit with semantic message: `feat(blog): publish [slug]`.
6. Run `git push origin <branch>` so CI/CD (Vercel / Netlify / Cloudflare) automatically deploys the updated site.

---

## 🛠️ MCP & Skill Synergy Matrix

| Task | Primary Tool / MCP | Secondary / Fallback Tool |
|---|---|---|
| Striking-Distance Keywords | Composio (`google_search_console`) | Ubersuggest (`domain_keywords`) |
| Real User Objections & Nuance | Composio (Reddit / Twitter / Forums) | Web search / FAQ mining |
| Search Volume & Keyword Difficulty | Ubersuggest (`keyword_suggestions`) | Composio Google Search Console |
| Page 1 Competitor Analysis | Ubersuggest (`serp_analysis`) | ScrapeGraph MCP / TinyFish MCP |
| Deep Competitor Content Scraping | ScrapeGraph (`extract`) | TinyFish (`fetch_content`) |
| High-Res Web Asset Discovery | TinyFish (`fetch_content`) | ScrapeGraph (`scrape`) |
| Direct Web Image Ingestion | Sanity (`media_library_upload_from_url`) | Local curl & Sharp processing |
| Bespoke AI Lifestyle Imagery | `image-generator` Subagent | `Sanity:generate_image` |
| Vector Infographics (1600×1100) | Programmatic SVG + Sharp Pipeline | Canvas / HTML export |
| Official Search Guidelines | Google Developer Knowledge MCP | BeyondSEO Skill |
| CMS Schema & Direct Publishing | Sanity Native MCP | Project API / Mutate HTTP |
| Database & Catalog Truth | Neon Postgres MCP / Datacloud | Local product files (`products.ts`) |
| E-E-A-T & Competitor Audits | BeyondSEO Skill | Manual E-E-A-T rubric |
| Codebase Architecture Discovery | Graphify Skill | File system inspection |
| Content Pipeline Logging | Composio (`googlesheets`) | Local markdown log |
| Multi-Channel Social Amplification | Composio (Social toolkits) | Markdown social drafts |

---

## 🛡️ Guardrails & Safety Rules

- **Zero Cannibalization:** Never publish a post that competes with an existing ranking page for the same keyword or search intent.
- **Authentic Product Image Integrity (Knitty Petit & Retail):** For Knitty Petit (`knitty-petit.vercel.app` / Hassan Crochet) and e-commerce product catalogs, **ALWAYS use genuine, unaltered product, yarn, and packaging photography** sourced directly from the project's local assets or verified client photo galleries. Never modify real stitch details, distort personalized embroidery lettering, or use synthetic hallucinations for handmade inventory.
- **Multi-Image Standard (4–6 Visual Assets):** Articles must feature 4 to 6 strategic, high-resolution visual assets (atmospheric hero, dual comparison pair, unboxing packaging gallery, flacon close-ups, and custom 1600×1100 vector infographic) with keyword-rich alt text and descriptive captions.
- **Deep Backlink Topology:** Every published article must contain a minimum of 4–6 contextual internal backlinks (linking to specific product pages, brand hubs, buying guides, and collections) and external citations to official manufacturer listings.
- **Evidence-First Claims:** Never invent search volumes, product specifications, or clinical claims. Always anchor metrics in live MCP results or database queries.
- **Zero Build Breaks:** An article is NEVER complete if `tsc --noEmit` or `npm run build` fails. Always resolve build issues before committing.
- **Graceful Tool Degradation:** If an MCP connection is temporarily unauthorized or unavailable, log the limitation clearly and pivot to the defined secondary tool without halting the workflow.

---

## 📚 Specialized References

- [Visual Media Pipeline](file:///C:/Users/HUZAIFA/.gemini/config/skills/autonomous-seo-blogger/references/visual-media-pipeline.md): Multi-image deployment rules, web asset scraping, AI image generation, and Google Image SEO.
- [Composio Playbook](file:///C:/Users/HUZAIFA/.gemini/config/skills/autonomous-seo-blogger/references/composio-playbook.md): Complete guide to GSC queries, social listening, Sheets logging, and social amplification.
- [MCP Context Ecosystem](file:///C:/Users/HUZAIFA/.gemini/config/skills/autonomous-seo-blogger/references/mcp-context-ecosystem.md): Deep-dive integration with Ubersuggest, Sanity, ScrapeGraph, TinyFish, and Neon.
- [Schema & E-E-A-T Templates](file:///C:/Users/HUZAIFA/.gemini/config/skills/autonomous-seo-blogger/references/schema-eeat-templates.md): Ready-to-use JSON-LD schemas and Position 0 featured snippet formulas.
