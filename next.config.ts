import type { NextConfig } from 'next'

const apiUrl = process.env.RAYCHI_API_URL ?? 'http://127.0.0.1:8080'

const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${apiUrl}/api/:path*` }]
  },
}

export default nextConfig
