'use client';

import dynamic from 'next/dynamic';

// The inline Hold Request on /visit loads in the browser when the page needs it.
const HoldFlow = dynamic(() => import('../HoldRequest/HoldFlow').then((m) => m.HoldFlow), {
  ssr: false,
  loading: () => <div className="h-72 animate-pulse rounded-tag bg-petal" aria-hidden="true" />,
});

export function InlineHold() {
  return <HoldFlow initialItem={null} headingLevel={3} />;
}
