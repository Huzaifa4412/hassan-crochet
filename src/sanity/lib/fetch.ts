import { client } from "./client";

/**
 * Wrapper function to fetch data from Sanity with error handling
 * @param query - The GROQ query string
 * @param params - Query parameters
 * @returns The fetched data or null if an error occurs
 */
export async function fetchSanity<T>(
  query: string,
  params?: Record<string, unknown>
): Promise<T | null> {
  try {
    const result = await client.fetch<T>(query, params || {});
    return result;
  } catch (error) {
    console.error("Sanity fetch error:", error);
    // Log additional details for debugging
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return null;
  }
}

/**
 * Wrapper function to fetch multiple items from Sanity with error handling
 * @param query - The GROQ query string
 * @param params - Query parameters
 * @returns The fetched data array or empty array if an error occurs
 */
export async function fetchSanityArray<T>(
  query: string,
  params?: Record<string, unknown>
): Promise<T[]> {
  try {
    const result = await client.fetch<T[]>(query, params || {});
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
