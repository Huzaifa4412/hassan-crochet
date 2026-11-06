# Resend checkout design emails — 6 November 2026

Production: https://www.knittypetit.shop

Application commit: `431edac46f387206e471e6cfd2ac77eb7dcb8c3f` on `codex/resend-checkout-emails-20261106`.

Production deployment: `dpl_3EwtnYPvdvfG77qbRtXv9pkcg3U8` (`READY`, custom domains assigned). The release was deployed from this exact Git commit; it has not been merged into `master`.

## Customer and merchant behavior

After saving a design and opening checkout, the customer can choose **Email my design summary**. Their email is required only for this optional action; their name is optional. The customer receives a branded HTML and plain-text summary with quantities, personalization details, website subtotal, product links, Etsy listing links, and saved JPEG previews as attachments. A separate merchant notification goes to the owner-provided mailbox, with the customer's address as Reply-To. Customer replies go to the owner address.

Sender: **Knitty Petit <orders@knittypetit.shop>**. The sending domain is verified in Resend. DKIM and provider-requested SPF/MX/CNAME DNS records were added in Vercel; existing root mail records were preserved. Open and click tracking are disabled for these transactional emails.

These messages describe an **unpaid design request**. They do not confirm a purchase, reserve stock, place an Etsy order, transfer the website cart to Etsy, or confirm payment. Actual paid-order confirmation remains Etsy's responsibility. Email failure does not prevent copying the personalization or continuing to Etsy.

## Configuration

Server-only environment variables are configured for Vercel production and preview:

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Sending-only API key restricted to the verified Knitty Petit domain |
| `EMAIL_REQUEST_SECRET` | Random secret used to HMAC coordination identifiers |
| `RESEND_FROM_EMAIL` | `Knitty Petit <orders@knittypetit.shop>` |
| `CHECKOUT_NOTIFICATION_EMAIL` | Owner-provided notification mailbox |
| `RESEND_REPLY_TO_EMAIL` | Owner-provided reply mailbox |
| `SANITY_API_TOKEN` | Existing server token for metadata-only delivery coordination |

No new secret was added to the repository or local environment files. Add equivalent server variables for a local integration environment when needed; `npm run test:email` uses mocks and needs no real sending credentials. Redeploy after changing Vercel environment variables.

## Delivery and privacy

- Titles, prices, stock state, product URLs, and HTTPS Etsy listing destinations are resolved on the server. Client-supplied prices and destinations are ignored.
- The endpoint enforces same-origin JSON requests, validates payloads and JPEG previews, limits request size, and includes a honeypot.
- Shared limits allow five new requests per IP per 15-minute window and two per recipient per hour. IP and recipient values are HMACed before coordination storage. Fixed windows reset naturally; the `expiresAt` field does not automatically delete documents.
- Sanity coordination documents contain HMAC identifiers, counters, timestamps, lease identifiers, and provider message IDs. Customer names, addresses, design text, and previews are not persisted there. Resend necessarily processes the submitted email content to deliver it.
- Each customer/merchant channel has an independent provider idempotency key and durable acceptance marker. A partial failure can retry the missing channel without resending an already accepted channel. Revision-checked leases serialize concurrent identical requests.
- Incomplete requests older than 23 hours are rejected rather than retried beyond Resend's 24-hour idempotency window. Refreshing checkout creates a new request identity.
- The website shows success only when both messages have been accepted by Resend. Acceptance does not guarantee inbox delivery. Check Resend delivery/bounce status if a customer reports a missing message. There is no claim of guaranteed inbox placement or paid-order delivery confirmation.
- The email submission adds no analytics parameters containing the customer's email, name, or design content.

## Verification

A real production checkout submission used an explicitly labelled **INTEGRATION TEST - no order/payment**, a `TEST` sweater design with one Heart icon, and the owner's Gmail as both test customer and merchant recipient. No Etsy order or payment was placed. The disposable design was removed from the test browser cart afterward.

Reference: `KP-FAE5A057E297`.

| Copy | Resend ID | Verified status | Attachment |
| --- | --- | --- | --- |
| Customer | `01a1b1b5-e315-75a0-83c9-021d67b3d91c` | `delivered` | `design-1.jpg`, JPEG, 39,066 bytes |
| Merchant | `01a1b1b5-e6f4-7a41-9c95-d50aef482d70` | `delivered` | `design-1.jpg`, JPEG, 39,066 bytes |

Resend retrieval confirmed both sender/recipient pairs and explicit unpaid-summary wording. Attachment listing confirmed one JPEG on each email. Provider `delivered` status confirms acceptance by the recipient's mail server; inbox versus spam placement was not independently verified.

- `npm run test:email`: passed. Covers validation, escaping, canonical prices/destinations, attachments, partial-channel retry, completed-request deduplication, concurrent leases, shared recipient limits, unavailable listings, missing configuration, and endpoint rejection cases.
- `npm run test:cart`: passed.
- ESLint on changed source files: passed.
- Local production build: passed. Vercel built the exact release commit and reached `READY`.
- Full repository lint: 33 existing errors and 53 warnings; the existing baseline remains unresolved by this email change.

The live checkout success screenshot is kept as a local release artifact rather than committed, because the form contains the owner's recipient address.

## Sanity schema publishing limitation

The deployed Next.js Studio includes the new read-only delivery metadata models. Both attempts to publish the separate Sanity cloud schema manifest were rejected because the available CLI credentials lack `sanity.project/deployStudio` / `sanity.project/deploySchema`. Runtime metadata writes succeeded in the production integration test, so email delivery is operational. Cloud manifest publishing remains pending an appropriately authorized Sanity deployment credential; no existing documents were migrated or deleted.

## Relevant source and provider references

- `src/components/cart/EmailSummaryForm.tsx`
- `src/app/api/checkout/email/route.ts`
- `src/lib/checkout-email.ts`
- `src/lib/email-delivery.server.ts`
- `src/sanity/schemaTypes/emailDelivery.ts`
- `scripts/check-checkout-email.mjs`
- [Resend idempotency keys](https://resend.com/docs/dashboard/emails/idempotency-keys)
- [Resend attachments](https://resend.com/docs/dashboard/emails/attachments)
- [Resend scoped API keys](https://resend.com/docs/api-reference/api-keys/create-api-key)
