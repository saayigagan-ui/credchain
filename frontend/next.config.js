/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gateway.pinata.cloud',
        port: '',
        pathname: '/ipfs/**',
      },
    ],
  },
  
  // This tells Webpack to completely stop using eval() for local development source maps
  webpack: (config, { dev }) => {
    if (dev) {
      config.devtool = 'source-map';
    }
    return config;
  },
};

module.exports = nextConfig;