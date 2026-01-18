import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'tmp-file-server-79040334887.us-central1.run.app',
      },
    ],
  },
};

export default nextConfig;
