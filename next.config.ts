import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    domains: ['api.gsbuzz.in'],
  },
  /* config options here */
};

export default nextConfig;