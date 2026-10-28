import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow independent local previews without overwriting an active build.
  distDir: process.env.KNITTY_BUILD_DIR || ".next",
  async redirects() {
    return [
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
