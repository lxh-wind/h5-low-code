/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      }
      
      config.watchOptions = {
        ...config.watchOptions,
        ignored: ['**/node_modules/**', '**/.git/**', '**/.next/**'],
        aggregateTimeout: 300,
        poll: false,
      }
    }
    
    return config
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img4.yishouapp.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig 