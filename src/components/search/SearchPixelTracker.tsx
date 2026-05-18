"use client"

import { useEffect, useRef } from "react"
import * as pixel from "@/lib/fpixel"
import { getSearchPixelPayload } from "@/lib/meta-events"

interface SearchPixelTrackerProps {
  query: string
}

export function SearchPixelTracker({ query }: SearchPixelTrackerProps) {
  const lastTrackedQuery = useRef("")

  useEffect(() => {
    const trimmedQuery = query.trim()

    if (trimmedQuery.length < 2 || lastTrackedQuery.current === trimmedQuery) {
      return
    }

    lastTrackedQuery.current = trimmedQuery
    pixel.event("Search", getSearchPixelPayload(trimmedQuery, "search_page"))
  }, [query])

  return null
}
