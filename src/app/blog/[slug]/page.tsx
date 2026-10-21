import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { getPostBySlug, getAllPostSlugs, getAllPosts } from "@/sanity/queries";
import { urlFor } from "@/sanity/lib/image";
import { portableTextComponents } from "@/components/blog/PortableTextComponents";
import { BlogShareButtons, TableOfContents } from "@/components/blog/BlogReadingTools";
import BlogCard from "@/components/blog/BlogCard";
import { CalendarDays, Clock, ArrowLeft, ArrowRight, Tag, Sparkles, HeartHandshake } from "lucide-react";
import { absoluteUrl, buildMetadata, siteName, siteUrl } from "@/lib/seo";
import { calculateReadingTime, estimateWordCount, extractHeadings } from "@/lib/blog-utils";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((s) => ({ slug: s.slug.current }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return {};

  const ogImageUrl = post.mainImage?.asset
    ? urlFor(post.mainImage).width(1200).height(630).fit("crop").auto("format").url()
    : `${siteUrl}/home1.webp`;

  const description =
    post.excerpt ?? `Read ${post.title} on the Knitty Petit Journal.`;

  return {
    ...buildMetadata({
      title: `${post.title} | Knitty Petit Journal`,
      description,
      path: `/blog/${post.slug.current}`,
      image: ogImageUrl,
      type: "article",
    }),
    keywords: [
      post.title,
      "baby shower gifts",
      "hand embroidered baby sweater",
      "personalized kids knitwear",
      "knitty petit journal",
      ...(post.categories || []),
    ],
    openGraph: {
      title: `${post.title} | Knitty Petit Journal`,
      description,
      url: absoluteUrl(`/blog/${post.slug.current}`),
      siteName,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.publishedAt,
      authors: post.author?.name ? [post.author.name] : [siteName],
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.mainImage?.alt ?? post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [ogImageUrl],
    },
  };
}

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

function buildArticleJsonLd(post: NonNullable<Awaited<ReturnType<typeof getPostBySlug>>>) {
  const imageUrl = post.mainImage?.asset
    ? urlFor(post.mainImage).width(1200).height(630).fit("crop").auto("format").url()
    : undefined;

  const readingMinutes = calculateReadingTime(post.body as any, post.excerpt);
  const wordCount = estimateWordCount(post.body as any, post.excerpt);
  const articleUrl = absoluteUrl(`/blog/${post.slug.current}`);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Journal",
            item: absoluteUrl("/blog"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: post.title,
            item: articleUrl,
          },
        ],
      },
      {
        "@type": "BlogPosting",
        "@id": `${articleUrl}#article`,
        isPartOf: {
          "@type": "Blog",
          "@id": absoluteUrl("/blog#blog"),
          name: "The Knitty Petit Journal",
        },
        headline: post.title,
        description: post.excerpt ?? "",
        datePublished: post.publishedAt,
        dateModified: post.publishedAt,
        wordCount,
        timeRequired: `PT${readingMinutes}M`,
        inLanguage: "en-US",
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": articleUrl,
        },
        image: imageUrl ? [imageUrl] : undefined,
        author: {
          "@type": "Person",
          name: post.author?.name || siteName,
          ...(post.author?.bio ? { description: post.author.bio } : {}),
        },
        publisher: {
          "@type": "Organization",
          name: siteName,
          url: siteUrl,
          logo: {
            "@type": "ImageObject",
            url: absoluteUrl("/logo.png"),
          },
        },
      },
    ],
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  // Fetch all posts to surface related stories at the bottom
  const allPosts = await getAllPosts();
  const relatedPosts = allPosts
    .filter((p) => p.slug.current !== post.slug.current)
    .slice(0, 3);

  const heroImageUrl = post.mainImage?.asset
    ? urlFor(post.mainImage).width(1400).height(850).fit("crop").auto("format").url()
    : null;

  const authorImageUrl = post.author?.image?.asset
    ? urlFor(post.author.image).width(160).height(160).fit("crop").url()
    : null;

  const readingMinutes = calculateReadingTime(post.body as any, post.excerpt);
  const headings = extractHeadings(post.body as any);
  const currentUrl = absoluteUrl(`/blog/${post.slug.current}`);
  const jsonLd = buildArticleJsonLd(post);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="min-h-screen bg-[#faf8f5] dark:bg-stone-950 text-stone-900 dark:text-stone-100">
        {/* ── Breadcrumb & Navigation Bar ───────────────────────────────── */}
        <div className="border-b border-stone-200/80 dark:border-stone-800 bg-[#f5ede4]/60 dark:bg-stone-900/60 backdrop-blur-sm sticky top-0 z-30">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-3 flex items-center justify-between">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:text-amber-800 dark:hover:text-amber-400 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Journal</span>
            </Link>

            <BlogShareButtons title={post.title} url={currentUrl} />
          </div>
        </div>

        {/* ── Editorial Header ─────────────────────────────────────────── */}
        <header className="container mx-auto max-w-4xl px-4 sm:px-6 pt-10 sm:pt-14 pb-8 space-y-6">
          {/* Breadcrumb text */}
          <nav aria-label="Breadcrumb" className="text-xs font-medium text-stone-500">
            <ol className="flex items-center gap-2 flex-wrap">
              <li>
                <Link href="/" className="hover:text-amber-800 transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-stone-300">/</li>
              <li>
                <Link href="/blog" className="hover:text-amber-800 transition-colors">
                  Journal
                </Link>
              </li>
              {post.categories?.[0] && (
                <>
                  <li aria-hidden="true" className="text-stone-300">/</li>
                  <li className="text-stone-600">{formatCategory(post.categories[0])}</li>
                </>
              )}
            </ol>
          </nav>

          {/* Categories */}
          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.categories.map((cat) => (
                <span
                  key={cat}
                  className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/80 dark:bg-amber-950/70 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-amber-900 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60"
                >
                  <Tag className="h-3 w-3" />
                  {formatCategory(cat)}
                </span>
              ))}
            </div>
          )}

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-stone-900 dark:text-stone-50 tracking-tight leading-[1.14] text-balance">
            {post.title}
          </h1>

          {/* Excerpt / Lead */}
          {post.excerpt && (
            <p className="text-lg sm:text-xl text-stone-600 dark:text-stone-300 font-normal leading-relaxed pt-1">
              {post.excerpt}
            </p>
          )}

          {/* Author & Meta Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-stone-200/80 dark:border-stone-800">
            {/* Author */}
            <div className="flex items-center gap-3.5">
              <div className="relative h-11 w-11 rounded-full overflow-hidden border-2 border-white dark:border-stone-800 shadow-sm bg-stone-100">
                {authorImageUrl ? (
                  <Image
                    src={authorImageUrl}
                    alt={post.author?.name || "Author"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm font-bold text-amber-800 bg-amber-100">
                    {post.author?.name?.[0] || "K"}
                  </div>
                )}
              </div>
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  Written by
                </span>
                <span className="block text-sm font-bold text-stone-900 dark:text-stone-100">
                  {post.author?.name || "Knitty Petit Studio"}
                </span>
              </div>
            </div>

            {/* Date & Reading Time */}
            <div className="flex items-center gap-4 text-xs font-medium text-stone-500 dark:text-stone-400">
              {post.publishedAt && (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-stone-400" />
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                </span>
              )}
              <span className="text-stone-300 dark:text-stone-700">•</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-stone-400" />
                <span>{readingMinutes} min read</span>
              </span>
            </div>
          </div>
        </header>

        {/* ── Featured Hero Image ───────────────────────────────────────── */}
        {heroImageUrl && (
          <section className="container mx-auto max-w-4xl px-4 sm:px-6 my-6 sm:my-8">
            <figure className="relative overflow-hidden rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 shadow-lg">
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full">
                <Image
                  src={heroImageUrl}
                  alt={post.mainImage?.alt ?? post.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 896px, 100vw"
                  className="object-cover"
                />
              </div>
              {post.mainImage?.alt && (
                <figcaption className="p-3 text-center text-xs text-stone-500 dark:text-stone-400 bg-stone-50/80 dark:bg-stone-900/80 border-t border-stone-100 dark:border-stone-800 font-serif italic">
                  {post.mainImage.alt}
                </figcaption>
              )}
            </figure>
          </section>
        )}

        {/* ── Main Content Area ────────────────────────────────────────── */}
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 py-6 sm:py-10">
          {/* Table of contents if headings exist */}
          <TableOfContents headings={headings} />

          {/* PortableText rich body */}
          <section className="article-body">
            {post.body ? (
              <PortableText
                value={post.body as Parameters<typeof PortableText>[0]["value"]}
                components={portableTextComponents}
              />
            ) : (
              <p className="py-12 text-center text-stone-500 italic">
                This story is being handcrafted. Check back soon for the full text.
              </p>
            )}
          </section>

          {/* ── Keepsake Customizer Embedded Callout ───────────────────── */}
          <div className="my-14 overflow-hidden rounded-3xl border border-amber-200/80 dark:border-amber-900/60 bg-gradient-to-br from-amber-50 to-[#faf0e6] dark:from-stone-900 dark:to-amber-950/30 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-2xl overflow-hidden shrink-0 border-2 border-white dark:border-stone-800 shadow-md">
                <Image
                  src="/home1.webp"
                  alt="Personalized hand embroidered sweater"
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </div>

              <div className="space-y-3 text-center sm:text-left flex-1">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
                  <Sparkles className="h-3.5 w-3.5" />
                  Featured Keepsake
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
                  Hand Embroidered Kids Name Sweater
                </h3>
                <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                  Available in 16 timeless shades including Camel, Oatmeal, and Rose. Personalize their name and playful motifs.
                </p>
                <div className="pt-1">
                  <Link
                    href="/products/hand-embroidered-kids-name-sweaters"
                    className="inline-flex items-center gap-2 rounded-full bg-stone-900 hover:bg-amber-800 text-white dark:bg-stone-100 dark:hover:bg-amber-300 dark:text-stone-900 text-xs font-semibold px-5 py-2.5 transition-colors shadow-sm"
                  >
                    <span>Customize Your Sweater</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ── Author Bio Card ────────────────────────────────────────── */}
          {post.author && (
            <div className="my-12 p-6 sm:p-7 rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900/80 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left shadow-2xs">
              <div className="relative h-16 w-16 rounded-full overflow-hidden shrink-0 border border-stone-200">
                {authorImageUrl ? (
                  <Image
                    src={authorImageUrl}
                    alt={post.author.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-lg text-amber-800 bg-amber-100">
                    {post.author.name[0]}
                  </div>
                )}
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                    {post.author.name}
                  </h4>
                  <span className="text-[10px] font-semibold text-amber-800 bg-amber-100/80 dark:text-amber-300 dark:bg-amber-950/60 px-2 py-0.5 rounded-full">
                    Artisan & Creator
                  </span>
                </div>
                {post.author.bio && (
                  <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                    {post.author.bio}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ── Share Story at Bottom ───────────────────────────────────── */}
          <div className="pt-8 pb-12 border-t border-stone-200/80 dark:border-stone-800 flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-amber-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to all stories</span>
            </Link>

            <BlogShareButtons title={post.title} url={currentUrl} />
          </div>
        </div>

        {/* ── Related Articles Section ─────────────────────────────────── */}
        {relatedPosts.length > 0 && (
          <section className="border-t border-stone-200/80 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-900/40 py-16">
            <div className="container mx-auto max-w-6xl px-4 sm:px-6">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                    Keep Reading
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 mt-1">
                    More stories from our studio
                  </h3>
                </div>
                <Link
                  href="/blog"
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-amber-800 transition-colors"
                >
                  <span>Explore all</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((related) => (
                  <div key={related._id} className="h-full">
                    <BlogCard post={related} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>
    </>
  );
}
