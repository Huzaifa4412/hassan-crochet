import type { PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { slugify } from '@/lib/blog-utils'
import { Quote, Hash, Sparkles } from 'lucide-react'

function CodeBlock({ children }: { children: string }) {
  return (
    <div className="my-8 rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-900 shadow-sm">
      <div className="flex items-center gap-2 px-4 py-3 bg-stone-950/80 border-b border-stone-800 text-stone-400 text-xs font-mono">
        <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
        <span className="ml-2">snippet</span>
      </div>
      <pre className="overflow-x-auto p-5 text-xs sm:text-sm font-mono leading-relaxed text-stone-200">
        <code>{children}</code>
      </pre>
    </div>
  )
}

function getNodeText(children: React.ReactNode): string {
  if (!children) return ''
  if (typeof children === 'string') return children
  if (Array.isArray(children)) return children.map(getNodeText).join('')
  if (typeof children === 'object' && children && 'props' in children) {
    const el = children as { props?: { children?: React.ReactNode } }
    return getNodeText(el.props?.children)
  }
  return ''
}

export const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-6 text-[17px] sm:text-[18.5px] leading-[1.85] text-stone-700 dark:text-stone-300 font-normal">
        {children}
      </p>
    ),
    h2: ({ children }) => {
      const text = getNodeText(children)
      const id = slugify(text)
      return (
        <h2
          id={id}
          className="group relative mt-14 mb-6 pt-6 text-2xl sm:text-3xl md:text-[2rem] font-serif font-bold tracking-tight text-stone-900 dark:text-stone-50 scroll-mt-24 border-t border-stone-200/70 dark:border-stone-800/80 flex items-baseline gap-2.5"
        >
          <span className="h-2 w-2 rounded-full bg-amber-600 dark:bg-amber-400 shrink-0 self-center hidden sm:inline-block" />
          <a
            href={`#${id}`}
            className="hover:text-amber-800 dark:hover:text-amber-400 transition-colors inline-flex items-center gap-2"
          >
            <span>{children}</span>
            <Hash className="h-4 w-4 opacity-0 group-hover:opacity-60 text-amber-700 dark:text-amber-400 transition-opacity shrink-0" />
          </a>
        </h2>
      )
    },
    h3: ({ children }) => {
      const text = getNodeText(children)
      const id = slugify(text)
      return (
        <h3
          id={id}
          className="group mt-9 mb-4 text-xl sm:text-2xl font-serif font-semibold tracking-tight text-stone-900 dark:text-stone-100 scroll-mt-24"
        >
          <a
            href={`#${id}`}
            className="hover:text-amber-800 dark:hover:text-amber-400 transition-colors inline-flex items-center gap-2"
          >
            <span>{children}</span>
            <Hash className="h-3.5 w-3.5 opacity-0 group-hover:opacity-50 text-amber-600 dark:text-amber-400 transition-opacity" />
          </a>
        </h3>
      )
    },
    h4: ({ children }) => (
      <h4 className="mt-7 mb-3 text-lg font-semibold text-stone-900 dark:text-stone-200 scroll-mt-24">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <figure className="relative my-10 overflow-hidden rounded-3xl border-l-[5px] border-amber-600 bg-gradient-to-r from-amber-50/80 via-[#fcfaf7] to-amber-50/30 dark:from-amber-950/30 dark:via-stone-900 dark:to-stone-900 px-7 py-6 sm:px-9 sm:py-7 shadow-sm">
        <div className="flex items-center gap-2 text-amber-700/60 dark:text-amber-400/60 mb-3">
          <Quote className="h-7 w-7" />
          <span className="text-xs uppercase tracking-widest font-bold">Artisan Note</span>
        </div>
        <blockquote className="text-lg sm:text-[1.25rem] font-serif italic text-stone-800 dark:text-stone-200 leading-relaxed">
          {children}
        </blockquote>
      </figure>
    ),
  },

  list: {
    bullet: ({ children }) => (
      <ul className="my-7 ml-2 space-y-3.5 text-[17px] sm:text-[18px] text-stone-700 dark:text-stone-300">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="my-7 ml-4 list-decimal space-y-3.5 text-[17px] sm:text-[18px] text-stone-700 dark:text-stone-300 marker:font-bold marker:text-amber-800 dark:marker:text-amber-400">
        {children}
      </ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => (
      <li className="flex items-start gap-3 leading-relaxed">
        <span className="h-2 w-2 rounded-full bg-amber-600/80 dark:bg-amber-400/80 mt-2.5 shrink-0" />
        <div className="flex-1">{children}</div>
      </li>
    ),
    number: ({ children }) => <li className="leading-relaxed pl-1">{children}</li>,
  },

  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-stone-900 dark:text-stone-50">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => <span className="underline underline-offset-4 decoration-amber-400/80">{children}</span>,
    code: ({ children }) => (
      <code className="rounded-md bg-stone-100 dark:bg-stone-800 px-2 py-0.5 text-[0.875em] font-mono font-medium text-amber-800 dark:text-amber-300 border border-stone-200/50 dark:border-stone-700/50">
        {children}
      </code>
    ),
    link: ({ value, children }) => {
      const target = value?.blank ? '_blank' : '_self'
      const rel = target === '_blank' ? 'noopener noreferrer' : undefined
      return (
        <a
          href={value?.href}
          target={target}
          rel={rel}
          className="font-medium text-amber-800 dark:text-amber-400 underline decoration-amber-400/70 hover:decoration-amber-900 dark:hover:decoration-amber-300 underline-offset-4 transition-colors duration-150 inline-flex items-center gap-0.5"
        >
          <span>{children}</span>
        </a>
      )
    },
  },

  types: {
    image: ({ value }) => {
      if (!value?.asset) return null

      const src = urlFor(value).width(1600).fit('max').auto('format').url()
      const alt: string = value.alt ?? 'Knitty Petit story illustration'
      const caption: string | undefined = value.caption

      return (
        <figure className="my-12 overflow-hidden rounded-3xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-900/60 p-2 sm:p-3.5 shadow-md">
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-2xl bg-stone-100 dark:bg-stone-800">
            <Image
              src={src}
              alt={alt}
              fill
              className="object-cover transition-transform duration-500 hover:scale-[1.02]"
              sizes="(min-width: 1024px) 850px, 100vw"
            />
          </div>
          {caption && (
            <figcaption className="mt-3.5 px-3 py-1.5 text-center text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-serif italic flex items-center justify-center gap-1.5">
              <Sparkles className="h-3 w-3 text-amber-600/70 shrink-0" />
              <span>{caption}</span>
            </figcaption>
          )}
        </figure>
      )
    },
    code: ({ value }) => {
      return <CodeBlock>{value?.code || ''}</CodeBlock>
    },
  },
}
