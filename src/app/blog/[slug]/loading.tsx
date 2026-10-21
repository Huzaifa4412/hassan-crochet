export default function BlogPostLoading() {
  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-stone-950 animate-pulse">
      {/* Top bar skeleton */}
      <div className="h-12 border-b border-stone-200/80 dark:border-stone-800 bg-[#f5ede4]/40" />

      {/* Header skeleton */}
      <header className="container mx-auto max-w-4xl px-4 sm:px-6 pt-10 sm:pt-14 pb-8 space-y-6">
        <div className="h-4 w-32 rounded bg-stone-200 dark:bg-stone-800" />
        <div className="h-6 w-24 rounded-full bg-stone-200 dark:bg-stone-800" />

        <div className="space-y-3">
          <div className="h-10 w-full rounded-lg bg-stone-200 dark:bg-stone-800" />
          <div className="h-10 w-3/4 rounded-lg bg-stone-200 dark:bg-stone-800" />
        </div>

        <div className="h-5 w-5/6 rounded bg-stone-200/80 dark:bg-stone-800" />

        <div className="flex items-center gap-4 pt-6 border-t border-stone-200/80 dark:border-stone-800">
          <div className="h-11 w-11 rounded-full bg-stone-200 dark:bg-stone-800" />
          <div className="space-y-2">
            <div className="h-3 w-20 rounded bg-stone-200 dark:bg-stone-800" />
            <div className="h-4 w-32 rounded bg-stone-200 dark:bg-stone-800" />
          </div>
        </div>
      </header>

      {/* Hero image skeleton */}
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 my-6">
        <div className="aspect-[16/10] sm:aspect-[16/9] w-full rounded-3xl bg-stone-200 dark:bg-stone-800" />
      </div>

      {/* Body lines skeleton */}
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 py-10 space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-4 rounded bg-stone-200/70 dark:bg-stone-800"
            style={{ width: `${80 + (i % 3) * 8}%` }}
          />
        ))}
      </div>
    </div>
  );
}
