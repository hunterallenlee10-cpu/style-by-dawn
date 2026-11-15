import Image from 'next/image';
import { giftItem, photos } from '@/lib/looks';
import { HoldButton } from '../HoldRequest/HoldButton';

// DRAFT: seasonal copy, swap after the holidays
export function HolidayBand() {
  const big = photos['15'];
  const small = photos['16'];
  return (
    <section aria-labelledby="holiday-title" data-draft="seasonal holiday band" className="overflow-x-clip bg-petal">
      <div className="wrap section grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="relative pr-[18%] pb-[22%] lg:col-span-6">
          <div className="reveal rounded-[5px] border border-seam bg-linen p-2">
            <Image
              src={big.src}
              width={big.width}
              height={big.height}
              alt={big.alt}
              sizes="(min-width: 1024px) 40vw, 82vw"
              className="h-auto w-full rounded-[3px]"
            />
          </div>
          <div className="reveal absolute right-0 bottom-0 w-[50%] rotate-3 rounded-[5px] border border-seam bg-linen p-2 shadow-[0_24px_40px_-28px_rgb(42_33_30/0.45)]">
            <Image
              src={small.src}
              width={small.width}
              height={small.height}
              alt={small.alt}
              sizes="(min-width: 1024px) 24vw, 46vw"
              className="h-auto w-full rounded-[3px]"
            />
          </div>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <p className="eyebrow text-green">For the holidays</p>
          <h2 id="holiday-title" className="mt-3 text-h2">Gifts she&apos;ll actually wear.</h2>
          <p className="mt-5 measure text-lead">
            Sherpa quarter zips, buffalo check backpacks, slipper boots and Merry &amp; Bright caps, all at the shop now.
          </p>
          <HoldButton item={giftItem} className="btn btn-primary mt-8">
            Hold a gift for me
          </HoldButton>
        </div>
      </div>
    </section>
  );
}
