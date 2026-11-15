import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { business, captions, reviews, secondShop } from '@/lib/business';
import { breadcrumb, JsonLd } from '@/lib/jsonld';
import { photos } from '@/lib/looks';
import { pageMeta, pages } from '@/lib/seo';
import { HoldButton } from '@/components/HoldRequest/HoldButton';

export const metadata: Metadata = pageMeta(pages.meet.path, pages.meet.title, pages.meet.description);

// Each step is backed by Dawn's own caption or Jessica R.'s real review.
const steps = [
  { title: 'Tell her where you are headed.', quote: captions.boots, source: "From Dawn's Facebook posts" },
  { title: 'She pulls pieces and shows you different ways to wear them.', quote: reviews[0].excerpt, source: `${reviews[0].name}, via Facebook, ${reviews[0].date}` },
  { title: 'Walk out with the whole look.', quote: captions.basics, source: "From Dawn's Facebook posts" },
];

export default function MeetDawnPage() {
  const door = photos['02'];
  const strip = [
    { ph: photos['09'], line: business.findLine },
    { ph: photos['13'], line: business.shopSmall },
  ];
  return (
    <>
      <JsonLd data={breadcrumb('/meet-dawn', 'Meet Dawn')} />
      <section aria-labelledby="meet-title" className="wrap grid grid-cols-[minmax(0,1fr)] items-center gap-10 pt-10 pb-16 lg:grid-cols-12 lg:gap-16 lg:pt-16 lg:pb-24">
        <div className="lg:col-span-6">
          <p className="eyebrow text-green">The owner</p>
          <h1 id="meet-title" className="mt-3 text-h1">Meet Dawn, owner of Style by Dawn in Leonardtown</h1>
          <p className="mt-6 measure text-lead">
            Dawn runs {business.name}, a women&apos;s boutique inside {business.market} on Duke Street in Leonardtown, Maryland.
          </p>
        </div>
        <figure className="relative ml-auto w-[58%] rotate-[1.5deg] sm:w-full sm:rotate-0 lg:col-span-6">
          <div className="rounded-[5px] border border-seam bg-petal p-1.5 sm:p-2.5">
            <Image src={door.src} width={door.width} height={door.height} alt={door.alt} preload sizes="(min-width: 1344px) 620px, (min-width: 1024px) 46vw, (min-width: 640px) calc(100vw - 100px), 58vw" className="h-auto w-full rounded-[3px]" />
          </div>
          <figcaption className="absolute right-[112%] bottom-3 w-32 -rotate-[1.5deg] text-right font-display text-lead leading-snug text-barnwood sm:static sm:mt-3 sm:w-auto sm:rotate-0 sm:text-center sm:text-small sm:font-sans">
            {door.caption}.
          </figcaption>
        </figure>
      </section>

      <section aria-labelledby="story-title" className="bg-petal">
        <div className="wrap section grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 id="story-title" className="text-h2">A Leonardtown story.</h2>
            {/* DRAFT: confirm wording with Dawn */}
            <div data-draft="story wording" className="mt-6 space-y-5 measure text-lead">
              <p>
                Dawn grew up in {business.county}. {business.historyLine} Every week she dresses Stiffany, the shop
                mannequin, in the newest arrivals, and she will help you put the whole outfit together.
              </p>
              <p>Her aim fits on one line:</p>
              <p className="border-l-2 border-mint pl-5 font-display text-h3">&ldquo;{business.fbBio}&rdquo;</p>
            </div>
          </div>
          {/* Labelled placeholder until Dawn sends a portrait. Never a stock photo. */}
          <div
            data-placeholder="portrait"
            className="flex aspect-[4/5] w-full max-w-sm items-center justify-center self-start rounded-tag border border-dashed border-barnwood/50 bg-linen p-8 text-center lg:col-span-4 lg:col-start-9"
          >
            <p className="text-barnwood">
              <span className="eyebrow block">Placeholder</span>
              <span className="mt-3 block font-display text-h3">Photo: Dawn in the shop, from Style by Dawn</span>
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="how-title" className="section">
        <div className="wrap">
          <p className="eyebrow text-green">How Dawn helps you shop</p>
          <h2 id="how-title" className="mt-3 text-h2">Three steps, one whole look.</h2>
          <ol className="mt-12 grid gap-6 lg:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} className="hangtag reveal flex flex-col p-6 pt-10 lg:p-8 lg:pt-12">
                <span className="font-display text-h2 leading-none text-rose">{i + 1}</span>
                <h3 className="mt-4 font-display text-h3">{s.title}</h3>
                <blockquote className="mt-5 border-l-2 border-mint pl-4 text-espresso/90">
                  <p>&ldquo;{s.quote}&rdquo;</p>
                </blockquote>
                <p className="mt-2 pl-4 text-small text-barnwood">{s.source}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="fun-title" className="bg-sage">
        <div className="wrap section grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="fun-title" className="text-h2">A little playful.</h2>
            <p className="mt-5 text-lead">A velvet witch hat on a cardigan. A 250 Years of Freedom tee for America&apos;s 250th. That is the shop.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:col-span-7 lg:col-start-6 lg:gap-6">
            {strip.map(({ ph, line }, i) => (
              <figure key={ph.id} className={`reveal ${i === 1 ? 'mt-10 lg:mt-16' : ''}`}>
                <div className="rounded-[5px] border border-seam bg-linen p-2">
                  <Image src={ph.src} width={ph.width} height={ph.height} alt={ph.alt} sizes="(min-width: 1024px) 26vw, 46vw" className="h-auto w-full rounded-[3px]" />
                </div>
                <figcaption className="mt-3 font-display text-lead">&ldquo;{line}&rdquo;</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="next-title" className="section">
        <div className="wrap grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 id="next-title" className="text-h2">Come say hello.</h2>
            <p className="mt-5 measure text-lead">
              Tell Dawn where you are headed and she will pull the pieces. Hold one before you come, or just stop by.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <HoldButton>Hold it for me</HoldButton>
              <Link href="/visit" className="btn btn-ghost">
                Plan your visit <ArrowRight aria-hidden="true" className="size-4" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
          {secondShop.show ? (
            // DRAFT: confirm Style House belongs on this site, and the 24/7 wording
            <aside data-draft="second shop" aria-labelledby="house-title" className="hangtag self-start p-6 pt-10 lg:col-span-4 lg:col-start-9">
              <p className="eyebrow text-green">Dawn&apos;s second shop</p>
              <h2 id="house-title" className="mt-2 font-display text-h3">{secondShop.name}</h2>
              <p className="mt-3 text-barnwood">
                Inside {secondShop.inside}, {secondShop.address}. {secondShop.note}
              </p>
            </aside>
          ) : null}
        </div>
      </section>
    </>
  );
}
