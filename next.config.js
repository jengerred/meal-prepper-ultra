/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable Turbopack
  experimental: {
    turbo: false
  },
  // Images configuration
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
    ],
  },
  // Webpack configuration
  webpack: (config, { isServer }) => {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };
    return config;
  },
};

module.exports = nextConfig;
