import type { Metadata } from 'next'
import { getAllPosts } from '@/sanity/queries'
import BlogCard from '@/components/blog/BlogCard'
import { buildMetadata } from '@/lib/seo'

/**
 * ISR: the blog listing is revalidated every 60 seconds.
 * New/updated posts published in Sanity will appear within one minute
 * without requiring a full rebuild.
 */
export const revalidate = 60

export const metadata: Metadata = buildMetadata({
  title: 'Crochet Blog',
  description:
    'Crochet tips, tutorials, behind-the-scenes stories, and handmade gift inspiration from the Knitty Petit studio.',
  path: '/blog',
})

export default async function BlogPage() {
  // Server Component: data fetched at request time (ISR)
  const posts = await getAllPosts()

  return (
    <div className="min-h-screen bg-background">
      {/* ── Page Header ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border bg-[#faf9f6] dark:bg-zinc-950 py-24 md:py-32">
        {/* Subtle texture or motif background */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
        
        {/* Decorative background yarn-loop motif */}
        <div
          aria-hidden
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-orange-100/50 dark:bg-orange-900/10 blur-[100px]"
        />
        <div
          aria-hidden
          className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-rose-100/50 dark:bg-rose-900/10 blur-[80px]"
        />

        <div className="container relative mx-auto max-w-5xl px-4 text-center">
          <div className="flex flex-col items-center gap-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 dark:border-orange-900/50 bg-orange-50 dark:bg-orange-900/20 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-orange-600 dark:text-orange-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              Our Journal
            </span>
            <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-6xl lg:text-7xl">
              Stories from <br className="hidden sm:block" /> the Studio
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
              A curated collection of crochet tips, tutorials, behind-the-scenes glimpses, and seasonal inspiration — all handcrafted with love in our Knitty Petit studio.
            </p>
          </div>
        </div>
      </section>

      {/* ── Post Grid ───────────────────────────────────────────── */}
      <section className="container mx-auto max-w-6xl px-4 py-12 md:py-16">
        {posts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              /**
               * Staggered entrance animation per card using Tailwind's
               * arbitrary animation-delay values combined with the global
               * animate-in / fade-in CSS defined in globals.css.
               *
               * We cap the delay at the 6th card (1.5 s total) so that
               * cards loaded on scroll don't appear with a long lag.
               */
              <div
                key={post._id}
                className="animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDuration: '0.5s', animationDelay: `${Math.min(i * 80, 480)}ms`, animationFillMode: 'both' }}
              >
                <BlogCard post={post} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <span className="text-6xl" aria-hidden>
        🧶
      </span>
      <h2 className="text-2xl font-semibold text-foreground">
        No posts yet — check back soon!
      </h2>
      <p className="max-w-sm text-muted-foreground">
        We&apos;re busy crafting our first articles. Follow us on social media
        for the latest updates.
      </p>
    </div>
  )
}
