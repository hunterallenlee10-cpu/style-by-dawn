import Image from 'next/image';
import { mapsDirectionsUrl } from '@/lib/business';
import { photos } from '@/lib/looks';
import { HoldButton } from '../HoldRequest/HoldButton';

export function FinalBand() {
  const ph = photos['02'];
  return (
    <section aria-labelledby="final-title" className="section">
      <div className="wrap grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <h2 id="final-title" className="text-h2">
            See it on Stiffany.
            <br />
            Try it on with Dawn.
          </h2>
          <div className="mt-8 flex flex-wrap gap-3">
            <HoldButton>Hold it for me</HoldButton>
            <a href={mapsDirectionsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              Get directions
            </a>
          </div>
        </div>
        <figure className="reveal lg:col-span-7">
          <div className="rounded-[5px] border border-seam bg-petal p-2.5">
            <Image
              src={ph.src}
              width={ph.width}
              height={ph.height}
              alt={ph.alt}
              sizes="(min-width: 1344px) 720px, (min-width: 1024px) 54vw, 100vw"
              className="h-auto w-full rounded-[3px]"
            />
          </div>
        </figure>
      </div>
    </section>
  );
}
