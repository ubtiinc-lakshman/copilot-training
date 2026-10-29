import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // The Copilot pages moved under /courses/copilot; keep old links and bookmarks working.
  async redirects() {
    return ["common", "days", "library", "sessions", "today", "track"].flatMap((p) => [
      { source: `/${p}`, destination: `/courses/copilot/${p}`, permanent: false },
      { source: `/${p}/:path*`, destination: `/courses/copilot/${p}/:path*`, permanent: false },
    ]);
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
