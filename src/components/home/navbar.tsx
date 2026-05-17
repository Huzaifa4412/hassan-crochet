"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, Search, UserRound, X } from "lucide-react";
import { SearchDropdown } from "@/components/search/SearchDropdown";
import TimerClock from "../TimerClock";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "Journal", href: "/blog" },
  { name: "About", href: "/about" },
];

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#ead7c7]/80 bg-[#fffaf4]/88 shadow-[0_10px_40px_rgba(86,52,32,0.06)] backdrop-blur-xl">
        <div className="flex min-h-10 items-center justify-center gap-3 bg-[#b85e37] px-4 py-2 text-center text-sm font-medium text-white">
          <span>Up to 40% off custom keepsakes</span>
          <span className="hidden h-1 w-1 rounded-full bg-white/55 sm:block" />
          <TimerClock />
        </div>

        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 lg:hidden">
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => setIsMenuOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#e3cdbd] bg-white text-[#31211b] shadow-sm"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </motion.button>
          </div>

          <Link href="/" className="flex items-center gap-3">
            <span className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-[0_12px_30px_rgba(70,42,26,0.08)]">
              <Image
                alt="Knitty Petit logo"
                src="/logo.png"
                width={80}
                height={80}
                className="h-10 w-10 object-contain"
              />
            </span>
            <span className="leading-none">
              <span className="block text-sm font-semibold uppercase text-[#281b16]">
                Knitty Petit
              </span>
              <span className="mt-1 block text-xs font-medium text-[#8b7569]">
                Handmade crochet studio
              </span>
            </span>
          </Link>

          <div className="hidden items-center rounded-full border border-[#ead7c7] bg-white/75 p-1 shadow-[0_12px_30px_rgba(70,42,26,0.06)] lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="rounded-full px-4 py-2 text-sm font-semibold text-[#6f5a50] transition-colors hover:bg-[#fff1e6] hover:text-[#a94f2c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bf6036]"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex min-w-0 items-center justify-end gap-2">
            <AnimatePresence mode="wait">
              {isSearchOpen ? (
                <motion.div
                  key="search"
                  initial={{ opacity: 0, width: 120 }}
                  animate={{ opacity: 1, width: 330 }}
                  exit={{ opacity: 0, width: 120 }}
                  transition={{ duration: 0.25 }}
                  className="hidden items-center gap-2 overflow-hidden md:flex"
                >
                  <SearchDropdown className="w-full shadow-sm" />
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#7c665b] hover:bg-[#fff1e6]"
                    aria-label="Close search"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="actions"
                  initial={false}
                  className="flex items-center gap-2"
                >
                  <motion.button
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsSearchOpen(true)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#e3cdbd] bg-white text-[#31211b] shadow-sm transition-colors hover:bg-[#fff1e6]"
                    aria-label="Search"
                  >
                    <Search className="h-5 w-5" />
                  </motion.button>
                  <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      href="/studio"
                      className="hidden h-11 items-center gap-2 rounded-full bg-[#31211b] px-4 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(49,33,27,0.16)] transition-colors hover:bg-[#4a3329] sm:inline-flex"
                    >
                      <UserRound className="h-4 w-4" />
                      Studio
                    </Link>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-[60] bg-[#231814]/25 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed bottom-0 left-0 top-0 z-[70] flex w-[min(86vw,340px)] flex-col bg-[#fffaf4] p-6 shadow-2xl lg:hidden"
            >
              <div className="mb-10 flex items-center justify-between">
                <Link
                  href="/"
                  className="flex items-center gap-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Image
                    alt="Knitty Petit logo"
                    src="/logo.png"
                    width={44}
                    height={44}
                    className="h-10 w-10 object-contain"
                  />
                  <span className="text-sm font-semibold uppercase text-[#281b16]">
                    Knitty Petit
                  </span>
                </Link>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#6f5a50]"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <ul className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block rounded-2xl border border-[#ead7c7] bg-white px-5 py-4 text-xl font-semibold text-[#31211b] shadow-sm transition-colors hover:bg-[#fff1e6]"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-auto rounded-3xl bg-[#f3dfcf] p-5 text-sm leading-6 text-[#6f5a50]">
                Custom crochet gifts, previewed with care and finished by hand.
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
