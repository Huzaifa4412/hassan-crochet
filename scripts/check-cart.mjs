import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { randomUUID } from "node:crypto";
import ts from "typescript";

// Execute the real cart and event modules without contacting analytics providers.
const calls = [];
const storage = new Map();
const target = new EventTarget();
let blocked = false;
const browser = {
  location: { origin: "https://example.test" },
  localStorage: {
    getItem: (key) => storage.get(key) || null,
    setItem: (key, value) => { if (blocked) throw new Error("Storage blocked"); storage.set(key, value); },
  },
  addEventListener: target.addEventListener.bind(target),
  removeEventListener: target.removeEventListener.bind(target),
  dispatchEvent: target.dispatchEvent.bind(target),
  fbq: (...args) => calls.push({ provider: "meta", args }),
  setTimeout,
};
const cache = new Map();
function load(name) {
  if (name === "react") return { useSyncExternalStore: (_subscribe, snapshot) => snapshot() };
  if (cache.has(name)) return cache.get(name).exports;
  assert.ok(name.startsWith("@/"));
  const filename = path.resolve("src", name.slice(2) + ".ts");
  const source = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const compiled = { exports: {} };
  cache.set(name, compiled);
  vm.runInNewContext(source, {
    exports: compiled.exports, module: compiled, require: load, window: browser,
    document: { title: "Cart test" }, crypto: { randomUUID }, Event, console,
    process: { env: { NEXT_PUBLIC_FACEBOOK_PIXEL_ID: "1234567890", NEXT_PUBLIC_GA_ID: "G-TEST" } },
  }, { filename });
  return compiled.exports;
}
const cart = load("@/lib/cart");
const store = load("@/lib/cart-store");
const google = load("@/lib/gtag");
const shopping = load("@/lib/shopping-events");
const pixel = load("@/lib/fpixel");
const installedPixel = browser.fbq;
browser.fbq = undefined;
pixel.event("AddToCart", { value: 44, currency: "USD" }, { eventID: "early-cart" });
pixel.event("InitiateCheckout", { value: 44, currency: "USD" }, { eventID: "early-checkout" });
const beforeBootstrap = calls.length;
browser.fbq = installedPixel;
pixel.flushQueuedEvents();
assert.equal(calls.length, beforeBootstrap + 2, "Early shopping events survive delayed pixel initialization");
assert.equal(calls.at(-2).args[3].eventID, "early-cart");
assert.equal(calls.at(-1).args[1], "InitiateCheckout");
pixel.flushQueuedEvents();
assert.equal(calls.length, beforeBootstrap + 2, "Flushing again does not duplicate events");
calls.length = 0;
const item = {
  productId: "product-1", slug: "name-sweater", title: "Name sweater", category: "Sweaters",
  color: "Rose", iconCount: 1, details: "Child name: PrivateName", design: "PrivateName at 10,20",
};

store.addCartItem(item);
store.addCartItem(item);
assert.equal(store.useCart().length, 1, "Identical designs merge");
assert.equal(store.useCart()[0].quantity, 2);
assert.equal(cart.cartValue(store.useCart()), 88);
store.addCartItem({ ...item, color: "White" });
assert.equal(store.useCart().length, 2, "Different colors remain separate");
const first = store.useCart()[0];
store.setCartQuantity(first.id, 4);
assert.equal(cart.cartValue(store.useCart()), 220);
store.setCartQuantity(first.id, 2);
const lastMeta = calls.at(-1);
assert.equal(lastMeta.args[1], "RemoveFromCart");
assert.equal(lastMeta.args[2].value, 88, "Quantity reductions report only removed units");
assert.equal(lastMeta.args[2].contents[0].quantity, 2);
store.setCartQuantity(first.id, 0);
assert.equal(store.useCart().length, 1);
assert.equal(cart.cartValue(store.useCart()), 44);
store.setCartQuantity(store.useCart()[0].id, 21);
assert.equal(store.useCart()[0].quantity, 1, "Out-of-range quantity is rejected");

const eventCount = calls.length;
blocked = true;
assert.throws(() => store.addCartItem({ ...item, color: "Blue" }));
assert.equal(calls.length, eventCount, "Failed persistence does not report a cart addition");
assert.equal(store.useCart().length, 1);
blocked = false;

assert.equal(cart.parseCart([{ ...first, quantity: -1 }]).length, 0);
assert.equal(cart.parseCart([{ ...first, iconCount: 1.5 }]).length, 0);
assert.equal(cart.parseCart([{ ...first, preview: "javascript:alert(1)" }]).length, 0);
assert.equal(cart.parseCart([first, first]).length, 1, "Duplicate line IDs are rejected");
storage.set(cart.CART_KEY, "{broken json");
assert.equal(store.useCart().length, 0, "Corrupt saved carts recover safely");

shopping.trackShoppingEvent("begin_checkout", [{ ...first, quantity: 2 }]);
shopping.trackEtsyHandoff({ ...first, quantity: 2 });
google.pageview("/checkout");
const gaCalls = browser.dataLayer.map((entry) => Array.from(entry));
assert.equal(gaCalls.filter((entry) => entry[0] === "config").length, 1, "Google initializes once");
assert.ok(gaCalls.findIndex((entry) => entry[0] === "config") < gaCalls.findIndex((entry) => entry[0] === "event"));
const add = gaCalls.find((entry) => entry[1] === "add_to_cart");
assert.equal(add[2].currency, "USD");
assert.equal(add[2].value, 44);
assert.equal(add[2].items[0].price, 44);
assert.equal(add[2].items[0].quantity, 1);
const begin = gaCalls.find((entry) => entry[1] === "begin_checkout");
assert.equal(begin[2].value, 88);
assert.equal(calls.find((entry) => entry.args[1] === "InitiateCheckout").args[2].num_items, 2);
assert.ok(gaCalls.some((entry) => entry[1] === "etsy_checkout_click"));
assert.ok(calls.some((entry) => entry.args[1] === "EtsyCheckoutClick" && entry.args[0] === "trackCustom"));
assert.ok(!JSON.stringify({ calls, gaCalls }).includes("PrivateName"), "Personalization stays out of both providers");
assert.ok(!gaCalls.some((entry) => entry[1] === "purchase"));
assert.ok(!calls.some((entry) => entry.args[1] === "Purchase"));

if (process.argv[2]) {
  const base = process.argv[2];
  for (const body of ["[]", "invalid", JSON.stringify([{ id: "x", slug: "../../etc", iconCount: 0, quantity: 1 }])]) {
    const response = await fetch(`${base}/api/checkout`, { method: "POST", body });
    assert.equal(response.status, 400);
  }
  const response = await fetch(`${base}/api/checkout`, {
    method: "POST", body: JSON.stringify([{ id: "test", slug: "hand-embroidered-kids-name-sweaters", iconCount: 2, quantity: 3, price: 0.01, etsyLink: "https://evil.test" }]),
  });
  assert.equal(response.status, 200);
  const reviewed = (await response.json()).items[0];
  assert.equal(reviewed.price, 48, "Server ignores a client-supplied price");
  assert.ok(reviewed.etsyLink.startsWith("https://www.etsy.com/listing/"), "Checkout uses the CMS listing, never a client URL");
  for (const route of ["/cart", "/checkout"]) {
    const html = await (await fetch(`${base}${route}`)).text();
    assert.match(html, /name="robots" content="noindex/);
  }
  const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
  assert.ok(!sitemap.includes("/cart<") && !sitemap.includes("/checkout<"));
  const html = await (await fetch(`${base}/products/hand-embroidered-kids-name-sweaters`)).text();
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((match) => JSON.parse(match[1]));
  const product = schemas.find((entry) => entry.mainEntity?.["@type"] === "Product").mainEntity;
  assert.equal(product.offers.price, 40);
  assert.equal(product.offers.priceCurrency, "USD");
  assert.ok(!product.aggregateRating, "No unverified review rating is emitted");
}
console.log("Cart checks passed: persistence, quantities, price integrity, storage failures, privacy, event semantics, and initialization." );
