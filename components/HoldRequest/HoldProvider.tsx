'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { createContext, useCallback, useContext, useRef, useState } from 'react';
import type { HoldItem } from '@/lib/looks';

type HoldCtx = { open: (item?: HoldItem | null) => void; close: () => void };
const Ctx = createContext<HoldCtx | null>(null);

// The modal (and the whole flow) only loads the first time someone opens it.
const HoldModal = dynamic(() => import('./HoldModal'), { ssr: false });

export function HoldProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ open: boolean; item: HoldItem | null; key: number }>({
    open: false,
    item: null,
    key: 0,
  });
  const openerRef = useRef<HTMLElement | null>(null);
  const pathname = usePathname();

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
    <Ctx.Provider value={{ open, close }}>
      {children}
      {state.key > 0 && <HoldModal key={state.key} open={state.open} item={state.item} onClose={close} />}
    </Ctx.Provider>
  );
}

export function useHold() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useHold must be used inside HoldProvider');
  return ctx;
}
