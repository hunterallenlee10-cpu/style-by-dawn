'use client';

import { useEffect } from 'react';

// Two small behaviours with no UI of their own.
export function ClientGuards() {
  // 1. When a phone's address bar shows or hides during a client navigation, the browser skips the
  //    page crossfade and rejects the view transition with "Viewport size changed". Navigation is
  //    unaffected; this only stops that one benign rejection surfacing as an uncaught console error.
  useEffect(() => {
    const onRejection = (e: PromiseRejectionEvent) => {
      const r = e.reason as { name?: string; message?: string } | undefined;
      if (r?.name === 'InvalidStateError' && /Transition was aborted/.test(r.message ?? '')) e.preventDefault();
    };
    window.addEventListener('unhandledrejection', onRejection);
    return () => window.removeEventListener('unhandledrejection', onRejection);
  }, []);

  // 2. Floating controls (the sticky mobile bar, the back-to-top button) never cover keyboard focus.
  //    Browsers do not scroll an element that is already on screen, even when something fixed sits
  //    over it, so lift it clear ourselves once the browser's own scroll-into-view has run.
  useEffect(() => {
    const onFocus = (e: FocusEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el || el.closest('[data-float], dialog') || !el.matches(':focus-visible')) return;
      requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        let limit = Infinity;
        for (const f of document.querySelectorAll<HTMLElement>('[data-float]')) {
          const cs = getComputedStyle(f);
          if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') continue;
          const fr = f.getBoundingClientRect();
          if (fr.width && fr.left < r.right && fr.right > r.left) limit = Math.min(limit, fr.top);
        }
        if (r.bottom > limit - 8) window.scrollBy({ top: r.bottom - limit + 16, behavior: 'instant' });
      });
    };
    document.addEventListener('focusin', onFocus);
    return () => document.removeEventListener('focusin', onFocus);
  }, []);
  return null;
}
