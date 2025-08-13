import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React 18 features
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

