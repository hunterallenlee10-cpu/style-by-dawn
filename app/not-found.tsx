import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { business } from '@/lib/business';
import { Hanger } from '@/components/Rail/Hanger';

export const metadata: Metadata = { title: { absolute: `Not found | ${business.name}` }, robots: { index: false, follow: true } };

export default function NotFound() {
  return (
    <section aria-labelledby="nf-title" className="wrap section grid items-center gap-10 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <p className="eyebrow text-green">Page not found</p>
        <h1 id="nf-title" className="mt-3 text-h1">This one&apos;s not on the rack.</h1>
        <p className="mt-6 measure text-lead">
          The page you wanted has moved or never existed. The clothes are still here, inside {business.market} on Duke Street.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-primary">Back to the home page</Link>
          <Link href="/new" className="btn btn-ghost">
            See what is new this week <ArrowRight aria-hidden="true" className="size-4" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
      <div className="flex justify-center lg:col-span-5">
        <div className="w-full max-w-sm rounded-tag bg-petal px-10 pt-6 pb-14">
          <div className="h-1.5 rounded-full bg-wood" aria-hidden="true" />
          <Hanger className="mx-auto -mt-[7px] w-40 origin-[50%_6%] rotate-6" />
          <p className="mt-6 text-center font-display text-h3 text-barnwood">An empty hanger.</p>
        </div>
      </div>
    </section>
  );
}
