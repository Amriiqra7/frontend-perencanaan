import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  reactStrictMode: true,
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
