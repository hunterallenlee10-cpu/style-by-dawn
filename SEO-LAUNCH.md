# SEO launch checklist: Style by Dawn

The site ships in **demo mode**: every page says `noindex, nofollow`, every response carries `X-Robots-Tag: noindex, nofollow`, there is no sitemap and no `llms.txt`, and the footer shows "Concept preview by Lee Enterprises Unlimited." Nothing below happens until Dawn says yes.

## 1. Before you flip the switch
- [ ] Decide which phone number is the real one: (301) 461-3147 (her Facebook mobile, used on the site) or (301) 481-7914 (Google and Yelp). Update `lib/business.ts` if needed.
- [ ] Replace every DRAFT item (search the code for `DRAFT`) and the "Your Google reviews go here" placeholder. The live build refuses to run while any remain: `scripts/guard-live.mjs` checks `app/`, `components/` and `lib/`.
- [ ] Remove the portrait placeholder on /meet-dawn once Dawn sends a photo of herself.

## 2. Go live on Vercel
- [ ] In the Vercel project, set `NEXT_PUBLIC_SITE_MODE=live` and `NEXT_PUBLIC_SITE_URL=https://<her domain>` (no trailing slash). Redeploy.
- [ ] Confirm on the live domain:
  - View source on `/`: `<meta name="robots" content="index, follow">`
  - `curl -sI https://<domain>/` shows **no** `X-Robots-Tag` header
  - `https://<domain>/sitemap.xml` lists `/`, `/new`, `/meet-dawn`, `/visit`
  - `https://<domain>/robots.txt` lists the sitemap
  - `https://<domain>/llms.txt` returns the Markdown summary
  - The footer no longer shows the concept line
- [ ] There is no old site, so no redirects are needed. Redirect or retire the `*.vercel.app` preview address (Vercel: Settings, Domains, redirect it to the real domain).

## 3. Point Google at it
- [ ] Google Business Profile: put the home page `/` in the website field. Today it says "Add website".
- [ ] Google Search Console: add the domain property, request indexing for `/`, submit `https://<domain>/sitemap.xml`.
- [ ] Bing Webmaster Tools: import from Search Console or add the site, submit the same sitemap.
- [ ] Confirm the host's bot protection (Vercel Firewall, Attack Challenge Mode) is not blocking Googlebot, Bingbot or AI search crawlers.

## 4. Make name, address and phone identical everywhere
Use exactly: **Style by Dawn, 22725 Duke Street, Leonardtown, MD 20650**, and the phone number chosen in step 1.
- [ ] Google Business Profile
- [ ] Apple Business Connect
- [ ] Bing Places
- [ ] Yelp (currently lists the other phone number)
- [ ] The Shepherd's Old Field Market vendor page
- [ ] Facebook (shopstylebydawn), and retire or merge the separate "Dawn's Style" page

## 5. What the site already does
- One `h1` per page with the service and the town, unique titles and meta descriptions, self-referencing canonicals from `NEXT_PUBLIC_SITE_URL`.
- JSON-LD: `ClothingStore` on `/` and `/visit` (address, hours, phone, email, map link, Facebook and Instagram, inside Shepherd's Old Field Market), `BreadcrumbList` on inner pages. No rating or review markup, on purpose: reviews appear only as plain attributed text.
- Open Graph and Twitter cards with a 1200x630 image of her shopfront, and a monogram favicon.

## One honest line for Dawn
"The site is technically complete. Ranking from here depends mostly on your Google profile, getting Google reviews (you have none yet), consistent listings and links."
