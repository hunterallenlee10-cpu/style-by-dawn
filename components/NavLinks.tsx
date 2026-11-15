'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navLinks } from './nav-links';

export function NavLinks() {
  const pathname = usePathname();
  return (
    <ul className="flex items-center gap-8">
      {navLinks.map((l) => {
        const active = pathname === l.href;
        return (
          <li key={l.href}>
            <Link
              href={l.href}
              aria-current={active ? 'page' : undefined}
              className={`relative py-2 text-[0.9375rem] font-medium transition-colors hover:text-rose ${
                active ? 'text-rose after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-rose' : 'text-espresso'
              }`}
            >
              {l.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
