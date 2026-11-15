// Parses every JSON-LD block on the four pages and checks required properties by hand
// (Google's ClothingStore/LocalBusiness and BreadcrumbList requirements). Fails on any
// aggregateRating or review markup. Usage: node scripts/validate-jsonld.mjs [base]
const base = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '');
const pages = ['/', '/new', '/meet-dawn', '/visit'];
let ok = true;
const fail = (m) => { ok = false; console.log('  FAIL ' + m); };
const pass = (m) => console.log('  ok   ' + m);
const isAbs = (u) => typeof u === 'string' && /^https?:\/\//.test(u);
const hhmm = (t) => /^([01]\d|2[0-3]):[0-5]\d$/.test(t);

function forbidden(obj, path = '') {
  if (!obj || typeof obj !== 'object') return;
  for (const [k, v] of Object.entries(obj)) {
    if (['aggregateRating', 'review', 'reviews'].includes(k)) fail(`${path}${k} must not appear`);
    forbidden(v, `${path}${k}.`);
  }
}

for (const p of pages) {
  const html = await (await fetch(base + p)).text();
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  console.log(`${p}: ${blocks.length} JSON-LD block(s)`);
  for (const raw of blocks) {
    let d;
    try {
      d = JSON.parse(raw);
    } catch (e) {
      fail(`invalid JSON: ${e.message}`);
      continue;
    }
    if (d['@context'] !== 'https://schema.org') fail('@context');
    forbidden(d);
    if (d['@type'] === 'ClothingStore') {
      for (const k of ['name', 'telephone', 'url', 'image', 'address', 'openingHoursSpecification']) if (!d[k]) fail(`ClothingStore.${k} missing`);
      const a = d.address || {};
      if (a['@type'] !== 'PostalAddress') fail('address @type');
      for (const k of ['streetAddress', 'addressLocality', 'addressRegion', 'postalCode', 'addressCountry']) if (!a[k]) fail(`address.${k} missing`);
      if (!isAbs(d.url) || !isAbs(d.image) || !isAbs(d.logo)) fail('url, image and logo must be absolute');
      if (!/^\+1\d{10}$/.test(d.telephone)) fail('telephone format');
      for (const o of d.openingHoursSpecification || []) {
        if (o['@type'] !== 'OpeningHoursSpecification' || !hhmm(o.opens) || !hhmm(o.closes) || !o.dayOfWeek?.length) fail('openingHoursSpecification entry');
        for (const day of o.dayOfWeek) if (!/^https:\/\/schema\.org\/(Mon|Tues|Wednes|Thurs|Fri|Satur|Sun)day$/.test(day)) fail(`dayOfWeek ${day}`);
      }
      const days = (d.openingHoursSpecification || []).flatMap((o) => o.dayOfWeek);
      if (days.length !== 6 || days.some((x) => x.endsWith('Monday'))) fail('expected 6 open days, Monday closed');
      if (d.containedInPlace?.name !== "Shepherd's Old Field Market") fail('containedInPlace');
      if (!Array.isArray(d.sameAs) || d.sameAs.length !== 2 || !d.sameAs.every(isAbs)) fail('sameAs');
      if (!isAbs(d.hasMap)) fail('hasMap');
      if (d.geo) fail('geo should be omitted until known');
      pass(`ClothingStore: ${d.name}, ${a.streetAddress}, ${a.addressLocality} ${a.postalCode}, ${days.length} open days, ${d.telephone}`);
    } else if (d['@type'] === 'BreadcrumbList') {
      const items = d.itemListElement || [];
      items.forEach((it, i) => {
        if (it['@type'] !== 'ListItem' || it.position !== i + 1 || !it.name || !isAbs(it.item)) fail(`breadcrumb item ${i + 1}`);
      });
      if (!items.at(-1)?.item.endsWith(p)) fail('breadcrumb last item is not this page');
      pass(`BreadcrumbList: ${items.map((i) => i.name).join(' > ')}`);
    } else fail(`unexpected @type ${d['@type']}`);
  }
}
console.log(ok ? 'JSON-LD: all blocks valid (parsed and checked by hand)' : 'JSON-LD: FAILURES');
process.exit(ok ? 0 : 1);
