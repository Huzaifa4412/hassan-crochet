#!/usr/bin/env node
// HTTP checks for this application's controlled server HTML. This does not
// execute JavaScript or replace rendered-browser, rich-result, or ranking QA.
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const [baseArg = "http://localhost:3005", originArg = "https://www.knittypetit.shop", reportArg = "docs/seo/local-audit.json"] = process.argv.slice(2);
const base = new URL(baseArg);
const canonicalOrigin = new URL(originArg).origin;
const reportPath = resolve(reportArg);
const concurrency = 4;
const userAgent = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
const report = {
  mode: "HTTP server HTML; JavaScript is not executed",
  startedAt: new Date().toISOString(),
  base: base.origin,
  canonicalOrigin,
  concurrency,
  pages: [],
  checks: [],
  errors: [],
  warnings: [],
};

function issue(level, url, message) {
  report[level].push({ url, message });
}

function check(condition, url, message) {
  if (!condition) issue("errors", url, message);
}

function decode(value = "") {
  return value.replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos);/gi, (entity, code) => {
    if (code[0] === "#") {
      const number = code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return number <= 0x10ffff ? String.fromCodePoint(number) : entity;
    }
    return ({ amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" })[code.toLowerCase()] || entity;
  });
}

function text(value = "") {
  return decode(value.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

function attributes(tag) {
  const result = {};
  for (const match of tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
    result[match[1].toLowerCase()] = decode(match[2] ?? match[3] ?? match[4]);
  }
  return result;
}

function metadata(html) {
  const clean = html.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, "").replace(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi, "");
  const meta = [...clean.matchAll(/<meta\b[^>]*>/gi)].map(([tag]) => attributes(tag));
  const canonicals = [...clean.matchAll(/<link\b[^>]*>/gi)].map(([tag]) => attributes(tag)).filter((attrs) => attrs.rel?.toLowerCase().split(/\s+/).includes("canonical")).map((attrs) => attrs.href);
  const content = (name) => meta.filter((attrs) => attrs.name?.toLowerCase() === name).map((attrs) => attrs.content || "");
  return {
    titles: [...clean.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title\s*>/gi)].map((match) => text(match[1])),
    descriptions: content("description"),
    canonicals,
    h1s: [...clean.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1\s*>/gi)].map((match) => text(match[1])),
    robots: content("robots"),
    googlebot: content("googlebot"),
  };
}

function noindex(values) {
  return values.some((value) => /(?:^|[\s,;:])(?:noindex|none)(?:$|[\s,;])/i.test(value));
}

function normalizedUrl(value) {
  try {
    return new URL(value).href;
  } catch {
    return null;
  }
}

function schemaNodes(value) {
  if (!value || typeof value !== "object") return [];
  return [value, ...Object.values(value).flatMap((child) => Array.isArray(child) ? child.flatMap(schemaNodes) : schemaNodes(child))];
}

function inspectSchema(html, url) {
  let count = 0;
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
    if (attributes(match[1]).type?.toLowerCase() !== "application/ld+json") continue;
    count += 1;
    let parsed;
    try {
      parsed = JSON.parse(match[2]);
    } catch {
      issue("errors", url, `JSON-LD block ${count} is not valid JSON.`);
      continue;
    }
    for (const node of schemaNodes(parsed)) {
      const types = [].concat(node["@type"] || []);
      if (types.includes("Offer")) {
        const price = node.price ?? node.priceSpecification?.price;
        const currency = node.priceCurrency ?? node.priceSpecification?.priceCurrency;
        check(price !== undefined && price !== null && price !== "" && Number.isFinite(Number(price)) && Number(price) >= 0, url, "Offer has no valid price.");
        check(typeof currency === "string" && /^[A-Z]{3}$/.test(currency), url, "Offer has no three-letter price currency.");
      }
      if (types.includes("AggregateOffer")) {
        check(node.lowPrice !== undefined && node.lowPrice !== "" && Number.isFinite(Number(node.lowPrice)) && Number(node.lowPrice) >= 0 && /^[A-Z]{3}$/.test(node.priceCurrency || ""), url, "AggregateOffer is missing valid lowPrice/priceCurrency.");
      }
      if (types.includes("Product")) {
        check(typeof node.name === "string" && !!node.name.trim(), url, "Product is missing its name.");
        const offers = [].concat(node.offers || []);
        const hasOffer = offers.some((offer) => offer && [].concat(offer["@type"] || []).some((type) => ["Offer", "AggregateOffer"].includes(type)));
        const rating = node.aggregateRating;
        const hasRating = rating && rating.ratingValue !== undefined && (rating.ratingCount || rating.reviewCount);
        const hasReview = [].concat(node.review || []).some((review) => review?.reviewRating?.ratingValue !== undefined && review.author);
        check(!!(hasOffer || hasReview || hasRating), url, "Product lacks a qualifying offers, review, or aggregateRating object for product snippet eligibility.");
      }
    }
  }
  return count;
}

async function request(path, options = {}) {
  const response = await fetch(new URL(path, base), {
    redirect: "manual",
    ...options,
    headers: { "user-agent": userAgent, ...options.headers },
    signal: AbortSignal.timeout(45000),
  });
  return { response, body: await response.text() };
}

async function auditPage(entry) {
  const url = new URL(entry.url);
  try {
    const { response, body } = await request(url.pathname + url.search);
    const meta = metadata(body);
    const result = { url: entry.url, status: response.status, ...meta, jsonLdBlocks: inspectSchema(body, entry.url), lastModified: entry.lastModified || null };
    report.pages.push(result);
    check(response.status === 200, entry.url, `Expected 200, received ${response.status}.`);
    check(meta.canonicals.length === 1 && normalizedUrl(meta.canonicals[0]) === normalizedUrl(entry.url), entry.url, `Expected one canonical equal to ${entry.url}; found ${JSON.stringify(meta.canonicals)}.`);
    check(meta.titles.length === 1 && !!meta.titles[0], entry.url, "Expected one nonempty title.");
    check(meta.descriptions.length === 1 && !!meta.descriptions[0]?.trim(), entry.url, "Expected one nonempty meta description.");
    check(meta.h1s.length === 1 && !!meta.h1s[0], entry.url, `Expected one nonempty H1; found ${meta.h1s.length}.`);
    check(!noindex([...meta.robots, ...meta.googlebot, response.headers.get("x-robots-tag") || ""]), entry.url, "Sitemap page has a noindex directive.");
  } catch (error) {
    issue("errors", entry.url, `Request failed: ${error.message}`);
  }
}

async function pool(items, action) {
  let position = 0;
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (position < items.length) await action(items[position++]);
  }));
}

async function extras() {
  const searchPath = "/search?q=sweater";
  const search = await request(searchPath);
  const searchMeta = metadata(search.body);
  report.checks.push({ path: searchPath, status: search.response.status, robots: searchMeta.robots, googlebot: searchMeta.googlebot });
  check(search.response.status === 200, searchPath, "Search should return 200.");
  check(noindex(searchMeta.robots), searchPath, "Search is missing robots noindex.");
  check(noindex(searchMeta.googlebot), searchPath, "Search is missing explicit googlebot noindex.");

  for (const path of ["/test-sanity", "/studio"]) {
    const { response, body } = await request(path);
    const meta = metadata(body);
    const headerRobots = response.headers.get("x-robots-tag") || "";
    report.checks.push({ path, status: response.status, robots: meta.robots, googlebot: meta.googlebot, headerRobots });
    check(response.status === 200, path, `Expected diagnostics/editor route to return 200, received ${response.status}.`);
    check(noindex([...meta.robots, headerRobots]), path, "Diagnostics/editor route is missing explicit robots noindex.");
    check(!meta.googlebot.length || noindex(meta.googlebot), path, "Diagnostics/editor route has a googlebot directive that overrides noindex.");
  }

  for (const prefix of ["products", "blog", "category"]) {
    const path = `/${prefix}/seo-audit-missing-route-6fe9f05a`;
    const { response, body } = await request(path);
    const meta = metadata(body);
    const hasNoindex = noindex([...meta.robots, ...meta.googlebot, response.headers.get("x-robots-tag") || ""]);
    report.checks.push({ path, status: response.status, noindex: hasNoindex });
    if (response.status === 200 && hasNoindex) {
      issue("warnings", path, "Missing route returned streamed HTTP 200 with noindex; a strict HTTP 404 was not observed.");
    } else {
      check(response.status === 404, path, `Expected HTTP 404, received ${response.status}.`);
    }
    check(hasNoindex, path, "Missing route has no explicit noindex directive.");
  }

  const redirectPath = "/products?seo_audit=redirect&sort=az";
  const { response } = await request(redirectPath, { headers: { host: "knittypetit.shop" } });
  const expectedLocation = `https://www.knittypetit.shop${redirectPath}`;
  const location = response.headers.get("location");
  report.checks.push({ path: redirectPath, host: "knittypetit.shop", status: response.status, location });
  check(response.status === 308 && location === expectedLocation, redirectPath, `Expected 308 redirect preserving path/query to ${expectedLocation}; received ${response.status}, ${location}.`);
}

try {
  const { response, body } = await request("/sitemap.xml");
  check(response.status === 200, "/sitemap.xml", `Expected 200, received ${response.status}.`);
  const entries = [...body.matchAll(/<url\b[^>]*>([\s\S]*?)<\/url\s*>/gi)].map((match) => ({
    url: decode(match[1].match(/<loc\b[^>]*>([\s\S]*?)<\/loc\s*>/i)?.[1]?.trim() || ""),
    lastModified: match[1].match(/<lastmod\b[^>]*>([\s\S]*?)<\/lastmod\s*>/i)?.[1]?.trim(),
  }));
  report.sitemapEntries = entries.length;
  check(entries.length > 0, "/sitemap.xml", "Sitemap has no URL entries.");
  check(new Set(entries.map((entry) => entry.url)).size === entries.length, "/sitemap.xml", "Sitemap contains duplicate URLs.");
  const staticPaths = ["/", "/products", "/about", "/blog"];
  for (const path of staticPaths) check(entries.some((entry) => entry.url === `${canonicalOrigin}${path}`), "/sitemap.xml", `Missing static URL ${path}.`);
  const validEntries = entries.filter((entry) => {
    try {
      const url = new URL(entry.url);
      check(url.origin === canonicalOrigin, entry.url, `Sitemap origin must be ${canonicalOrigin}.`);
      if (staticPaths.includes(url.pathname)) {
        check(!entry.lastModified, entry.url, "Static sitemap entry should omit lastmod.");
      } else {
        check(!!entry.lastModified && /^\d{4}-\d{2}-\d{2}T/.test(entry.lastModified) && Number.isFinite(Date.parse(entry.lastModified)), entry.url, "Dynamic sitemap entry needs a valid CMS lastmod timestamp.");
      }
      return true;
    } catch {
      issue("errors", entry.url, "Invalid sitemap URL.");
      return false;
    }
  });
  await pool(validEntries, auditPage);
  const titles = new Map();
  for (const page of report.pages) {
    if (!page.titles[0]) continue;
    const pages = titles.get(page.titles[0]) || [];
    pages.push(page.url);
    titles.set(page.titles[0], pages);
  }
  for (const [title, urls] of titles) {
    if (urls.length < 2) continue;
    const duplicatePages = report.pages.filter((page) => urls.includes(page.url));
    const productDuplicates = duplicatePages.every((page) =>
      new URL(page.url).pathname.startsWith("/products/") &&
      page.h1s.length === 1 &&
      title === `${page.h1s[0]} | Knitty Petit`,
    );
    issue(productDuplicates ? "warnings" : "errors", urls.join(", "), `Duplicate title ${JSON.stringify(title)}${productDuplicates ? "; CMS product titles need editorial differentiation" : ""}.`);
  }
  await extras();
} catch (error) {
  issue("errors", base.origin, `Audit could not complete: ${error.message}`);
} finally {
  report.completedAt = new Date().toISOString();
  report.pages.sort((a, b) => a.url.localeCompare(b.url));
  report.summary = { sitemapEntries: report.sitemapEntries || 0, pagesChecked: report.pages.length, errors: report.errors.length, warnings: report.warnings.length };
  await mkdir(dirname(reportPath), { recursive: true });
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`HTTP SEO audit: ${report.summary.pagesChecked}/${report.summary.sitemapEntries} pages; ${report.summary.errors} errors; ${report.summary.warnings} warnings.`);
  for (const item of report.errors) console.error(`ERROR ${item.url}: ${item.message}`);
  for (const item of report.warnings) console.warn(`WARN ${item.url}: ${item.message}`);
  console.log(`Report: ${reportPath}`);
  process.exitCode = report.errors.length ? 1 : 0;
}
