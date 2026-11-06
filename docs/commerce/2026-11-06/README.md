# Cart, Etsy checkout, measurement, and SEO — 6 November 2026

Deployed to **https://www.knittypetit.shop** on 6 November 2026. Payment remains on Etsy. No order, charge, or external message was made. The initial screenshots show a local QA design (Mila + Heart); the live verification used Demo + Heart at $44 and removed that sample from the browser cart afterward. [Production release record](meta-release.json), [sanitized live requests](live-events.json), [live checkout screenshot](checkout-live.png).

Production source: commit `48585ec4e3e5308cb63512f6b18e00b658654a7c` on `codex/cart-checkout-meta-events-20261106`, deployment `dpl_7NzZdzurU9yGtFJh8NtbUMAiUphb`, READY with the www and apex aliases assigned. The release branch has not been merged into master.

## Shopping behavior

- Product customization now saves a design into a persistent, versioned browser cart. The snapshot reads actual canvas lettering, fonts, colors, icons, and placement, rather than the most recently selected controls. JPEG previews can be downloaded from checkout.
- Identical product/color/design combinations merge; distinct designs remain separate. Quantities, removal, header count, browser reloads, and cross-tab changes are supported. Limits: 12 designs, 20 units per design, 30 icons per design. Storage failures are visible and do not generate successful add events.
- Personalized designs use the existing $40 name-included price plus $4 per icon. Shipping is free; Etsy confirms taxes, size/options, delivery, availability, and final payment. The $18 unpersonalized 0–3 month offer remains available through the existing Etsy listing; it is not represented as the personalized cart price.
- `/checkout` rechecks the CMS listing and stock flag, derives pricing from shared constants, and only enables validated HTTPS Etsy listing URLs. Client-supplied prices and destination URLs are ignored. This endpoint does not save an order or take payment.
- Every design has copy-details, download-preview, and open-listing controls. Customers manually choose the corresponding Etsy options, paste personalization, set quantity, and add each design to their Etsy basket. The website cart does not automatically transfer to Etsy.
- Fixed the sticky preview covering controls below desktop width, a narrow-screen header overflow, and the mobile search control. Replaced the resetting promotional countdown and unsupported discount wording in the shared header with existing free-shipping information.

## Event contract

| Actual action | Google Analytics | Meta |
| --- | --- | --- |
| View a product | `view_item` | `ViewContent` |
| Save a design / increase quantity | `add_to_cart` | `AddToCart` |
| Remove / decrease quantity | `remove_from_cart` | custom `RemoveFromCart` |
| View a populated cart | `view_cart` | custom `ViewCart` |
| Enter a reviewed, available checkout | `begin_checkout` | `InitiateCheckout` |
| Open an Etsy listing from reviewed checkout | `etsy_checkout_click` | custom `EtsyCheckoutClick` |
| Submit a search and view results | `view_search_results` | `Search` |

Payloads contain product IDs, quantity, price, value, and USD currency. Quantity changes send only their delta. Embroidered names, design JSON, preview images, and copyable personalization details are excluded. Meta standard shopping events receive unique event IDs. There is no configured Conversions API sender; these are browser events, not a claim of browser/server deduplication.

Google ecommerce events queue even when they occur before the Google script loads; Google initializes only once. Meta events now also queue until the inline bootstrap is ready, replacing the previous two-second expiry. Tests cover delayed initialization and repeated queue flushes. Meta route tracking avoids a duplicate initial PageView. Removed duplicate Search events on dropdown submission and renamed product-card listing clicks so they do not inflate checkout starts.

Google page views use the provider's enhanced measurement by default. In the active web stream, keep **Page loads** and **Page changes based on browser history events** enabled. The connected GA tools do not expose these account settings; deployed SPA page_view requests were verified in the network evidence below. If choosing explicit application page views instead, first disable enhanced history/page-load page views, then set `NEXT_PUBLIC_GA_MANUAL_PAGEVIEWS=true`. Do not enable both approaches.

`NEXT_PUBLIC_TRACKING_ENABLED=false` suppresses our Google and Meta tags/events for local browser QA. The browser preview on port 3100 used this flag, so its sample cart activity was not intentionally sent to production analytics. Production builds use the existing configured IDs unless that flag is explicitly disabled. Retain the site's applicable consent configuration when releasing; this change does not introduce a consent manager.

**Purchase limitation:** Etsy payment completion is not observable from a website button or a return visit. `Purchase`, GA4 `purchase`, and `AddPaymentInfo` are deliberately not sent. Paid-order measurement needs a separate verified Etsy order integration with matching attribution and server credentials. No Google Ads conversion action or revenue import was configured.

## Connected-account evidence

- Google Analytics MCP: local measurement ID matches the Knitty Petit web stream under property `562382938`, stream `16271360487`. Another older Knitty Petit property also exists; no settings were changed on either property.
- Search Console MCP: owner access to `https://www.knittypetit.shop/`. The main product URL is submitted and indexed; Google's selected canonical agrees with the website. Reported crawl: 2 November 2026.
- Sitemap: 16 submitted pages, no errors or warnings, not pending. Last reported download/submission: 4 November. Sitemap indexed-count reporting was zero, while individual product inspection explicitly passed; the summary counter is not proof of non-indexing.
- Search performance query for 7 October–3 November 2026 returned no rows. This is not evidence of achieved rankings or traffic gains.
- Meta MCP and Vercel environment verification found different local-preview and production pixels. The actual production pixel is `1232897498603348` (knittypetit), matching the existing Sales-Etsy ad set's promoted pixel. Production was preserved, and the local public pixel was aligned to it. Earlier observations about the local preview dataset were not evidence about production. The production dataset is active and already had historical AddToCart/InitiateCheckout volume before this release.
- Meta account `986091360949043`: ad sets were paused or campaign-paused at inspection. The user clarified that they will edit and run ads after configuration. No campaign, ad set, audience, budget, or bidding setting was changed.
- Eight legacy Manual Event Setup Tool rules were set INACTIVE after the new live flow was verified. These included View on Etsy → InitiateCheckout, Order on Etsy → Lead, title-click → ViewContent, and overlapping customization clicks. A fresh read confirmed all eight statuses. [Before](legacy-rules-before.json), [after](legacy-rules-after.json). They can be restored by setting their recorded IDs ACTIVE if rolling back the website; do not run both the legacy click rules and the replacement application triggers.
- Vercel MCP **All main projects** connection verified the production project and performed the Git-backed deployment. The production deployment is READY and assigned to www.knittypetit.shop and knittypetit.shop.

## SEO and validation

Added nested Product/Offer JSON-LD matching the visible $40 named-sweater offer and current CMS stock flag. Existing page metadata, canonical URLs, breadcrumbs, sitemap, buyer guidance, and internal links remain. Cart and checkout explicitly use noindex and are omitted from the sitemap. No review score or speculative delivery/return-policy markup was added.

- `npm run build`: passed, including TypeScript and 27 generated routes. [Build output](build.txt).
- `npm run test:cart -- http://localhost:3101`: passed against the production server. Checks merging, distinct variants, persistence failures, quantity deltas/limits, corrupt storage, provider payload privacy, Google initialization order, checkout/handoff semantics, server price/URL integrity, noindex, sitemap exclusions, and Product markup. [Test output](cart-tests.txt).
- Changed-file ESLint: zero errors; existing warnings remain in the large product client and search dropdown. [Changed files](changed-files-lint.txt).
- Full `npm run lint`: 33 pre-existing errors and 53 warnings remain elsewhere, including legacy scripts and unused components. [Full output](full-lint.txt).
- Production-server HTTP SEO audit: 16/16 sitemap pages, zero errors, one existing warning about the missing blog route returning streamed HTTP 200 with noindex. A first dev-server audit timed out; the recorded result is from the completed production-server audit. [SEO report](seo-audit.json).
- Browser: actual name + icon saved at $44; quantity two survived reload at $88; removal and empty state worked; checkout copied quantity and personalization; mobile search returned the canonical product. At a 390px viewport, checkout's document and scroll widths were both 390px. Desktop cart and mobile checkout were inspected. Browser console showed no errors during the final flow. [Desktop QA cart](cart-desktop.png), [mobile QA checkout](checkout-mobile.png).

Skills used: Analytics, project Meta Pixel, SEO, frontend design, Sanity best practices, and Vercel React review. Context7 and official Google/Meta documentation informed event semantics; TinyFish inspected the live storefront; connected Composio Google tools and Meta Ads MCP verified account context.

Provider references: [Google ecommerce event reference](https://developers.google.com/analytics/devguides/collection/ga4/reference/events), [Google single-page measurement guidance](https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications), [Meta Pixel event reference](https://developers.facebook.com/documentation/meta-pixel/reference).

## Live acceptance

An authorized QA journey on the production domain saved Demo + Heart, added it to the cart, reviewed checkout, and opened the Etsy listing. It placed no order and made no payment. Network evidence confirms one captured Meta AddToCart, InitiateCheckout, and EtsyCheckoutClick, each accepted with HTTP 200 and $44 USD / quantity 1. Corresponding GA4 add_to_cart, view_cart, begin_checkout, and etsy_checkout_click requests returned HTTP 204. Product IDs and quantities matched the cart. Google batches some events in newline-delimited request bodies; each event was inspected separately. SPA page_view traffic was observed on the route changes.

`npm run test:cart -- https://www.knittypetit.shop` passed against production, including checkout price/URL integrity, noindex, sitemap exclusions, and Product markup. [Live checks](live-cart-tests.txt).

HTTP acceptance confirms delivery to the provider endpoints, not completed ad attribution or dashboard processing. Dashboard visibility can lag. The existing **knittypetit** pixel can use **InitiateCheckout** as the observable checkout-start event; **AddToCart** records saved-cart additions. Confirmed Etsy paid orders remain a separate integration requirement. Product rich-result eligibility and ranking changes still depend on Google's processing and subsequent search performance; no ranking improvement is claimed.
