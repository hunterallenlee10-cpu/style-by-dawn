import { Plus } from 'lucide-react';
import { business, hoursSummary, secondShop } from '@/lib/business';

// Answers come only from lib/business.ts. Native details/summary, so it works without JavaScript.
export const faqs: { q: string; a: string; draft?: string }[] = [
  {
    q: 'Where is Style by Dawn?',
    a: `Inside ${business.market} at ${business.addressLine}, about ${business.nearby}.`,
  },
  { q: 'What are your hours?', a: hoursSummary },
  {
    q: 'What sizes do you carry?',
    a: `Sizes change with every delivery. Text Dawn at ${business.phoneDisplay} with the piece you like and she will tell you what is in.`,
  },
  {
    q: 'Can I shop online?',
    a: 'Not yet. Everything is in the shop, and you can text Dawn to ask about a piece first.',
  },
  { q: 'What does it cost?', a: 'Dawn keeps her prices affordable. Ask about any piece by text.' },
  // DRAFT: confirm Dawn wants Style House on this site
  ...(secondShop.show
    ? [
        {
          q: 'Do you have a second shop?',
          a: `Yes, ${secondShop.name}, inside ${secondShop.inside}.`,
          draft: 'second shop',
        },
      ]
    : []),
];

export function Faq() {
  return (
    <section aria-labelledby="faq-title" className="bg-petal">
      <div className="wrap section grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <p className="eyebrow text-green">Good to know</p>
          <h2 id="faq-title" className="mt-3 text-h2">Questions, answered.</h2>
          <p className="mt-5 text-barnwood">
            Anything else?{' '}
            <a href={business.smsHref} className="link">
              Text Dawn at {business.phoneDisplay}
            </a>
            .
          </p>
        </div>
        <div className="lg:col-span-8">
          <ul className="border-t border-seam">
            {faqs.map((f) => (
              <li key={f.q} className="border-b border-seam" data-draft={f.draft}>
                <details className="group">
                  <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-4 font-display text-h3 [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <Plus
                      aria-hidden="true"
                      className="size-5 shrink-0 text-rose transition-transform duration-200 group-open:rotate-45"
                      strokeWidth={1.5}
                    />
                  </summary>
                  <p className="measure pb-6 text-espresso">{f.a}</p>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
