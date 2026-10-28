import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllPosts, type PostPreview } from "@/sanity/queries";
import BlogCard from "@/components/blog/BlogCard";
import { absoluteUrl, buildMetadata, serializeJsonLd, siteName, siteUrl } from "@/lib/seo";
import { urlFor } from "@/sanity/lib/image";
import { CalendarDays, Clock, ArrowRight, Sparkles, BookOpen, HeartHandshake } from "lucide-react";
import { calculateReadingTime } from "@/lib/blog-utils";

export const revalidate = 60;

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Baby Gift Guides, Sweater Sizing & Care",
    description:
      "Explore thoughtful baby shower gift guides, custom name sweater inspiration, embroidery care tips, and handmade keepsake stories from Knitty Petit.",
    path: "/blog",
    image: "/home1.webp",
  }),
  keywords: [
    "baby shower gift ideas",
    "personalized baby sweaters",
    "hand embroidered kids names",
    "baby keepsake journal",
    "nursery gift guides",
    "crochet baby clothes inspiration",
  ],
};

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function buildBlogListingJsonLd(posts: PostPreview[]) {
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
        ],
      },
      {
        "@type": "Blog",
        "@id": absoluteUrl("/blog#blog"),
        name: "The Knitty Petit Journal",
        description:
          "Thoughtful gift guides, custom name sweater styling, and behind-the-scenes stories from our handmade knitwear studio.",
        url: absoluteUrl("/blog"),
        publisher: {
          "@type": "Organization",
          name: siteName,
          url: siteUrl,
          logo: {
            "@type": "ImageObject",
            url: absoluteUrl("/logo.png"),
          },
        },
        blogPost: posts.map((post) => ({
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt ?? "",
          url: absoluteUrl(`/blog/${post.slug.current}`),
          datePublished: post.publishedAt,
          image: post.mainImage?.asset
            ? urlFor(post.mainImage).width(1200).height(630).url()
            : undefined,
          author: {
            "@type": "Person",
            name: post.author?.name || siteName,
          },
        })),
      },
    ],
  };
}

export default async function BlogPage() {
  const posts = await getAllPosts();
  const featuredPost = posts[0];
  const gridPosts = posts.slice(1);
  const jsonLd = buildBlogListingJsonLd(posts);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      <main className="min-h-screen bg-[#faf8f5] dark:bg-stone-950 text-stone-900 dark:text-stone-100">
        {/* ── Editorial Header ────────────────────────────────────────────── */}
        <section className="relative overflow-hidden border-b border-stone-200/80 dark:border-stone-800/80 pt-16 pb-12 sm:pt-20 sm:pb-16 bg-gradient-to-b from-[#f5ede4]/70 to-[#faf8f5] dark:from-stone-900/60 dark:to-stone-950">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-xs font-medium text-stone-500 dark:text-stone-400">
                <li>
                  <Link href="/" className="hover:text-amber-800 dark:hover:text-amber-400 transition-colors">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true" className="text-stone-300 dark:text-stone-700">/</li>
                <li className="text-stone-900 dark:text-stone-100 font-semibold" aria-current="page">
                  Journal
                </li>
              </ol>
            </nav>

            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-100/80 dark:bg-amber-950/60 px-3.5 py-1 text-xs font-semibold text-amber-900 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/50">
                <Sparkles className="h-3.5 w-3.5 text-amber-700 dark:text-amber-400" />
                <span>The Knitty Petit Journal</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-stone-900 dark:text-stone-50 tracking-tight leading-[1.12]">
                Little stitches. <br className="hidden sm:inline" />
                <span className="italic font-normal text-amber-900 dark:text-amber-200">Unforgettable</span> keepsakes.
              </h1>

              <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 font-normal leading-relaxed max-w-2xl">
                A warm collection of thoughtful baby gift guides, sweater sizing tips, nursery inspiration, and the stories behind every hand-embroidered name.
              </p>
            </div>
          </div>
        </section>

        {/* ── Featured Story (if available) ──────────────────────────────── */}
        {featuredPost && (
          <section className="container mx-auto max-w-6xl px-4 sm:px-6 pt-10 sm:pt-12">
            <div className="group relative overflow-hidden rounded-3xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-900/90 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_45px_-12px_rgba(120,53,15,0.15)] transition-all duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
                {/* Visual / Image */}
                <div className="lg:col-span-7 relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:h-[460px] overflow-hidden bg-stone-100 dark:bg-stone-800">
                  {featuredPost.mainImage?.asset ? (
                    <Image
                      src={urlFor(featuredPost.mainImage).width(1200).height(800).fit("crop").auto("format").url()}
                      alt={featuredPost.mainImage?.alt ?? featuredPost.title}
                      fill
                      priority
                      sizes="(min-width: 1024px) 60vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-amber-50">
                      <span className="text-6xl">🧶</span>
                    </div>
                  )}

                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-900/85 text-white text-xs font-semibold px-3.5 py-1.5 backdrop-blur-md">
                      <Sparkles className="h-3 w-3 text-amber-300" />
                      Featured Story
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 flex flex-col justify-between h-full space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-xs font-medium text-stone-500 dark:text-stone-400">
                      {featuredPost.publishedAt && (
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5 text-stone-400" />
                          <time dateTime={featuredPost.publishedAt}>
                            {formatDate(featuredPost.publishedAt)}
                          </time>
                        </span>
                      )}
                      <span className="text-stone-300 dark:text-stone-700">•</span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-stone-400" />
                        <span>{calculateReadingTime(undefined, featuredPost.excerpt)} min read</span>
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-50 leading-tight group-hover:text-amber-800 dark:group-hover:text-amber-300 transition-colors">
                      <Link href={`/blog/${featuredPost.slug.current}`}>
                        {featuredPost.title}
                      </Link>
                    </h2>

                    {featuredPost.excerpt && (
                      <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed line-clamp-3">
                        {featuredPost.excerpt}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                    {featuredPost.author?.name ? (
                      <div className="flex items-center gap-3">
                        {featuredPost.author.image?.asset && (
                          <div className="relative h-8 w-8 rounded-full overflow-hidden border border-stone-200">
                            <Image
                              src={urlFor(featuredPost.author.image).width(64).height(64).url()}
                              alt={featuredPost.author.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                          {featuredPost.author.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-stone-500">Knitty Petit Studio</span>
                    )}

                    <Link
                      href={`/blog/${featuredPost.slug.current}`}
                      className="inline-flex items-center gap-2 rounded-full bg-stone-900 hover:bg-amber-800 text-white dark:bg-stone-100 dark:hover:bg-amber-300 dark:text-stone-900 text-xs font-semibold px-4 py-2 transition-colors shadow-sm"
                    >
                      <span>Read article</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Stories Grid ────────────────────────────────────────────────── */}
        <section className="container mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-stone-200/80 dark:border-stone-800">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
              Recent Articles & Guides
            </h2>
            <span className="text-xs font-semibold text-stone-500">
              {posts.length} {posts.length === 1 ? "Story" : "Stories"}
            </span>
          </div>

          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-2xl border border-dashed border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-900">
              <span className="text-5xl mb-4" aria-hidden="true">🧶</span>
              <h3 className="text-xl font-serif font-semibold text-stone-900 dark:text-stone-100">
                New stories are currently in the making
              </h3>
              <p className="mt-2 text-sm text-stone-500 max-w-sm">
                We are busy handcrafting tutorials, sizing guides, and keepsakes. Please check back soon!
              </p>
            </div>
          ) : (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {gridPosts.map((post) => (
                <div key={post._id} className="h-full">
                  <BlogCard post={post} />
                </div>
              ))}
              {/* If only 1 post was published, show it in the grid as well for completeness */}
              {gridPosts.length === 0 && featuredPost && (
                <div className="h-full">
                  <BlogCard post={featuredPost} />
                </div>
              )}
            </div>
          )}
        </section>

        {/* ── Keepsake Studio Callout ──────────────────────────────────────── */}
        <section className="container mx-auto max-w-6xl px-4 sm:px-6 pb-20">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2a1e16] to-[#1c140f] text-white p-8 sm:p-12 lg:p-16 shadow-xl">
            <div className="relative z-10 max-w-2xl space-y-5">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-medium text-amber-200 backdrop-blur-md">
                <HeartHandshake className="h-3.5 w-3.5 text-amber-300" />
                Handcrafted Keepsakes
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold leading-tight">
                Ready to create a one-of-a-kind name sweater?
              </h2>
              <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                Choose from 16 timeless yarn colors, enter their name, and pick playful motifs. Each piece is hand-embroidered with care in our studio.
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  href="/products/hand-embroidered-kids-name-sweaters"
                  className="inline-flex items-center gap-2 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold px-6 py-3 text-sm transition-colors shadow-md"
                >
                  <span>Customize a Sweater</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 text-sm transition-colors border border-white/20"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>View All Sweaters</span>
                </Link>
              </div>
            </div>

            {/* Subtle decorative motif in background */}
            <div className="absolute -right-12 -bottom-12 w-80 h-80 rounded-full bg-amber-600/10 blur-3xl pointer-events-none" />
          </div>
        </section>
      </main>
    </>
  );
}
