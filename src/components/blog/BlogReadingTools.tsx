"use client";

import { useState } from "react";
import { Link2, Check, Share2 } from "lucide-react";
import type { HeadingItem } from "@/lib/blog-utils";

interface BlogReadingToolsProps {
  title: string;
  url: string;
  headings: HeadingItem[];
}

export function BlogShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(url || window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
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

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-stone-500 mr-1 flex items-center gap-1.5">
        <Share2 className="h-3.5 w-3.5" />
        Share:
      </span>

      <button
        onClick={handleCopy}
        aria-label="Copy article link"
        className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-3 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-300 hover:border-amber-400 hover:text-amber-800 transition-colors shadow-2xs"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-emerald-600" />
            <span className="text-emerald-700 dark:text-emerald-400">Copied!</span>
          </>
        ) : (
          <>
            <Link2 className="h-3.5 w-3.5 text-stone-400" />
            <span>Copy Link</span>
          </>
        )}
      </button>

      <button
        onClick={handlePinterestShare}
        aria-label="Share on Pinterest"
        className="rounded-full border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-3 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-300 hover:border-rose-400 hover:text-rose-700 transition-colors shadow-2xs"
      >
        Pinterest
      </button>

      <button
        onClick={handleTwitterShare}
        aria-label="Share on X / Twitter"
        className="rounded-full border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-3 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-300 hover:border-sky-400 hover:text-sky-700 transition-colors shadow-2xs"
      >
        X / Twitter
      </button>
    </div>
  );
}

export function TableOfContents({ headings }: { headings: HeadingItem[] }) {
  if (!headings || headings.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="my-10 overflow-hidden rounded-2xl border border-amber-200/70 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20 p-5 sm:p-6"
    >
      <div className="flex items-center gap-2 mb-3 text-stone-900 dark:text-stone-100 font-serif font-bold text-base">
        <span>In this story:</span>
      </div>
      <ol className="space-y-2 text-sm">
        {headings.map((h, i) => (
          <li
            key={h.id || i}
            className={h.level === 3 ? "ml-4" : ""}
          >
            <a
              href={`#${h.id}`}
              className="text-stone-700 dark:text-stone-300 hover:text-amber-800 dark:hover:text-amber-400 font-medium transition-colors inline-flex items-center gap-2"
            >
              <span className="text-amber-700/60 dark:text-amber-400/60 text-xs font-mono">
                {String(i + 1).padStart(2, "0")}.
              </span>
              <span>{h.text}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
