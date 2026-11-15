import { Wordmark } from './Wordmark';

// The wordmark on a Sign Mint plate, like the hand-lettered sign over her door.
export function Plate({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-[3px] bg-mint px-2.5 py-1 text-espresso shadow-[inset_0_0_0_1px_color-mix(in_oklch,var(--color-green)_25%,transparent),inset_0_0_0_4px_var(--color-mint),inset_0_0_0_5px_color-mix(in_oklch,var(--color-linen)_85%,transparent)] ${className}`}
    >
      <Wordmark className="h-full w-auto" />
    </span>
  );
}
