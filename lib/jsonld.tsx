import { business, hours, mapsPlaceUrl } from './business';
import { absUrl } from './site';

// Server-rendered JSON-LD. Never aggregateRating or review markup about the business.
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function clothingStore() {
  // Group days that share hours into one OpeningHoursSpecification each
  const groups = new Map<string, string[]>();
  hours.forEach((h, i) => {
    if (!h.open || !h.close) return;
    const key = `${h.open}-${h.close}`;
    groups.set(key, [...(groups.get(key) ?? []), dayNames[i]]);
  });
  return {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    '@id': absUrl('/#store'),
    name: business.name,
    description: business.fbBio,
    url: absUrl('/'),
    telephone: business.phoneE164,
    email: business.email,
    image: absUrl('/images/01-storefront-style-by-dawn-sign.jpg'),
    logo: absUrl('/icon-512.png'),
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address.street,
      addressLocality: business.address.city,
      addressRegion: business.address.region,
      postalCode: business.address.postalCode,
      addressCountry: business.address.country,
    },
    // DRAFT: copy geo coordinates from her Google profile, omitted until known
    openingHoursSpecification: [...groups.entries()].map(([k, days]) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: days.map((d) => `https://schema.org/${d}`),
      opens: k.split('-')[0],
      closes: k.split('-')[1],
    })),
    containedInPlace: { '@type': 'Place', name: business.market },
    hasMap: mapsPlaceUrl,
    sameAs: [business.facebook, business.instagram],
    areaServed: `${business.address.city}, ${business.county}, Maryland`,
  };
}

export function breadcrumb(path: string, name: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: absUrl('/') },
      { '@type': 'ListItem', position: 2, name, item: absUrl(path) },
    ],
  };
}
