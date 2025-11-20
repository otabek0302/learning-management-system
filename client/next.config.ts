import PWA from "next-pwa";

const PWAFunc = PWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com"],
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
    ];
  },
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  webpack: (config: any, { dev, isServer }: { dev: boolean; isServer: boolean }) => {
    if (dev && !isServer) {
      config.devtool = "eval-source-map";
      config.optimization = {
        ...config.optimization,
        minimize: false,
      };
    }
    return config;
  },
  experimental: {
    optimizePackageImports: ["@reduxjs/toolkit", "react-redux"],
  },
};

export default PWAFunc(nextConfig);