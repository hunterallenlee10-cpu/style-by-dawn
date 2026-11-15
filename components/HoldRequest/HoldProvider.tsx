'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { HoldItem } from '@/lib/looks';

type HoldCtx = { open: (item?: HoldItem | null) => void; close: () => void; preload: () => void };
const Ctx = createContext<HoldCtx | null>(null);

// The modal (and the whole flow) stays out of the initial page load. It downloads in the background
// once the page is idle (or the moment a Hold button is pressed, whichever comes first), so the
// first tap opens instantly even on a phone connection.
const loadModal = () => import('./HoldModal');
const HoldModal = dynamic(loadModal, { ssr: false });

export function HoldProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ open: boolean; item: HoldItem | null; key: number }>({
    open: false,
    item: null,
    key: 0,
  });
  const openerRef = useRef<HTMLElement | null>(null);
  const pathname = usePathname();

  // Once the code is in, mount the modal closed. Opening is then a plain state change, so React
  // never shows it through a freshly resolved Suspense boundary (which it holds back ~300ms).
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 2500));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const id = idle(() => void loadModal().then(() => setReady(true)), { timeout: 4000 });
    return () => cancel(id);
  }, []);

  const open = useCallback((item?: HoldItem | null) => {
    openerRef.current = (document.activeElement as HTMLElement) ?? null;
    setState((s) => ({ open: true, item: item ?? null, key: s.key + 1 }));
  }, []);

  const close = useCallback(() => {
    setState((s) => ({ ...s, open: false }));
    const el = openerRef.current;
    if (el && document.contains(el)) requestAnimationFrame(() => el.focus({ preventScroll: true }));
  }, []);

  // Close when the route changes (Activity keeps routes mounted). Compared during render, no effect.
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    if (state.open) setState({ ...state, open: false });
  }

  return (
    <Ctx.Provider value={{ open, close, preload: loadModal }}>
      {children}
      {(ready || state.key > 0) && <HoldModal key={state.key} open={state.open} item={state.item} onClose={close} />}
    </Ctx.Provider>
  );
}

export function useHold() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useHold must be used inside HoldProvider');
  return ctx;
}
