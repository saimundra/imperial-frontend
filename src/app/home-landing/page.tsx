import type { Metadata } from 'next';
import DynamicHeader from '@/components/common/DynamicHeader';
import HeroSection from './components/HeroSection';
import CategorySection from './components/CategorySection';
import FeaturedProducts from './components/FeaturedProducts';
import TrustSignals from './components/TrustSignals';
import PromotionalBanner from './components/PromotionalBanner';
import TestimonialsSection from './components/TestimonialsSection';
import NewsletterSection from './components/NewsletterSection';
import Footer from './components/Footer';

export const metadata: Metadata = {
  title: 'Home - Imperial Glow Nepal',
  description: 'Discover authentic luxury makeup, skincare, and perfumes from international brands. Nepal\'s premier destination for genuine beauty products with secure delivery across Kathmandu, Pokhara, and beyond.',
};

export default function HomeLandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <DynamicHeader />
      
      <main className="pt-20">
        <HeroSection />
        <CategorySection />
        <FeaturedProducts />
        <TrustSignals />
        <PromotionalBanner />
        <TestimonialsSection />
        <NewsletterSection />
      </main>

      <Footer />
    </div>
  );
}