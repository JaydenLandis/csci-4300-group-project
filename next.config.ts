import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'scontent-atl3-1.xx.fbcdn.net',
        pathname: '/**', // This allows all paths under the domain
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**', // This allows all paths under the domain
      },
    ],
  },
};

export default nextConfig;
