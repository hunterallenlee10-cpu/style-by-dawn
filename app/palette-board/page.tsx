import type { Metadata } from 'next';
import Image from 'next/image';
import { captions } from '@/lib/business';
import { photos } from '@/lib/looks';
import { Plate } from '@/components/Plate';

// Phase 1 palette board. Noindexed in both modes, never in the sitemap. Deleted before the final build.
export const metadata: Metadata = { title: 'Palette board | Style by Dawn', robots: { index: false, follow: false } };

const swatches = [
  ['Linen', '#FAF6F0', 'bg-linen', 'Background, about 60%'],
  ['Petal', '#F3E7E3', 'bg-petal', 'Cards and the rail backdrop'],
  ['Sign Sage', '#DCE5DD', 'bg-sage', 'Section bands, about 25%'],
  ['Sign Mint', '#B8CABD', 'bg-mint', 'Wordmark plate, dividers, focus halo'],
  ['Rosewood', '#9B4555', 'bg-rose', 'Primary button, active states'],
  ['Deep Rosewood', '#7F3343', 'bg-rose-deep', 'Primary hover'],
  ['Shop Green', '#3F5747', 'bg-green', "Body links, the Dawn's note label"],
  ['Espresso', '#2A211E', 'bg-espresso', 'Text'],
  ['Barnwood Grey', '#6A5A54', 'bg-barnwood', 'Muted text'],
  ['Seam', '#E5D8D0', 'bg-seam', '1px borders'],
  ['Barnwood', '#785450', 'bg-wood', 'Rail rod and hooks only'],
] as const;

export default function PaletteBoard() {
  const p = photos['01'];
  return (
    <div className="wrap section">
      <h1 className="text-h1">Palette board</h1>
      <p className="lead mt-4 measure text-lead text-barnwood">Sage Sign, Blush Walls. Every token, on the surfaces it will live on.</p>
      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
        {swatches.map(([name, hex, cls, use]) => (
          <div key={name} className="overflow-hidden rounded-tag border border-seam bg-linen">
            <div className={`h-24 ${cls}`} />
            <div className="p-3 text-small">
              <p className="font-semibold">{name}</p>
              <p className="text-barnwood">{hex}</p>
              <p className="mt-1 text-barnwood">{use}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <Plate className="h-20" />
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn btn-primary">Hold it for me</button>
            <button type="button" className="btn btn-ghost">Get directions</button>
          </div>
          <p className="measure">
            Women&apos;s fashion at affordable prices, styled by Dawn herself, inside Shepherd&apos;s Old Field Market on Duke Street.
            Body text sits on Linen in Espresso. <a href="#swatches" className="link">Shop Green links</a> stay calm.
          </p>
          <div className="hangtag max-w-sm p-6 pt-8">
            <p className="eyebrow text-green">Dawn&apos;s note</p>
            <blockquote className="mt-3 font-display text-lead">&ldquo;{captions.boots}&rdquo;</blockquote>
            <p className="mt-3 text-small text-barnwood">From Dawn&apos;s Facebook posts</p>
          </div>
          <div className="rounded-tag bg-sage p-6">
            <p className="text-barnwood">Barnwood Grey on Sign Sage</p>
            <p className="eyebrow mt-2 text-green">Shop Green label on Sign Sage</p>
          </div>
        </div>
        <figure className="hangtag p-3 pt-7">
          <Image src={p.src} width={p.width} height={p.height} alt={p.alt} sizes="(min-width: 1024px) 50vw, 100vw" className="h-auto w-full rounded-[3px]" />
          <figcaption className="mt-3 text-center">
            <span className="tag-label">{p.caption}</span>
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
