const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Fix webpack module resolution issues
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Handle module resolution issues in development
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: /node_modules/,
      };
    }
    
    // Improve module resolution
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
    };
    
    return config;
  },
  // Optimize for development
  swcMinify: true,
  // Better error handling
  onDemandEntries: {
    maxInactiveAge: 60 * 1000, // dispose inactive pages after 1 minute
    pagesBufferLength: 5, // keep 5 pages in memory
  },
};

module.exports = nextConfig;
