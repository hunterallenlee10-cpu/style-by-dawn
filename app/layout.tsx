import type { Metadata, Viewport } from 'next';
import { Instrument_Sans, Libre_Caslon_Display } from 'next/font/google';
import { ViewTransition } from 'react';
import { Analytics } from '@vercel/analytics/next';
import { BackToTop } from '@/components/BackToTop';
import { Footer } from '@/components/Footer';
import { HoldProvider } from '@/components/HoldRequest/HoldProvider';
import { MobileBar } from '@/components/MobileBar';
import { Nav } from '@/components/Nav';
import { business } from '@/lib/business';
import { ogImage } from '@/lib/seo';
import { IS_LIVE, SITE_URL } from '@/lib/site';
import './globals.css';

const caslon = Libre_Caslon_Display({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-caslon',
});
const instrument = Instrument_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-instrument',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `Women's Boutique in Leonardtown, MD | ${business.name}`,
  applicationName: business.name,
  robots: IS_LIVE ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: {
    type: 'website',
    siteName: business.name,
    locale: 'en_US',
    images: [ogImage],
  },
  twitter: { card: 'summary_large_image', images: ['/og-image.png'] },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: '#FAF6F0',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${caslon.variable} ${instrument.variable}`}>
      <body className="pb-[var(--bar-h)] md:pb-0">
        <span id="top" tabIndex={-1} className="sr-only">
          Top of page
        </span>
        <a
          href="#main"
          className="sr-only fixed top-2 left-2 z-50 rounded-full bg-espresso px-4 py-3 text-linen focus:not-sr-only"
        >
          Skip to content
        </a>
        <HoldProvider>
          <Nav />
          <ViewTransition>
            <main id="main" tabIndex={-1} className="outline-none">
              {children}
            </main>
          </ViewTransition>
          <Footer />
          <MobileBar />
          <BackToTop />
        </HoldProvider>
        {process.env.VERCEL === '1' && <Analytics />}
      </body>
    </html>
  );
}
