import { Faq } from '@/components/sections/Faq';
import { FinalBand } from '@/components/sections/FinalBand';
import { Hero } from '@/components/sections/Hero';
import { HolidayBand } from '@/components/sections/HolidayBand';
import { NewOnRacks } from '@/components/sections/NewOnRacks';
import { ProofStrip } from '@/components/sections/ProofStrip';
import { Reviews } from '@/components/sections/Reviews';
import { StiffanyBand } from '@/components/sections/StiffanyBand';
import { StylerSection } from '@/components/sections/StylerSection';

export default function Home() {
  return (
    <>
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
