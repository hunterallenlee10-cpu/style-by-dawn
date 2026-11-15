import type { NextConfig } from 'next';

const isLive = process.env.NEXT_PUBLIC_SITE_MODE === 'live';

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  devIndicators: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
  async redirects() {
    return [{ source: '/contact', destination: '/visit#contact', permanent: true }];
  },
  async headers() {
    // Demo mode: every response (pages, images, files) carries X-Robots-Tag. Live mode: none.
    if (isLive) return [];
    return [{ source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }];
  },
};

export default nextConfig;
