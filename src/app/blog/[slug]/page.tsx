import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { getPostBySlug, getAllPostSlugs, getAllPosts, getProductBySlug } from "@/sanity/queries";
import { urlFor } from "@/sanity/lib/image";
import { portableTextComponents } from "@/components/blog/PortableTextComponents";
import {
  BlogShareButtons,
  TableOfContents,
  ReadingProgressBar,
  ScrollToTopButton,
  BookmarkButton,
} from "@/components/blog/BlogReadingTools";
import BlogCard from "@/components/blog/BlogCard";
import {
  CalendarDays,
  Clock,
  ArrowLeft,
  ArrowRight,
  Tag,
  Sparkles,
  Heart,
  ShieldCheck,
  Star,
  ShoppingBag,
  BookOpen,
  Send,
} from "lucide-react";
import { absoluteUrl, buildMetadata, serializeJsonLd, siteName, siteUrl } from "@/lib/seo";
import { calculateReadingTime, estimateWordCount, extractHeadings, type PortableTextBlock } from "@/lib/blog-utils";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((s) => ({ slug: s.slug.current }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return buildMetadata({ title: "Article Not Found", path: `/blog/${slug}`, noIndex: true });

  const ogImageUrl = post.mainImage?.asset
    ? urlFor(post.mainImage).width(1200).height(630).fit("crop").auto("format").url()
    : `${siteUrl}/home1.webp`;

  const description =
    post.excerpt ?? `Read ${post.title} on the Knitty Petit Journal.`;

  return {
    ...buildMetadata({
      title: post.title,
      description,
      path: `/blog/${post.slug.current}`,
      image: ogImageUrl,
      type: "article",
    }),
    keywords: [
      post.title,
      "baby name sweater sizing",
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
      modifiedTime: post._updatedAt || post.publishedAt,
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

  const readingMinutes = calculateReadingTime(post.body as PortableTextBlock[], post.excerpt);
  const wordCount = estimateWordCount(post.body as PortableTextBlock[], post.excerpt);
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
        dateModified: post._updatedAt || post.publishedAt,
        wordCount,
        timeRequired: `PT${readingMinutes}M`,
        inLanguage: "en-US",
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": articleUrl,
        },
        image: imageUrl ? [imageUrl] : undefined,
        author: {
          "@type": post.author?.name ? "Person" : "Organization",
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

  // Fetch all posts to determine prev/next & related stories
  const allPosts = await getAllPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug.current === post.slug.current);
  const previousPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  const relatedPosts = allPosts
    .filter((p) => p.slug.current !== post.slug.current)
    .sort((a, b) => {
      const overlap = (categories?: string[]) =>
        (categories || []).filter((category) => post.categories?.includes(category)).length;
      return overlap(b.categories) - overlap(a.categories);
    })
    .slice(0, 3);

  // Fetch flagship product to power "Shop the Story" cards
  const featuredProduct = await getProductBySlug("hand-embroidered-kids-name-sweaters");

  const heroImageUrl = post.mainImage?.asset
    ? urlFor(post.mainImage).width(1600).height(960).fit("crop").auto("format").url()
    : null;

  const authorImageUrl = post.author?.image?.asset
    ? urlFor(post.author.image).width(180).height(180).fit("crop").url()
    : null;

  const readingMinutes = calculateReadingTime(post.body as PortableTextBlock[], post.excerpt);
  const wordCount = estimateWordCount(post.body as PortableTextBlock[], post.excerpt);
  const headings = extractHeadings(post.body as PortableTextBlock[]);
  const currentUrl = absoluteUrl(`/blog/${post.slug.current}`);
  const jsonLd = buildArticleJsonLd(post);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      {/* Top Reading Progress Bar */}
      <ReadingProgressBar />

      {/* Floating Scroll to Top */}
      <ScrollToTopButton />

      <article className="min-h-screen bg-[#faf8f5] dark:bg-stone-950 text-stone-900 dark:text-stone-100 selection:bg-amber-100 selection:text-amber-900">
        {/* ── Sticky Top Navigation & Utility Bar ──────────────────────── */}
        <div className="sticky top-0 z-30 border-b border-stone-200/70 dark:border-stone-800/80 bg-[#faf8f5]/85 dark:bg-stone-950/85 backdrop-blur-md transition-all">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:text-amber-800 dark:hover:text-amber-400 transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              <span>The Journal</span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              <BookmarkButton slug={post.slug.current} title={post.title} />
              <BlogShareButtons title={post.title} url={currentUrl} compact />
            </div>
          </div>
        </div>

        {/* ── Editorial Hero Header ────────────────────────────────────── */}
        <header className="relative pt-10 sm:pt-16 pb-8 overflow-hidden bg-gradient-to-b from-[#f5eee6]/60 via-[#faf8f5] to-[#faf8f5] dark:from-stone-900/40 dark:to-stone-950">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 space-y-6">
            {/* Breadcrumb pills */}
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-xs font-semibold tracking-wide hover:bg-stone-200 transition-colors"
              >
                <BookOpen className="h-3 w-3 text-amber-700 dark:text-amber-400" />
                <span>Journal</span>
              </Link>

              {post.categories && post.categories.length > 0 && (
                <>
                  <span className="text-stone-300 dark:text-stone-700">•</span>
                  {post.categories.map((cat) => (
                    <span
                      key={cat}
                      className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/90 dark:bg-amber-950/80 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-amber-900 dark:text-amber-300 border border-amber-200/90 dark:border-amber-800/60 shadow-2xs"
                    >
                      <Tag className="h-3 w-3" />
                      {formatCategory(cat)}
                    </span>
                  ))}
                </>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] font-serif font-bold text-stone-900 dark:text-stone-50 tracking-tight leading-[1.12] text-balance">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-lg sm:text-xl text-stone-600 dark:text-stone-300 font-normal leading-relaxed pt-1 max-w-3xl border-l-2 border-amber-500/60 pl-4 sm:pl-5 italic">
                {post.excerpt}
              </p>
            )}

            {/* Author & Publication Meta Bar */}
            <div className="flex flex-wrap items-center justify-between gap-5 pt-6 border-t border-stone-200/80 dark:border-stone-800">
              <div className="flex items-center gap-3.5">
                <div className="relative h-12 w-12 rounded-full overflow-hidden ring-2 ring-amber-600/30 dark:ring-amber-400/30 shadow-sm bg-stone-100 shrink-0">
                  {authorImageUrl ? (
                    <Image
                      src={authorImageUrl}
                      alt={post.author?.name || "Author"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-base font-bold text-amber-800 bg-amber-100">
                      {post.author?.name?.[0] || "K"}
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      {post.author?.name || "Knitty Petit Studio"}
                    </span>
                    <ShieldCheck className="h-4 w-4 text-amber-600" />
                  </div>
                  <span className="block text-xs font-medium text-stone-500 dark:text-stone-400">
                    Boutique Artisan &amp; Designer
                  </span>
                </div>
              </div>

              {/* Stats badges */}
              <div className="flex items-center gap-3 sm:gap-4 text-xs font-medium text-stone-500 dark:text-stone-400">
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
                <span className="text-stone-300 dark:text-stone-700 hidden sm:inline">•</span>
                <span className="hidden sm:inline-flex text-stone-400">
                  {wordCount.toLocaleString()} words
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* ── Featured Hero Visual ─────────────────────────────────────── */}
        {heroImageUrl && (
          <section className="container mx-auto max-w-5xl px-4 sm:px-6 my-6 sm:my-10">
            <figure className="relative overflow-hidden rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 shadow-xl shadow-stone-900/5">
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full">
                <Image
                  src={heroImageUrl}
                  alt={post.mainImage?.alt ?? post.title}
                  fill
                  priority
                  sizes="(min-width: 1200px) 1024px, 100vw"
                  className="object-cover"
                />
              </div>
              {post.mainImage?.alt && (
                <figcaption className="p-3.5 text-center text-xs text-stone-600 dark:text-stone-400 bg-stone-50/90 dark:bg-stone-900/90 border-t border-stone-200/60 dark:border-stone-800 font-serif italic">
                  {post.mainImage.alt}
                </figcaption>
              )}
            </figure>
          </section>
        )}

        {/* ── Main Two-Column Reading Layout ───────────────────────────── */}
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-12">
          <div className="grid lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_340px] gap-10 xl:gap-14 items-start">
            
            {/* ── Left Column: Main Article Body ────────────────────────── */}
            <main className="min-w-0">
              {/* Mobile Table of Contents */}
              <div className="lg:hidden">
                <TableOfContents headings={headings} />
              </div>

              {/* PortableText rich body */}
              <div className="article-body">
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
              </div>

              {/* ── Embedded "Shop The Story" Interactive Product Card ──── */}
              <div className="my-14 overflow-hidden rounded-3xl border border-amber-200/90 dark:border-amber-900/60 bg-gradient-to-br from-amber-50/90 via-[#fcf8f3] to-stone-100 dark:from-stone-900 dark:to-amber-950/40 p-6 sm:p-8 shadow-md">
                <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-7">
                  <div className="relative h-36 w-36 sm:h-40 sm:w-40 rounded-2xl overflow-hidden shrink-0 border-2 border-white dark:border-stone-800 shadow-lg group">
                    <Image
                      src={featuredProduct?.mainImageUrl || "/home1.webp"}
                      alt="Hand embroidered personalized kids name sweater"
                      fill
                      sizes="160px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="rounded-full bg-stone-900/90 text-white text-[10px] font-bold px-2 py-0.5 tracking-wider uppercase shadow-xs">
                        Bestseller
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 text-center sm:text-left flex-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
                        <Sparkles className="h-3.5 w-3.5" />
                        Handcrafted Keepsake
                      </span>
                      <span className="text-stone-300 dark:text-stone-700">•</span>
                      <div className="flex items-center text-amber-500 text-xs">
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                        <span className="ml-1 text-stone-600 dark:text-stone-400 font-semibold text-[11px]">4.9 (140+ reviews)</span>
                      </div>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
                      Hand Embroidered Kids Name Sweater
                    </h3>
                    
                    <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                      Custom stitched with 100% gentle combed cotton. Pick your favorite base knit color and let our artisans handcraft their name and custom icons.
                    </p>

                    {/* Color pills preview */}
                    <div className="flex items-center justify-center sm:justify-start gap-1.5 pt-1">
                      <span className="text-[11px] font-semibold text-stone-400 mr-1">Popular shades:</span>
                      <span className="h-4 w-4 rounded-full bg-[#E5D7C5] border border-stone-300" title="Oatmeal" />
                      <span className="h-4 w-4 rounded-full bg-[#D4A373] border border-stone-300" title="Camel" />
                      <span className="h-4 w-4 rounded-full bg-[#DDA7A5] border border-stone-300" title="Dusty Rose" />
                      <span className="h-4 w-4 rounded-full bg-[#B8C4B5] border border-stone-300" title="Mint Green" />
                      <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-400 ml-1">+12 more</span>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                      <Link
                        href="/products/hand-embroidered-kids-name-sweaters"
                        className="inline-flex items-center gap-2 rounded-full bg-stone-900 hover:bg-amber-800 text-white dark:bg-stone-100 dark:hover:bg-amber-300 dark:text-stone-900 text-xs font-semibold px-5 py-2.5 transition-all shadow-sm hover:shadow-md"
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        <span>Customize Name &amp; Size</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Author Bio Section ─────────────────────────────────── */}
              {post.author && (
                <div className="my-12 p-6 sm:p-8 rounded-3xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-900/80 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                  <div className="relative h-20 w-20 rounded-2xl overflow-hidden shrink-0 border-2 border-stone-100 dark:border-stone-800 shadow-sm">
                    {authorImageUrl ? (
                      <Image
                        src={authorImageUrl}
                        alt={post.author.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-2xl text-amber-800 bg-amber-100">
                        {post.author.name[0]}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <h4 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                        About {post.author.name}
                      </h4>
                      <span className="text-[11px] font-semibold text-amber-800 bg-amber-100/90 dark:text-amber-300 dark:bg-amber-950/70 px-2.5 py-0.5 rounded-full">
                        Founder &amp; Head Artisan
                      </span>
                    </div>
                    {post.author.bio ? (
                      <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                        {post.author.bio}
                      </p>
                    ) : (
                      <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                        Crafting timeless handmade crochet apparel and embroidered knitwear for little ones. Each piece is made to become a cherished nursery heirloom.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* ── Previous & Next Article Navigator ──────────────────── */}
              <div className="my-10 pt-8 border-t border-stone-200/80 dark:border-stone-800 grid gap-4 sm:grid-cols-2">
                {previousPost ? (
                  <Link
                    href={`/blog/${previousPost.slug.current}`}
                    className="group p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white/70 dark:bg-stone-900/70 hover:border-amber-400 dark:hover:border-amber-600 transition-all flex flex-col justify-between gap-3 shadow-2xs hover:shadow-sm"
                  >
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                      <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" />
                      <span>Previous Story</span>
                    </div>
                    <span className="font-serif font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
                      {previousPost.title}
                    </span>
                  </Link>
                ) : (
                  <div className="hidden sm:block" />
                )}

                {nextPost ? (
                  <Link
                    href={`/blog/${nextPost.slug.current}`}
                    className="group p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white/70 dark:bg-stone-900/70 hover:border-amber-400 dark:hover:border-amber-600 transition-all flex flex-col justify-between gap-3 text-right shadow-2xs hover:shadow-sm"
                  >
                    <div className="flex items-center justify-end gap-1.5 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                      <span>Next Story</span>
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </div>
                    <span className="font-serif font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
                      {nextPost.title}
                    </span>
                  </Link>
                ) : (
                  <div className="hidden sm:block" />
                )}
              </div>

              {/* ── Share Story at Bottom ───────────────────────────────── */}
              <div className="pt-6 pb-12 flex flex-wrap items-center justify-between gap-4">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-amber-800 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to all stories</span>
                </Link>

                <BlogShareButtons title={post.title} url={currentUrl} />
              </div>
            </main>

            {/* ── Right Column: Sticky Editorial Sidebar ──────────────── */}
            <aside className="hidden lg:block sticky top-20 space-y-6">
              {/* Sticky Table of Contents */}
              <TableOfContents headings={headings} isSidebar={true} />

              {/* Featured Mini Product Card */}
              <div className="rounded-2xl border border-amber-200/90 dark:border-amber-900/50 bg-gradient-to-b from-[#fdfbf8] to-amber-50/50 dark:from-stone-900 dark:to-amber-950/20 p-5 shadow-xs">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3.5 border border-stone-200/70">
                  <Image
                    src={featuredProduct?.mainImageUrl || "/home1.webp"}
                    alt="Custom Name Sweater"
                    fill
                    sizes="280px"
                    className="object-cover"
                  />
                  <span className="absolute top-2 left-2 rounded-full bg-amber-800 text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                    Made to Order
                  </span>
                </div>

                <div className="space-y-1.5 mb-3.5">
                  <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 line-clamp-1">
                    Custom Kids Name Sweater
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2">
                    100% Cotton knit with hand-stitched cursive embroidery.
                  </p>
                </div>

                <Link
                  href="/products/hand-embroidered-kids-name-sweaters"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 hover:bg-amber-800 text-white dark:bg-stone-100 dark:hover:bg-amber-300 dark:text-stone-900 text-xs font-semibold py-2.5 transition-colors shadow-2xs"
                >
                  <span>Customize Yours</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* VIP Nursery Journal Newsletter */}
              <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white/70 dark:bg-stone-900/70 p-5 backdrop-blur-sm shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100">
                  <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
                  <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                    The Nursery Journal
                  </h4>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                  Join 5,000+ parents receiving early seasonal drop announcements, milestone outfit ideas, and care tips.
                </p>
                <div className="space-y-2 pt-1">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 px-3 py-2 text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold py-2 transition-colors shadow-2xs"
                  >
                    <span>Subscribe</span>
                    <Send className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* ── Related Stories Carousel / Grid ─────────────────────────── */}
        {relatedPosts.length > 0 && (
          <section className="border-t border-stone-200/80 dark:border-stone-800 bg-[#f7f2ec]/60 dark:bg-stone-900/40 py-16 sm:py-20">
            <div className="container mx-auto max-w-6xl px-4 sm:px-6">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    Curated Reads
                  </span>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-stone-900 dark:text-stone-100 mt-1">
                    More Stories from Our Studio
                  </h3>
                </div>
                <Link
                  href="/blog"
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-amber-800 dark:text-stone-300 dark:hover:text-amber-400 transition-colors"
                >
                  <span>View All Journal Entries</span>
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
