"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { SearchDropdown } from "@/components/search/SearchDropdown";
import { X, Menu } from "lucide-react";
import TimerClock from "../TimerClock";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Journal", href: "/blog" },
    { name: "About", href: "/about" },
    { name: "Products", href: "/products" },
  ];

  return (
    <>
      {/* 1. HEADER CONTAINER: Must be relative with a high z-index so the wave overlaps the content below */}
      <header className="relative bg-white z-50">
        {/* Announcement Bar */}
        <div className="fixed top-0 left-0 right-0 bg-orange-300 text-white text-sm text-center py-2.5 font-medium flex items-center justify-center gap-2">
          <span className="text-sm">📦 Hurry! Up to 40% Off Ends Soon</span>{" "}
          <TimerClock />
        </div>

        {/* Main Navbar */}
        <nav className="max-w-[1600px]  mt-10 mx-auto px-4 sm:px-8 py-5 flex items-start justify-between">
          {/* LEFT: Nav Links (Wraps into two lines automatically if needed) */}
          <div className="hidden lg:flex flex-col gap-3 w-1/3 mt-2">
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-lg  text-gray-800">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-gray-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* MOBILE MENU TOGGLE: Visible on smaller screens */}
          <div className="lg:hidden flex items-center w-1/3 mt-3">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 -ml-2 text-gray-700 hover:text-gray-900 transition-colors focus:outline-none"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* CENTER: Logo */}
          <div className="flex-shrink-0 flex items-center justify-center w-1/3">
            <Link href="/" className="flex items-center gap-3">
              {/* Replace this emoji with your actual next/image sheep logo */}
              <Image
                alt="Logo"
                src={"/logo.png"}
                width={500}
                height={500}
                className="size-12"
              />
              <div className="text-center tracking-[0.25em] leading-[1.1] text-gray-500 font-light">
                <div className="text-lg">KNITTY</div>
                <div className="text-lg">BABY</div>
              </div>
            </Link>
          </div>

          {/* RIGHT: Utility Icons */}
          <div className="flex items-center justify-end w-1/3 text-gray-700 mt-3">
            {isSearchOpen ? (
              <div className="flex items-center w-full max-w-[350px] gap-2 ml-auto z-50">
                <div className="flex-1">
                  <SearchDropdown className="w-full shadow-sm" />
                </div>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 -mr-2 text-gray-500 hover:text-gray-900 transition-colors focus:outline-none"
                  aria-label="Close search"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="hover:text-gray-400 transition-colors"
                  aria-label="Search"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </button>
                <button
                  className="hover:text-gray-400 transition-colors"
                  aria-label="Account"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                </button>
                {/* <button
                  className="hover:text-gray-400 transition-colors"
                  aria-label="Cart"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    ></path>
                  </svg>
                </button> */}
              </div>
            )}
          </div>
        </nav>

        {/* 2. THE SVG WAVE DIVIDER */}
        {/* translate-y-[99%] pushes it exactly to the bottom edge of the white header */}
        <div className="absolute bottom-0 left-0 w-full translate-y-[99%] overflow-hidden leading-[0]">
          <svg
            className="block w-[calc(100%+1.3px)] h-[40px] md:h-[65px]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="fill-white"
            ></path>
          </svg>
        </div>
      </header>
      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] lg:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-white z-[70] shadow-2xl lg:hidden p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-10">
                <Link
                  href="/"
                  className="flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Image
                    alt="Logo"
                    src={"/logo.png"}
                    width={40}
                    height={40}
                    className="size-8"
                  />
                  <span className="font-light tracking-widest text-sm text-gray-500">
                    KNITTY BABY
                  </span>
                </Link>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 -mr-2 text-gray-500 hover:text-gray-900 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <ul className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-2xl font-light text-gray-800 hover:text-orange-400 transition-colors block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-10 border-t border-gray-100">
                <p className="text-sm text-gray-400 font-light">
                  Handmade with love for your little ones.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
