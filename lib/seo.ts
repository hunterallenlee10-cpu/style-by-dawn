import type { Metadata } from 'next';
import { absUrl } from './site';

// Title, description, self-referencing canonical and Open Graph for one page.
export function pageMeta(path: string, title: string, description: string): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: absUrl(path) },
    openGraph: { url: absUrl(path), title, description },
    twitter: { title, description },
  };
}

export const pages = {
  home: {
    path: '/',
    title: "Women's Boutique in Leonardtown, MD | Style by Dawn",
    description:
      "Style by Dawn is a women's boutique inside Shepherd's Old Field Market in Leonardtown, MD. New looks every week, styled by Dawn. Text to hold a piece.",
  },
  new: {
    path: '/new',
    title: 'New Arrivals at Style by Dawn | Leonardtown Boutique',
    description:
      'See what is new this week at Style by Dawn in Leonardtown, MD: sweaters, shackets, denim, bags and holiday gifts. Text Dawn to hold your size.',
  },
  meet: {
    path: '/meet-dawn',
    title: "Meet Dawn | Style by Dawn, Women's Boutique in Leonardtown",
    description:
      "Meet Dawn, who has run boutiques at Shepherd's Old Field Market since 2016 and will help you put the whole outfit together. Visit her in Leonardtown, MD.",
  },
  visit: {
    path: '/visit',
    title: 'Visit Style by Dawn | SOF Market, Duke St, Leonardtown',
    description:
      "Visit Style by Dawn inside Shepherd's Old Field Market, 22725 Duke Street, Leonardtown, MD. Open Tuesday to Sunday. Get directions, call or text Dawn.",
  },
} as const;

// Real last-modified dates for the sitemap. Update when a page's content changes.
export const lastModified = {
  '/': '2026-11-15',
  '/new': '2026-11-15',
  '/meet-dawn': '2026-11-15',
  '/visit': '2026-11-15',
} as const;
