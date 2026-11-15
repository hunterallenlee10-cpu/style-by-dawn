import { Fragment } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { thisWeek } from '@/lib/business';
import { photos, type PhotoId } from '@/lib/looks';
import { PhotoTile } from '../ui/PhotoTile';

// Asymmetric bento. Desktop: a mixed row (12 square, 13 and 21 portrait) over a row of squares (14, 15, 18). Tiles keep their
// native aspect ratio and grow in proportion to it, so each row shares one height and nothing is cropped.
// Phone: 12 full width, then pairs 13 + 21 and 14 + 15, then 18 full width. Same DOM order everywhere.
const layout: { id: PhotoId; mobile: string; sizes: string }[] = [
  { id: '12', mobile: 'col-span-2', sizes: '(min-width: 1024px) 40vw, 100vw' },
  { id: '13', mobile: '', sizes: '(min-width: 1024px) 31vw, 50vw' },
  { id: '21', mobile: '', sizes: '(min-width: 1024px) 31vw, 50vw' },
  { id: '14', mobile: '', sizes: '(min-width: 1024px) 31vw, 50vw' },
  { id: '15', mobile: '', sizes: '(min-width: 1024px) 31vw, 50vw' },
  { id: '18', mobile: 'col-span-2', sizes: '(min-width: 1024px) 31vw, 100vw' },
];

export function NewOnRacks() {
  return (
    <section aria-labelledby="new-title" className="section">
      <div className="wrap">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-green">New this week</p>
            <h2 id="new-title" className="mt-3 text-h2">New on the racks.</h2>
          </div>
          <p data-draft="weekly line" className="max-w-sm text-barnwood">
            {thisWeek} Tap any piece to hold it.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-2 items-start gap-3 sm:gap-4 lg:flex lg:flex-wrap lg:gap-5">
          {layout.map((t) => (
            <Fragment key={t.id}>
              <div
                className={`reveal min-w-0 ${t.mobile}`}
                style={{ flex: `${(photos[t.id].width / photos[t.id].height).toFixed(3)} 1 0%` }}
              >
                <PhotoTile id={t.id} sizes={t.sizes} />
              </div>
              {t.id === '21' && <div aria-hidden="true" className="hidden lg:block lg:h-0 lg:basis-full" />}
            </Fragment>
          ))}
        </div>
        <p className="mt-10">
          <Link href="/new" className="btn btn-ghost">
            See everything new this week <ArrowRight aria-hidden="true" className="size-4" strokeWidth={1.5} />
          </Link>
        </p>
      </div>
    </section>
  );
}
