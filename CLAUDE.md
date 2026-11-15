# Style by Dawn (concept site)

Front-end-only concept site for Style by Dawn, a women's boutique inside Shepherd's Old Field Market, Leonardtown, MD. Built by Lee Enterprises Unlimited as a spec demo.

Re-read the matching part of BUILD-SPEC.md at the start of each phase.

## Stack
- Next.js 16 (App Router, TypeScript), React 19, Tailwind CSS 4 (tokens in the `@theme` block of `app/globals.css`)
- `next/font/google`: Libre Caslon Display + Instrument Sans (two families only)
- `lucide-react` icons, `@vercel/analytics`. No backend, no API keys.

## Commands
- `npm run dev`: dev server on :3000
- `npm run build`: production build (runs the live-mode DRAFT guard when `NEXT_PUBLIC_SITE_MODE=live`)
- `npm run check`: builds nothing; crawls a running server (default http://localhost:3000) and fails on: more or fewer than one h1, broken internal links, em dashes or `--`, images without alt/width/height, phone or email that do not match `lib/business.ts`, and (live mode) DRAFT markers
- `npm run lint`: ESLint directly (`next lint` no longer exists)

## Rules that never bend
- Real photos only: the 21 files in `public/images/`. Never stock, never AI, never the lily logo image.
- Invent nothing. Every fact lives in `lib/business.ts` with its source beside it. Looks and tiles live in `lib/looks.ts`.
- Dawn's captions are quoted exactly. Never rewritten.
- No em dashes and no double hyphens in any copy.
- Demo mode by default (`NEXT_PUBLIC_SITE_MODE=demo`): noindex meta + `X-Robots-Tag` header, no sitemap, no llms.txt.
- Anything assumed gets a `// DRAFT` comment or a visible label.
- No file over 500 lines.
