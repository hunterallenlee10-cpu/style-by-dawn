'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { business } from '@/lib/business';
import { occasionItem, occasions, photos, type OccasionId } from '@/lib/looks';
import { HoldButton } from '../HoldRequest/HoldButton';
import { STYLER_EVENT, type StylerSelect } from './events';

// "Where are you headed?" Pick the plan, and Dawn's real looks deal out as a stacked deck.
// Chips are a radiogroup (arrow keys move). The deck answers to Next look, swipe, drag and arrow keys.
export function Styler({ header }: { header: React.ReactNode }) {
  const [occasionId, setOccasionId] = useState<OccasionId>('dinner');
  const occasion = occasions.find((o) => o.id === occasionId)!;
  const [order, setOrder] = useState<number[]>(() => occasion.looks.map((_, i) => i));
  const [dealt, setDealt] = useState(false);
  const [leaving, setLeaving] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const busy = useRef(false);

  const redeal = useCallback(() => {
    setDealt(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setDealt(true)));
  }, []);

  const choose = useCallback(
    (id: OccasionId, frontPhoto?: string) => {
      const o = occasions.find((x) => x.id === id)!;
      const idx = o.looks.map((_, i) => i);
      const front = frontPhoto ? o.looks.findIndex((l) => l.photo === frontPhoto) : 0;
      const rotated = front > 0 ? [...idx.slice(front), ...idx.slice(0, front)] : idx;
      setOccasionId(id);
      setOrder(rotated);
      setLeaving(null);
      redeal();
    },
    [redeal],
  );

  // First time the studio scrolls into view: Dinner out deals once
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDealt(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // The hero rail selects a look here
  useEffect(() => {
    const onSelect = (e: Event) => {
      const { occasion: id, photo } = (e as CustomEvent<StylerSelect>).detail;
      choose(id, photo);
    };
    window.addEventListener(STYLER_EVENT, onSelect);
    return () => window.removeEventListener(STYLER_EVENT, onSelect);
  }, [choose]);

  const next = useCallback(
    (dir: 1 | -1 = 1) => {
      if (order.length < 2 || busy.current) return;
      busy.current = true;
      if (dir === 1) {
        setLeaving(order[0]);
        setTimeout(() => {
          setOrder((o) => [...o.slice(1), o[0]]);
          setLeaving(null);
          busy.current = false;
        }, 150);
      } else {
        setOrder((o) => [o[o.length - 1], ...o.slice(0, -1)]);
        setTimeout(() => (busy.current = false), 150);
      }
    },
    [order],
  );

  const onChipKey = (e: React.KeyboardEvent, i: number) => {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (e.key === 'Home' || e.key === 'End' || keys[e.key]) {
      e.preventDefault();
      const n = occasions.length;
      const j = e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : (i + keys[e.key] + n) % n;
      choose(occasions[j].id);
      chipRefs.current[j]?.focus();
      chipRefs.current[j]?.scrollIntoView({ inline: 'nearest', block: 'nearest' });
    }
  };

  const frontIndex = order[0];
  const front = occasion.looks[frontIndex];
  const lookName = `${occasion.label} look (${front.short})`;
  const smsBody = `Hi Dawn! I saw the ${lookName} on your website. Do you have it in my size?`;
  const position = (lookIdx: number) => order.indexOf(lookIdx);
  const many = occasion.looks.length > 1;

  return (
    <div ref={root} className="styler grid gap-x-16 gap-y-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <div className="[grid-area:head] min-w-0">{header}</div>
      <div className="[grid-area:chips] min-w-0">
        <p id="styler-chips-label" className="eyebrow text-barnwood">Pick the plan</p>
        <div
          role="radiogroup"
          aria-labelledby="styler-chips-label"
          className="no-scrollbar -mx-5 mt-4 flex snap-x gap-2 overflow-x-auto px-5 pb-1 md:-mx-10 md:px-10 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0"
        >
          {occasions.map((o, i) => {
            const checked = o.id === occasionId;
            return (
              <button
                key={o.id}
                ref={(el) => {
                  chipRefs.current[i] = el;
                }}
                type="button"
                role="radio"
                aria-checked={checked}
                tabIndex={checked ? 0 : -1}
                onClick={() => o.id !== occasionId && choose(o.id)}
                onKeyDown={(e) => onChipKey(e, i)}
                className="chip shrink-0 snap-start"
              >
                {o.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="[grid-area:deck] min-w-0">
        <div
          role="group"
          aria-roledescription="deck of looks"
          aria-label={`${occasion.label}: look ${frontIndex + 1} of ${occasion.looks.length}${many ? '. Use the Left and Right arrow keys or swipe for the next look.' : ''}`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
              e.preventDefault();
              next(e.key === 'ArrowRight' ? 1 : -1);
            }
          }}
          onPointerDown={(e) => (swipe.current = { x: e.clientX, y: e.clientY })}
          onPointerUp={(e) => {
            const s = swipe.current;
            swipe.current = null;
            if (!s) return;
            const dx = e.clientX - s.x;
            if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(e.clientY - s.y)) next(dx < 0 ? 1 : -1);
          }}
          className="deck relative mx-auto aspect-[1/1.04] w-full max-w-[36rem] touch-pan-y select-none"
        >
          {occasion.looks.map((look, i) => {
            const ph = photos[look.photo];
            const pos = position(i);
            const state = !dealt ? 'stacked' : leaving === i ? 'leaving' : `p${Math.min(pos, 3)}`;
            return (
              <figure
                key={`${occasion.id}-${look.photo}`}
                data-state={state}
                aria-hidden={pos !== 0}
                className="deck-card absolute top-1/2 left-1/2 w-[78%] rounded-[5px] border border-seam bg-linen p-2"
                style={{ zIndex: 10 - pos }}
              >
                <Image
                  src={ph.src}
                  width={ph.width}
                  height={ph.height}
                  alt={ph.alt}
                  sizes="(min-width: 1024px) 28rem, 78vw"
                  draggable={false}
                  className="block h-auto w-full rounded-[3px]"
                />
              </figure>
            );
          })}
        </div>
        {many && (
          <div className="mt-6 flex items-center justify-center gap-4">
            <span className="text-small text-barnwood" aria-hidden="true">
              Look {frontIndex + 1} of {occasion.looks.length}
            </span>
            <button type="button" onClick={() => next(1)} className="btn btn-ghost btn-sm">
              Next look <ArrowRight aria-hidden="true" className="size-4" strokeWidth={1.5} />
            </button>
          </div>
        )}
      </div>

      <div className="[grid-area:details] min-w-0" aria-live="polite">
        <h3 className="font-display text-h3">{occasion.label}</h3>
        {front.note ? (
          <div className="mt-5 border-l-2 border-mint pl-5">
            <p className="eyebrow text-green">Dawn&apos;s note</p>
            <blockquote className="mt-2 font-display text-lead leading-snug text-espresso">
              <p>&ldquo;{front.note}&rdquo;</p>
            </blockquote>
            <p className="mt-2 text-small text-barnwood">From Dawn&apos;s Facebook posts</p>
          </div>
        ) : null}
        <p className="eyebrow mt-6 text-barnwood">The pieces</p>
        <ul className="mt-2 space-y-1">
          {front.pieces.map((pc) => (
            <li key={pc} className="flex gap-3">
              <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-wood" />
              {pc}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          <HoldButton item={occasionItem(occasion, frontIndex)}>Hold this look for me</HoldButton>
          <a href={`${business.smsHref}?&body=${encodeURIComponent(smsBody)}`} className="btn btn-ghost">
            <MessageCircle aria-hidden="true" className="size-4" strokeWidth={1.5} /> Text Dawn about it
          </a>
        </div>
      </div>
    </div>
  );
}
