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
- [x] Phase 2: the hero with The Rail (375 first, then desktop), the proof strip, independent review 1 and one round of fixes.
- [x] Phase 3: Where are you headed? styler, Stiffany band.
- [x] Phase 4: New this week bento, holiday band, reviews, FAQ, final band. Home page finished.
- [x] Phase 5: the Hold Request with every pre-fill wired, the honest last step, the mobile sticky bar.
- [x] Phase 6: `/new` with filters and lightbox, `/meet-dawn`, `/visit` with the tap-to-load map, the `/contact` redirect, the 404 page.
- [x] Phase 7: launch switch and header, titles, descriptions, h1s, canonicals, JSON-LD (validated), robots, sitemap, `llms.txt`, OG image, favicon, live-mode build guard, `SEO-LAUNCH.md`. Delete `/palette-board`.
- [x] Phase 8: Lighthouse 13 on a production build, live mode then demo mode, mobile and desktop. Header proof.
- [x] Phase 9: independent review 2 with fact audit, one round of fixes, keyboard-only and 200% zoom passes, final commit.

## Phase log
- Phase 2, independent review 1 (fresh subagent, hero screenshots only): 68/100 (design 28/40, usability 20/30, creativity 13/20, content 7/10). Fixed: (1) the rail now shows hooks and about half the first card above the mobile bar (tighter hero spacing, smaller mobile hangers); (2) rail reads as a rod, not a slider (stroke-only hangers, no panel border, bleeds off the right edge on desktop, uniform 9:10 frames with per-photo crop focus that keeps every watermark whole, aligned tags, less dead space); (3) the weekly line's dot became a short mint rule, the nav plate is larger with a lighter frame. Not applied, because the spec fixes them: renaming "Hold it for me", rewriting Dawn's sub line, and photo-first proof order on phones (it would push the 2016 line and the review out of the first two screens).
- Phase 3: styler deck ships as a real stacked deck (fallback not needed). Weekend easy holds 4 looks (05, 06, 11, 14) and A day in town adds 07 so every rail card opens a matching look; the spec says 1 to 3, noted here as a deliberate deviation.

- Phase 8: Lighthouse 13.6.0 against production builds (next build, next start), mobile and desktop, home plus one page of each type. Live mode ran locally with NEXT_PUBLIC_SITE_MODE=live NEXT_PUBLIC_SITE_URL=http://localhost:3000 and ALLOW_DRAFT_IN_LIVE=1 (DRAFTs allowed for this local run only). First pass had home mobile at Performance 86 (LCP 3.5 s) and /meet-dawn, /visit at 93 and 94 (LCP 3.0 to 3.2 s). Fixes: dropped the unused wdth axis from Instrument Sans (56 KB to 29 KB), exact sizes so phones fetch 640w, and on phones the /visit address and hours card comes before the photo and the /meet-dawn header photo became a 58% inset, so the LCP is text that paints before the framework scripts.

Live mode:

| Page | Form | Perf | A11y | Best Pr. | SEO | LCP | CLS | TBT | Failing (a11y/BP/SEO) |
|---|---|---|---|---|---|---|---|---|---|
| / | mobile | 100 | 100 | 100 | 100 | 0.9 s | 0 | 60 ms | none |
| /new | mobile | 100 | 100 | 100 | 100 | 0.9 s | 0 | 90 ms | none |
| /meet-dawn | mobile | 100 | 100 | 100 | 100 | 0.9 s | 0 | 70 ms | none |
| /visit | mobile | 99 | 100 | 100 | 100 | 0.9 s | 0 | 120 ms | none |
| / | desktop | 100 | 100 | 100 | 100 | 0.3 s | 0 | 0 ms | none |
| /new | desktop | 100 | 100 | 100 | 100 | 0.3 s | 0 | 0 ms | none |
| /meet-dawn | desktop | 100 | 100 | 100 | 100 | 0.6 s | 0 | 0 ms | none |
| /visit | desktop | 100 | 100 | 100 | 100 | 0.6 s | 0 | 0 ms | none |

Agentic Browsing (information only, home mobile, live): 100

Demo mode (SEO 69 expected, only is-crawlable fails):

| Page | Form | Perf | A11y | Best Pr. | SEO | LCP | CLS | TBT | Failing (a11y/BP/SEO) |
|---|---|---|---|---|---|---|---|---|---|
| / | mobile | 99 | 100 | 100 | 69 | 0.9 s | 0 | 90 ms | is-crawlable |
| /new | mobile | 100 | 100 | 100 | 69 | 0.9 s | 0 | 60 ms | is-crawlable |
| /meet-dawn | mobile | 100 | 100 | 100 | 69 | 0.9 s | 0 | 70 ms | is-crawlable |
| /visit | mobile | 100 | 100 | 100 | 69 | 0.9 s | 0 | 80 ms | is-crawlable |
| / | desktop | 100 | 100 | 100 | 69 | 0.3 s | 0 | 0 ms | is-crawlable |
| /new | desktop | 100 | 100 | 100 | 69 | 0.3 s | 0 | 0 ms | is-crawlable |
| /meet-dawn | desktop | 100 | 100 | 100 | 69 | 0.6 s | 0 | 0 ms | is-crawlable |
| /visit | desktop | 100 | 100 | 100 | 69 | 0.6 s | 0 | 0 ms | is-crawlable |

- Phase 9, independent review 2 (fresh subagent, 1440 and 375 screenshots of all four pages plus rendered text): 76/100 (design 31/40, usability 21/30, creativity 16/20, content 8/10). Fact audit: phone, email, address, hours, links, all three reviews and all five Dawn captions verified word for word; no em dashes, hype words, stars or counts. Fixed in one round: /new is a 2-column grid on phones with compact Hold and text-icon actions and a fade on scrollable chip rows; the weekly line no longer repeats in the rack intro; the styler deck is larger on phones; /visit has Get directions and Ask Dawn to hold something at the top; Inside the shop tiles share a 4:5 frame; hold copy now reads as a request, not a policy; the /new intro no longer claims every piece is on the racks; photo 02 caption corrected (the door opens inside the market, not onto Duke Street); pre-written texts fixed ('the The denim table', and caps or bags ask 'Do you still have it?'). Kept as the spec dictates: meta descriptions, the FAQ answers, S/M/L/XL chips (DRAFT), 'Be your best you.', photo 03 in both the styler and the Stiffany band.
- Keyboard-only pass (scripts/test-keyboard.mjs): every focus stop on all four pages at 1440 and 390 is visible, styled and never under the sticky header or mobile bar; skip link is the first stop (it was not, fixed). 200% zoom pass (scripts/test-zoom.mjs at 720, 640 and 320 CSS px): no horizontal scroll, no clipped text (a 4px overflow on /new at 320 was fixed).

Final Lighthouse 13.6.0, live mode (ALLOW_DRAFT_IN_LIVE=1, local only):

| Page | Form | Perf | A11y | Best Pr. | SEO | LCP | CLS | TBT | Failing (a11y/BP/SEO) |
|---|---|---|---|---|---|---|---|---|---|
| / | mobile | 93 | 100 | 100 | 100 | 3.1 s | 0 | 120 ms | none |
| /new | mobile | 100 | 100 | 100 | 100 | 0.9 s | 0 | 60 ms | none |
| /meet-dawn | mobile | 100 | 100 | 100 | 100 | 0.9 s | 0 | 50 ms | none |
| /visit | mobile | 100 | 100 | 100 | 100 | 0.9 s | 0 | 80 ms | none |
| / | desktop | 100 | 100 | 100 | 100 | 0.3 s | 0 | 0 ms | none |
| /new | desktop | 100 | 100 | 100 | 100 | 0.3 s | 0 | 0 ms | none |
| /meet-dawn | desktop | 100 | 100 | 100 | 100 | 0.6 s | 0 | 0 ms | none |
| /visit | desktop | 100 | 100 | 100 | 100 | 0.7 s | 0 | 0 ms | none |

Home mobile re-runs after the 93 outlier (rail card picked as LCP mid-slide): 99, 98, 99, LCP 0.9 s, observed LCP 173 to 186 ms.

Final demo mode:

| Page | Form | Perf | A11y | Best Pr. | SEO | LCP | CLS | TBT | Failing (a11y/BP/SEO) |
|---|---|---|---|---|---|---|---|---|---|
| / | mobile | 99 | 100 | 100 | 69 | 0.9 s | 0 | 140 ms | is-crawlable |
| /new | mobile | 99 | 100 | 100 | 69 | 0.9 s | 0 | 100 ms | is-crawlable |
| /meet-dawn | mobile | 99 | 100 | 100 | 69 | 0.9 s | 0 | 120 ms | is-crawlable |
| /visit | mobile | 100 | 100 | 100 | 69 | 0.9 s | 0 | 80 ms | is-crawlable |
| / | desktop | 100 | 100 | 100 | 69 | 0.7 s | 0 | 0 ms | is-crawlable |
| /new | desktop | 100 | 100 | 100 | 69 | 0.2 s | 0 | 0 ms | is-crawlable |
| /meet-dawn | desktop | 100 | 100 | 100 | 69 | 0.6 s | 0 | 10 ms | is-crawlable |
| /visit | desktop | 100 | 100 | 100 | 69 | 0.6 s | 0 | 0 ms | is-crawlable |
