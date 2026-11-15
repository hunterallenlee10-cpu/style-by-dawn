import type { OccasionId, PhotoId } from '@/lib/looks';

export const STYLER_EVENT = 'sbd:styler-select';
export type StylerSelect = { occasion: OccasionId; photo?: PhotoId };

// Rail cards call this: scroll the styler into view and select the look.
export function selectInStyler(occasion: OccasionId, photo?: PhotoId) {
  window.dispatchEvent(new CustomEvent<StylerSelect>(STYLER_EVENT, { detail: { occasion, photo } }));
  const el = document.getElementById('styler');
  if (el) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }
}
