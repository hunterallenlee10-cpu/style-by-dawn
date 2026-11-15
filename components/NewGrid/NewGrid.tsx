'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, MessageCircle, X } from 'lucide-react';
import { business } from '@/lib/business';
import { categories, newArrivals, photoItem, photos, type Category, type PhotoId } from '@/lib/looks';
import { HoldButton } from '../HoldRequest/HoldButton';

const textHref = (caption: string) =>
  `${business.smsHref}?&body=${encodeURIComponent(`Hi Dawn! I saw the ${caption} on your website. Do you have it in my size?`)}`;

// Filters run client-side with no reloads. Tapping a photo opens a lightbox (arrow keys, swipe, Esc).
export function NewGrid() {
  const [filter, setFilter] = useState<Category | 'all'>('all');
  const [open, setOpen] = useState<number | null>(null);
  const list = useMemo<PhotoId[]>(
    () => (filter === 'all' ? newArrivals : newArrivals.filter((id) => photos[id].categories.includes(filter))),
    [filter],
  );

  return (
    <div>
      <div role="group" aria-label="Filter new arrivals" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 md:-mx-10 md:px-10 lg:mx-0 lg:flex-wrap lg:px-0">
        {categories.map((c) => (
          <button key={c.id} type="button" aria-pressed={filter === c.id} onClick={() => setFilter(c.id)} className="chip shrink-0">
            {c.label}
          </button>
        ))}
      </div>
      <p className="mt-4 text-small text-barnwood" aria-live="polite">
        Showing {list.length} {list.length === 1 ? 'piece' : 'pieces'}
        {filter === 'all' ? '' : ` in ${categories.find((c) => c.id === filter)?.label}`}.
      </p>
      <ul className="mt-8 columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4">
        {list.map((id, i) => {
          const ph = photos[id];
          return (
            <li key={id} className="hangtag mb-5 break-inside-avoid p-2 pt-7">
              <button
                type="button"
                onClick={() => setOpen(i)}
                className="group relative block w-full overflow-hidden rounded-[3px]"
                aria-label={`Open a larger photo: ${ph.caption}`}
              >
                <Image
                  src={ph.src}
                  width={ph.width}
                  height={ph.height}
                  alt={ph.alt}
                  sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw"
                  className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <span className="absolute top-2 right-2 inline-flex size-9 items-center justify-center rounded-full bg-linen/90 text-espresso opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  <Expand aria-hidden="true" className="size-4" strokeWidth={1.5} />
                </span>
              </button>
              <p className="mt-3 px-1">
                <span className="tag-label">{ph.caption}</span>
              </p>
              <div className="mt-3 flex flex-wrap gap-2 px-1 pb-1">
                <HoldButton item={photoItem(id)} label={`Hold it for me: ${ph.caption}`} className="btn btn-primary btn-sm">
                  Hold it for me
                </HoldButton>
                <a href={textHref(ph.caption)} className="btn btn-ghost btn-sm" aria-label={`Text Dawn about this: ${ph.caption}`}>
                  <MessageCircle aria-hidden="true" className="size-4" strokeWidth={1.5} /> Text Dawn about this
                </a>
              </div>
            </li>
          );
        })}
      </ul>
      {open !== null && <Lightbox list={list} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </div>
  );
}

function Lightbox({ list, index, onIndex, onClose }: { list: PhotoId[]; index: number; onIndex: (i: number) => void; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const touch = useRef<number | null>(null);
  const ph = photos[list[index]];
  const n = list.length;
  const go = (d: number) => onIndex((index + d + n) % n);

  useEffect(() => {
    opener.current = document.activeElement as HTMLElement;
    const d = ref.current;
    if (d && !d.open) d.showModal();
    document.documentElement.style.overflow = 'hidden';
    const back = opener.current;
    return () => {
      document.documentElement.style.overflow = '';
      if (d?.open) d.close(); // the page is inert until the modal closes
      back?.focus({ preventScroll: true });
    };
  }, []);

  return (
    <dialog
      ref={ref}
      aria-label={`Photo ${index + 1} of ${n}: ${ph.caption}`}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(1);
        if (e.key === 'ArrowLeft') go(-1);
      }}
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touch.current === null) return;
        const dx = e.changedTouches[0].clientX - touch.current;
        touch.current = null;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
      }}
      onClick={(e) => e.target === ref.current && onClose()}
      className="m-auto h-dvh max-h-none w-screen max-w-none bg-espresso/92 p-0 text-linen backdrop:bg-espresso/60"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-4 px-4 py-3">
          <p className="text-small">
            {index + 1} of {n}
          </p>
          <button type="button" onClick={onClose} aria-label="Close the photo" className="inline-flex size-11 items-center justify-center rounded-full hover:bg-linen/10">
            <X aria-hidden="true" className="size-6" strokeWidth={1.5} />
          </button>
        </div>
        <div className="relative flex min-h-0 flex-1 items-center justify-center px-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
          <Image
            key={ph.id}
            src={ph.src}
            width={ph.width}
            height={ph.height}
            alt={ph.alt}
            sizes="100vw"
            className="h-auto max-h-full w-auto max-w-full rounded-[3px] object-contain"
          />
          <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className="absolute left-2 inline-flex size-12 items-center justify-center rounded-full bg-linen text-espresso md:left-6">
            <ChevronLeft aria-hidden="true" className="size-6" strokeWidth={1.5} />
          </button>
          <button type="button" onClick={() => go(1)} aria-label="Next photo" className="absolute right-2 inline-flex size-12 items-center justify-center rounded-full bg-linen text-espresso md:right-6">
            <ChevronRight aria-hidden="true" className="size-6" strokeWidth={1.5} />
          </button>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 px-4 py-4">
          <p className="w-full text-center font-display text-lead sm:w-auto">{ph.caption}</p>
          <HoldButton item={photoItem(ph.id)} className="btn btn-primary btn-sm">
            Hold it for me
          </HoldButton>
        </div>
      </div>
    </dialog>
  );
}
