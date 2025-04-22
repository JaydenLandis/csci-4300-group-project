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
      {
        protocol: 'https',
        hostname: 'cdn.britannica.com',
        pathname: '/**', // This allows all paths under the domain
      },
      {
        protocol: 'https',
        hostname: '**',
        pathname: '**',
      }
    ],
  },
};

module.exports = nextConfig;
