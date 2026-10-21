export default function BlogCardSkeleton() {
  return (
    <div className="flex flex-col h-full overflow-hidden rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-[16/10] w-full bg-stone-200/80 dark:bg-stone-800" />

      {/* Body skeleton */}
      <div className="flex flex-col flex-1 p-6 sm:p-7 justify-between gap-4">
        <div className="space-y-3">
          {/* Metadata */}
          <div className="flex items-center gap-3">
            <div className="h-3.5 w-24 rounded bg-stone-200 dark:bg-stone-800" />
            <div className="h-3.5 w-16 rounded bg-stone-200 dark:bg-stone-800" />
          </div>

          {/* Title */}
          <div className="space-y-2 pt-1">
            <div className="h-5 w-full rounded bg-stone-200 dark:bg-stone-800" />
            <div className="h-5 w-4/5 rounded bg-stone-200 dark:bg-stone-800" />
          </div>

          {/* Excerpt */}
          <div className="space-y-1.5 pt-1">
            <div className="h-3.5 w-full rounded bg-stone-100 dark:bg-stone-800/60" />
            <div className="h-3.5 w-5/6 rounded bg-stone-100 dark:bg-stone-800/60" />
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-stone-100 dark:border-stone-800/60 flex items-center justify-between">
          <div className="h-3.5 w-20 rounded bg-stone-200 dark:bg-stone-800" />
          <div className="h-3.5 w-16 rounded bg-stone-200 dark:bg-stone-800" />
        </div>
      </div>
    </div>
  );
}
