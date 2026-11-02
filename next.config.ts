import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The journal moved from /math to /blog; keep old links working.
      { source: "/math/:path*", destination: "/blog/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
