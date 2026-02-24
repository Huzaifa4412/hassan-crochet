/**
 * Main export file for Sanity utilities
 * Re-export everything from queries for convenient imports
 */

export * from './queries';
export { client } from './lib/client';
// Note: sanityFetch and SanityLive are excluded here because they use defineLive
// which can only be used in Server Components. Import them directly from './lib/live'
// when needed in server components only.
export { testQuery, getDocumentCount, getDocumentIds, checkConfig, logConfig } from './lib/debug';
