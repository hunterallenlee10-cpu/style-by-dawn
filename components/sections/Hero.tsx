import { Clock, MapPin, MessageCircle } from 'lucide-react';
import { business, mapsDirectionsUrl, thisWeek } from '@/lib/business';
import { HoldButton } from '../HoldRequest/HoldButton';
import { Rail } from '../Rail/Rail';

export function QuickFacts({ className = '' }: { className?: string }) {
  return (
    <ul className={`flex flex-col gap-x-6 gap-y-2 text-small text-barnwood sm:flex-row sm:flex-wrap ${className}`}>
      <li className="flex items-center gap-2">
        <Clock aria-hidden="true" className="size-4 text-green" strokeWidth={1.5} /> Open Tue to Sun
      </li>
      <li className="flex items-center gap-2">
        <MapPin aria-hidden="true" className="size-4 text-green" strokeWidth={1.5} /> Inside SOF Market, Duke St
      </li>
      <li>
        <a href={business.smsHref} className="flex min-h-6 items-center gap-2 hover:text-rose">
          <MessageCircle aria-hidden="true" className="size-4 text-green" strokeWidth={1.5} />
          Text Dawn {business.phoneDisplay}
        </a>
      </li>
    </ul>
  );
}

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-x-clip">
      <div className="wrap grid grid-cols-[minmax(0,1fr)] gap-y-5 pt-5 pb-0 sm:pt-10 lg:grid-cols-12 lg:gap-x-12 lg:pt-16 lg:pb-20">
        <div className="flex flex-col justify-center lg:col-span-5">
          <h1 id="hero-title">
            <span className="eyebrow block font-sans text-barnwood">
              Women&apos;s boutique in Leonardtown, MD<span className="sr-only">.</span>
            </span>
            <span className="mt-2 block font-display text-h1 tracking-[-0.01em] text-espresso lg:mt-5">Be your best you.</span>
          </h1>
          <p data-draft="weekly line" className="mt-3 flex items-start gap-3 text-small font-semibold text-green lg:mt-6">
            <span aria-hidden="true" className="mt-[0.7em] inline-block h-0.5 w-5 shrink-0 rounded-full bg-mint" />
            {thisWeek}
          </p>
          <p className="mt-3 measure text-lead text-espresso/90 lg:mt-5">
            Women&apos;s fashion at affordable prices, styled by Dawn herself, inside {business.market} on Duke Street.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 lg:mt-8">
            <HoldButton>Hold it for me</HoldButton>
            <a href={mapsDirectionsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              Get directions
            </a>
          </div>
          <QuickFacts className="mt-8 hidden lg:flex" />
        </div>
        <div className="min-w-0 lg:col-span-7">
          <Rail />
        </div>
      </div>
    </section>
  );
}
