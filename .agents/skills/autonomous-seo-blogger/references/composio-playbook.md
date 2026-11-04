# Composio MCP Playbook for Autonomous SEO & Content Intelligence

The **Composio MCP Server** connects the autonomous SEO blogger to 500+ production applications, transforming the agent from a static writer into an integrated marketing and search intelligence engine.

---

## 1. Connected Applications & SEO Capabilities

The user has the following pre-connected apps available via Composio:
- **`google_search_console`**: Ground-truth search performance, queries, CTR, indexing, and striking-distance opportunities.
- **`google_analytics`**: Real-time traffic, top-performing landing pages, bounce rates, and engagement duration.
- **`googlesheets`**: Content calendar synchronization, keyword tracking, and automated reporting.
- **`metaads`**: Audience interests, ad copy performance, and high-converting value propositions.
- **Social & Community Platforms (Reddit, X/Twitter, HackerNews, Notion, Slack, Discord)**: Real-time social listening, authentic voice-of-the-customer research, and post-publish syndication.

---

## 2. Core SEO Workflows Powered by Composio

### Workflow A: Google Search Console Intelligence (Striking Distance Mining)
*Targeting keywords already ranking on positions 4–20 provides the fastest organic traffic surge.*

1. **Discover Tools**:
   ```json
   {
     "session": { "generate_id": true },
     "queries": [
       {
         "use_case": "query Google Search Console search analytics for striking distance keywords and low CTR queries",
         "known_fields": "dimensions:query,page"
       }
     ]
   }
   ```
2. **Execute via `COMPOSIO_MULTI_EXECUTE_TOOL`**:
   - Filter queries with:
     - Impressions > 500
     - Position between 4.0 and 20.0
     - CTR < 3%
   - **Action**: Use these exact queries as the primary or secondary H2 sections for the new or updated blog post.

### Workflow B: Social Listening & Voice-of-the-Customer Research
*Traditional keyword tools only show search queries, not the emotional context or actual objections of buyers.*

1. **Discover Community Discussion Tools**:
   ```json
   {
     "session": { "id": "<session_id>" },
     "queries": [
       {
         "use_case": "search Reddit discussions for user complaints, questions, and recommendations about [niche/product]",
         "known_fields": "subreddit:all,sort:relevance"
       },
       {
         "use_case": "search Twitter posts for trending opinions and hashtags about [niche/product]"
       }
     ]
   }
   ```
2. **Extract Real Nuance**:
   - Extract raw user terminology, common misconceptions, buyer hesitation points, and authentic dilemmas.
   - Address these verbatim questions in the blog’s **People Also Ask (PAA)** and **Pro-Tips** sections.

### Workflow C: Editorial Pipeline Logging via Google Sheets
*Keep stakeholders and content calendars automatically synchronized.*

1. **Search Sheets Tools**:
   ```json
   {
     "session": { "id": "<session_id>" },
     "queries": [
       {
         "use_case": "append row to Google Sheet content calendar",
         "known_fields": "sheet_name:SEO_Content_Calendar"
       }
     ]
   }
   ```
2. **Log Schema**:
   Append a row containing:
   `[Date, Target Slug, Primary Keyword, Search Volume, Target Intent, Word Count, Infographic Asset Path, Live URL, Indexing Requested (Yes/No)]`

### Workflow D: Post-Publish Multi-Channel Amplification
*SEO articles rank faster when they receive early organic social engagement and referral signals.*

1. **Generate & Distribute Derivatives**:
   - **X / Twitter Thread**: 5-part educational thread distilling the core framework or decision chart from the article, linking to the full canonical post.
   - **LinkedIn Pulse / Update**: Professional takeaway addressing industry decision-makers or enthusiasts.
   - **Slack / Discord Alert**: Notify internal marketing or founder channels with the newly published link, targeted keywords, and visual preview.

---

## 3. Best Practices & Safety Guidelines for Composio Calls

1. **Always Pass `session`**:
   - Initialize with `session: { generate_id: true }` on the first call.
   - Reuse the returned `session_id` across all subsequent tool calls in that execution turn.
2. **Schema Compliance**:
   - If a tool returns a `schemaRef` instead of an inline schema, call `COMPOSIO_GET_TOOL_SCHEMAS` first before executing.
   - Never invent arguments or parameter names.
3. **Graceful Fallbacks**:
   - If a connection is not active or token expired, log the message and fall back to local project logging or native CLI without halting the entire publishing pipeline.
