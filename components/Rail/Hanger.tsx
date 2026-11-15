// A wooden-shop hanger: hook curls over the rod, shoulders hold the card.
// viewBox 0 0 120 52. The rod passes through the hook curl at y = 6.5.
export const HOOK_Y = 6.5;
export const HANGER_VB_W = 120;

export function Hanger({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 52" className={className} aria-hidden="true" fill="none">
      <path
        d="M60 27 L60 19.5 C60 15.5 62.3 13.8 64.6 12.3 C68 10.2 69.4 7.2 68 4.6 C66.6 2 62.6 1.4 60.6 3 C59.2 4.1 58.7 5.6 58.8 7.2"
        stroke="var(--color-wood)"
        strokeWidth="2"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M60 26.5 L10.5 44 C5.8 45.7 6.4 50.2 10.8 50.2 L109.2 50.2 C113.6 50.2 114.2 45.7 109.5 44 Z"
        stroke="var(--color-wood)"
        strokeWidth="2"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        fill="none"
      />
      <circle cx="60" cy="27" r="1.8" fill="var(--color-wood)" />
    </svg>
  );
}

export function Rod({ className = '' }: { className?: string }) {
  // Drawn without a viewBox so the rod stretches to any width while the brackets keep their size.
  // Place it with a 10px inset each side. The rod's centre line is y = 36 of 40.
  return (
    <svg className={className} width="100%" height="40" aria-hidden="true" fill="none" overflow="visible">
      <rect x="12" y="0" width="9" height="38" rx="2" fill="var(--color-wood)" opacity="0.8" />
      <svg x="100%" overflow="visible">
        <rect x="-21" y="0" width="9" height="38" rx="2" fill="var(--color-wood)" opacity="0.8" />
      </svg>
      <line x1="0" y1="36" x2="100%" y2="36" stroke="var(--color-wood)" strokeWidth="6" strokeLinecap="round" />
      <line x1="0" y1="34.5" x2="100%" y2="34.5" stroke="var(--color-linen)" strokeOpacity="0.25" strokeWidth="1.5" />
    </svg>
  );
}
