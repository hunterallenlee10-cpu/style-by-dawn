import { business, hours, timeZone } from '@/lib/business';
import type { HoldItem } from '@/lib/looks';

export const SIZES = ['S', 'M', 'L', 'XL', 'Not sure'] as const; // DRAFT: confirm the size range Dawn stocks
export type Size = (typeof SIZES)[number];

export type Day = { key: string; label: string; sub: string; phrase: string; closed: boolean };

// Next 7 days from today in America/New_York, generated from her hours. Runs in the browser only.
export function nextSevenDays(now = new Date()): Day[] {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(now);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const base = Date.UTC(get('year'), get('month') - 1, get('day'));
  const minutesNow = get('hour') * 60 + get('minute');
  const days: Day[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(base + i * 86400000);
    const dow = d.getUTCDay();
    const h = hours[dow];
    let closed = !h.open;
    if (i === 0 && h.close) {
      const [ch, cm] = h.close.split(':').map(Number);
      if (minutesNow >= ch * 60 + cm - 30) closed = true; // too late to stop in today
    }
    const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : h.day;
    const sub = closed && !h.open ? 'Closed' : closed ? 'Closed now' : `${h.short} ${d.getUTCDate()}`;
    days.push({ key: d.toISOString().slice(0, 10), label, sub, phrase: i === 0 ? 'today' : i === 1 ? 'tomorrow' : h.day, closed });
  }
  return days;
}

export type Answers = { item: HoldItem | null; size: Size | null; day: Day | 'unsure' | null; name: string };

export function buildMessage({ item, size, day, name }: Answers): string {
  const parts = ['Hi Dawn!'];
  const sized = item ? item.sized : true;
  const knownSize = sized && size && size !== 'Not sure' ? size : null;
  const sizeBit = knownSize ? ` in a size ${knownSize}` : '';

  if (!item || item.kind === 'help') {
    parts.push(knownSize ? `Could you help me pick something? I wear a size ${knownSize}.` : 'Could you help me pick something?');
  } else if (item.kind === 'facebook') {
    parts.push(`Could you hold a piece I saw on your Facebook page${sizeBit}?`);
  } else if (item.ask) {
    parts.push(item.ask + (knownSize ? ` I wear a size ${knownSize}.` : ''));
  } else {
    const phrase = item.phrase ?? `the ${item.label}`;
    parts.push(`Could you hold ${phrase}${item.detail ? ` (${item.detail})` : ''}${sizeBit}?`);
  }
  if (sized && size === 'Not sure' && item?.kind !== 'help') parts.push("I'm not sure of my size.");

  if (day && day !== 'unsure') parts.push(`I'm hoping to stop in ${day.phrase}.`);
  else parts.push("I'm not sure which day I can stop in yet.");

  const first = name.trim().split(/\s+/)[0];
  parts.push(first ? `Thanks, ${first}.` : 'Thanks!');
  parts.push('Sent from your website.');
  return parts.join(' ');
}

export const smsLink = (body: string) => `${business.smsHref}?&body=${encodeURIComponent(body)}`;
export const mailLink = (body: string) =>
  `mailto:${business.email}?subject=${encodeURIComponent('Hold request from your website')}&body=${encodeURIComponent(body)}`;
