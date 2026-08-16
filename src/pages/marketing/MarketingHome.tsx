// Screen A — Marketing site (chronix.com)
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from '../../components/marketing/Navbar';
import { Hero } from '../../components/marketing/Hero';
import { IndustriesSection } from '../../components/marketing/IndustriesSection';
import { FeaturesSection } from '../../components/marketing/FeaturesSection';
import { PricingSection } from '../../components/marketing/PricingSection';
import { FAQSection } from '../../components/marketing/FAQSection';
import { Footer } from '../../components/marketing/Footer';

export function MarketingHome() {
  const { hash } = useLocation();

  // Reaching here via navigate('/#section') from another page (see Navbar) -
  // scroll to the target section once this page's content has mounted.
  useEffect(() => {
    if (!hash) return;
    const id = hash.slice(1);
    const timeout = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    return () => window.clearTimeout(timeout);
  }, [hash]);

  return (
    <div>
      <Navbar />
      <Hero />
      <IndustriesSection />
      <FeaturesSection />
      <PricingSection />
      <FAQSection />
      <Footer />
    </div>
  );
}
