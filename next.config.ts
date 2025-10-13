import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: { reactCompiler: false },
  // Allow LAN device to access dev assets without warning
  allowedDevOrigins: ['http://192.168.219.104:3000']
}

export default nextConfig
