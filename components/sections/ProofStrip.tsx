import Image from 'next/image';
import { business, reviews } from '@/lib/business';
import { photos } from '@/lib/looks';
import { QuickFacts } from './Hero';

export function ProofStrip() {
  const shop = photos['01'];
  const jessica = reviews[0];
  return (
    <section aria-labelledby="proof-title" className="bg-petal max-lg:before:mx-5 max-lg:before:block max-lg:before:h-px max-lg:before:bg-mint max-lg:before:content-[''] md:max-lg:before:mx-10">
      <h2 id="proof-title" className="sr-only">Find the shop, and what shoppers say</h2>
      <div className="wrap grid items-center gap-8 py-12 md:gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-12 lg:py-20">
        <figure className="hangtag hangtag--linen order-3 p-2.5 pt-7 md:order-none md:col-span-2 lg:col-span-5">
          <Image
            src={shop.src}
            width={shop.width}
            height={shop.height}
            alt={shop.alt}
            sizes="(min-width: 1344px) 530px, (min-width: 1024px) 38vw, 100vw"
            className="h-auto w-full rounded-[3px]"
          />
          <figcaption className="mt-3 mb-1 text-center">
            <span className="tag-label tag-label--petal">{shop.caption}</span>
          </figcaption>
        </figure>
        <div className="lg:col-span-3">
          <p className="eyebrow text-green">Since {business.sinceYear}</p>
          <p className="mt-3 font-display text-h3 text-espresso">{business.historyLine}</p>
        </div>
        <figure className="lg:col-span-4 lg:border-l lg:border-mint lg:pl-12">
          <blockquote className="font-display text-lead leading-snug text-espresso">
            <p>&ldquo;{jessica.excerpt}&rdquo;</p>
          </blockquote>
          <figcaption className="mt-4 text-small text-barnwood">
            {jessica.name}, via {jessica.source}, {jessica.date}
            <br />
            <a href={business.facebookReviews} target="_blank" rel="noopener noreferrer" className="link inline-flex min-h-11 items-center">
              Read it on Facebook
            </a>
          </figcaption>
        </figure>
        <QuickFacts className="order-4 md:hidden" />
      </div>
    </section>
  );
}
