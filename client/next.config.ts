import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Helps catch bugs early
  images: {
    domains: ["res.cloudinary.com"], // If you use Cloudinary for images
  },
  experimental: {
    optimizeCss: true, // Optimize TailwindCSS
  },
  typescript: {
    ignoreBuildErrors: false, // Force fixing TS errors
  },
  eslint: {
    ignoreDuringBuilds: true, // Optional: Skip ESLint errors during build
  },
  async redirects() {
    // Redirects (optional)
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
    ];
  },
  pwa: {
    dest: "public", // where service worker files will go
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development", // Disable in dev
  },
};

export default withPWA(nextConfig);
