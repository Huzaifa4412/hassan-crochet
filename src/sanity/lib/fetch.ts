import { client } from "./client";

/** Options forwarded to the Next.js fetch cache layer. */
interface FetchOptions {
  /**
   * Number of seconds for ISR revalidation.
   * Omit to use the site's default public-content ISR window.
   * Pass a positive integer (e.g. 60) to enable time-based ISR.
   */
  revalidate?: number;
}

const DEFAULT_REVALIDATE_SECONDS = 60;

/**
 * Wrapper function to fetch a single item from Sanity with error handling.
 *
 * @param query      - The GROQ query string
 * @param params     - Query parameters
 * @param options    - Optional cache/revalidation settings
 * @returns The fetched data or null on error / no result
 */
export async function fetchSanity<T>(
  query: string,
  params?: Record<string, unknown>,
  options?: FetchOptions
): Promise<T | null> {
  try {
    const nextOptions = {
      next: { revalidate: options?.revalidate ?? DEFAULT_REVALIDATE_SECONDS },
    };

    const result = await client.fetch<T>(query, params || {}, nextOptions);
    return result;
  } catch (error) {
    console.error("Sanity fetch error:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return null;
  }
}

/**
 * Wrapper function to fetch multiple items from Sanity with error handling.
 *
 * @param query      - The GROQ query string
 * @param params     - Query parameters
 * @param options    - Optional cache/revalidation settings
 * @returns The fetched data array or empty array on error
 */
export async function fetchSanityArray<T>(
  query: string,
  params?: Record<string, unknown>,
  options?: FetchOptions
): Promise<T[]> {
  try {
    const nextOptions = {
      next: { revalidate: options?.revalidate ?? DEFAULT_REVALIDATE_SECONDS },
    };

    const result = await client.fetch<T[]>(query, params || {}, nextOptions);
    return result || [];
  } catch (error) {
    console.error("Sanity fetch array error:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return [];
  }
}
