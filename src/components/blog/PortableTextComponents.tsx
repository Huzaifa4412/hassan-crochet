'use client'

import type { PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { slugify } from '@/lib/blog-utils'
import { Quote } from 'lucide-react'

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
      <p className="mb-6 text-[17px] sm:text-[18px] leading-[1.8] text-stone-700 dark:text-stone-300 font-normal">
        {children}
      </p>
    ),
    h2: ({ children }) => {
      const text = getNodeText(children)
      const id = slugify(text)
      return (
        <h2
          id={id}
          className="group relative mt-12 mb-5 pt-4 text-2xl sm:text-3xl font-serif font-bold tracking-tight text-stone-900 dark:text-stone-50 scroll-mt-28 border-t border-stone-100 dark:border-stone-800/80"
        >
          <a
            href={`#${id}`}
            className="inline-flex items-center hover:text-amber-800 dark:hover:text-amber-400 transition-colors"
          >
            {children}
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
          className="mt-8 mb-4 text-xl sm:text-2xl font-serif font-semibold tracking-tight text-stone-900 dark:text-stone-100 scroll-mt-28"
        >
          <a
            href={`#${id}`}
            className="hover:text-amber-800 dark:hover:text-amber-400 transition-colors"
          >
            {children}
          </a>
        </h3>
      )
    },
    h4: ({ children }) => (
      <h4 className="mt-6 mb-3 text-lg font-semibold text-stone-900 dark:text-stone-200 scroll-mt-28">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <figure className="relative my-8 my-10 overflow-hidden rounded-2xl border-l-4 border-amber-700/60 bg-amber-50/50 dark:bg-amber-950/20 px-6 py-5 sm:px-8 sm:py-6">
        <Quote className="h-8 w-8 text-amber-700/20 dark:text-amber-400/20 mb-2 -ml-1" />
        <blockquote className="text-lg sm:text-xl font-serif italic text-stone-800 dark:text-stone-200 leading-relaxed">
          {children}
        </blockquote>
      </figure>
    ),
  },

  list: {
    bullet: ({ children }) => (
      <ul className="my-6 ml-6 list-disc space-y-2.5 text-[17px] text-stone-700 dark:text-stone-300 marker:text-amber-700 dark:marker:text-amber-400">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="my-6 ml-6 list-decimal space-y-2.5 text-[17px] text-stone-700 dark:text-stone-300 marker:font-semibold marker:text-amber-800 dark:marker:text-amber-400">
        {children}
      </ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed pl-1">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed pl-1">{children}</li>,
  },

  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-stone-900 dark:text-stone-100">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => <span className="underline underline-offset-4 decoration-amber-400">{children}</span>,
    code: ({ children }) => (
      <code className="rounded-md bg-stone-100 dark:bg-stone-800 px-2 py-0.5 text-[0.875em] font-mono font-medium text-amber-800 dark:text-amber-300">
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
          className="font-medium text-amber-800 dark:text-amber-400 underline decoration-amber-300/70 hover:decoration-amber-800 dark:hover:decoration-amber-300 underline-offset-4 transition-colors duration-150"
        >
          {children}
        </a>
      )
    },
  },

  types: {
    image: ({ value }) => {
      if (!value?.asset) return null

      const src = urlFor(value).width(1400).fit('max').auto('format').url()
      const alt: string = value.alt ?? 'Knitty Petit story illustration'
      const caption: string | undefined = value.caption

      return (
        <figure className="my-10 overflow-hidden rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/40 p-2 sm:p-3 shadow-sm">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-stone-100 dark:bg-stone-800">
            <Image
              src={src}
              alt={alt}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 800px, 100vw"
            />
          </div>
          {caption && (
            <figcaption className="mt-3 px-2 text-center text-sm text-stone-500 dark:text-stone-400 font-serif italic">
              {caption}
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
