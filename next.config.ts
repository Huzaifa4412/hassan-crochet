import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow independent local previews without overwriting an active build.
  distDir: process.env.KNITTY_BUILD_DIR || ".next",
  async redirects() {
    // Duplicate product URLs that showed the same Etsy listing.
    const duplicateProductSlugs = [
      "kids-sweater",
      "hand-embroidered-kidz-name-sweater",
      "hand-embroidered-kids-name-sweaterss",
    ];
    return [
      ...duplicateProductSlugs.map((slug) => ({
        source: `/products/${slug}`,
        destination: "/products/hand-embroidered-kids-name-sweaters",
        permanent: true,
      })),
      {
        source: "/:path*",
        has: [{ type: "host", value: "knittypetit.shop" }],
        destination: "https://www.knittypetit.shop/:path*",
        permanent: true,
      },
    ];
  },
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co.com'
      },
      {
        protocol: 'https',
        hostname: '**.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      }
    ],
    unoptimized: false,

  },
};

export default nextConfig;
