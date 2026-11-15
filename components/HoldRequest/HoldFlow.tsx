'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Check, Copy, Mail, MessageCircle, Phone } from 'lucide-react';
import { business } from '@/lib/business';
import { photos, pickerItems, type HoldItem } from '@/lib/looks';
import { buildMessage, mailLink, nextSevenDays, SIZES, smsLink, type Day, type Size } from './holdMessage';

type Step = 'item' | 'size' | 'day' | 'review';

function ItemSummary({ item }: { item: HoldItem | null }) {
  if (!item) return null;
  const thumb = item.photo ? photos[item.photo] : null;
  return (
    <div className="flex items-center gap-3 rounded-tag border border-seam bg-petal p-2.5">
      {thumb ? (
        <Image src={thumb.src} width={thumb.width} height={thumb.height} alt="" aria-hidden="true" sizes="56px" className="size-14 shrink-0 rounded-[3px] object-cover" />
      ) : null}
      <div className="min-w-0">
        <p className="leading-snug font-semibold">{item.label}</p>
        {item.detail ? <p className="text-small text-barnwood">{item.detail}</p> : null}
      </div>
    </div>
  );
}

// Tap-only steps, Back and Next, never asks twice. Ends with an honest button that names the real action.
export function HoldFlow({ initialItem, headingLevel = 2 }: { initialItem: HoldItem | null; headingLevel?: 2 | 3 }) {
  const [item, setItem] = useState<HoldItem | null>(initialItem);
  const [size, setSize] = useState<Size | null>(null);
  const [day, setDay] = useState<Day | 'unsure' | null>(null);
  const [name, setName] = useState('');
  const [step, setStep] = useState<Step>(initialItem ? (initialItem.sized ? 'size' : 'day') : 'item');
  const [dir, setDir] = useState<1 | -1>(1);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [desktop] = useState(() => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  const [days] = useState(() => nextSevenDays());
  const heading = useRef<HTMLHeadingElement>(null);
  const startStep = useRef(step);
  const moved = useRef(false);

  // Steps that apply to this request. The item step only exists when nothing was pre-filled.
  const steps = useMemo<Step[]>(() => {
    const s: Step[] = [];
    if (!initialItem) s.push('item');
    if (item ? item.sized : true) s.push('size');
    s.push('day');
    return s;
  }, [initialItem, item]);
  const index = step === 'review' ? steps.length : steps.indexOf(step);

  // Move focus to the new step's heading only after the visitor has actually changed step
  useEffect(() => {
    if (!moved.current && step === startStep.current) return;
    moved.current = true;
    heading.current?.focus({ preventScroll: true });
  }, [step]);

  const go = (to: Step, d: 1 | -1 = 1) => {
    setDir(d);
    setStep(to);
  };
  const nextAfter = (s: Step, it = item): Step => {
    const list: Step[] = [...(initialItem ? [] : (['item'] as Step[])), ...((it ? it.sized : true) ? (['size'] as Step[]) : []), 'day', 'review'];
    return list[list.indexOf(s) + 1];
  };
  const back = () => {
    const list: Step[] = [...steps, 'review'];
    const i = list.indexOf(step);
    if (i > 0) go(list[i - 1], -1);
  };

  const message = buildMessage({ item, size, day, name });
  const H = headingLevel === 2 ? 'h2' : 'h3';


  return (
    <div className="flex flex-col">
      {/* progress */}
      <div className="flex items-center justify-between gap-4 text-small text-barnwood">
        <span aria-live="polite">{step === 'review' ? 'Ready to send' : `Step ${index + 1} of ${steps.length}`}</span>
        {step !== steps[0] && !sent ? (
          <button type="button" onClick={back} className="inline-flex min-h-11 items-center gap-1.5 font-medium text-espresso hover:text-rose">
            <ArrowLeft aria-hidden="true" className="size-4" strokeWidth={1.5} /> Back
          </button>
        ) : null}
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-seam" aria-hidden="true">
        <div
          className="h-full origin-left rounded-full bg-rose transition-transform duration-300"
          style={{ transform: `scaleX(${step === 'review' ? 1 : (index + 1) / (steps.length + 1)})` }}
        />
      </div>

      <div key={step} className={dir === 1 ? 'hold-step-in' : 'hold-step-back'}>
        {step === 'item' && (
          <fieldset className="mt-6">
            <legend className="contents">
              <H ref={heading} tabIndex={-1} className="font-display text-h3 outline-none">What caught your eye?</H>
            </legend>
            <div className="mt-5 flex flex-wrap gap-2">
              {pickerItems.map((it) => (
                <button
                  key={it.id}
                  type="button"
                  aria-pressed={item?.id === it.id}
                  className="chip"
                  onClick={() => {
                    setItem(it);
                    go(nextAfter('item', it));
                  }}
                >
                  {it.label}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {step === 'size' && (
          <fieldset className="mt-6">
            <legend className="contents">
              <H ref={heading} tabIndex={-1} className="font-display text-h3 outline-none">Your size</H>
            </legend>
            {initialItem ? <div className="mt-4"><ItemSummary item={item} /></div> : null}
            <div className="mt-5 flex flex-wrap gap-2">
              {SIZES.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  aria-pressed={size === sz}
                  className="chip min-w-14"
                  onClick={() => {
                    setSize(sz);
                    go(nextAfter('size'));
                  }}
                >
                  {sz}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {step === 'day' && (
          <div className="mt-6">
            <fieldset>
              <legend className="contents">
                <H ref={heading} tabIndex={-1} className="font-display text-h3 outline-none">When can you stop in?</H>
              </legend>
              {initialItem && !initialItem.sized ? <div className="mt-4"><ItemSummary item={item} /></div> : null}
              <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {days.map((d) => (
                  <button
                    key={d.key}
                    type="button"
                    disabled={d.closed}
                    aria-pressed={day !== 'unsure' && day?.key === d.key}
                    className="chip flex-col gap-0 px-2 py-1.5 leading-tight"
                    onClick={() => setDay(d)}
                  >
                    <span className="text-[0.9375rem]">{d.label}</span>
                    <span className="text-[0.75rem] opacity-80">{d.sub}</span>
                  </button>
                ))}
                <button type="button" aria-pressed={day === 'unsure'} className="chip px-2 text-[0.9375rem] leading-tight" onClick={() => setDay('unsure')}>
                  Not sure yet
                </button>
              </div>
            </fieldset>
            <label className="mt-6 block">
              <span className="font-medium">Your first name</span> <span className="text-small text-barnwood">(optional)</span>
              <input
                type="text"
                autoComplete="given-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 block min-h-12 w-full rounded-tag border border-seam bg-linen px-4 text-espresso placeholder:text-barnwood focus-visible:border-rose"
              />
            </label>
            <button type="button" disabled={!day} onClick={() => go('review')} className="btn btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-50">
              {day ? 'Next' : 'Pick a day to continue'}
            </button>
          </div>
        )}

        {step === 'review' && (
          <div className="mt-6">
            <H ref={heading} tabIndex={-1} className="font-display text-h3 outline-none">
              Your request
            </H>
            <div className="mt-4 space-y-3">
              <ItemSummary item={item} />
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-small">
                {item?.sized !== false && (
                  <>
                    <dt className="text-barnwood">Size</dt>
                    <dd>{size ?? 'Not sure'}</dd>
                  </>
                )}
                <dt className="text-barnwood">Stopping in</dt>
                <dd>{day && day !== 'unsure' ? `${day.label}, ${day.sub}` : 'Not sure yet'}</dd>
                {name.trim() ? (
                  <>
                    <dt className="text-barnwood">Name</dt>
                    <dd>{name.trim()}</dd>
                  </>
                ) : null}
              </dl>
              <p className="rounded-tag border border-seam bg-linen p-3 text-small text-barnwood">{message}</p>
            </div>

            {sent ? (
              <p role="status" className="mt-5 flex items-start gap-2 font-medium text-success">
                <Check aria-hidden="true" className="mt-0.5 size-5 shrink-0" strokeWidth={2} />
                Sent to Dawn&apos;s phone. She&apos;ll text you back.
              </p>
            ) : null}

            {desktop ? (
              <div className="mt-6 flex flex-col gap-3">
                <button
                  type="button"
                  className="btn btn-primary w-full"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(message);
                      setCopied(true);
                    } catch {
                      setCopied(false);
                    }
                  }}
                >
                  {copied ? <Check aria-hidden="true" className="size-4" strokeWidth={2} /> : <Copy aria-hidden="true" className="size-4" strokeWidth={1.5} />}
                  {copied ? 'Copied' : 'Copy my request'}
                </button>
                <a href={mailLink(message)} className="btn btn-ghost w-full">
                  <Mail aria-hidden="true" className="size-4" strokeWidth={1.5} /> Email it to Dawn
                </a>
                <a href={smsLink(message)} onClick={() => setSent(true)} className="link inline-flex min-h-11 items-center justify-center text-small">
                  On a phone? Text my request to Style by Dawn
                </a>
                <span role="status" className="sr-only">{copied ? 'Copied your request' : ''}</span>
              </div>
            ) : (
              <a href={smsLink(message)} onClick={() => setSent(true)} className="btn btn-primary mt-6 w-full whitespace-normal text-center">
                <MessageCircle aria-hidden="true" className="size-4 shrink-0" strokeWidth={1.5} /> Text my request to Style by Dawn
              </a>
            )}
          </div>
        )}
      </div>

      <p className="mt-6 border-t border-seam pt-4 text-small text-barnwood">
        Rather talk? Call or text{' '}
        <a href={business.phoneHref} className="link inline-flex items-center gap-1">
          <Phone aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
          {business.phoneDisplay}
        </a>
      </p>
    </div>
  );
}
