import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    domains: ['api.gsbuzz.in', 'images.unsplash.com'],
    unoptimized: true,
  },
  /* config options here */
};

export default nextConfig;