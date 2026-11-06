# Cart, Etsy checkout, measurement, and SEO — 6 November 2026

Implemented locally. Payment remains on Etsy, as requested. No production deployment, order, charge, or external message was made. Screenshots contain a clearly identified QA design (Mila, one Heart icon), not an actual order.

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

Google ecommerce events queue even when they occur before the Google script loads; Google initializes only once. Meta route tracking avoids a duplicate initial PageView. Removed duplicate Search events on dropdown submission and renamed product-card listing clicks so they do not inflate checkout starts.

Google page views use the provider's enhanced measurement by default. In the active web stream, keep **Page loads** and **Page changes based on browser history events** enabled. These account settings could not be inspected with the connected GA tools and still require live acceptance testing. If choosing explicit application page views instead, first disable enhanced history/page-load page views, then set `NEXT_PUBLIC_GA_MANUAL_PAGEVIEWS=true`. Do not enable both approaches.

`NEXT_PUBLIC_TRACKING_ENABLED=false` suppresses our Google and Meta tags/events for local browser QA. The browser preview on port 3100 used this flag, so its sample cart activity was not intentionally sent to production analytics. Production builds use the existing configured IDs unless that flag is explicitly disabled. Retain the site's applicable consent configuration when releasing; this change does not introduce a consent manager.

**Purchase limitation:** Etsy payment completion is not observable from a website button or a return visit. `Purchase`, GA4 `purchase`, and `AddPaymentInfo` are deliberately not sent. Paid-order measurement needs a separate verified Etsy order integration with matching attribution and server credentials. No Google Ads conversion action or revenue import was configured.

## Connected-account evidence

- Google Analytics MCP: local measurement ID matches the Knitty Petit web stream under property `562382938`, stream `16271360487`. Another older Knitty Petit property also exists; no settings were changed on either property.
- Search Console MCP: owner access to `https://www.knittypetit.shop/`. The main product URL is submitted and indexed; Google's selected canonical agrees with the website. Reported crawl: 2 November 2026.
- Sitemap: 16 submitted pages, no errors or warnings, not pending. Last reported download/submission: 4 November. Sitemap indexed-count reporting was zero, while individual product inspection explicitly passed; the summary counter is not proof of non-indexing.
- Search performance query for 7 October–3 November 2026 returned no rows. This is not evidence of achieved rankings or traffic gains.
- Meta MCP: the configured Knitty Petit dataset is active, with a browser last-fired timestamp on 4 November. No server event activity or CAPI gateway setup was reported. This read predates deployment of the new code and does not prove receipt of its events.
- Vercel MCP: the existing **All main projects** connection verified the owning team, project, domains, and currently READY production deployment. The code changes remain local; no deployment was made.

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

Before calling the release complete, publish to the authorized Vercel project, verify the active GA enhanced measurement settings, inspect one real browsing journey in GA DebugView and Meta Test Events, and check Product rich-result eligibility after Google recrawls. Ranking gains cannot be promised from technical changes alone; maintain the existing buyer-focused content and measure subsequent Search Console impressions and clicks.
