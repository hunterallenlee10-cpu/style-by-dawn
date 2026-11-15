import type { Metadata } from 'next';
import Image from 'next/image';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { business, mapsDirectionsUrl } from '@/lib/business';
import { breadcrumb, clothingStore, JsonLd } from '@/lib/jsonld';
import { photos } from '@/lib/looks';
import { pageMeta, pages } from '@/lib/seo';
import { HoursTable } from '@/components/Visit/HoursTable';
import { InlineHold } from '@/components/Visit/InlineHold';
import { MapLoader } from '@/components/Visit/MapLoader';

export const metadata: Metadata = pageMeta(pages.visit.path, pages.visit.title, pages.visit.description);

// DRAFT: ask Dawn what to say about parking at SOF Market. Nothing shows until confirmed.

export default function VisitPage() {
  const shop = photos['01'];
  const inside = [photos['19'], photos['05']];
  const tiles = [
    { href: business.phoneHref, icon: Phone, title: 'Call', text: business.phoneDisplay },
    { href: business.smsHref, icon: MessageCircle, title: 'Text Dawn', text: business.phoneDisplay },
    { href: `mailto:${business.email}`, icon: Mail, title: 'Email', text: business.email },
  ];
  return (
    <>
      <JsonLd data={clothingStore()} />
      <JsonLd data={breadcrumb('/visit', 'Visit')} />

      <section aria-labelledby="visit-title" className="wrap pt-10 pb-16 lg:pt-16 lg:pb-24">
        <p className="eyebrow text-green">Visit and contact</p>
        <h1 id="visit-title" className="mt-3 max-w-5xl text-h1">Visit Style by Dawn at Shepherd&apos;s Old Field Market, Leonardtown</h1>
        <p className="mt-6 measure text-lead">
          {business.name} is a women&apos;s boutique inside {business.market} at {business.addressLine}, about{' '}
          {business.nearby} in {business.county}. Open Tuesday to Sunday.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={mapsDirectionsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            <MapPin aria-hidden="true" className="size-4" strokeWidth={1.5} /> Get directions
          </a>
          <a href="#contact" className="btn btn-ghost">
            Ask Dawn to hold something
          </a>
        </div>

        <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-12 lg:gap-12">
          <figure className="order-2 lg:order-none lg:col-span-7">
            <div className="rounded-[5px] border border-seam bg-petal p-2.5">
              <Image src={shop.src} width={shop.width} height={shop.height} alt={shop.alt} preload sizes="(min-width: 1344px) 740px, (min-width: 1024px) 56vw, calc(100vw - 60px)" className="h-auto w-full rounded-[3px]" />
            </div>
            <figcaption className="mt-3 text-center">
              <span className="tag-label">{shop.caption}</span>
            </figcaption>
          </figure>

          <div className="hangtag order-1 self-start p-6 pt-10 lg:order-none lg:col-span-5 lg:p-8 lg:pt-12">
            <h2 className="font-display text-h3">Find us</h2>
            <address className="mt-4 not-italic">
              <strong className="font-semibold">{business.name}</strong>
              <br />
              {business.address.street}
              <br />
              {business.address.city}, {business.address.region} {business.address.postalCode}
            </address>
            <p className="mt-2 text-barnwood">Inside {business.market}, about {business.nearby}.</p>
            <h2 className="mt-8 font-display text-h3">Hours</h2>
            <div className="mt-3">
              <HoursTable />
            </div>
            <div className="mt-8 flex flex-col gap-3">
              <a href={mapsDirectionsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full">
                <MapPin aria-hidden="true" className="size-4" strokeWidth={1.5} /> Get directions
              </a>
              <div className="grid grid-cols-3 gap-2">
                <a href={business.phoneHref} className="btn btn-ghost btn-sm px-2">Call</a>
                <a href={business.smsHref} className="btn btn-ghost btn-sm px-2">Text</a>
                <a href={`mailto:${business.email}`} className="btn btn-ghost btn-sm px-2">Email</a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="sr-only">Map</h2>
          <MapLoader />
        </div>
      </section>

      <section id="contact" aria-labelledby="contact-title" className="scroll-mt-24 bg-petal">
        <div className="wrap section grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="eyebrow text-green">Contact</p>
            <h2 id="contact-title" className="mt-3 text-h2">Ask Dawn to hold it.</h2>
            <p className="mt-5 measure text-lead">
              Pick the piece, your size and the day you will stop in. It goes to Dawn as a text.
            </p>
            <ul className="mt-8 grid gap-3">
              {tiles.map((t) => (
                <li key={t.title}>
                  <a href={t.href} className="flex min-h-16 items-center gap-4 rounded-tag border border-seam bg-linen px-5 py-3 transition-colors hover:border-espresso">
                    <t.icon aria-hidden="true" className="size-5 shrink-0 text-green" strokeWidth={1.5} />
                    <span>
                      <span className="block font-semibold">{t.title}</span>
                      <span className="block text-small text-barnwood">{t.text}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[10px] border border-seam bg-linen p-5 sm:p-8 lg:col-span-7">
            <InlineHold />
          </div>
        </div>
      </section>

      <section aria-labelledby="inside-title" className="section">
        <div className="wrap">
          <h2 id="inside-title" className="text-h2">Inside the shop.</h2>
          <div className="mt-10 grid grid-cols-2 gap-4 lg:gap-6">
            {inside.map((ph) => (
              <figure key={ph.id} className="reveal">
                <div className="rounded-[5px] border border-seam bg-petal p-2">
                  <Image src={ph.src} width={ph.width} height={ph.height} alt={ph.alt} sizes="(min-width: 1344px) 640px, 48vw" className="aspect-[4/5] h-auto w-full rounded-[3px] object-cover" />
                </div>
                <figcaption className="mt-3">
                  <span className="tag-label">{ph.caption}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
