# Sanity CMS Data Fetching Troubleshooting Guide

This guide helps diagnose and fix common issues with Sanity data fetching in your Next.js e-commerce project.

## Quick Diagnostics

### 1. Check Environment Configuration

Verify your environment variables are set correctly:

```bash
# In .env.local
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-02-23
```

**Test from browser console:**
```javascript
// Import and use the debug utility
import { checkConfig } from '@/sanity/lib/debug';
console.log(checkConfig());
```

### 2. Verify Sanity Studio Access

1. Run `npm run dev`
2. Navigate to `http://localhost:3000/studio`
3. Verify you can see your content
4. Use the Vision plugin to test queries

### 3. Test Basic Queries

In Sanity Studio's Vision plugin, test:

```groq
// Test 1: Count products
count(*[_type == "product"])

// Test 2: Get all product slugs
*[_type == "product"]{ slug { current } }

// Test 3: Get a specific product
*[_type == "product" && slug.current == "your-slug"][0]

// Test 4: Check draft status
*[_type == "product"]{ _id, title, slug }
```

## Common Issues and Solutions

### Issue 1: No Data Returned (null results)

**Symptoms:** Queries return `null` or empty arrays

**Possible Causes:**
- Documents are still drafts (not published)
- Wrong dataset name
- Schema mismatch
- Query syntax error

**Solutions:**

1. **Check if documents are published:**
   ```groq
   *[_type == "product"]{ _id, title }
   ```
   If you see IDs starting with `drafts.`, those are drafts. Publish them from Studio.

2. **Verify dataset name:**
   - Check `.env.local`
   - Check in Studio → Project Settings → Datasets
   - Make sure they match exactly

3. **Test with simplified query:**
   ```groq
   *[_type == "product"][0]{ title }
   ```

### Issue 2: Image URLs Not Loading

**Symptoms:** Images return `undefined` or null

**Possible Causes:**
- Image not projected correctly
- Asset reference is broken
- CORS issues

**Solutions:**

1. **Check image projection:**
   ```groq
   *[_type == "product"][0]{
     variants[]{
       colorName,
       "imageUrl": image.asset->url
     }
   }
   ```

2. **Verify image is attached to variant:**
   - Open product in Studio
   - Check each variant has an image
   - Re-upload image if needed

3. **Check for CORS errors in browser console:**
   - If present, verify CDN is enabled in client config

### Issue 3: TypeScript Type Mismatches

**Symptoms:** TypeScript errors, runtime errors accessing properties

**Possible Causes:**
- Query projections don't match TypeScript interfaces
- Nested objects not properly typed

**Solutions:**

1. **Compare query projection with interface:**
   ```typescript
   // Query returns:
   "imageUrl": image.asset->url  // Results in { imageUrl: string }

   // Interface should match:
   imageUrl: string;  // ✅ Correct
   image: { asset: { url: string } };  // ❌ Wrong
   ```

2. **Use proper projection syntax:**
   ```groq
   // For direct URL access
   "imageUrl": image.asset->url

   // For full object access
   image{ asset->url }
   ```

### Issue 4: Category/Collection References Return Null

**Symptoms:** `category` or `collections` fields are null/undefined

**Possible Causes:**
- Reference not set in Studio
- Referenced document is a draft
- Query projection incorrect

**Solutions:**

1. **Check reference in Studio:**
   - Open product in Studio
   - Verify category is selected
   - Publish both the product AND the category

2. **Verify reference projection:**
   ```groq
   *[_type == "product"][0]{
     title,
     category->{_id, title, slug{ current } }
   }
   ```

### Issue 5: Variants Array Empty

**Symptoms:** `variants` is `undefined` or empty array

**Possible Causes:**
- No variants added in Studio
- Variants not published
- Wrong array projection

**Solutions:**

1. **Check variants in Studio:**
   - Open product in Studio
   - Scroll to Color Variants
   - Add at least one variant with image
   - Ensure variant is saved (green dot)

2. **Test variant query:**
   ```groq
   *[_type == "product" && slug.current == "your-slug"][0]{
     title,
     variants[]{
       colorName,
       colorValue,
       "imageUrl": image.asset->url
     }
   }
   ```

## Testing Queries in Development

### Using the Debug Utilities

```typescript
import { testQuery, getDocumentCount, logConfig } from '@/sanity/lib/debug';

// Test configuration
logConfig();

// Test a query
const result = await testQuery(`
  *[_type == "product" && featured == true][0]{
    title,
    slug
  }
`);

console.log(result);
// Output:
// {
//   success: true,
//   result: { title: "...", slug: { current: "..." } },
//   duration: "45.23ms",
//   query: "...",
//   params: undefined
// }
```

### Using Sanity Studio Vision Plugin

1. Open Studio at `/studio`
2. Click "Vision" in left sidebar
3. Enter query and click "Run"
4. Inspect results

### Using Browser DevTools

```javascript
// In browser console on your site
fetch('https://6m1z3oqp.api.sanity.io/v1/graphql/production/default', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: `*[_type == "product"][0]{ title }`
  })
})
.then(r => r.json())
.then(console.log);
```

## Query Performance Tips

1. **Use selective projections** - Only fetch fields you need
2. **Limit results** - Use `[0...$limit]` instead of fetching all
3. **Order early** - Apply `| order()` before projections when possible
4. **Filter effectively** - Use specific filters to reduce result set

## Schema Field Reference

### Product Schema Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✅ | Product title |
| `slug` | slug | ✅ | URL slug |
| `category` | reference | ❌ | Category reference |
| `collections` | array | ❌ | Collection references |
| `description` | text | ❌ | Full description |
| `shortDescription` | text | ❌ | Brief description |
| `etsyLink` | url | ✅ | Etsy listing URL |
| `variants` | array | ❌ | Color variants with images |
| `galleryImages` | array | ❌ | Additional images |
| `badges` | array | ❌ | Product badges |
| `inStock` | boolean | ❌ | Stock status (default: true) |
| `featured` | boolean | ❌ | Featured flag (default: false) |
| `isNew` | boolean | ❌ | New arrival flag |
| `sortOrder` | number | ❌ | Display order |
| `seoTitle` | string | ❌ | SEO meta title |
| `seoDescription` | text | ❌ | SEO meta description |
| `saleEndDate` | datetime | ❌ | Sale end date |

### ProductVariant Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `colorName` | string | ✅ | Display name |
| `colorValue` | string | ❌ | Hex/Tailwind value |
| `image` | image | ✅ | Product image |
| `sortOrder` | number | ❌ | Display order |

## Getting Help

If you're still stuck:

1. **Check Sanity status:** https://status.sanity.io/
2. **Review documentation:** https://www.sanity.io/docs
3. **Check community forums:** https://www.sanity.io/community
4. **Enable verbose logging:** Set `NODE_ENV=development` for more detailed error messages
