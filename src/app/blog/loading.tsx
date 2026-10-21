import BlogCardSkeleton from "@/components/blog/BlogCardSkeleton";

export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-stone-950 animate-pulse">
      {/* Header skeleton */}
      <section className="border-b border-stone-200/80 dark:border-stone-800 bg-[#f5ede4]/40 py-16 sm:py-20">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 space-y-4">
          <div className="h-6 w-36 rounded-full bg-stone-200 dark:bg-stone-800" />
          <div className="h-12 w-2/3 max-w-xl rounded-xl bg-stone-200 dark:bg-stone-800" />
          <div className="h-4 w-1/2 max-w-md rounded bg-stone-200/70 dark:bg-stone-800" />
        </div>
      </section>

      {/* Featured Card Skeleton */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6 pt-10">
        <div className="h-[440px] w-full rounded-3xl bg-stone-200/70 dark:bg-stone-800" />
      </section>

      {/* Grid skeleton */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
