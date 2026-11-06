import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import { randomUUID } from "node:crypto";
import ts from "typescript";

const nativeRequire = createRequire(import.meta.url);
const records = new Map();
const accepted = new Map();
const attempts = [];
const env = {
  RESEND_API_KEY: "re_test_not_real", EMAIL_REQUEST_SECRET: "unit-test-secret-not-a-production-key",
  SANITY_API_TOKEN: "unit-test-only", RESEND_FROM_EMAIL: "Knitty Petit <orders@example.test>",
  CHECKOUT_NOTIFICATION_EMAIL: "owner@example.test", RESEND_REPLY_TO_EMAIL: "owner@example.test",
};
let sequence = 0;
let failMerchant = false;
const clone = (value) => value ? structuredClone(value) : value;
const client = {
  createIfNotExists: async (doc) => {
    if (!records.has(doc._id)) records.set(doc._id, { ...clone(doc), _rev: String(++sequence), _createdAt: new Date().toISOString() });
    return clone(records.get(doc._id));
  },
  getDocument: async (id) => clone(records.get(id)),
  patch: (id) => {
    let revision;
    let values = {};
    let increments = {};
    const patch = {
      ifRevisionId: (value) => { revision = value; return patch; },
      set: (value) => { values = value; return patch; },
      inc: (value) => { increments = value; return patch; },
      commit: async () => {
        const record = records.get(id);
        if (!record || (revision && revision !== record._rev)) throw new Error("Revision conflict");
        const next = { ...record, ...clone(values), _rev: String(++sequence) };
        for (const key of Object.keys(increments)) next[key] = (next[key] || 0) + increments[key];
        records.set(id, next);
        return clone(next);
      },
    };
    return patch;
  },
};
class FakeResend {
  emails = { send: async (email, options) => {
    attempts.push({ email, key: options.idempotencyKey });
    if (failMerchant && email.to === env.CHECKOUT_NOTIFICATION_EMAIL) return { error: { message: "Temporary provider error" } };
    if (!accepted.has(options.idempotencyKey)) accepted.set(options.idempotencyKey, { email, id: randomUUID() });
    return { data: { id: accepted.get(options.idempotencyKey).id }, error: null };
  } };
}
const modules = new Map();
function load(name) {
  if (name === "server-only") return {};
  if (name === "resend") return { Resend: FakeResend };
  if (name === "next-sanity") return { createClient: () => client };
  if (name === "@/sanity/env") return { projectId: "unit-test", dataset: "test", apiVersion: "2026-02-23" };
  if (name === "@/sanity/queries") return { getProductBySlug: async (slug) => slug === "missing" ? null : {
    title: "Verified sweater", slug: { current: slug }, inStock: true,
    etsyLink: "https://www.etsy.com/listing/4489116946/name-sweater",
  } };
  if (!name.startsWith("@/")) return nativeRequire(name);
  if (modules.has(name)) return modules.get(name).exports;
  const filename = path.resolve("src", name.slice(2) + ".ts");
  const code = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  const compiled = { exports: {} };
  modules.set(name, compiled);
  vm.runInNewContext(code, { module: compiled, exports: compiled.exports, require: load,
    process: { env }, console: { ...console, error: () => {} }, Buffer, URL, Date, Request, Response, setTimeout }, { filename });
  return compiled.exports;
}
const { parseEmailSubmission, renderSummaryEmail } = load("@/lib/checkout-email");
const { sendDesignSummary } = load("@/lib/email-delivery.server");
const route = load("@/app/api/checkout/email/route");
const body = (overrides = {}) => ({ requestId: randomUUID(), name: "PrivateName <script>", email: "customer@example.test",
  website: "", items: [{ id: "design-1", slug: "name-sweater", color: "Rose", iconCount: 1, quantity: 2,
    details: "PrivateName <script>alert(1)</script>", preview: "data:image/jpeg;base64,/9j/AAAA", price: 0.01,
    etsyLink: "https://evil.example" }], ...overrides });

assert.equal(parseEmailSubmission(body({ email: "bad\r\nBcc:attacker@example.test" })), null);
assert.equal(parseEmailSubmission(body({ website: "spam bot" })), null);
assert.equal(parseEmailSubmission(body({ items: [{ ...body().items[0], preview: "https://private-server.test" }] })), null);
assert.equal(parseEmailSubmission(body({ items: [{ ...body().items[0], quantity: 21 }] })), null);
const input = parseEmailSubmission(body());
assert.ok(input);
const sent = await sendDesignSummary(input, "192.0.2.1");
assert.equal(sent.accepted, true);
assert.equal(accepted.size, 2, "Customer and merchant receive separate messages");
const customer = [...accepted.values()].find((entry) => entry.email.to === input.email).email;
const owner = [...accepted.values()].find((entry) => entry.email.to === env.CHECKOUT_NOTIFICATION_EMAIL).email;
assert.equal(customer.replyTo, env.CHECKOUT_NOTIFICATION_EMAIL);
assert.equal(owner.replyTo, input.email);
assert.ok(customer.html.includes("&lt;script&gt;"));
assert.ok(!customer.html.includes("<script>"));
assert.ok(customer.text.includes("$88.00 USD"), "Price is derived from trusted shared pricing, not the browser");
assert.ok(!customer.text.includes("evil.example"));
assert.equal(customer.attachments[0].filename, "design-1.jpg");
assert.ok(customer.text.includes("not an order or payment confirmation"));
assert.ok(!JSON.stringify([...records.values()]).includes("PrivateName"));
assert.ok(!JSON.stringify([...records.values()]).includes("customer@example.test"));
assert.ok(!JSON.stringify([...records.values()]).includes("/9j/AAAA"), "Public coordination records contain no previews");
const attemptCount = attempts.length;
assert.equal((await sendDesignSummary(input, "192.0.2.1")).duplicate, true);
assert.equal(attempts.length, attemptCount, "Completed retries do not contact the email provider again");

failMerchant = true;
const partial = parseEmailSubmission(body({ email: "partial@example.test" }));
await assert.rejects(() => sendDesignSummary(partial, "192.0.2.2"), (error) => error.status === 503);
const customerAttempts = attempts.filter((entry) => entry.email.to === partial.email).length;
failMerchant = false;
assert.equal((await sendDesignSummary(partial, "192.0.2.2")).accepted, true);
assert.equal(attempts.filter((entry) => entry.email.to === partial.email).length, customerAttempts, "Merchant-only retry never duplicates the customer email");

const concurrent = parseEmailSubmission(body({ email: "concurrent@example.test" }));
const concurrentResults = await Promise.allSettled([sendDesignSummary(concurrent, "192.0.2.3"), sendDesignSummary(concurrent, "192.0.2.3")]);
assert.equal(concurrentResults.filter((result) => result.status === "fulfilled").length, 1, "Only one concurrent sender acquires the revision-checked lock");
assert.equal(attempts.filter((entry) => entry.email.to === concurrent.email).length, 1);

await sendDesignSummary(parseEmailSubmission(body({ email: "limited@example.test" })), "192.0.2.4");
await sendDesignSummary(parseEmailSubmission(body({ email: "limited@example.test" })), "192.0.2.4");
await assert.rejects(() => sendDesignSummary(parseEmailSubmission(body({ email: "limited@example.test" })), "192.0.2.4"), (error) => error.status === 429);
await assert.rejects(() => sendDesignSummary(parseEmailSubmission(body({ items: [{ ...body().items[0], slug: "missing" }] })), "192.0.2.5"), (error) => error.status === 400);

function request(data, headers = {}) {
  return new Request("https://example.test/api/checkout/email", { method: "POST", headers: { origin: "https://example.test", "content-type": "application/json", ...headers }, body: typeof data === "string" ? data : JSON.stringify(data) });
}
assert.equal((await route.POST(request("bad-json"))).status, 400);
assert.equal((await route.POST(request(body(), { origin: "https://other.test" }))).status, 403);
assert.equal((await route.POST(request(body(), { "content-type": "text/plain" }))).status, 415);
assert.equal((await route.POST(request(body(), { "content-length": "4000000" }))).status, 413);
env.RESEND_API_KEY = "";
assert.equal((await route.GET().json()).available, false);
assert.equal((await route.POST(request(body()))).status, 503, "Missing config never reports a successful send");
assert.ok(renderSummaryEmail);
console.log("Checkout email checks passed: customer/owner messages, trusted prices/links, attachments, escaping, no public PII, partial retry, deduplication, concurrent locks, rate limits, origin validation, and missing-config failure.");
