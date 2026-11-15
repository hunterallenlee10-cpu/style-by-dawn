'use client';

import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { business, mapsEmbedUrl } from '@/lib/business';

// The Google Maps embed only loads when the visitor asks for it, so it never costs page speed.
export function MapLoader() {
  const [show, setShow] = useState(false);
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-tag border border-seam bg-sage md:aspect-[21/8]">
      {show ? (
        <iframe
          src={mapsEmbedUrl}
          title={`Map: ${business.name}, ${business.addressLine}`}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
          {/* a quiet drawn street grid, not a map image */}
          <svg aria-hidden="true" className="absolute inset-0 h-full w-full text-mint" preserveAspectRatio="none" viewBox="0 0 400 300" fill="none" stroke="currentColor" strokeWidth="6">
            <path d="M-10 190 L410 150" />
            <path d="M120 -10 L160 310" />
            <path d="M290 -10 L260 310" strokeWidth="3" />
            <path d="M-10 70 L410 90" strokeWidth="3" />
          </svg>
          <span className="relative inline-flex size-14 items-center justify-center rounded-full bg-rose text-on-rose">
            <MapPin aria-hidden="true" className="size-7" strokeWidth={1.5} />
          </span>
          <p className="relative font-semibold">{business.addressLine}</p>
          <button type="button" onClick={() => setShow(true)} className="btn btn-ghost btn-sm relative bg-linen">
            Show the map
          </button>
        </div>
      )}
    </div>
  );
}
