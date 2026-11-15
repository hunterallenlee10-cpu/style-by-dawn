import { business, reviews } from '@/lib/business';

// Real Facebook recommendations as plain attributed text. No stars, no counts, no review markup.
export function Reviews() {
  const [jessica, delores, annmarie] = reviews;
  return (
    <section aria-labelledby="reviews-title" className="section">
      <div className="wrap">
        <p className="eyebrow text-green">Kind words</p>
        <h2 id="reviews-title" className="mt-3 text-h2">What shoppers say.</h2>
        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <figure className="reveal lg:col-span-7">
            <span aria-hidden="true" className="block font-display text-[5rem] leading-[0.6] text-mint">&ldquo;</span>
            <blockquote className="mt-2 font-display text-h3 leading-snug text-espresso">
              <p>{jessica.quote}</p>
              <p className="mt-4">{jessica.second}</p>
            </blockquote>
            <figcaption className="mt-6 text-barnwood">
              <span className="font-semibold text-espresso">{jessica.name}</span>, via {jessica.source}, {jessica.date}
            </figcaption>
          </figure>
          <div className="flex flex-col gap-10 lg:col-span-5 lg:border-l lg:border-mint lg:pl-12">
            {[delores, annmarie].map((r) => (
              <figure key={r.name} className="reveal" data-draft={r.date ? undefined : 'review date to confirm'}>
                <blockquote className="font-display text-lead leading-snug">
                  <p>&ldquo;{r.quote}&rdquo;</p>
                </blockquote>
                <figcaption className="mt-3 text-small text-barnwood">
                  <span className="font-semibold text-espresso">{r.name}</span>, via {r.source}
                  {r.date ? `, ${r.date}` : ''}
                </figcaption>
              </figure>
            ))}
            <a href={business.facebookReviews} target="_blank" rel="noopener noreferrer" className="link inline-flex min-h-11 items-center self-start">
              See all recommendations on Facebook
            </a>
          </div>
        </div>
        {/* Empty, labelled placeholder. Never filled with an invented review. Live builds refuse while it exists. */}
        <div
          data-placeholder="google-reviews"
          className="mt-14 flex min-h-32 flex-col items-center justify-center gap-2 rounded-tag border border-dashed border-barnwood/50 p-8 text-center"
        >
          <span className="eyebrow text-barnwood">Placeholder</span>
          <p className="font-display text-h3 text-barnwood">Your Google reviews go here.</p>
        </div>
      </div>
    </section>
  );
}
