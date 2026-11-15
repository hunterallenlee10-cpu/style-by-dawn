'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { photos, railLooks } from '@/lib/looks';
import { Hanger, Rod } from './Hanger';
import { selectInStyler } from '../Styler/events';

// The Rail: five looks hang from a barnwood rod. On load they slide in along the rod (staggered 80ms)
// and settle with one damped pendulum swing. After that it is a scroll-snap row: drag, swipe,
// arrow buttons, or Left and Right keys. Transforms only, so no layout shift.
export function Rail() {
  const scroller = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const drag = useRef<{ x: number; left: number; moved: boolean; id: number } | null>(null);
  const suppressClick = useRef(false);

  const updateEdges = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const start = el.scrollLeft < 8;
    const end = el.scrollLeft + el.clientWidth > el.scrollWidth - 8;
    setEdges((e) => (e.start === start && e.end === end ? e : { start, end }));
  }, []);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    updateEdges();
    el.addEventListener('scroll', updateEdges, { passive: true });
    window.addEventListener('resize', updateEdges);
    return () => {
      el.removeEventListener('scroll', updateEdges);
      window.removeEventListener('resize', updateEdges);
    };
  }, [updateEdges]);

  const step = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-rail-item]');
    const gap = parseFloat(getComputedStyle(el).columnGap || '0') || 0;
    const w = card ? card.offsetWidth + gap : el.clientWidth * 0.8;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: dir * w, behavior: reduce ? 'auto' : 'smooth' });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const dir = e.key === 'ArrowRight' ? 1 : -1;
    const buttons = [...(scroller.current?.querySelectorAll<HTMLButtonElement>('[data-rail-card]') ?? [])];
    const i = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (i >= 0) {
      const next = buttons[Math.min(buttons.length - 1, Math.max(0, i + dir))];
      next.focus({ preventScroll: true });
      next.closest('[data-rail-item]')?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    } else step(dir);
  };

  // Mouse drag (touch and pen use native scrolling)
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || e.button !== 0 || !scroller.current) return;
    drag.current = { x: e.clientX, left: scroller.current.scrollLeft, moved: false, id: e.pointerId };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    const el = scroller.current;
    if (!d || !el) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      el.setPointerCapture(d.id);
      el.style.scrollSnapType = 'none';
      el.style.cursor = 'grabbing';
    }
    if (d.moved) el.scrollLeft = d.left - dx;
  };
  const endDrag = () => {
    const d = drag.current;
    const el = scroller.current;
    drag.current = null;
    if (!d || !el || !d.moved) return;
    suppressClick.current = true;
    setTimeout(() => (suppressClick.current = false), 50);
    el.style.cursor = '';
    // settle onto the nearest card, then hand control back to scroll-snap
    const items = [...el.querySelectorAll<HTMLElement>('[data-rail-item]')];
    const pad = parseFloat(getComputedStyle(el).scrollPaddingLeft || '0') || 0;
    const target = items.reduce((best, it) =>
      Math.abs(it.offsetLeft - pad - el.scrollLeft) < Math.abs(best.offsetLeft - pad - el.scrollLeft) ? it : best,
    );
    el.scrollTo({ left: target.offsetLeft - pad, behavior: 'smooth' });
    setTimeout(() => (el.style.scrollSnapType = ''), 400);
  };

  return (
    <div className="rail relative -mx-5 overflow-hidden bg-petal md:-mx-10 lg:ml-0 lg:rounded-l-tag">
      <Rod className="rail-rod pointer-events-none absolute inset-x-2.5" />
      <div
        ref={scroller}
        role="region"
        aria-roledescription="carousel"
        aria-label="Dawn's looks on the rail. Swipe, drag or use the arrow keys."
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="rail-scroller no-scrollbar relative flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain lg:gap-6"
      >
        {railLooks.map((look, i) => {
          const ph = photos[look.photo];
          return (
            <div key={look.photo} data-rail-item className="rail-item shrink-0 snap-start" style={{ '--i': i } as React.CSSProperties}>
              <div className="rail-slide">
                <div className="rail-swing">
                  <button
                    type="button"
                    data-rail-card
                    className="rail-card group flex w-full flex-col items-center rounded-tag text-espresso"
                    aria-label={`${look.name}. See how Dawn styles it`}
                    onClick={(e) => {
                      if (suppressClick.current) return e.preventDefault();
                      selectInStyler(look.occasion, look.photo);
                    }}
                  >
                    <Hanger className="rail-hanger relative z-[1] h-auto" />
                    <span className="-mt-px block w-full rounded-[4px] border border-seam bg-linen p-1.5 shadow-hang">
                      <Image
                        src={ph.src}
                        width={ph.width}
                        height={ph.height}
                        alt={ph.alt}
                        sizes="(min-width: 1024px) 264px, (min-width: 640px) 44vw, 78vw"
                        preload={i === 0}
                        draggable={false}
                        className="block aspect-[9/10] h-auto w-full rounded-[3px] object-cover select-none"
                        style={{ objectPosition: look.focus }}
                      />
                    </span>
                    <span className="tag-label mt-2.5">{look.name}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between gap-4 px-5 pb-5 md:px-10 lg:pr-[calc(max(0px,(100vw-84rem)/2)+2.5rem)] lg:pl-8 lg:pb-7">
        <p className="text-small text-barnwood">
          <span className="lg:hidden">Swipe the rail. </span>
          <span className="hidden lg:inline">Drag the rail. </span>
          Tap a look to see how Dawn styles it.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={edges.start}
            aria-label="Scroll the rail left"
            className="inline-flex size-11 items-center justify-center rounded-full border border-espresso/40 bg-linen text-espresso transition-colors hover:border-espresso disabled:opacity-40"
          >
            <ChevronLeft aria-hidden="true" className="size-5" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            disabled={edges.end}
            aria-label="Scroll the rail right"
            className="inline-flex size-11 items-center justify-center rounded-full border border-espresso/40 bg-linen text-espresso transition-colors hover:border-espresso disabled:opacity-40"
          >
            <ChevronRight aria-hidden="true" className="size-5" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
