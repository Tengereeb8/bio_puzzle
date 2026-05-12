import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.imagerenderer.com",
        pathname: "/images/**",
      },
    ],
  },
  webpack(config, options) {
    const fileLoaderRule = config.module.rules.find((rule: { test?: RegExp }) => {
      return typeof rule.test?.test === "function" && rule.test.test(".svg");
    });

    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/;
    }

    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

export default nextConfig;
