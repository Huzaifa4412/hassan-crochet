import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Heart,
  Instagram,
  Mail,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";

const shopLinks = [
  { label: "All Products", href: "/products" },
  { label: "Custom Sweaters", href: "/products/kids-sweater" },
  { label: "About Studio", href: "/about" },
  { label: "Journal", href: "/blog" },
];

const supportLinks = [
  { label: "Search", href: "/search" },
  { label: "Size Guide", href: "/products" },
  { label: "Shipping Notes", href: "/products" },
  { label: "Etsy Checkout", href: "https://etsy.com" },
];

const promises = [
  { icon: PackageCheck, label: "Made to order" },
  { icon: Truck, label: "Gift-ready delivery" },
  { icon: ShieldCheck, label: "Secure checkout" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-[#ead7c7] bg-[#fff7ef] text-[#251611]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-[#ead7c7] bg-[#fffdf9] shadow-[0_24px_80px_rgba(124,82,58,0.1)]">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-7 p-6 sm:p-8 lg:p-10">
              <Link
                href="/"
                className="group inline-flex items-center gap-3"
                aria-label="Knitty Petit home"
              >
                <span className="grid size-14 place-items-center overflow-hidden rounded-2xl border border-[#ead7c7] bg-white shadow-sm transition-transform duration-300 group-hover:-rotate-3">
                  <Image
                    src="/logo.png"
                    alt="Knitty Petit logo"
                    width={44}
                    height={44}
                    className="scale-125"
                  />
                </span>
                <span>
                  <span className="block text-lg font-black uppercase tracking-[0.12em]">
                    Knitty Petit
                  </span>
                  <span className="mt-1 block text-sm font-medium text-[#7a6258]">
                    Handmade crochet studio
                  </span>
                </span>
              </Link>

              <div className="max-w-xl space-y-4">
                <p className="text-3xl font-black leading-[1.02] tracking-tight sm:text-4xl">
                  Soft little keepsakes, stitched for the stories you keep.
                </p>
                <p className="max-w-lg text-sm leading-7 text-[#7a6258] sm:text-base">
                  Personalized crochet baby gifts, nursery pieces, and custom
                  sweaters made with warm colors, careful detail, and a
                  preview-first ordering flow.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {promises.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 rounded-2xl border border-[#ead7c7] bg-[#fff7ef] px-4 py-3"
                    >
                      <span className="grid size-9 place-items-center rounded-full bg-[#cf6f3f] text-white shadow-[0_10px_24px_rgba(207,111,63,0.24)]">
                        <Icon className="size-4" />
                      </span>
                      <span className="text-sm font-bold text-[#4d3b34]">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-[#ead7c7] bg-[#251611] p-6 text-white sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
              <div className="flex h-full flex-col justify-between gap-8">
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#ffe4d0]">
                    <Sparkles className="size-3.5" />
                    Start a custom gift
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-2xl font-black leading-tight sm:text-3xl">
                      Design a name sweater before it reaches your cart.
                    </h2>
                    <p className="text-sm leading-7 text-[#f5d6bd]">
                      Choose a color, add a name, place icons, then carry the
                      exact personalization details into Etsy.
                    </p>
                  </div>
                  <Link
                    href="/products/kids-sweater"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#cf6f3f] px-6 py-3 text-sm font-black text-white shadow-[0_18px_40px_rgba(207,111,63,0.24)] transition-colors hover:bg-[#dd7d4e] focus:outline-none focus:ring-2 focus:ring-[#f5d6bd] focus:ring-offset-2 focus:ring-offset-[#251611]"
                  >
                    Customize a sweater
                    <ArrowRight className="size-4" />
                  </Link>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.18em] text-[#f5d6bd]">
                      Shop
                    </h3>
                    <ul className="mt-4 space-y-3">
                      {shopLinks.map((link) => (
                        <li key={link.label}>
                          <Link
                            href={link.href}
                            className="text-sm font-semibold text-white/82 transition-colors hover:text-white"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.18em] text-[#f5d6bd]">
                      Help
                    </h3>
                    <ul className="mt-4 space-y-3">
                      {supportLinks.map((link) => (
                        <li key={link.label}>
                          <Link
                            href={link.href}
                            className="text-sm font-semibold text-white/82 transition-colors hover:text-white"
                            target={link.href.startsWith("http") ? "_blank" : undefined}
                            rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-[#ead7c7] bg-white px-6 py-5 text-sm text-[#7a6258] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
            <p className="flex items-center gap-1.5">
              © {year} Knitty Petit. Made with
              <Heart className="size-3.5 fill-[#cf6f3f] text-[#cf6f3f]" />
              and careful stitches.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="mailto:hello@knittypetit.com"
                className="inline-flex items-center gap-2 rounded-full border border-[#ead7c7] px-3 py-2 font-semibold text-[#5c4036] transition-colors hover:bg-[#fff1e6]"
              >
                <Mail className="size-4" />
                Email
              </Link>
              <Link
                href="https://instagram.com/knittypetit"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#ead7c7] px-3 py-2 font-semibold text-[#5c4036] transition-colors hover:bg-[#fff1e6]"
              >
                <Instagram className="size-4" />
                Instagram
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
