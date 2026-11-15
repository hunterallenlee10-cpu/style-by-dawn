import Link from 'next/link';
import { business, hours, mapsDirectionsUrl } from '@/lib/business';
import { IS_LIVE } from '@/lib/site';
import { Wordmark } from './Wordmark';
import { FacebookIcon, InstagramIcon } from './ui/SocialIcons';
import { navLinks } from './nav-links';

// Hours grouped for the footer: Tue to Sat share one line
const hourRows = [
  { days: 'Tuesday to Saturday', label: hours[2].label },
  { days: 'Sunday', label: hours[0].label },
  { days: 'Monday', label: hours[1].label },
];

export function Footer() {
  return (
    <footer className="bg-sage text-espresso">
      <div className="wrap grid gap-12 py-16 md:grid-cols-12 lg:py-24">
        <div className="md:col-span-5">
          <Wordmark className="h-20 w-auto text-espresso lg:h-24" />
          <p className="mt-4 font-display text-h3">{business.signLine}</p>
          <p className="mt-8">
            <a href={business.phoneHref} className="font-display text-h2 leading-none hover:text-rose">
              {business.phoneDisplay}
            </a>
          </p>
          <p className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            <a href={business.smsHref} className="link inline-flex min-h-11 items-center">
              Text Dawn
            </a>
            <a href={`mailto:${business.email}`} className="link inline-flex min-h-11 items-center">
              {business.email}
            </a>
          </p>
        </div>

        <div className="md:col-span-4">
          <h2 className="eyebrow font-sans text-barnwood">Visit</h2>
          <address className="mt-4 not-italic">
            <strong className="font-semibold">{business.name}</strong>
            <br />
            Inside {business.market}
            <br />
            {business.address.street}
            <br />
            {business.address.city}, {business.address.region} {business.address.postalCode}
          </address>
          <a href={mapsDirectionsUrl} target="_blank" rel="noopener noreferrer" className="link mt-3 inline-flex min-h-11 items-center">
            Get directions on Google Maps
          </a>
          <h2 className="eyebrow mt-8 font-sans text-barnwood">Hours</h2>
          <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1">
            {hourRows.map((r) => (
              <div key={r.days} className="contents">
                <dt>{r.days}</dt>
                <dd>{r.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="md:col-span-3">
          <h2 className="eyebrow font-sans text-barnwood">Pages</h2>
          <ul className="mt-4 space-y-1">
            <li>
              <Link href="/" className="inline-flex min-h-11 items-center hover:text-rose">Home</Link>
            </li>
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-11 items-center hover:text-rose">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <h2 className="eyebrow mt-8 font-sans text-barnwood">Follow along</h2>
          <div className="mt-3 flex gap-2">
            <a href={business.facebook} target="_blank" rel="noopener noreferrer" aria-label="Style by Dawn on Facebook" className="inline-flex size-11 items-center justify-center rounded-full border border-espresso/30 hover:bg-espresso hover:text-sage">
              <FacebookIcon className="size-5" />
            </a>
            <a href={business.instagram} target="_blank" rel="noopener noreferrer" aria-label="Style by Dawn on Instagram" className="inline-flex size-11 items-center justify-center rounded-full border border-espresso/30 hover:bg-espresso hover:text-sage">
              <InstagramIcon className="size-5" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-espresso/15">
        <div className="wrap flex flex-col gap-1 py-6 text-small text-barnwood md:flex-row md:justify-between">
          <p>© 2026 {business.name}. Women&apos;s boutique in Leonardtown, {business.county}, Maryland.</p>
          {!IS_LIVE && <p>Concept preview by Lee Enterprises Unlimited.</p>}
        </div>
      </div>
    </footer>
  );
}
