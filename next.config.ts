// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // allow any HTTPS host, any path
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '/**',
      },
      // if you also need HTTP images, add:
      {
        protocol: 'http',
        hostname: '**',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
