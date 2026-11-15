import Image from 'next/image';
import { captions } from '@/lib/business';
import { photos, stiffanyItem } from '@/lib/looks';
import { HoldButton } from '../HoldRequest/HoldButton';

export function StiffanyBand() {
  const ph = photos['03'];
  return (
    <section aria-labelledby="stiffany-title" className="bg-sage">
      <div className="wrap section grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="reveal lg:col-span-5">
          <p className="eyebrow text-green">Look of the week</p>
          <h2 id="stiffany-title" className="mt-4 font-display text-display text-espresso">Meet Stiffany.</h2>
          <p className="mt-6 measure text-lead text-espresso">
            She lives at the front of the shop and gets dressed before anyone else. This week:
          </p>
          <figure className="mt-8 border-l-2 border-mint pl-5">
            <blockquote className="font-display text-h3 text-espresso">
              <p>&ldquo;{captions.stiffany}&rdquo;</p>
            </blockquote>
            <figcaption className="mt-2 text-small text-barnwood">From Dawn&apos;s Facebook post</figcaption>
          </figure>
          <HoldButton item={stiffanyItem} className="btn btn-primary mt-8">
            Hold Stiffany&apos;s look
          </HoldButton>
        </div>
        <figure className="reveal lg:col-span-7">
          <div className="rounded-[5px] border border-seam bg-linen p-2.5">
            <Image
              src={ph.src}
              width={ph.width}
              height={ph.height}
              alt={ph.alt}
              sizes="(min-width: 1344px) 720px, (min-width: 1024px) 54vw, 100vw"
              className="h-auto w-full rounded-[3px]"
            />
          </div>
          <figcaption className="mt-4 grid grid-cols-2 text-center">
            <span><span className="tag-label">Step 1: the dress</span></span>
            <span><span className="tag-label">Step 2: add the coat</span></span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
