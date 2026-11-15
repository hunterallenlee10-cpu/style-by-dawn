# Style by Dawn: concept site

Front-end-only concept site for Style by Dawn, a women's boutique inside Shepherd's Old Field Market, Leonardtown, MD. Built by Lee Enterprises Unlimited. Ships in **demo mode** (noindex everywhere). See `SEO-LAUNCH.md` before going live, and `BUILD-SPEC.md` for the full brief.

## Run it
```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build (live mode refuses to build while DRAFT markers remain)
npm start
```

## Checks (run against a running server)
```bash
npm run check                       # h1s, links, dashes, images, phone and email, DRAFTs in live mode
node scripts/test-hold.mjs          # Hold Request end to end
node scripts/test-new.mjs           # /new filters and lightbox
node scripts/test-keyboard.mjs      # keyboard-only pass
node scripts/test-zoom.mjs          # 200% zoom and 320px reflow
node scripts/validate-jsonld.mjs    # structured data
node scripts/lighthouse.mjs demo    # Lighthouse 13, production build only
node scripts/mobile-sweep.mjs [base] # every page on six phone profiles
node scripts/mobile-interactions.mjs [base] "iPhone 13"  # touch interactions
```

## Launch switch
- `NEXT_PUBLIC_SITE_MODE` = `demo` (default) or `live`
- `NEXT_PUBLIC_SITE_URL` = the real domain, used for canonicals, sitemap and JSON-LD

## Where things live
- Facts: `lib/business.ts` (source beside each). Looks, photos and tiles: `lib/looks.ts`.
- Design tokens: `app/globals.css` `@theme` block.
- Photos: `public/images/` (her 21 Facebook photos at full size; `02` has the left 15% cropped).
- Generated: `components/Wordmark.tsx` (`npm run wordmark`), OG image and icons (`node scripts/make-assets.mjs`).
- Screenshots: `screenshots/final/`. Review notes and Lighthouse numbers: `implementation_kickstart.md`.
