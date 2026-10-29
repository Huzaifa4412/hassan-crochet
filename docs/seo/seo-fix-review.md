# SEO and trust cleanup

This change consolidates three duplicate product URLs, excludes redirected/noindexed URLs from the sitemap, adds sitewide Organization/WebSite and visible homepage FAQ structured data, improves metadata, removes synthetic buyer activity/reviews, and clarifies the Etsy checkout handoff.

- Keep `/products/hand-embroidered-kids-name-sweaters` as the existing canonical product.
- Matching redirects and the empty-category noindex header are already live in Vercel project routes; these source changes preserve the behavior in the application.
- The apex-domain redirect is currently configured in Vercel as temporary. Update that domain setting to 308 separately; application redirects cannot guarantee overriding an earlier platform domain redirect.
- Sale countdown stays disabled until a real sale end date is confirmed.
- Prices, manufacturing origin, ratings, review counts, shipping promises and returns are not newly asserted from the saved audit. Refer shoppers to current Etsy terms.
- Product markup remains ItemPage; Product/Offer markup should only be enabled once accurate visible offer data is available.
- Unpublish the three duplicate product documents and correct mislabeled color images in Sanity after reviewing the live catalog. No CMS records are deleted by this PR.
- This is an SEO foundation improvement, not a ranking guarantee.
