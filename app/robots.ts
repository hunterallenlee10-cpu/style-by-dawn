import type { MetadataRoute } from 'next';
import { absUrl, IS_LIVE } from '@/lib/site';

// Demo: crawling stays allowed so the noindex can be read, no sitemap, named AI crawlers disallowed.
// Live: everything allowed and the sitemap is listed.
export default function robots(): MetadataRoute.Robots {
  if (IS_LIVE) {
    return { rules: [{ userAgent: '*', allow: '/' }], sitemap: absUrl('/sitemap.xml') };
  }
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'CCBot'], disallow: '/' },
    ],
  };
}
