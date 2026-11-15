import type { MetadataRoute } from 'next';
import { lastModified } from '@/lib/seo';
import { absUrl, IS_LIVE } from '@/lib/site';

// Demo mode returns an empty sitemap. Live mode lists the four pages.
export default function sitemap(): MetadataRoute.Sitemap {
  if (!IS_LIVE) return [];
  return (['/', '/new', '/meet-dawn', '/visit'] as const).map((path) => ({
    url: absUrl(path),
    lastModified: new Date(lastModified[path]),
    changeFrequency: path === '/new' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : 0.8,
  }));
}
