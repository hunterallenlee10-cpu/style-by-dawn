import { business, hoursSummary } from '@/lib/business';
import { absUrl, IS_LIVE } from '@/lib/site';

// Served in live mode only. A plain Markdown summary with links to the four pages and the facts.
export function GET() {
  if (!IS_LIVE) return new Response('Not found', { status: 404, headers: { 'content-type': 'text/plain; charset=utf-8' } });
  const body = `# ${business.name}

> ${business.name} is a women's boutique inside ${business.market} at ${business.addressLine}, about ${business.nearby} in ${business.county}.

## Pages

- [Home](${absUrl('/')}): looks styled by Dawn, the shop, reviews and questions
- [New this week](${absUrl('/new')}): every new piece on the racks, with a way to hold it
- [Meet Dawn](${absUrl('/meet-dawn')}): the owner, and how she helps you shop
- [Visit](${absUrl('/visit')}): address, hours, directions and contact

## Facts

- Address: ${business.addressLine}, inside ${business.market}
- Hours: ${hoursSummary}
- Phone (call or text): ${business.phoneDisplay}
- Email: ${business.email}
- History: ${business.historyLine}
- Facebook: ${business.facebook}
- Instagram: ${business.instagram}
`;
  return new Response(body, { headers: { 'content-type': 'text/markdown; charset=utf-8' } });
}
