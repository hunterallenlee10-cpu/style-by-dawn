import Image from 'next/image';
import { prices, showPricing } from '@/lib/business';
import { photoItem, photos, type PhotoId } from '@/lib/looks';
import { HoldButton } from '../HoldRequest/HoldButton';

// A hangtag tile. The whole tile is a button that opens the Hold Request with this piece.
export function PhotoTile({ id, sizes, className = '' }: { id: PhotoId; sizes: string; className?: string }) {
  const ph = photos[id];
  const price = showPricing && prices[id] ? `, from $${prices[id]}` : '';
  return (
    <HoldButton item={photoItem(id)} label={`${ph.caption}. Hold it for me`} className={`group hangtag block w-full p-1.5 pt-6 text-left sm:p-2 sm:pt-7 ${className}`}>
      <span className="block overflow-hidden rounded-[3px]">
        <Image
          src={ph.src}
          width={ph.width}
          height={ph.height}
          alt={ph.alt}
          sizes={sizes}
          className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.025]"
        />
      </span>
      <span className="mt-2.5 mb-1 flex items-center justify-between gap-3">
        <span className="tag-label">
          {ph.caption}
          {price}
        </span>
        <span aria-hidden="true" className="hidden shrink-0 text-small font-semibold text-rose group-hover:underline xl:inline">
          Hold it
        </span>
      </span>
    </HoldButton>
  );
}
