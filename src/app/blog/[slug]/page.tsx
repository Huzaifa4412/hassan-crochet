import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";

import { getPostBySlug, getAllPostSlugs } from "@/sanity/queries";
import { urlFor } from "@/sanity/lib/image";
import { portableTextComponents } from "@/components/blog/PortableTextComponents";
import { CalendarDays, User, ArrowLeft, Tag } from "lucide-react";
import { absoluteUrl, buildMetadata, siteName, siteUrl } from "@/lib/seo";

// ── Route configuration ──────────────────────────────────────────────────────

/**
 * ISR: individual post pages revalidate every 60 seconds.
 * On-demand revalidation can be triggered from a Sanity webhook.
 */
export const revalidate = 60;

// ── Static params (SSG) ──────────────────────────────────────────────────────

/**
 * Pre-build routes for all published posts at build time.
 * Any slug not found at build time will be generated on first request
 * (dynamicParams = true, the Next.js default).
 */
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((s) => ({ slug: s.slug.current }));
}

// ── Metadata ─────────────────────────────────────────────────────────────────

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return {};

  const ogImageUrl = post.mainImage?.asset
    ? urlFor(post.mainImage).width(1200).height(630).fit("crop").url()
    : undefined;

  return {
    ...buildMetadata({
      title: `${post.title} - Crochet Blog`,
      description: post.excerpt ?? `Read ${post.title} on the Knitty Petit blog.`,
      path: `/blog/${post.slug.current}`,
      image: ogImageUrl || "/logo.png",
      type: "article",
    }),
    description: post.excerpt ?? `Read ${post.title} on the Knitty Petit blog.`,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: absoluteUrl(`/blog/${post.slug.current}`),
      siteName,
      type: "article",
      publishedTime: post.publishedAt,
      authors: post.author?.name ? [post.author.name] : undefined,
      images: ogImageUrl
        ? [{ url: ogImageUrl, width: 1200, height: 630, alt: post.title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: ogImageUrl ? [ogImageUrl] : [],
    },
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatCategory(cat: string): string {
  return cat
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * Builds a JSON-LD BlogPosting structured data object.
 * Helps search engines understand and display rich results.
 */
function buildJsonLd(post: Awaited<ReturnType<typeof getPostBySlug>>) {
  if (!post) return null;

  const imageUrl = post.mainImage?.asset
    ? urlFor(post.mainImage).width(1200).height(630).fit("crop").url()
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt ?? "",
    datePublished: post.publishedAt ?? "",
    dateModified: post.publishedAt ?? "",
    author: post.author?.name
      ? { "@type": "Person", name: post.author.name }
      : undefined,
    image: imageUrl,
    url: absoluteUrl(`/blog/${post.slug.current}`),
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/logo.png"),
      },
    },
  };
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  // Trigger Next.js built-in 404 page if slug doesn't match any post
  if (!post) notFound();

  const heroImageUrl = post.mainImage?.asset
    ? urlFor(post.mainImage).width(1400).height(700).fit("crop").url()
    : null;

  const authorImageUrl = post.author?.image?.asset
    ? urlFor(post.author.image).width(120).height(120).fit("crop").url()
    : null;

  const jsonLd = buildJsonLd(post);

  return (
    <>
      {/* JSON-LD structured data injected into <head> */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <article className="min-h-screen bg-white dark:bg-zinc-950">
        {/* ── Hero section ─────────────────────────────────────────── */}
        {heroImageUrl ? (
          <div className="relative h-96 w-full overflow-hidden sm:h-[500px] md:h-[600px] lg:h-[700px]">
            <Image
              src={heroImageUrl}
              alt={post.mainImage?.alt ?? post.title}
              fill
              priority
              sizes="100vw"
              className="object-cover object-top"
            />
            {/* Elegant overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-zinc-950 via-transparent to-black/10" />
          </div>
        ) : (
          <div className="h-24 md:h-32" /> // Spacing if no hero
        )}

        {/* ── Content wrapper ────────────────────────────────────── */}
        <div className="container mx-auto max-w-3xl px-6 sm:px-8">
          {/* Back link */}
          <div className="relative pt-12">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-orange-500 transition-colors duration-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Journal
            </Link>
          </div>

          {/* ── Post header ──────────────────────────────────────── */}
          <header className="mt-10 mb-16 space-y-8">
            {/* Categories */}
            {post.categories && post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2.5">
                {post.categories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 dark:bg-orange-900/20 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-900/50"
                  >
                    <Tag className="h-3 w-3" />
                    {formatCategory(cat)}
                  </span>
                ))}
              </div>
            )}

            <div className="space-y-6">
              <h1 className=" text-4xl font-bold leading-[1.1] tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl md:text-6xl text-balance">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="text-xl sm:text-2xl text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                  {post.excerpt}
                </p>
              )}
            </div>

            {/* Premium Meta Row */}
            <div className="flex flex-wrap items-center justify-between gap-6 pt-8 border-t border-zinc-100 dark:border-zinc-900">
              {post.author && (
                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-white dark:border-zinc-800 shadow-sm">
                    {authorImageUrl ? (
                      <Image
                        src={authorImageUrl}
                        alt={post.author.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                        <User className="h-6 w-6 text-zinc-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      Written by
                    </span>
                    <span className="block text-sm font-bold text-zinc-900 dark:text-zinc-50">
                      {post.author.name}
                    </span>
                  </div>
                </div>
              )}

              {post.publishedAt && (
                <div className="flex flex-col items-end">
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-right">
                    Published
                  </span>
                  <span className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-zinc-50 text-right">
                    <CalendarDays className="h-4 w-4 text-orange-400" />
                    {formatDate(post.publishedAt)}
                  </span>
                </div>
              )}
            </div>
          </header>

          {/* ── Rich text body ───────────────────────────────────── */}
          <section className="prose-container">
            {post.body ? (
              <div className="pb-24">
                <PortableText
                  value={
                    post.body as Parameters<typeof PortableText>[0]["value"]
                  }
                  components={portableTextComponents}
                />
              </div>
            ) : (
              <div className="pb-24 py-12 text-center border-t border-zinc-100 dark:border-zinc-900">
                <p className="text-zinc-400 italic font-medium">
                  This story is still being crafted. Check back soon for the
                  full content.
                </p>
              </div>
            )}
          </section>

          {/* ── Footer / CTA ──────────────────────────────────────── */}
          <footer className="mb-24 pt-12 border-t border-zinc-100 dark:border-zinc-900 flex flex-col items-center gap-8 text-center">
            <div className="space-y-3">
              <h3 className=" text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                Thanks for reading
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 max-w-sm">
                We hope you enjoyed this article. Feel free to explore more
                stories from our studio.
              </p>
            </div>

            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full bg-zinc-900 dark:bg-zinc-50 px-8 py-3.5 text-sm font-bold text-white dark:text-zinc-950 hover:bg-orange-500 dark:hover:bg-orange-500 transition-colors duration-300 shadow-lg shadow-zinc-900/10 dark:shadow-none"
            >
              <ArrowLeft className="h-4 w-4" />
              Keep Reading
            </Link>
          </footer>
        </div>
      </article>
    </>
  );
}
