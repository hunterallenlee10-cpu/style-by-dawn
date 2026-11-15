# Style by Dawn: Claude Code Build Prompt

Paste everything below the line into Claude Code, in an empty folder.

---

You are a senior web designer and front-end engineer. Your job is to build an award-level, front-end-only concept website for a real business, **Style by Dawn**, a women's clothing boutique inside Shepherd's Old Field Market on Duke Street in Leonardtown, Maryland. This is a spec demo that Lee Enterprises Unlimited will show to the owner, Dawn. She has no website. Her Google Business Profile literally says "Add website", shows zero Google reviews, and still ranks second in the map pack for "women's boutique Leonardtown MD". Her Instagram link goes to a Linktree with one button. Everything she does lives in Facebook posts: weekly new arrivals styled on a shop mannequin she calls "Stiffany", her own styling notes ("Just add your favorite boots..."), and the odd sale. The new site has to make her say "I need this" in the first five seconds. She will most likely open the link on her phone, so the first phone screen matters more than anything else. It must feel like a warm, editorial boutique magazine that happens to be her shop, not an AI template and not a generic Shopify theme. If you could swap the wordmark and pass it off as another boutique's site, it is not finished.

**Finish the whole build in this session.** Ordinary obstacles (a port in use, a missing browser for screenshots, an image that will not convert, a Lighthouse run that fails) are yours to diagnose and work through. Do not end by listing what is left or offering to continue. The only planned stop is missing photos, as described in section 0.

**First actions, in this order:**
1. Save this entire prompt, unchanged, as `BUILD-SPEC.md` in the project root.
2. Write a short `CLAUDE.md`: the stack, the commands (`npm run dev`, `npm run build`, `npm run check`), the rules that never bend (real photos only, invent nothing, no em dashes, demo mode by default), and the line "Re-read the matching part of BUILD-SPEC.md at the start of each phase."
3. `git init` and make the first commit.
4. Write `implementation_kickstart.md` (the plan, the design tokens and the checklist from section 9). Commit after every phase from here on.

## 0. Get the assets first

All images live in Hunter's Google Drive folder **"Style by Dawn - Website Demo Assets"**:
https://drive.google.com/drive/folders/1mCg2N5k4jqUudhlSZ-3fOrToh6NFtRxL

- `photos/` (folder ID `1IdZFnZ5gc0xAJ6Ua4B6iB5dIhYARPsMs`): 21 real photos from the owner's Facebook page. These are the only photos allowed on the site.
- `reference-brand (look and feel only, not site images)/` (folder ID `1ZSttQONxXgTZuL0zmVcu06-PP_oFhIPe`): her Facebook profile image, a white script "Style By Dawn" set over a pink lily photo. Read it for the wordmark style only. Never put it on the site.

If you have a Google Drive connector, download every file in `photos/` into `public/images/raw/`. If you do not, and `public/images/raw/` is empty, stop and ask Hunter to drop the `photos/` folder there, then continue. Look at every image yourself before you design, so you know what is in each one.

Keep the source files at full size in `public/images/` and let `next/image` serve the right size per screen (see section 6). Do not hand-convert them to one fixed size.

### Photo map (what each file is and where it goes)

Every photo is a phone shot from her Facebook page. Widths run from 853px to 1268px, so **none can fill a 1920px full-bleed hero, and none may be stretched past its native size.** The two widest (`01`, `02`, 1268x952) can run full-width on a phone and as a contained or half-width image on desktop. Everything else lives in cards, the hanger rail, split layouts and collages. Most photos carry her own "STYLE by Dawn" watermark in a bottom corner. That is hers and is fine to show; never crop it in half (crop it fully out or leave it fully in), and put "unwatermarked originals" on the ask-the-owner list.

| File | Size | What it shows | Use it for |
|---|---|---|---|
| `01-STOREFRONT-sage-style-by-dawn-sign-BEST` | 1268x952 | **The shop itself**, inside Shepherd's Old Field Market. Sage sign with script "Style By Dawn" and "Be your best you!", string lights, barnwood beams, pink walls, overalls and star prints in the windows, brick walkway | **Hero "find us" card, /visit hero, OG image. The trust photo** |
| `02-storefront-sign-alt-angle` | 1268x952 | Same storefront, closer angle, door open to the pink interior | /meet-dawn header. A faint figure behind the glass on the far left: crop the left 15% |
| `03-stiffany-black-ribbed-dress-then-cream-coat-diptych` | 1092x1092 | Two panels: Stiffany in a black ribbed midi dress with leopard belt, then the same look with a long cream coat | **Styler "Dinner out" look**, Stiffany's Look of the Week |
| `04-stiffany-taupe-ribbed-dress-cream-coat` | 967x1211 | Stiffany in a taupe ribbed midi, leopard belt, cream coat. Star tote and a "You glow girl" sign behind | **Hero rail hanger 1**, Styler "A day in town" |
| `05-three-fall-looks-at-shop-door-sign` | 907x1211 | Three mannequins at the shop door under the sign: leopard overalls with cream hat, olive long vest over florals, sherpa jacket with wide-leg jeans and a woven tote | Hero rail hanger 3, Styler "Weekend easy", /visit |
| `06-pink-plaid-shacket-mannequin-at-sign` | 1092x1092 | Pink plaid shacket and taupe wide-brim hat, blue zigzag cardigan beside it, sign above | Hero rail hanger 2, /new |
| `07-white-utility-jacket-and-black-dress` | 967x1211 | White cinched utility jacket with wide-leg jeans beside a black tiered dress and crossbody | Hero rail hanger 5, /new |
| `08-taupe-cardigan-crossbody-wide-leg-jeans` | 967x1211 | Taupe cropped cardigan, tan leather crossbody with printed panel, sailor-pocket wide-leg jeans | Hero rail hanger 4, Styler "A day in town" |
| `09-green-cardigan-velvet-witch-hat` | 967x1211 | Green button cardigan on a form wearing a purple velvet witch hat | Styler "Something fun", /meet-dawn personality strip |
| `10-cable-cardigan-window-velvet-hat` | 853x1211 | Cream and caramel cable cardigan with crossbody in the shop window, glass reflections | Collage tile only, small |
| `11-window-aztec-maxi-and-denim-jacket` | 1092x1092 | Shop window: aztec striped maxi with denim jacket and rust hat, white denim jacket over plaid dress | Styler "Weekend easy", /new |
| `12-merry-and-bright-snapback-caps` | 1092x1092 | Three holiday snapbacks: "Merry & Bright" with red polka dot brim, "MERRY" with buffalo plaid brim, "Merry & Bright" with green stripe brim | **Holiday band**, Styler "Holiday season" |
| `13-250-years-of-freedom-tee-star-hat` | 967x1211 | "250 Years of Freedom 1776 - 2026" tee on a form with a star sun hat | Styler "Something fun", /new graphic tees |
| `14-plaid-shackets-rust-hat-wall` | 1092x1092 | Two plaid shackets and a rust tank on a barnwood wall, rust felt hat, jeans below | /new jackets, Styler "Weekend easy" |
| `15-sherpa-quarter-zips-buffalo-check-backpacks` | 1092x1092 | Grey, berry and buffalo check sherpa quarter zips over four buffalo check sherpa backpacks | Holiday band, Styler "Holiday season", /new cozy |
| `16-muk-luks-slipper-boots` | 1092x1092 | Fair isle knit slipper boots with sherpa cuffs, Muk Luks tags | Holiday band, /new cozy |
| `17-olive-vest-floral-top-closeup` | 1092x1092 | Close-up: olive quilted vest over a dark floral top | Texture tile on /new |
| `18-zebra-totes-wide-leg-jeans` | 1092x1092 | Pink and black zebra totes beside very wide-leg faded jeans | Styler "Something fun", /new bags and denim |
| `19-denim-table-graphic-tees-wall` | 874x874 | Barnwood and galvanised denim table, graphic tees and caps on the wall | /visit interior, /new denim |
| `20-denim-stack-closeup` | 874x874 | Close stack of jeans, back pockets and tags | /new denim texture |
| `21-blue-embroidered-crossbody-bag` | 966x1211 | Navy canvas bag with white embroidered pattern and leather straps on barnwood | /new bags |

**Never generate, fetch or use stock or AI images.** They make a real business look fake, and Dawn would spot a stranger's sweater on her own site instantly. There is **no photo of Dawn herself** and no unwatermarked logo file. Where a portrait belongs (/meet-dawn), use a clean labelled placeholder in the design system: "Photo: Dawn in the shop, from Style by Dawn". Never use the lily image.

No customers, children or licence plates appear in these photos. Other vendors' signs (a "Vinrella" umbrella sign in `06` and `10`) are background only: never mention them.

## 1. Business facts (use only these, invent nothing)

Put every fact in one file, `lib/business.ts`, with the source in a comment beside each.

- **Name:** Style by Dawn. Her sign sets "Style" in a large script with "By Dawn" small beneath; in body copy write "Style by Dawn".
- **Owner:** Dawn Campbell (The BayNet, March 2026). Use "Dawn" in copy.
- **Location:** 22725 Duke Street, Leonardtown, MD 20650, inside Shepherd's Old Field Market (Google lists her as "Located in: Shepherd's Old Field Market"; her posts say "just about a block off the square").
- **Hours (Google profile and her Facebook post, Nov 2026):** Tuesday to Saturday 10 AM to 7 PM, Sunday 11 AM to 5 PM, Monday closed.
- **Main search phrase:** "women's boutique Leonardtown MD". Variations: "women's clothing store Leonardtown", "boutique in St. Mary's County MD", "Shepherd's Old Field Market boutique". Name, address and phone must appear exactly as written here everywhere on the site.
- **Phone (call or text):** (301) 461-3147, listed as her mobile on Facebook. Use `tel:+13014613147` and `sms:+13014613147`. `// DRAFT: confirm. Google and Yelp list (301) 481-7914`
- **Email:** mystylebydawn@gmail.com
- **Links:** Facebook facebook.com/shopstylebydawn (about 1K followers). Instagram @style_by_dawn.
- **History, in her words (The BayNet, March 2026):** "I have had boutique businesses in Leonardtown at SOF Market since SOF opened in 2016." She grew up in St. Mary's County. Write it as: "Dawn has run boutiques at Shepherd's Old Field Market since it opened in 2016."
- **What she sells (from her own photos and posts only):** women's tops, sweaters and cardigans, dresses, jackets and shackets, vests, denim (wide-leg, flare, overalls), graphic tees (including "250 Years of Freedom" tees for America's 250th), hats (wide-brim felt, sun hats, holiday snapback caps), bags (crossbodies, totes, sherpa backpacks), sherpa quarter zips, slipper boots, belts and accessories. Sizes she has posted: S/M and L/XL on one dress, "Small to Large" on a cardigan. Do not list other sizes.
- **Brands named in her posts:** Artemis Vintage (jeans), Myra (leather bag), Muk Luks (visible on slipper tags). No others.
- **How she works (the differentiator):** she styles every new piece into a full look and tells you how to wear it. Her captions, word for word, are the copy:
  - "Just add your favorite boots for an effortlessly polished outfit, perfect for dinner out or a day in town!"
  - "Pair it with tall brown boots and a coordinating handbag for a fresh fall look, or dress it up with heels and gold jewelry for dinner out!"
  - "Super soft and perfect for Fall, this super soft cropped cardi pairs perfectly with your favorite jeans or skirt!"
  - "Gear up for Fall with the basics! Check out this wool blend cardi, perfect in this neutral taupe color! Jeans by Artemis Vintage, and leather Myra bag to finish off the look!"
  - "These newly added snapbacks are giving your favorite jeans and sweatshirt a little Christmas cheer!"
  - A real Facebook review confirms it in person (below).
- **Stiffany:** the shop mannequin. Dawn writes posts in her voice: "Stiffany is ready to head out in style!", "Stiffany is mixing it up..." Use her by name.
- **Her own lines you can reuse:** "Be your best you!" (on her shop sign). "Women's fashion at affordable prices to help you feel fabulous every day!" (Facebook bio). "Helping you feel your best every day" (Instagram bio). "Find your next favorite outfit!" "Shop small."
- **Reviews (Facebook recommendations, the only reviews that exist; Google shows none):**
  - Jessica R., via Facebook, April 2019: "I met the owner Dawn, and she was wonderful! I'm not good at shopping, and have lost some weight recently, so I was lost. Dawn actually helped me so much! She helped me pick out some amazing outfits, and showed me different ways to wear the items." and "The clothes are all superb, amazing, boutique quality, but affordable prices!"
  - De'Lores R., via Facebook, November 2018: "Great clothes and affordable check her out!"
  - AnnMarie A., via Facebook: "Beautiful Apparel! Friendly Customer Service!" `// DRAFT: confirm date on Facebook`
- **Second shop (DRAFT, confirm whether she wants it on this site):** Style House on Park Avenue, inside The Inn at Leonardtown, 41655 Park Avenue, Leonardtown. Opened with a ribbon cutting in March 2026. A coastal-inspired boutique for women and men. Her posts call it "open 24/7 for your shopping pleasure" `// DRAFT: confirm`.
- **Promo:** none current. Her recent posts ran single-day "20% off storewide" sales. Do not show a promo. The holiday band (section 4) carries no discount.
- **Conflicts to leave off:** (301) 481-7914 (Google and Yelp). A separate "Dawn's Style" Facebook page. A candy display ("Classic Candy & Snack Co.") she posted is another market vendor's, not hers. Add all three to the confirm list.
- **Do not claim:** star ratings, review counts, "best boutique", "#1", years in business beyond the 2016 quote, size ranges beyond those listed, plus sizes, alterations, gift wrapping, gift cards, online ordering, shipping, holds or reservations as a policy, free styling appointments, brand names beyond those listed, any prices, or "women of all ages".

## 2. The ONE goal

Every visitor action leads to **"Hold it for me"**. That button opens the **Hold Request** (section 5), which ends by texting Dawn the piece, size and the day the shopper will stop in. Calling and getting directions are the always-visible second paths, because boutique shoppers either ask about sizes or just come in. Primary action rationale: this is a walk-in store with no online shop, so the online job is to turn "I like that" into a named visit. No newsletter, no email capture, no cart.

`// DRAFT: confirm Dawn is happy to hold pieces for a day or two. If not, the same flow becomes "Ask Dawn about this" with no other change.`

## 3. Design direction: "Sage Sign, Blush Walls"

The feel: stepping off Duke Street into her shop. Warm linen light, the mint sage of her hand-lettered sign, the blush pink of her walls, honey barnwood and string lights. Editorial and calm like a premium label's lookbook, but friendly and local, because Dawn is the one who will help you. Emphatically not dark, not neon, not a beige template, not pink-overload.

**Palette (designed from her sign, walls and wood; all tokens in OKLCH in the `@theme` block, with the hex beside each):**

| Role | Hex | Name | Where it comes from / where it goes |
|---|---|---|---|
| Background | `#FAF6F0` | Linen | Off-white tinted warm. About 60% of the page |
| Surface | `#F3E7E3` | Petal | Blush-tinted cards and the rail backdrop. Drawn from her pink walls |
| Band | `#DCE5DD` | Sign Sage | A lighter tint of her sign `#B8CABD` (sampled from photo `01`). Section rhythm bands, about 25% |
| Sign | `#B8CABD` | Sign Mint | Sampled from the sign itself. Wordmark plate, dividers, focus halo |
| Primary | `#9B4555` | Rosewood | Deepened from her blush walls and lily logo pinks. Only the primary button, active states, the styler's selected chip, key small details. About 10% |
| Primary hover | `#7F3343` | Deep Rosewood | |
| Deep sage | `#3F5747` | Shop Green | Links in body copy, the "Dawn's note" label |
| Text | `#2A211E` | Espresso | Off-black, warm |
| Muted text | `#6A5A54` | Barnwood Grey | |
| Border | `#E5D8D0` | Seam | 1px borders |
| Wood | `#785450` | Barnwood | The hanger rail rod and hooks only (sampled from her beams) |
| Success / error | `#3F6B4F` / `#A3322F` | | Form states only |

Text on the primary button is Linen `#FFF9F5`.

Contrast, checked: Espresso on Linen 14.6:1, on Petal 13.0:1, on Sign Sage 12.2:1. Barnwood Grey on Linen 6.1:1, on Petal 5.4:1, on Sign Sage 5.1:1. Linen on Rosewood 6.0:1, on Deep Rosewood 8.2:1. Rosewood on Linen 5.8:1. Shop Green on Linen 7.3:1. All pass AA for body text. No pure black, no pure white anywhere.

This palette is different from what local boutiques use (white templates, hot pink, or black) and matches the newest premium boutique sites: warm off-white, one restrained accent, generous space. Test it against her photos (warm wood, pinks, denim blue): the Rosewood accent must never sit directly on a photo; put it on Linen or Petal. If any photo looks cold next to Linen, add no filter; adjust the surrounding surface to Petal instead.

**Palette board first:** Phase 1 renders `/palette-board` (excluded from the sitemap and noindexed in both modes): every swatch with its name, a primary button, a card, a paragraph of body text, a "Dawn's note" block and photo `01`. Screenshot it, look at it, and fix anything muddy or harsh before building pages. Delete the route before the final build.

**Type (2 families, `next/font/google`, `display: swap`):**
- Display: **Libre Caslon Display** (400). A classic editorial serif, the same family of feeling as the best fashion lookbooks. Headlines, Stiffany's name, the styler's occasion titles.
- Body: **Instrument Sans** (variable, 400 to 600). Body, buttons, labels, tracked uppercase micro labels (letter-spacing 0.14em, 0.75rem).
- **Wordmark:** her sign is a flowing script "Style" over a small "By Dawn". Recreate it as an inline SVG: at build time, a one-off script (`scripts/make-wordmark.mjs`) uses `opentype.js` to convert the word "Style" set in the Google font **Allura** into SVG paths, and sets "BY DAWN" beneath in Libre Caslon Display capitals at 0.22em tracking. Commit the resulting SVG as `components/Wordmark.tsx`. Allura is never loaded at runtime, so the two-font limit holds. `// DRAFT: swap for her real logo file when she sends it`
- **Type scale (named steps, each a `clamp()` with rem bounds):** label `clamp(0.75rem, 0.72rem + 0.1vw, 0.8125rem)`; body `clamp(1rem, 0.97rem + 0.15vw, 1.0625rem)`, line height 1.6; lead `clamp(1.125rem, 1.06rem + 0.3vw, 1.3125rem)`; h3 `clamp(1.375rem, 1.2rem + 0.7vw, 1.75rem)`; h2 `clamp(2rem, 1.6rem + 1.8vw, 3.25rem)`; h1 `clamp(2.75rem, 2rem + 3.6vw, 5.5rem)`, line height 1.0; display (Stiffany headline) `clamp(3rem, 2.2rem + 4vw, 6.5rem)`, line height 0.95. Text blocks max 66ch. Check: the longest word in the hero headline fits at 375px.

**Material:** "Hangtag". Cards are Petal with a 1px Seam border, 6px radius, and a small punched-hole circle (8px, Linen, inset 1px Seam ring) at top centre, like a boutique price tag. Product captions sit on a narrow tag-shaped label (rectangle with clipped top corners). No drop shadows except one very soft shadow under hanging cards on the rail (`0 18px 30px -18px rgb(42 33 30 / 0.35)`).

**Spacing:** 8px grid. Section padding 112 to 128px desktop, 72px mobile. Generous white space is part of the look.

**Icons:** `lucide-react` for interface icons, 1.5 stroke. Social icons (Facebook, Instagram) are inline SVGs from Simple Icons. No emoji.

**Motion (2 signature places, both on the home page):** the hero **"Rail"** and the **"Where are you headed?"** styler. Plus the free polish tier: scroll-triggered fade-up reveals in plain CSS (inside `@supports (animation-timeline: view())` and `prefers-reduced-motion: no-preference`) and View Transitions between pages. No loading intro, no custom cursor, no scroll-jacking, no smooth-scroll library. Respect `prefers-reduced-motion` everywhere.

**Layout variety:** split hero with the rail; a full-width Sign Sage band for Stiffany; the styler as a two-column studio; an asymmetric bento for "New this week"; a quote band for the review; Petal cards for Visit. Never four identical cards in a row.

**What the best sites in this niche do (patterns, in our own words):**
1. Warm off-white base with one restrained accent and a serif display face, because it reads premium without feeling cold.
2. A dated "this week" line in the hero instead of an evergreen slogan, because it proves the shop is alive and gives a reason to come back.
3. The owner is a visible person (founder story, her own picks), because boutique buyers buy from people.
4. Local winners put address, call, text, hours and a Google link together near the top, because that is the decision a walk-in shopper is making.
5. Shop by occasion helps undecided shoppers more than shop by category.
6. The newest builds use editorial split heroes, scroll-revealed images in plain CSS, separate phone and desktop crops, and large variable serif type clamped hard on phones.
- **Dated patterns to avoid:** auto-rotating hero carousels, stacked announcement bars, Instagram embed widgets, mega-menus on a small catalogue, sold-out items at the top.
- **Where they are all weak, and this site wins:** nobody answers "what do I wear to this?" (the styler does, with Dawn's own looks and words); store and clothes are shown separately (the rail hangs her looks inside her shop's world); no personality (Stiffany); contact is generic (text Dawn to hold a piece in your size).

**Things only this business has (all required):**
- Stiffany, by name, with her real looks (`03`, `04`).
- Dawn's own styling captions as "Dawn's note" copy, quoted, never rewritten.
- The sage sign, "Be your best you!", as the hero headline and the wordmark plate colour.
- Shepherd's Old Field Market, Duke Street, "a block off the square", and "since SOF opened in 2016".
- The "250 Years of Freedom 1776 - 2026" tee and her Merry & Bright snapbacks (her current, seasonal, local stock).
- Jessica R.'s real review about Dawn helping her pick outfits.

## 4. Page structure (compact multi-page: 4 pages)

Site map: `/` (home), `/new` (New this week), `/meet-dawn`, `/visit` (visit and contact). `/contact` permanently redirects to `/visit#contact`. Why four: the top boutique sites all separate new arrivals, the founder story and the visit details, and she has real material for each; anything more would be thin.

Every page has one job, its own search phrase, the same primary button and the same footer.

**Nav (sticky, slim, Linen at 92% with backdrop blur):** wordmark left (links home). Links: New this week, Meet Dawn, Visit. Right: "Get directions" text link with a map-pin icon and the "Hold it for me" button. Mobile: a burger opens a full-screen Petal sheet with big tap targets, and a sticky bottom bar on mobile only: [Directions] [Text Dawn] [Hold it for me]. The sticky bar must never cover the element that has keyboard focus (add `scroll-padding-bottom` equal to its height).

### Home `/`

**1. Hero (the best section on the site):**
- Desktop: split. Left 5/12 on Linen: copy. Right 7/12: the Rail on a Petal panel with a soft barnwood rod across the top.
- **Signature motion, "The Rail":** a horizontal wooden rod (Barnwood `#785450`, 6px, rounded ends, drawn in SVG with two small wall brackets) spans the panel. Five portrait hanger cards hang from it: `04`, `06`, `05`, `08`, `07`. Each card has an SVG hanger hook at top (Barnwood stroke) and a hangtag label below the photo with the look name ("A day in town", "Pink plaid weather", "Fall at the door", "Easy taupe", "Crisp white jacket"). On load, the cards slide in from the right along the rod, staggered 80ms, and settle with a small pendulum sway (rotate from 3deg to 0 around the hook point, one damped swing, about 900ms total), plays once. After that the rail is a scroll-snap row: drag or swipe to browse, two round arrow buttons, and Left and Right arrow keys when focused. Hovering a card lifts it 4px and swings it 1deg. Tapping a card opens the styler (section 3 below) scrolled into view with that look selected. Built with CSS transforms only (no layout properties), so no layout shift. Reduced motion: cards are simply in place, no sway. The rail and the styler are the only components that load the `motion` library, and only if you need it; plain CSS keyframes are preferred.
- Eyebrow + headline are the single `<h1>`: small span "Women's boutique in Leonardtown, MD" (tracked uppercase label), large span **"Be your best you."** (her sign) in Libre Caslon Display.
- Dated line under the h1, Shop Green label style: "New this week: holiday snapbacks, sherpa and Stiffany's dinner look." `// DRAFT: Hunter or Dawn updates this weekly from lib/business.ts`
- Sub (lead size): "Women's fashion at affordable prices, styled by Dawn herself, inside Shepherd's Old Field Market on Duke Street."
- Buttons: "Hold it for me" (Rosewood) and "Get directions" (ghost, opens Google Maps directions to the address in a new tab).
- Under the buttons, three quick facts with small icons: "Open Tue to Sun" | "Inside SOF Market, Duke St" | "Text Dawn (301) 461-3147".
- **On a 375px screen:** nav, eyebrow, headline, dated line, sub, both buttons. The top of the rail (hooks and the first card's top third) peeks in at the bottom edge to invite a scroll. Headline and primary button must be visible without scrolling. The rail becomes a full-width swipe row with the first card at 78% width so the next one peeks.

**2. Proof strip (inside the first two phone screens):** a Petal band with three parts side by side (stacked on phone): photo `01` in a hangtag frame with the caption "Find us inside Shepherd's Old Field Market, a block off the square"; the line "Dawn has run boutiques at SOF Market since it opened in 2016."; and Jessica R.'s review excerpt ("Dawn actually helped me so much! She helped me pick out some amazing outfits, and showed me different ways to wear the items.") with "Jessica R., via Facebook, April 2019" and a link "Read it on Facebook" to the reviews tab. Plain text, no stars.

**3. Where are you headed? (the show-stopper):** headline "Where are you headed?" Sub: "Pick the plan. Dawn already put the outfit together." A two-column studio on desktop (left: the occasion chips and Dawn's note, right: the look), stacked on phone (chips become a horizontal scroll-snap row).
- Occasion chips (pill buttons, `role="radiogroup"`, arrow keys move between them): **Dinner out**, **A day in town**, **Weekend easy**, **Holiday season**, **Something fun**.
- Each occasion shows 1 to 3 real looks as a stacked deck; the top card is large, the others fan behind it rotated 2 to 4deg. A "Next look" button and swipe deal the next card to the front (300ms, transform only).
  - Dinner out: `03`. Dawn's note: "Just add your favorite boots for an effortlessly polished outfit, perfect for dinner out or a day in town!" Pieces: black ribbed midi dress, leopard belt, long cream coat.
  - A day in town: `04`, `08`. Notes: `04` uses the same caption as above; `08` uses "Gear up for Fall with the basics! Check out this wool blend cardi, perfect in this neutral taupe color! Jeans by Artemis Vintage, and leather Myra bag to finish off the look!" `// DRAFT: confirm this caption belongs to photo 08`
  - Weekend easy: `05`, `11`, `14`. No caption exists: show pieces only, from the photo map ("Leopard overalls, cream hat", and so on). No invented note.
  - Holiday season: `12`, `15`, `16`. Note on `12`: "These newly added snapbacks are giving your favorite jeans and sweatshirt a little Christmas cheer!"
  - Something fun: `09`, `13`, `18`. Pieces only.
- "Dawn's note" is a Shop Green label above an Espresso quote in Libre Caslon Display at lead size, attributed "From Dawn's Facebook posts".
- Buttons under the look: "Hold this look for me" (primary, opens the Hold Request with the look pre-filled) and "Text Dawn about it" (ghost, `sms:` with "Hi Dawn! I saw the [look] on your website. Do you have it in my size?").
- On first scroll into view it auto-selects "Dinner out" and deals once. Works with mouse, touch and keyboard. Ungated: no form in front of it.
- **Fallback:** if the deck animation fights you, ship static tabs with a single large image per look and the same notes and buttons.

**4. Stiffany's look of the week (full-width Sign Sage band):** huge display headline "Meet Stiffany." Copy: "She lives at the front of the shop and gets dressed before anyone else. This week:" then the two panels of `03` side by side (it is already a diptych; show it whole) with hangtags "Step 1: the dress" and "Step 2: add the coat". A line from Dawn's post: "Stiffany is ready to head out in style!" Button: "Hold Stiffany's look".

**5. New this week (bento preview):** headline "New on the racks." Asymmetric bento of 6 tiles: `12` (large), `13`, `14`, `15`, `18`, `21`. Each tile has a hangtag caption from the photo map and opens the Hold Request with that piece pre-filled. Link below: "See everything new this week" to `/new`.

**6. The holiday band (seasonal, DRAFT):** Petal band, split. Left: `15` and `16` as an overlapping pair. Right: "Gifts she'll actually wear." "Sherpa quarter zips, buffalo check backpacks, slipper boots and Merry & Bright caps, all at the shop now." Button "Hold a gift for me". `// DRAFT: seasonal copy, swap after the holidays`

**7. Reviews (quote band):** the three real Facebook recommendations as plain attributed text, Jessica R.'s first and largest, each with its source and date. A link "See all recommendations on Facebook". Below them, one empty labelled card: "Your Google reviews go here." No names, no stars, no quotes in it. Never invent a review. Live mode blocks the build while this placeholder exists unless real Google reviews have replaced it.

**8. FAQ (accordion, 6 questions, answers only from section 1):**
- Where is Style by Dawn? Inside Shepherd's Old Field Market at 22725 Duke Street, Leonardtown, MD 20650, about a block off the square.
- What are your hours? Tuesday to Saturday 10 AM to 7 PM, Sunday 11 AM to 5 PM. Closed Monday.
- What sizes do you carry? Sizes change with every delivery. Text Dawn at (301) 461-3147 with the piece you like and she will tell you what is in.
- Can I shop online? Not yet. Everything is in the shop, and you can text Dawn to ask about a piece first.
- What does it cost? Dawn keeps her prices affordable. Ask about any piece by text. (Pricing block below stays off.)
- Do you have a second shop? `// DRAFT` Yes, Style House on Park Avenue, inside The Inn at Leonardtown.

**9. Final call-to-action band:** photo `02` (cropped as noted) contained at the right on desktop, Linen panel left: "See it on Stiffany. Try it on with Dawn." Buttons "Hold it for me" and "Get directions".

**Pricing block (off by default):** a `showPricing` flag in `lib/business.ts` (false) that adds "from $X" labels to tiles once Dawn supplies numbers. Never invent a price.

### `/new` (New this week)
- Title block: h1 "New arrivals at Style by Dawn in Leonardtown", dated line, and a one-paragraph intro.
- Filter chips (client-side, no page reloads): All, Sweaters and cardigans, Jackets and vests, Dresses, Denim, Bags and hats, Cozy and gifts, Graphic tees.
- Grid of every photo from `03` to `21` with hangtag captions from the photo map, each with "Hold it for me" (pre-filled) and "Text Dawn about this". Lightbox on tap with keyboard and swipe.
- A note at the end: "New pieces arrive every week. Follow along on Facebook and Instagram." with both links.

### `/meet-dawn`
- h1 "Meet Dawn, owner of Style by Dawn in Leonardtown". Header photo `02`.
- Her story, short, only from section 1: grew up in St. Mary's County; boutiques at SOF Market since it opened in 2016; dresses Stiffany every week; "Women's fashion at affordable prices to help you feel fabulous every day!" Mark the paragraph `// DRAFT: confirm wording with Dawn`.
- The labelled portrait placeholder.
- "How Dawn helps you shop" in three steps, each from her captions or Jessica's review: 1. Tell her where you are headed. 2. She pulls pieces and shows you different ways to wear them. 3. Walk out with the whole look.
- Personality strip: `09` and `13` with her own lines.
- If Style House is confirmed: a small card "Dawn's second shop: Style House on Park Avenue" with the address.

### `/visit` (visit and contact, `#contact` anchor)
- h1 "Visit Style by Dawn at Shepherd's Old Field Market, Leonardtown". Hero photo `01`, contained.
- Address card (Petal hangtag): address, "inside Shepherd's Old Field Market, about a block off the square", hours table with today highlighted (computed in America/New_York), Get directions button, Call, Text, Email.
- A Google Maps embed loaded only when the visitor taps "Show the map" (a static placeholder before), so it never hurts speed.
- `#contact`: three tiles (Call, Text, Email) and the Hold Request embedded inline.
- Interior strip: `19`, `05`.
- Parking: `// DRAFT: ask Dawn what to say about parking at SOF Market`. Show nothing until confirmed.

**Footer (all pages):** the wordmark, "Be your best you!", the phone large with tap-to-call, a "Text Dawn" link, email, the full address with "Inside Shepherd's Old Field Market", hours, page links, Facebook and Instagram icons with `aria-label`s. Small line: "© 2026 Style by Dawn". On a separate small line, demo mode only: **"Concept preview by Lee Enterprises Unlimited."**

## 5. The Hold Request (the conversion engine)

A modal (or inline on `/visit`) with a slim Rosewood progress bar and "Step 1 of 3". Tap-only choices, big targets, Back and Next, smooth transform transitions. Every step has a row: "Rather talk? Call or text (301) 461-3147". No step asks for something already given.

1. **What caught your eye?** Pre-filled when opened from a look, tile or Stiffany (shows the photo thumbnail and name). Otherwise chips: the five looks, "Something from Facebook", "Not sure yet, help me pick".
2. **Your size.** Chips: S, M, L, XL, "Not sure". `// DRAFT: confirm the size range Dawn stocks`
3. **When can you stop in?** Day chips generated from the hours (Tue to Sun, next 7 days, Monday shown as closed and disabled), plus "Not sure yet". Then a first-name field (optional).

**Last screen (honest):** a summary card and one button that names the real action: **"Text my request to Style by Dawn"**. It opens `sms:+13014613147?&body=` with a prefilled body built from the answers ("Hi Dawn! Could you hold the Dinner out look (black ribbed dress and cream coat) in a M? I'm hoping to stop in Saturday. Thanks, Sarah. Sent from your website."), URL-encoded. The success message ("Sent to Dawn's phone. She'll text you back.") appears only after that tap. On desktop, where a text link does nothing, show "Copy my request" (copies the same text and confirms "Copied") and an email link to mystylebydawn@gmail.com with the same body. Close with Esc, trap focus, lock body scroll, return focus to the button that opened it.

## 6. Tech and file rules

- **Stack:** install the current stable releases and print the installed versions, then read the upgrade notes for those major versions before writing code, because your habits may be older than the tools. At this date that means **Next.js 16, React 19 and Tailwind CSS 4**, with TypeScript and the App Router. Known changes: route `params` and `searchParams` are Promises and must be awaited; the `middleware` file is now `proxy`; `next lint` is gone, so lint with ESLint directly; Tailwind 4 keeps design tokens in a CSS `@theme` block, not a JavaScript config.
- Design tokens (colours in OKLCH with hex comments, the two fonts, the type scale, spacing, radius) live as CSS variables in `@theme`, so the palette and font limit are enforced by the token list.
- Motion: if you use a library, it is `motion` imported from `motion/react`, loaded lazily so only the rail and the styler pay for it.
- Icons: `lucide-react`. Social icons are inline SVGs from Simple Icons.
- Photos: `next/image` with a `sizes` value on every image, AVIF and WebP enabled in `next.config`, and the hero rail's first card preloaded with the framework's current preload setting (the old `priority` prop is deprecated). Every image has width and height.
- Server-rendered by default. Only the rail, the styler, the filters, the lightbox and the Hold Request are client components, and the Hold Request and the map load when first needed.
- One component per section in `components/sections/`, plus `components/Rail/`, `components/Styler/`, `components/HoldRequest/`. **No file over 500 lines.** All facts in `lib/business.ts`, all looks and tiles in `lib/looks.ts`.
- Responsive at 375, 768, 1024 and 1440px with no horizontal page scroll.
- **Speed budgets** (production build, phone profile): main image within 2.5 s, layout shift under 0.1, response to taps within 200 ms. The headline and buttons are visible from the first paint and never fade in from invisible.
- **Accessibility (WCAG 2.2 AA):** semantic landmarks; alt text written from the photo map; visible focus rings (2px Rosewood plus a Sign Mint halo); base text 16px; tap targets 44px (never under 24px); the rail and the styler deck work with buttons and arrow keys as well as drag and swipe; the sticky bar never covers focus; the Hold Request never asks twice; zoom is never blocked.
- A "Back to top" button after 1.5 screens.
- **Link preview:** Open Graph and Twitter `summary_large_image` on every page, a generated 1200x630 `og-image.png` (Linen background, the wordmark, "Be your best you.", photo `01` on the right), and a favicon and Apple touch icon from a Rosewood "S" script monogram taken from the wordmark SVG.
- A real 404 page ("This one's not on the rack.") that returns a 404 status.
- No backend, no database, no API keys, no analytics beyond `@vercel/analytics`.

## 7. SEO: built to score 100 at launch

This is a demo, but its SEO is finished. Dawn currently has no website at all, so her Google profile points nowhere. Target: **Lighthouse SEO 100 in live mode**, and 90 or higher (aim for 95+) on Performance, Accessibility and Best Practices.

**The launch switch.** `NEXT_PUBLIC_SITE_MODE`: `demo` (default) or `live`. `NEXT_PUBLIC_SITE_URL`: the base URL for every absolute link.
- **Demo mode:** robots meta `noindex, nofollow` on every page, **and** an `X-Robots-Tag: noindex, nofollow` response header on every response (pages, images, files) set in the `headers()` config. `app/robots.ts` still allows crawling (so the noindex can be read), lists no sitemap, and disallows these AI crawlers by name: GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot. `app/sitemap.ts` returns nothing. No `llms.txt`. The concept footer line shows.
- **Live mode:** robots meta `index, follow`, no `X-Robots-Tag`. Robots lists the sitemap. The sitemap lists `/`, `/new`, `/meet-dawn`, `/visit` with real last-modified dates. `llms.txt` is served. The concept footer line is hidden. **A build guard fails the live build if any `DRAFT` marker, the review placeholder card, or a `// TODO: swap` remains.**
- The deployed demo stays in demo mode. Live mode runs only locally until Hunter launches. Never show crawlers anything different from visitors.

**Words in the right places (what plus where).**

- Title: `Women's Boutique in Leonardtown, MD | Style by Dawn` (home page, 51 characters). Every page:

| Page | Title | Meta description | h1 |
|---|---|---|---|
| `/` | Women's Boutique in Leonardtown, MD \| Style by Dawn | Style by Dawn is a women's boutique inside Shepherd's Old Field Market in Leonardtown, MD. New looks every week, styled by Dawn. Text to hold a piece. | Women's boutique in Leonardtown, MD. Be your best you. |
| `/new` | New Arrivals at Style by Dawn \| Leonardtown Boutique | See what is new this week at Style by Dawn in Leonardtown, MD: sweaters, shackets, denim, bags and holiday gifts. Text Dawn to hold your size. | New arrivals at Style by Dawn in Leonardtown |
| `/meet-dawn` | Meet Dawn \| Style by Dawn, Women's Boutique in Leonardtown | Meet Dawn, who has run boutiques at Shepherd's Old Field Market since 2016 and will help you put the whole outfit together. Visit her in Leonardtown, MD. | Meet Dawn, owner of Style by Dawn in Leonardtown |
| `/visit` | Visit Style by Dawn \| SOF Market, Duke St, Leonardtown | Visit Style by Dawn inside Shepherd's Old Field Market, 22725 Duke Street, Leonardtown, MD. Open Tuesday to Sunday. Get directions, call or text Dawn. | Visit Style by Dawn at Shepherd's Old Field Market, Leonardtown |

Exactly one `<h1>` per page, server-rendered; the logo is never the h1. The first paragraph on each page says what and where. Headings step down in order. Name, address and phone as text in the footer and on `/visit`, exactly as in section 1. Write "Leonardtown" and "St. Mary's County" as text. Title length 50 to 60 is a display guideline, not a ranking rule.

**What Lighthouse checks (all must pass in live mode):** page not blocked from indexing, a title, a meta description, a 200 status, descriptive link text (every link says where it goes, no bare "learn more" or "click here", icon-only links get an `aria-label`), crawlable links (real `href`s; anything that opens the Hold Request or a modal is a `<button>`), a valid robots.txt, alt text on every image, no hreflang, and a self-referencing canonical on every page built from `NEXT_PUBLIC_SITE_URL`. Also `<html lang="en">` and a viewport tag.

**Structured data (JSON-LD, server-rendered, must validate):**
- `ClothingStore` with name, telephone, email, url, image (`01`), logo (the monogram), address, `openingHoursSpecification`, `containedInPlace` (`Place` named "Shepherd's Old Field Market"), `sameAs` (Facebook, Instagram), `hasMap` (a Google Maps link for the address). Geo coordinates: `// DRAFT: copy from her Google profile`, omit until known.
- `BreadcrumbList` on `/new`, `/meet-dawn` and `/visit`.
- `FAQPage` is optional (Google retired FAQ rich results in May 2026). Keep the visible FAQ either way, because shoppers and AI answers read it.
- **Never** add `aggregateRating` or `review` markup about the business, even though the Facebook reviews are real. Google does not show stars for reviews a business publishes about itself. Reviews appear only as plain attributed text with month and year and a link to the source.
- Validate: use a schema.org validator if reachable, otherwise parse every block and check required properties by hand, and say which you did.

**`public/llms.txt` (live mode only):** Markdown with a top heading, a one-line summary, and proper links to the four pages and the facts. Do not describe it to anyone as something that makes AI recommend her.

**`SEO-LAUNCH.md`** in the repo root:
- Set `NEXT_PUBLIC_SITE_MODE=live` and `NEXT_PUBLIC_SITE_URL` to the real domain in Vercel, redeploy, confirm the robots meta, the absent `X-Robots-Tag`, the sitemap and `llms.txt`.
- There is no old site, so no redirects are needed. Redirect or retire the preview address.
- The Google Business Profile should link to the home page `/`. Its "Add website" slot is empty today.
- Make name, address and phone identical everywhere: Google Business Profile, Apple Business, Bing Places, Yelp (which lists the other phone number), the SOF Market vendor page and Facebook. Decide which phone number is the real one first.
- Request indexing in Google Search Console and submit the sitemap in Search Console and Bing Webmaster Tools. Confirm the host's bot protection is not blocking search or AI search crawlers.
- Replace every DRAFT item and the review placeholder.
- One honest line for Dawn: "The site is technically complete. Ranking from here depends mostly on your Google profile, getting Google reviews (you have none yet), consistent listings and links."

## 8. Copy rules (strict)

- **No em dashes or double hyphens anywhere.** Use periods and commas.
- Short, warm, plain. Sound like Dawn: friendly, a little playful ("Where are my ball cap girls?!"), never salesy. Aim for half the words you first think of.
- Her captions are quoted exactly in "Dawn's note" blocks. Never rewrite or extend them.
- No hype words ("elevate", "curated", "seamless", "must-have", "luxury"). No fake stats, review counts, awards or "#1" claims, no brand names or prices beyond section 1.
- Anything assumed gets a `// DRAFT` comment or a visible "Sample" or placeholder label.

## 9. Build order (tick the boxes in `implementation_kickstart.md`)

At the start of each phase, re-read the matching part of `BUILD-SPEC.md`. At the end of each phase: run `npm run check` and print its output, take Playwright screenshots at 1440px and 375px (install the browser with `npx playwright install chromium` if missing; if it cannot install, use any available Chromium and say which), look at them yourself, fix the three weakest things, commit.

**`npm run check`** is a script you write in Phase 1 and run every phase. It tests: one h1 per page; no broken internal links; no leftover unfilled template braces, "lorem" or placeholder text other than the labelled ones; zero em dashes and zero `--` in rendered text; alt text and width and height on every image; every phone number and email in the rendered pages matches `lib/business.ts`; and, in live mode, zero DRAFT markers. It exits non-zero on any failure.

- [ ] Phase 1: scaffold, print installed versions, tokens in `@theme`, fonts, wordmark SVG script, the `/palette-board` board (screenshot and fix), nav, footer, `npm run check`.
- [ ] Phase 2: **the hero with The Rail**, polished on a 375px phone first, then desktop. Then the proof strip. **Independent review 1:** a fresh subagent that has not seen the build scores the hero screenshots as an award juror would (design 40, usability 30, creativity 20, content 10) and names the three weakest things. Fix them, one round only.
- [ ] Phase 3: **Where are you headed?** styler, Stiffany band.
- [ ] Phase 4: New this week bento, holiday band, reviews, FAQ, final band. The home page is finished and polished before any inner page starts.
- [ ] Phase 5: the Hold Request with every pre-fill wired, the honest last step, the mobile sticky bar.
- [ ] Phase 6: `/new` with filters and lightbox, `/meet-dawn`, `/visit` with the tap-to-load map, the `/contact` redirect, the 404 page.
- [ ] Phase 7: everything in section 7: the launch switch and header, titles, descriptions, h1s, canonicals, JSON-LD (validated), robots, sitemap, `llms.txt`, OG image, favicon, the live-mode build guard, `SEO-LAUNCH.md`. Delete `/palette-board`.
- [ ] Phase 8: Lighthouse 13 (print the version), mobile and desktop, against a production build (`next build` then `next start`), never the dev server. Live mode first, locally: `NEXT_PUBLIC_SITE_MODE=live NEXT_PUBLIC_SITE_URL=http://localhost:3000` (temporarily allow DRAFTs for this local run only with `ALLOW_DRAFT_IN_LIVE=1`, and say so). Run the home page and one page of each type. SEO must be 100, the other three 90 or higher; Agentic Browsing is reported as information only. Then demo mode: SEO is expected to read about 69, with "Page is blocked from indexing" the only failing audit. Print the real numbers. If Lighthouse cannot run, say so and list what you checked by hand. Never estimate a score. Print the response headers of the home page and of one image in demo mode to prove `X-Robots-Tag`.
- [ ] Phase 9: **Independent review 2:** a fresh subagent scores the 1440 and 375 screenshots of one page of each type as an award juror (same weights), names the three weakest things, and runs a fact audit: every number, name, claim, date and quote on the built pages is checked against section 1. Fix, one round only. Keyboard-only pass and a 200% zoom pass. Final commit, ready for a GitHub push and a Vercel import as its own project.

## 10. Final review checklist

- [ ] The hero alone would sell the job. The Rail settles once, swings naturally and browses by drag, swipe, arrows and keys. On a 375px screen the headline and "Hold it for me" are visible without scrolling, and real proof (photo `01`, the 2016 line, Jessica's review) sits within the first two screens.
- [ ] The styler shows only real looks and Dawn's exact captions, works with mouse, touch and keyboard, and is not gated.
- [ ] Every "Hold it for me" opens the Hold Request with the right pre-fill. The last button names the real action, the success message appears only after the tap, and desktop gets Copy and email.
- [ ] Every item in "Things only this business has" is on the site.
- [ ] Zero em dashes, zero "--", zero stock or AI-generated images, zero invented facts, prices, sizes or reviews. The review placeholder is empty and labelled.
- [ ] Two fonts, the palette tokens only, signature motion in two places, no cursor effects or loading intro.
- [ ] Every nav link resolves. No page is thin or built on guesses.
- [ ] Mobile at 375px: no overflow, the burger works, the sticky bar works and never covers focus.
- [ ] Demo mode serves `noindex, nofollow` in the meta and the `X-Robots-Tag` header, no sitemap, no `llms.txt`, and the concept line. Live mode serves `index, follow`, the sitemap, `llms.txt`, no concept line, and refuses to build with DRAFTs.
- [ ] The OG image and favicon are hers, not a framework default.
- [ ] Lighthouse SEO 100 in live mode, mobile and desktop, on the home page and one page of each type. Performance, Accessibility and Best Practices 90 or higher. Demo mode fails only the indexing audit.
- [ ] One h1 per page with the service and the town. Titles and meta descriptions unique. JSON-LD validates and contains no rating or review markup.
- [ ] Screenshots at 1440 and 375 cover one page of each type. Keyboard-only and 200% zoom passes done.

## 11. When you finish

Print in the conversation: the installed versions of Next.js, React and Tailwind; the Lighthouse version and the scores for all four scored categories in both modes, mobile and desktop, per page tested; the header check output; the last `npm run check` output; the structured-data validation result and how it was validated; the title, description and h1 of each page; desktop and mobile screenshots of the hero, the styler, the Hold Request and `/visit`; both independent review scores and what you fixed; and the list of every DRAFT, placeholder and TODO item for Dawn to confirm or supply: the real phone number ((301) 461-3147 vs (301) 481-7914), whether holds are OK, the size range she stocks, the "Dawn's Style" Facebook page, Style House on the site or not (and the "24/7" wording), the caption for photo `08`, AnnMarie's review date, parking, the geo coordinates, a portrait of Dawn, her logo file, unwatermarked photo originals, prices if she wants them shown, and real Google reviews.
