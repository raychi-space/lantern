import type { NextConfig } from 'next'

const apiUrl = process.env.RAYCHI_API_URL ?? 'http://127.0.0.1:8080'

const nextConfig: NextConfig = {
  basePath: process.env.RAYCHI_BASE_PATH ?? '',
  output: process.env.RAYCHI_STANDALONE === '1' ? 'standalone' : undefined,
  distDir: process.env.RAYCHI_BUILD_DIR ?? '.next',
  turbopack: { root: process.cwd() },
  async rewrites() {
    return [
      { source: '/sitemap-:name.xml', destination: '/sitemaps/:name.xml' },
      { source: '/api/:path*', destination: `${apiUrl}/api/:path*` },
    ]
  },
}

export default nextConfig
