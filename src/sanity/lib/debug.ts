/**
 * Utility functions for debugging Sanity queries
 */

import { client } from "./client";

/**
 * Test a raw GROQ query and return the result with metadata
 * Useful for debugging queries in the browser console
 */
export async function testQuery(query: string, params?: Record<string, unknown>) {
  const startTime = performance.now();

  try {
    const result = await client.fetch(query, params);
    const endTime = performance.now();
    const duration = endTime - startTime;

    return {
      success: true,
      result,
      duration: `${duration.toFixed(2)}ms`,
      query,
      params,
    };
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;

    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      duration: `${duration.toFixed(2)}ms`,
      query,
      params,
    };
  }
}

/**
 * Get a count of documents by type
 */
export async function getDocumentCount(type: string): Promise<number> {
  const query = `count(*[_type == $type && !(_id in path("drafts.**"))])`;
  try {
    const count = await client.fetch<number>(query, { type });
    return count;
  } catch (error) {
    console.error(`Error counting ${type} documents:`, error);
    return 0;
  }
}

/**
 * Get all document IDs for a type (useful for debugging)
 */
export async function getDocumentIds(type: string): Promise<Array<{ _id: string }>> {
  const query = `*[_type == $type && !(_id in path("drafts.**"))]{ _id }`;
  try {
    const ids = await client.fetch<Array<{ _id: string }>>(query, { type });
    return ids;
  } catch (error) {
    console.error(`Error getting ${type} document IDs:`, error);
    return [];
  }
}

/**
 * Check environment configuration
 */
export function checkConfig() {
  return {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "MISSING",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "MISSING",
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "MISSING",
    isConfigured: !!(
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
      process.env.NEXT_PUBLIC_SANITY_DATASET
    ),
  };
}

/**
 * Log environment configuration to console
 */
export function logConfig() {
  const config = checkConfig();
  console.group("Sanity Configuration");
  console.log("Project ID:", config.projectId);
  console.log("Dataset:", config.dataset);
  console.log("API Version:", config.apiVersion);
  console.log("Status:", config.isConfigured ? "✅ Configured" : "❌ Missing env vars");
  console.groupEnd();
  return config;
}
