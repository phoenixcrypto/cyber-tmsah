/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  
  // Output configuration for Vercel
  output: 'standalone',
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Compression
  compress: true,
  
  // Static page generation timeout (in seconds)
  staticPageGenerationTimeout: 60,
  
  // Turbopack configuration (Next.js 16+)
  turbopack: {},
  
  // Webpack configuration for theme support
  webpack: (config, { isServer }) => {
    // Add alias for themes
    config.resolve.alias = {
      ...config.resolve.alias,
      '@themes': require('path').join(__dirname, 'themes'),
    }
    return config
  },
  
  // Headers for security
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
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://www.google-analytics.com; frame-ancestors 'none';",
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Redirects
  async redirects() {
    // Get admin path from environment variable or use default
    const adminPath = process.env.ADMIN_PATH || 'admin';
    
    const redirects = [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
    
    // Only add /eltmsah redirect if ADMIN_PATH is NOT 'eltmsah'
    // If ADMIN_PATH is 'eltmsah', then /eltmsah is the actual admin path, no redirect needed
    if (adminPath !== 'eltmsah') {
      redirects.push(
        {
          source: '/eltmsah',
          destination: `/${adminPath}`,
          permanent: true,
        },
        {
          source: '/eltmsah/:path*',
          destination: `/${adminPath}/:path*`,
          permanent: true,
        }
      );
    }
    
    return redirects;
  },
  
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Trailing slash
  trailingSlash: false,
  
  // PoweredByHeader
  poweredByHeader: false,
  
  // React strict mode
  reactStrictMode: true,
  
  // Generate ETags
  generateEtags: true,
  
  // Production source maps (disable for smaller bundle)
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig;
