import type { Metadata } from 'next';
import { business, thisWeek } from '@/lib/business';
import { breadcrumb, JsonLd } from '@/lib/jsonld';
import { pageMeta, pages } from '@/lib/seo';
import { NewGrid } from '@/components/NewGrid/NewGrid';
import { FacebookIcon, InstagramIcon } from '@/components/ui/SocialIcons';

export const metadata: Metadata = pageMeta(pages.new.path, pages.new.title, pages.new.description);

export default function NewPage() {
  return (
    <>
      <JsonLd data={breadcrumb('/new', 'New this week')} />
      <section aria-labelledby="new-page-title" className="wrap pt-10 pb-16 lg:pt-16 lg:pb-24">
        <p className="eyebrow text-green">New this week</p>
        <h1 id="new-page-title" className="mt-3 max-w-4xl text-h1">New arrivals at Style by Dawn in Leonardtown</h1>
        <p data-draft="weekly line" className="mt-6 flex items-start gap-3 text-small font-semibold text-green">
          <span aria-hidden="true" className="mt-[0.7em] inline-block h-0.5 w-5 shrink-0 rounded-full bg-mint" />
          {thisWeek}
        </p>
        <p className="mt-4 measure text-lead">
          Every piece here is on the racks at {business.name}, a women&apos;s boutique inside {business.market} on Duke
          Street in Leonardtown, MD. Dawn styles each one into a look. See something you like? Hold it in your size, or
          text Dawn to ask about it.
        </p>
        <div className="mt-10">
          <NewGrid />
        </div>
        <div className="mt-14 flex flex-col items-start gap-4 rounded-tag bg-sage p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <p className="font-display text-h3">New pieces arrive every week. Follow along on Facebook and Instagram.</p>
          <div className="flex shrink-0 gap-3">
            <a href={business.facebook} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
              <FacebookIcon className="size-4" /> Facebook
            </a>
            <a href={business.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
              <InstagramIcon className="size-4" /> Instagram
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
