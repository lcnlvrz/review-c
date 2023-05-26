const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination: `http://localhost:3003/:path*`,
      },
    ]
  },
  transpilePackages: ['ui', 'configs', 'core'],
}

module.exports = withBundleAnalyzer(nextConfig)
