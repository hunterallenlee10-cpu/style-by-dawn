import type { OccasionId, PhotoId } from '@/lib/looks';

export const STYLER_EVENT = 'sbd:styler-select';
export type StylerSelect = { occasion: OccasionId; photo?: PhotoId };

// Rail cards call this: scroll the styler into view and select the look.
export function selectInStyler(occasion: OccasionId, photo?: PhotoId) {
  window.dispatchEvent(new CustomEvent<StylerSelect>(STYLER_EVENT, { detail: { occasion, photo } }));
  // Desktop shows the whole studio from its heading. On phones, land on the chips so the deck is in view.
  const wide = window.matchMedia('(min-width: 1024px)').matches;
  const el = document.getElementById(wide ? 'styler' : 'styler-chips');
  if (el) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }
}
