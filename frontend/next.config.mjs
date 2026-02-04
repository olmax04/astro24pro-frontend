import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    globalNotFound: true,
  },
  async rewrites() {
    return [
      {
        // Все запросы, начинающиеся с /api/v1, уходят на бэкенд
        source: '/api/v1/:path*',
        // Внутри Docker используем имя сервиса из docker-compose
        destination: 'http://astro-backend:8080/api/v1/:path*',
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000', // Порт, на котором запущен PayloadCMS

      },
    ],
  },
  // Required for Docker build
  // Your Next.js config here
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
