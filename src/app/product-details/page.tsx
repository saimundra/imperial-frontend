import type { Metadata } from 'next';
import DynamicHeader from '@/components/common/DynamicHeader';
import ProductDetailsPageContent from './components/ProductDetailsPageContent';

export const metadata: Metadata = {
  title: 'Product Details - Imperial Glow Nepal',
  description:
    'View detailed information about authentic luxury beauty products including makeup, skincare, and perfumes with customer reviews, pricing in NPR, and shipping options across Nepal.',
};

export default function ProductDetailsPage() {
  return (
    <div className="min-h-screen bg-background">
      <DynamicHeader />

      <main className="pt-28 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <ProductDetailsPageContent />
        </div>
      </main>

      <footer className="bg-card border-t golden-border py-8">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="font-caption text-sm text-muted-foreground text-center md:text-left">
              &copy; {new Date().getFullYear()} Imperial Glow Nepal. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <a
                href="#"
                className="font-caption text-sm text-muted-foreground transition-luxury hover:text-primary"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="font-caption text-sm text-muted-foreground transition-luxury hover:text-primary"
              >
                Terms & Conditions
              </a>
              <a
                href="#"
                className="font-caption text-sm text-muted-foreground transition-luxury hover:text-primary"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
