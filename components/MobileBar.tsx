import { MapPin, MessageCircle } from 'lucide-react';
import { business, mapsDirectionsUrl } from '@/lib/business';
import { HoldButton } from './HoldRequest/HoldButton';

// Phone only. Its height is --bar-h, which html uses as scroll-padding-bottom so it never covers focus.
export function MobileBar() {
  return (
    <div data-mobile-bar data-float className="fixed inset-x-0 bottom-0 z-30 border-t border-seam bg-linen/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
      <div className="grid h-[4.5rem] grid-cols-[1fr_1fr_1.35fr] items-center gap-2 px-3">
        <a href={mapsDirectionsUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-12 flex-col items-center justify-center gap-0.5 text-[0.8125rem] font-medium">
          <MapPin aria-hidden="true" className="size-5" strokeWidth={1.5} />
          Directions
        </a>
        <a href={business.smsHref} className="flex min-h-12 flex-col items-center justify-center gap-0.5 text-[0.8125rem] font-medium">
          <MessageCircle aria-hidden="true" className="size-5" strokeWidth={1.5} />
          Text Dawn
        </a>
        <HoldButton className="btn btn-primary btn-sm w-full px-3">Hold it for me</HoldButton>
      </div>
    </div>
  );
}
