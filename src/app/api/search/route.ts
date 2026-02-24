import { NextRequest, NextResponse } from "next/server"
import { searchProducts } from "@/sanity/queries"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q") || ""

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] })
  }

  try {
    const results = await searchProducts(query, 10)
    return NextResponse.json({ results })
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json(
      { error: "Failed to search products", results: [] },
      { status: 500 }
    )
  }
}
