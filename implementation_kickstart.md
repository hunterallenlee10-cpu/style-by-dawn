# Implementation kickstart: Style by Dawn

## Installed versions (printed in Phase 1)
- Next.js 16.4.6 (App Router, Turbopack, `cacheComponents: true`, `partialPrefetching: true`)
- React 19.3.1 / React DOM 19.3.1
- Tailwind CSS 4.3.5 via `@tailwindcss/turbopack`
- TypeScript 5.9.3 (Next 16 requires TS 5.1+; TS 7 is not used)
- lucide-react 1.73.0, @vercel/analytics 2.0.1, Lighthouse 13.6.0, sharp 0.35.5, opentype.js 2.0.0

## Notes from the bundled Next 16 docs (node_modules/next/dist/docs)
- `params` / `searchParams` are Promises. `middleware` is `proxy`. `next lint` is gone (ESLint CLI).
- `next/image`: `priority` is deprecated, use `preload` (only on the first rail card). `qualities` default is `[75]`.
- Cache Components: anything time based (today's hours, day chips) runs in client code after mount, never during prerender.
- Activity keeps hidden routes mounted, so the Hold Request lives in the root layout and closes on route change.
- `<ViewTransition>` from `react` gives page crossfades with no config.

## Plan
1. Assets: `public/images/raw/` (21 Drive originals, gitignored) are copied to `public/images/` at full size by `scripts/prepare-images.mjs`. Only `02` is changed: the left 15% is cropped (figure behind the glass). No EXIF or GPS was present.
2. Facts live in `lib/business.ts` (source comment per fact). Photos, looks, occasions and tiles live in `lib/looks.ts`. Site mode and URLs in `lib/site.ts`.
3. Wordmark: `scripts/make-wordmark.mjs` turns "Style" (Allura) and "BY DAWN" (Libre Caslon Display, 0.22em tracking) into SVG paths and writes `components/Wordmark.tsx` plus the "S" monogram used for the favicon, Apple icon and JSON-LD logo.
4. Home sections, one file each in `components/sections/`. Signature motion only in `components/Rail/` and `components/Styler/` (plain CSS keyframes and transitions, no motion library).
5. Hold Request: context provider in the root layout, flow component lazy loaded on first open, inline on `/visit#contact`.
6. SEO: launch switch (`NEXT_PUBLIC_SITE_MODE`), `X-Robots-Tag` via `headers()`, robots, sitemap, llms.txt route, JSON-LD, OG image, icons, live-mode guard (`scripts/guard-live.mjs` runs before `next build`).
7. `npm run check` (`scripts/check.mjs`) crawls a running server with Playwright and fails on any rule break.

## Design tokens (all in `app/globals.css` `@theme`)
| Token | Hex | OKLCH |
|---|---|---|
| linen | #FAF6F0 | oklch(97.46% 0.0090 78.28) |
| petal | #F3E7E3 | oklch(93.63% 0.0142 39.42) |
| sage (band) | #DCE5DD | oklch(91.28% 0.0144 148.77) |
| mint (sign) | #B8CABD | oklch(82.16% 0.0266 154.37) |
| rose (primary) | #9B4555 | oklch(50.62% 0.1156 10.57) |
| rose-deep (hover) | #7F3343 | oklch(43.11% 0.1061 9.65) |
| green (shop green) | #3F5747 | oklch(43.20% 0.0394 155.24) |
| espresso (text) | #2A211E | oklch(25.72% 0.0150 39.27) |
| barnwood (muted text) | #6A5A54 | oklch(48.14% 0.0231 41.65) |
| seam (border) | #E5D8D0 | oklch(89.05% 0.0181 53.95) |
| wood (rail only) | #785450 | oklch(48.34% 0.0489 26.13) |
| success / error | #3F6B4F / #A3322F | oklch(48.73% 0.0668 155.13) / oklch(48.62% 0.1493 25.92) |
| on-rose | #FFF9F5 | oklch(98.56% 0.0084 56.32) |

Contrast (computed by `scripts/oklch.mjs`): espresso on linen 14.61, on petal 13.00, on sage 12.21; barnwood on linen 6.09, petal 5.42, sage 5.09; on-rose on rose 5.96, on rose-deep 8.19; rose on linen 5.78; green on linen 7.32.

Type: Libre Caslon Display 400 (display), Instrument Sans 400 to 600 (body). Scale: label, body, lead, h3, h2, h1, display as `clamp()` steps from the spec. Radius 6px. 8px spacing grid. Section padding 72px mobile, 112 to 128px desktop.

## Checklist (section 9)
- [x] Phase 1: scaffold, print installed versions, tokens in `@theme`, fonts, wordmark SVG script, the `/palette-board` board (screenshot and fix), nav, footer, `npm run check`.
- [ ] Phase 2: the hero with The Rail (375 first, then desktop), the proof strip, independent review 1 and one round of fixes.
- [ ] Phase 3: Where are you headed? styler, Stiffany band.
- [ ] Phase 4: New this week bento, holiday band, reviews, FAQ, final band. Home page finished.
- [ ] Phase 5: the Hold Request with every pre-fill wired, the honest last step, the mobile sticky bar.
- [ ] Phase 6: `/new` with filters and lightbox, `/meet-dawn`, `/visit` with the tap-to-load map, the `/contact` redirect, the 404 page.
- [ ] Phase 7: launch switch and header, titles, descriptions, h1s, canonicals, JSON-LD (validated), robots, sitemap, `llms.txt`, OG image, favicon, live-mode build guard, `SEO-LAUNCH.md`. Delete `/palette-board`.
- [ ] Phase 8: Lighthouse 13 on a production build, live mode then demo mode, mobile and desktop. Header proof.
- [ ] Phase 9: independent review 2 with fact audit, one round of fixes, keyboard-only and 200% zoom passes, final commit.
