# MCP Context Ecosystem & Skill Integration Guide

The autonomous SEO blogger harnesses an interconnected matrix of specialized MCP servers and skills to achieve absolute factual accuracy, optimal search engine compliance, and native content publishing.

---

## 1. Tool Routing Matrix

| MCP / Skill | Primary Responsibility | Key Tools / Commands | Output Artifact / Benefit |
|---|---|---|---|
| **Composio MCP** | Real-world search queries, social listening, omni-channel distribution | `COMPOSIO_SEARCH_TOOLS`, `COMPOSIO_MULTI_EXECUTE_TOOL` | Striking-distance keywords, raw customer objections, Slack alerts, Sheets sync |
| **Ubersuggest MCP** | Keyword discovery, search volume, difficulty, SERP analysis | `google_suggestions`, `keyword_suggestions`, `serp_analysis`, `backlink_opportunity` | Primary & LSI keywords, search volume, difficulty score (<35 target), SERP competitor gaps |
| **Sanity Native MCP** | Direct schema inspection, asset upload, content creation & publishing | `get_schema`, `query_documents`, `media_library_upload_from_file`, `create_documents`, `publish_documents` | Native PortableText post generation, zero-curl CMS publishing, live asset uploads |
| **ScrapeGraph / TinyFish MCP** | Deep web scraping, competitor structure extraction, primary source verification | `scrapegraph:extract`, `scrapegraph:scrape`, `tinyfish:fetch_content`, `tinyfish:start_deep_research` | Competitor outlines, missing subtopics, factual data tables, exact manufacturer specifications |
| **Google Developer Knowledge MCP** | Official Google Search Guidelines, Structured Data specs, Core Web Vitals | `search_documents`, `answer_query` | Compliant Schema.org JSON-LD templates, Helpful Content criteria, AEO guidelines |
| **Neon Postgres / Datacloud MCP** | Live database & catalog truth (pricing, stock, reviews, ratings) | `run_sql`, `describe_table_schema`, `get_database_tables` | Authentic product attributes, customer review quotes, real-time stock and pricing |
| **BeyondSEO Skill** | Evidence-backed profiling, competitor cohorts, reputation scoring | `beyondseo crawl`, `playbooks/core/friendly-advisor.md`, `references/reputation.md` | Non-speculative keyword verification, E-E-A-T framing, entity SEO alignment |
| **Graphify Skill** | Codebase architecture and relationship mapping | `graphify-out/`, knowledge graph queries | Contextual understanding of project components, models, and helper utilities |

---

## 2. MCP Detailed Operations

### A. Ubersuggest MCP: Deep Keyword Intelligence
- **Step 1: Authenticate & Validate**:
  Call `ubersuggest:auth_status` to ensure active credentials.
- **Step 2: Seed Query Expansion**:
  Call `ubersuggest:google_suggestions` with high-intent seed words tailored to the detected business archetype (e.g. `["best headless cms for nextjs", "nextjs vs remix", "ergonomic office chair reviews"]`).
- **Step 3: Keyword Metrics Filtering**:
  Call `ubersuggest:keyword_suggestions` or `ubersuggest:keyword_metrics`. Select phrases meeting:
  - Search Volume: > 100 (target market or global depending on scope).
  - SEO Difficulty (SD): < 40 (prioritize < 30 for instant ranking potential).
  - High Intent: Clear commercial investigation ("vs", "review", "best") or informational guide ("how to", "architecture", "pricing").
- **Step 4: SERP Gap Detection**:
  Run `ubersuggest:serp_analysis` on the top query. Examine the top 5 ranking URLs:
  - Do they lack structured comparison tables?
  - Are they outdated (published > 1 year ago)?
  - Do they omit essential pricing or real-world testing?
  - **Your goal**: Build the definitive pillar article that fulfills every missing element.

### B. Sanity Native MCP: Seamless CMS Automation
*When the project uses Sanity Studio, leverage the native Sanity MCP tools instead of raw HTTP requests:*
- **Inspect Schemas**:
  Call `Sanity:get_schema` or `Sanity:list_workspace_schemas` to understand fields for `post`, `author`, `category`, and `product`.
- **Cannibalization Guard (GROQ Query)**:
  Call `Sanity:query_documents` with:
  ```groq
  *[_type == "post"]{ "slug": slug.current, title, "category": category->title, publishedAt }
  ```
  Ensure your proposed slug and target keyword do not clash with existing content.
- **Asset Upload & URL Ingestion (Multi-Image Pipeline)**:
  - Upload local files: Call `Sanity:media_library_upload_from_file` or `Sanity:dataset_assets_upload_from_file`.
  - Ingest directly from verified web URLs: Call `Sanity:media_library_upload_from_url` or `Sanity:dataset_assets_upload_from_url` to stream official manufacturer images directly to Sanity CDN without local disk bloat.
  - Generate or transform images: Call `Sanity:generate_image` for custom AI concepts or `Sanity:transform_image` for multi-aspect ratio crops.
- **Draft & Publish**:
  Call `Sanity:create_documents` followed by `Sanity:publish_documents` to push valid PortableText blocks directly to the dataset.

### C. ScrapeGraph & TinyFish MCP: Competitor Intelligence & Visual Asset Discovery
*Never rely on search snippets alone for factual depth or imagery:*
- **Web Asset Discovery**:
  - Call `scrapegraph-mcp:extract` or `tinyfish:fetch_content` to extract high-resolution image URLs, packshots, and note pyramids directly from brand and distributor sites.
- **Competitor Breakdown**:
  - Extract competitor headings (H2, H3), estimated word counts, comparison matrices, and FAQ sections.
- Synthesize this raw data to create richer, more authentic multi-image comparisons than any competitor on Page 1.

### D. Google Developer Knowledge MCP: Search Engine Standards
*Maintain strict compliance with Google's search engineering standards:*
- Call `google-developer-knowledge:search_documents` with queries like:
  - `"Google search structured data article blogposting requirements"`
  - `"Google helpful content guidelines E-E-A-T self-assessment questions"`
  - `"Google Search FAQPage structured data restrictions"`
- Use official guidelines to structure schemas and avoid algorithmic penalties.

### E. Neon Postgres / Datacloud MCP: Catalog & Inventory Truth
*If products, service plans, or transactions are stored in a database:*
- Execute read-only SQL queries via `mcp-server-neon:run_sql`:
  ```sql
  SELECT id, name, price, rating, stock_status, attributes FROM products WHERE is_active = true LIMIT 10;
  ```
- Incorporate exact prices, stock availability badges, and customer ratings into product comparison cards embedded in the article.

---

## 3. BeyondSEO Skill Synergy
1. **Evidence Over Assumptions**: Never assert that a phrase has high traffic or that a competitor ranks without live data from Ubersuggest, GSC, or a native crawl.
2. **Customer Intent Alignment**: Group search queries into:
   - *Problem Awareness*: e.g. "Why does database latency spike under load?", "How to structure Next.js blogs"
   - *Solution Comparison*: e.g. "PostgreSQL vs MongoDB for analytics", "Framework A vs Framework B"
   - *Transactional Verification*: e.g. "Pricing tier breakdown", "Enterprise SLA and licensing review"
3. **E-E-A-T Proof**: Always ground the article with concrete details: load test benchmarks, real-world execution speeds, durability assessments, and verified practitioner credentials.
