import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.imagerenderer.com",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
