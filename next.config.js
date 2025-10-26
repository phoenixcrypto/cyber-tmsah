/** @type {import('next').NextConfig} */
const nextConfig = {
  // Basic optimizations
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  
  // Image optimization
  images: {
    domains: ['localhost', 'example.com', 'cyber-tmsah.site', 'www.cyber-tmsah.site'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Output configuration
  trailingSlash: true,
  
  // Disable problematic features
  experimental: {
    // Remove problematic optimizations
  },
  
  // Disable static optimization for all pages
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  
  // Headers for performance and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig