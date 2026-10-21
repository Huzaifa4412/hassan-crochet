"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { PostPreview } from "@/sanity/queries";
import { urlFor } from "@/sanity/lib/image";
import { CalendarDays, Clock, ArrowRight, Tag } from "lucide-react";
import { calculateReadingTime } from "@/lib/blog-utils";

interface BlogCardProps {
  post: PostPreview;
  priority?: boolean;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatCategory(cat: string): string {
  return cat
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function BlogCard({ post, priority = false }: BlogCardProps) {
  const imageUrl = post.mainImage?.asset
    ? urlFor(post.mainImage).width(800).height(520).fit("crop").auto("format").url()
    : null;

  const firstCategory = post.categories?.[0];
  const readingTime = calculateReadingTime(undefined, post.excerpt);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col h-full overflow-hidden rounded-2xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-900/90 shadow-[0_4px_20px_-6px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_36px_-10px_rgba(120,53,15,0.12)] transition-all duration-300"
    >
      {/* Featured Image */}
      <Link
        href={`/blog/${post.slug.current}`}
        className="relative block aspect-[16/10] overflow-hidden bg-stone-100 dark:bg-stone-800 shrink-0"
        aria-label={`Read story: ${post.title}`}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.mainImage?.alt ?? post.title}
            fill
            priority={priority}
            sizes="(min-width: 1200px) 380px, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-amber-50 to-stone-100 dark:from-stone-800 dark:to-stone-900">
            <span className="text-5xl opacity-40 group-hover:scale-110 transition-transform duration-300">
              🧶
            </span>
          </div>
        )}

        {/* Category Pill Tag */}
        {firstCategory && (
          <div className="absolute top-3.5 left-3.5 z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 dark:bg-stone-900/95 text-stone-800 dark:text-stone-200 text-[11px] font-semibold tracking-wide px-3 py-1 shadow-sm backdrop-blur-md border border-stone-200/50">
              <Tag className="h-3 w-3 text-amber-700 dark:text-amber-400" />
              {formatCategory(firstCategory)}
            </span>
          </div>
        )}
      </Link>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-6 sm:p-7 justify-between gap-4">
        <div className="space-y-3">
          {/* Metadata: Date + Reading Time */}
          <div className="flex items-center gap-3 text-xs font-medium text-stone-500 dark:text-stone-400">
            {post.publishedAt && (
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-stone-400" />
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              </span>
            )}
            <span className="text-stone-300 dark:text-stone-700">•</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-stone-400" />
              <span>{readingTime} min read</span>
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl sm:text-[22px] font-serif font-bold text-stone-900 dark:text-stone-100 leading-snug group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
            <Link href={`/blog/${post.slug.current}`}>
              {post.title}
            </Link>
          </h3>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed line-clamp-3">
              {post.excerpt}
            </p>
          )}
        </div>

        {/* Card Footer: Author + Read Link */}
        <div className="pt-4 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between">
          {post.author?.name ? (
            <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              By {post.author.name}
            </span>
          ) : (
            <span className="text-xs font-medium text-stone-400">Knitty Petit Studio</span>
          )}

          <Link
            href={`/blog/${post.slug.current}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-400 group-hover:translate-x-0.5 transition-transform"
            tabIndex={-1}
            aria-hidden="true"
          >
            <span>Read story</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
