import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { mapsDirectionsUrl } from '@/lib/business';
import { HoldButton } from './HoldRequest/HoldButton';
import { MobileMenu } from './MobileMenu';
import { NavLinks } from './NavLinks';
import { Plate } from './Plate';

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-seam bg-linen/92 backdrop-blur-md">
      <div className="wrap flex h-[4.25rem] items-center justify-between gap-4 lg:h-20">
        <Link href="/" className="shrink-0 rounded-[3px]" aria-label="Style by Dawn, home">
          <Plate className="h-12 lg:h-[3.75rem]" />
        </Link>
        <nav aria-label="Main" className="hidden lg:block">
          <NavLinks />
        </nav>
        <div className="hidden items-center gap-6 md:flex">
          <a
            href={mapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-1.5 text-[0.9375rem] font-medium text-espresso hover:text-rose"
          >
            <MapPin aria-hidden="true" className="size-4" strokeWidth={1.5} />
            Get directions
          </a>
          <HoldButton className="btn btn-primary btn-sm">Hold it for me</HoldButton>
        </div>
        <MobileMenu />
      </div>
    </header>
  );
}
