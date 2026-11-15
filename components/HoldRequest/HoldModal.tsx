'use client';
// Phase 1 stub. The full flow lands in Phase 5.
import { useEffect, useRef } from 'react';
import type { HoldItem } from '@/lib/looks';

export default function HoldModal({ open, onClose }: { open: boolean; item: HoldItem | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} onClose={onClose} aria-label="Hold it for me" className="m-auto rounded-tag bg-linen p-8">
      <button type="button" className="btn btn-ghost" onClick={onClose}>Close</button>
    </dialog>
  );
}
