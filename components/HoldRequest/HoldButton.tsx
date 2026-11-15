'use client';

import type { HoldItem } from '@/lib/looks';
import { useHold } from './HoldProvider';

type Props = {
  item?: HoldItem | null;
  className?: string;
  children: React.ReactNode;
};

// Anything that opens the Hold Request is a <button>, never a link.
export function HoldButton({ item = null, className = 'btn btn-primary', children }: Props) {
  const { open } = useHold();
  return (
    <button type="button" className={className} onClick={() => open(item)} aria-haspopup="dialog">
      {children}
    </button>
  );
}
