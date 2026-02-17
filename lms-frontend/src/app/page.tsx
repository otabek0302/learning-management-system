import type { Metadata } from 'next';

import Banner from '@/modules/home/elements/banner';
import Benefits from '@/modules/home/elements/benefits';
import CTA from '@/modules/home/elements/cta';
import FeaturesSection from '@/modules/home/elements/features';

export const metadata: Metadata = {
  title: 'Home',
};

export default function HomePage() {
  return (
    <main>
      <Banner />
      <FeaturesSection />
      <Benefits />
      <CTA />
    </main>
  );
}
