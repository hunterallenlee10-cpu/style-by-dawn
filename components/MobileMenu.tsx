'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Menu, X, MapPin, Phone, MessageCircle } from 'lucide-react';
import { business, mapsDirectionsUrl } from '@/lib/business';
import { HoldButton } from './HoldRequest/HoldButton';
import { navLinks } from './nav-links';

export function MobileMenu() {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
    document.documentElement.style.overflow = open ? 'hidden' : '';
  }, [open]);

  // close on route change (compare during render, no effect)
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(false);
  }

  return (
    <div className="lg:hidden">
      <button
        type="button"
        className="inline-flex size-11 items-center justify-center rounded-full text-espresso"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <Menu aria-hidden="true" className="size-6" strokeWidth={1.5} />
      </button>
      <dialog
        ref={ref}
        onClose={() => setOpen(false)}
        aria-label="Menu"
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-petal p-0 text-espresso backdrop:bg-espresso/30"
      >
        <div className="wrap flex h-full flex-col py-4">
          <div className="flex h-12 items-center justify-between">
            <span className="eyebrow text-barnwood">Menu</span>
            <button
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-full"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              <X aria-hidden="true" className="size-6" strokeWidth={1.5} />
            </button>
          </div>
          <nav aria-label="Mobile" className="mt-6">
            <ul className="flex flex-col">
              <li className="border-b border-seam">
                <Link href="/" className="block py-4 font-display text-h3" onClick={() => setOpen(false)}>
                  Home
                </Link>
              </li>
              {navLinks.map((l) => (
                <li key={l.href} className="border-b border-seam">
                  <Link
                    href={l.href}
                    aria-current={pathname === l.href ? 'page' : undefined}
                    className="block py-4 font-display text-h3 aria-[current=page]:text-rose"
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-8 flex flex-col gap-3">
            <HoldButton className="btn btn-primary w-full">Hold it for me</HoldButton>
            <a href={mapsDirectionsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost w-full">
              <MapPin aria-hidden="true" className="size-4" strokeWidth={1.5} /> Get directions
            </a>
          </div>
          <div className="mt-auto grid grid-cols-2 gap-3 pt-8 pb-4 text-small">
            <a href={business.phoneHref} className="inline-flex min-h-11 items-center gap-2">
              <Phone aria-hidden="true" className="size-4" strokeWidth={1.5} /> Call {business.phoneDisplay}
            </a>
            <a href={business.smsHref} className="inline-flex min-h-11 items-center gap-2">
              <MessageCircle aria-hidden="true" className="size-4" strokeWidth={1.5} /> Text Dawn
            </a>
          </div>
        </div>
      </dialog>
    </div>
  );
}
