import type { Metadata } from 'next';
import { Faq } from '@/components/sections/Faq';
import { FinalBand } from '@/components/sections/FinalBand';
import { Hero } from '@/components/sections/Hero';
import { HolidayBand } from '@/components/sections/HolidayBand';
import { NewOnRacks } from '@/components/sections/NewOnRacks';
import { ProofStrip } from '@/components/sections/ProofStrip';
import { Reviews } from '@/components/sections/Reviews';
import { StiffanyBand } from '@/components/sections/StiffanyBand';
import { StylerSection } from '@/components/sections/StylerSection';
import { clothingStore, JsonLd } from '@/lib/jsonld';
import { pageMeta, pages } from '@/lib/seo';

export const metadata: Metadata = pageMeta(pages.home.path, pages.home.title, pages.home.description);

export default function Home() {
  return (
    <>
      <JsonLd data={clothingStore()} />
      <Hero />
      <ProofStrip />
      <StylerSection />
      <StiffanyBand />
      <NewOnRacks />
      <HolidayBand />
      <Reviews />
      <Faq />
      <FinalBand />
    </>
  );
}
