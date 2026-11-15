'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 1.5);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <button
      type="button"
      aria-label="Back to top"
      data-float
      onClick={() => {
        window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
        document.getElementById('top')?.focus({ preventScroll: true });
      }}
      className={`fixed right-4 bottom-[calc(var(--bar-h)+1rem)] z-30 inline-flex size-12 items-center justify-center rounded-full border border-seam bg-linen text-espresso transition-[opacity,transform] duration-200 hover:border-espresso md:right-6 md:bottom-6 ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
      tabIndex={show ? 0 : -1}
      aria-hidden={!show}
    >
      <ArrowUp aria-hidden="true" className="size-5" strokeWidth={1.5} />
    </button>
  );
}
