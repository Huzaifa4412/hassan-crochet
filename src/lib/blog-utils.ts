/**
 * Utility functions for blog posts:
 * - Word count & reading time estimation
 * - Table of contents heading extraction
 * - Text slugification for anchors
 */

interface PortableTextBlock {
  _type?: string;
  style?: string;
  children?: Array<{ _type?: string; text?: string }>;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Extracts plain text from Sanity portable text blocks.
 */
export function extractTextFromBlocks(blocks?: PortableTextBlock[]): string {
  if (!blocks || !Array.isArray(blocks)) return "";
  return blocks
    .filter((b) => b._type === "block" && Array.isArray(b.children))
    .map((b) => b.children?.map((c) => c.text || "").join("") || "")
    .join(" ");
}

/**
 * Estimates reading time in minutes (standard ~200 words per minute).
 */
export function calculateReadingTime(blocks?: PortableTextBlock[], excerpt?: string): number {
  const fullText = `${excerpt || ""} ${extractTextFromBlocks(blocks)}`;
  const wordCount = fullText.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(wordCount / 200);
  return Math.max(1, minutes || 1);
}

/**
 * Returns total word count of a post.
 */
export function estimateWordCount(blocks?: PortableTextBlock[], excerpt?: string): number {
  const fullText = `${excerpt || ""} ${extractTextFromBlocks(blocks)}`;
  return fullText.trim().split(/\s+/).filter(Boolean).length;
}

export interface HeadingItem {
  id: string;
  text: string;
  level: 2 | 3;
}

/**
 * Extracts H2 and H3 headings for the Table of Contents.
 */
export function extractHeadings(blocks?: PortableTextBlock[]): HeadingItem[] {
  if (!blocks || !Array.isArray(blocks)) return [];
  const headings: HeadingItem[] = [];

  for (const block of blocks) {
    if (block._type === "block" && (block.style === "h2" || block.style === "h3")) {
      const text = block.children?.map((c) => c.text || "").join("").trim() || "";
      if (text) {
        headings.push({
          id: slugify(text),
          text,
          level: block.style === "h2" ? 2 : 3,
        });
      }
    }
  }

  return headings;
}
