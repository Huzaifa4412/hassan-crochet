"use client";

import { useState, useEffect } from "react";
import {
  Link2,
  Check,
  Share2,
  Bookmark,
  ChevronUp,
  Sparkles,
  MessageCircle,
  Twitter,
} from "lucide-react";
import type { HeadingItem } from "@/lib/blog-utils";
import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Top reading progress bar pinned to the viewport
 */
export function ReadingProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-600 via-rose-500 to-amber-700 z-50 origin-left shadow-sm"
      aria-hidden="true"
    />
  );
}

/**
 * Floating Scroll-To-Top button with smooth entrance
 */
export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      onClick={scrollToTop}
      aria-label="Scroll to top of article"
      className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-stone-900/90 hover:bg-amber-800 text-white dark:bg-stone-100 dark:hover:bg-amber-400 dark:text-stone-900 shadow-xl backdrop-blur-md border border-stone-700/30 transition-all duration-200 group"
    >
      <ChevronUp className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
    </motion.button>
  );
}

/**
 * Interactive Bookmark button with LocalStorage persistence
 */
export function BookmarkButton({ slug, title }: { slug: string; title: string }) {
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("kp_bookmarked_posts");
      if (saved) {
        const list = JSON.parse(saved);
        if (Array.isArray(list) && list.includes(slug)) {
          setBookmarked(true);
        }
      }
    } catch {
      // ignore
    }
  }, [slug]);

  const toggleBookmark = () => {
    try {
      const saved = localStorage.getItem("kp_bookmarked_posts");
      let list = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(list)) list = [];

      if (bookmarked) {
        list = list.filter((s: string) => s !== slug);
        setBookmarked(false);
      } else {
        list.push(slug);
        setBookmarked(true);
      }
      localStorage.setItem("kp_bookmarked_posts", JSON.stringify(list));
    } catch {
      // ignore
    }
  };

  return (
    <button
      onClick={toggleBookmark}
      aria-label={bookmarked ? "Remove bookmark" : "Bookmark this article"}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
        bookmarked
          ? "bg-amber-100/90 text-amber-900 border-amber-300 dark:bg-amber-950/70 dark:text-amber-200 dark:border-amber-800"
          : "bg-white/80 dark:bg-stone-900/80 text-stone-700 dark:text-stone-300 border-stone-200/80 dark:border-stone-800 hover:border-amber-300"
      }`}
    >
      <Bookmark
        className={`h-3.5 w-3.5 ${
          bookmarked ? "fill-amber-700 text-amber-700 dark:fill-amber-400 dark:text-amber-400" : "text-stone-400"
        }`}
      />
      <span>{bookmarked ? "Saved" : "Save Story"}</span>
    </button>
  );
}

/**
 * Modern Share widget with Copy Link, Pinterest, WhatsApp & Twitter/X
 */
export function BlogShareButtons({
  title,
  url,
  compact = false,
}: {
  title: string;
  url: string;
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
    }
  };

  const handleTwitterShare = () => {
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      title
    )}&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  const handlePinterestShare = () => {
    const shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
      url
    )}&description=${encodeURIComponent(title)}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  const handleWhatsAppShare = () => {
    const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      `${title} ${url}`
    )}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {!compact && (
        <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 mr-1 hidden sm:flex items-center gap-1.5">
          <Share2 className="h-3.5 w-3.5" />
          Share:
        </span>
      )}

      {/* Copy link */}
      <button
        onClick={handleCopy}
        aria-label="Copy article link"
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 border shadow-2xs ${
          copied
            ? "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
            : "bg-white dark:bg-stone-900 border-stone-200/90 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-amber-400 hover:text-amber-800"
        }`}
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-emerald-600" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Link2 className="h-3.5 w-3.5 text-stone-400" />
            <span>Copy</span>
          </>
        )}
      </button>

      {/* Pinterest */}
      <button
        onClick={handlePinterestShare}
        aria-label="Share on Pinterest"
        title="Pin on Pinterest"
        className="rounded-full border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-900 px-3 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-300 hover:border-rose-400 hover:text-rose-700 dark:hover:text-rose-400 transition-colors shadow-2xs"
      >
        Pinterest
      </button>

      {/* WhatsApp */}
      <button
        onClick={handleWhatsAppShare}
        aria-label="Share via WhatsApp"
        title="Share via WhatsApp"
        className="rounded-full border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-900 px-2.5 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-300 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors shadow-2xs inline-flex items-center gap-1"
      >
        <MessageCircle className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">WhatsApp</span>
      </button>

      {/* Twitter / X */}
      <button
        onClick={handleTwitterShare}
        aria-label="Share on X (Twitter)"
        title="Share on X"
        className="rounded-full border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-900 px-2.5 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-300 hover:border-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors shadow-2xs inline-flex items-center"
      >
        <Twitter className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

/**
 * Dynamic Scroll-Spy Table of Contents with active heading tracking
 */
export function TableOfContents({
  headings,
  isSidebar = false,
}: {
  headings: HeadingItem[];
  isSidebar?: boolean;
}) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (!headings || headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0% -65% 0%",
        threshold: 0,
      }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (!headings || headings.length === 0) return null;

  if (isSidebar) {
    return (
      <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white/70 dark:bg-stone-900/70 p-5 backdrop-blur-sm shadow-2xs">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-stone-100 dark:border-stone-800 text-stone-900 dark:text-stone-100">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-600 animate-pulse" />
          <h4 className="font-serif font-bold text-sm uppercase tracking-wider text-stone-900 dark:text-stone-100">
            In This Guide
          </h4>
        </div>
        <nav aria-label="Table of contents navigation">
          <ul className="space-y-2 text-xs">
            {headings.map((h, i) => {
              const isActive = activeId === h.id;
              return (
                <li
                  key={h.id || i}
                  className={`${h.level === 3 ? "pl-3 text-[11px]" : ""}`}
                >
                  <a
                    href={`#${h.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const target = document.getElementById(h.id);
                      if (target) {
                        target.scrollIntoView({ behavior: "smooth", block: "start" });
                        setActiveId(h.id);
                      }
                    }}
                    className={`group flex items-start gap-2 py-1 rounded-md transition-all duration-150 ${
                      isActive
                        ? "text-amber-900 dark:text-amber-300 font-semibold pl-1.5 border-l-2 border-amber-600 dark:border-amber-400"
                        : "text-stone-600 dark:text-stone-400 hover:text-amber-800 dark:hover:text-amber-300"
                    }`}
                  >
                    <span
                      className={`font-mono shrink-0 ${
                        isActive
                          ? "text-amber-700 dark:text-amber-400 font-bold"
                          : "text-stone-400 dark:text-stone-500"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="line-clamp-2 leading-relaxed">{h.text}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    );
  }

  // Inline version
  return (
    <nav
      aria-label="Table of contents"
      className="my-10 overflow-hidden rounded-3xl border border-amber-200/80 dark:border-amber-900/50 bg-gradient-to-br from-amber-50/70 via-[#fcfaf7] to-stone-50/50 dark:from-amber-950/20 dark:to-stone-900/40 p-6 sm:p-7 shadow-sm"
    >
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-amber-200/50 dark:border-amber-900/40">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-amber-100 dark:bg-amber-950/80 flex items-center justify-center text-amber-800 dark:text-amber-300">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-serif font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100">
            Quick Navigation &amp; Table of Contents
          </span>
        </div>
        <span className="text-xs font-semibold text-stone-400">
          {headings.length} sections
        </span>
      </div>

      <ol className="grid gap-2 sm:grid-cols-2 text-sm">
        {headings.map((h, i) => (
          <li
            key={h.id || i}
            className={h.level === 3 ? "sm:pl-3 opacity-90" : ""}
          >
            <a
              href={`#${h.id}`}
              className="text-stone-700 dark:text-stone-300 hover:text-amber-800 dark:hover:text-amber-300 font-medium transition-colors inline-flex items-center gap-2.5 py-1"
            >
              <span className="h-5 w-5 rounded-md bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700 text-amber-800 dark:text-amber-400 text-[11px] font-mono font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <span className="line-clamp-1">{h.text}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
