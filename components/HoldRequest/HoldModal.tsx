'use client';

import { useLayoutEffect, useRef } from 'react';
import { X } from 'lucide-react';
import type { HoldItem } from '@/lib/looks';
import { HoldFlow } from './HoldFlow';

// Native <dialog> with showModal(): focus is trapped and the page behind is inert. Esc closes.
// Body scroll is locked while open; the provider returns focus to the button that opened it.
export default function HoldModal({ open, item, onClose }: { open: boolean; item: HoldItem | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  // Layout effect: the dialog opens in the same frame it mounts, not a paint later
  useLayoutEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
    document.documentElement.style.overflow = open ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose(); // tap on the backdrop
      }}
      aria-labelledby="hold-title"
      className="hold-dialog m-0 mt-auto max-h-[92dvh] w-full max-w-none overflow-y-auto rounded-t-[14px] bg-linen p-0 text-espresso backdrop:bg-espresso/45 backdrop:backdrop-blur-[2px] sm:m-auto sm:max-w-lg sm:rounded-[10px]"
    >
      <div className="p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow text-green">Hold it for me</p>
            <p id="hold-title" className="mt-1 font-display text-h3">Ask Dawn to hold it</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mt-1 -mr-2 inline-flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-petal"
          >
            <X aria-hidden="true" className="size-5" strokeWidth={1.5} />
          </button>
        </div>
        <div className="mt-5">
          <HoldFlow initialItem={item} headingLevel={2} />
        </div>
      </div>
    </dialog>
  );
}
