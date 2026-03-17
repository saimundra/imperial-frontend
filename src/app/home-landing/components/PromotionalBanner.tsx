import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

export default function PromotionalBanner() {
  return (
    <section className="py-16 lg:py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl golden-border golden-glow">
          <div className="absolute inset-0">
            <AppImage
              src="https://images.pixabay.com/photo/2017/08/06/22/01/lotion-2596975_1280.jpg"
              alt="Luxury beauty products display with golden packaging on elegant black surface with soft lighting"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/50" />
          </div>

          <div className="relative z-10 py-16 lg:py-24 px-8 lg:px-16">
            <div className="max-w-2xl">
              <p className="font-caption text-sm tracking-widest text-primary uppercase mb-4">
                Limited Time Offer
              </p>
              <h2 className="font-heading text-4xl lg:text-5xl font-bold text-foreground mb-6">
                New Year Beauty Sale
              </h2>
              <p className="font-body text-lg text-muted-foreground mb-8">
                Get up to 30% off on selected luxury makeup, skincare, and perfumes. Use code <span className="font-data text-primary font-semibold">NEWYEAR2026</span> at checkout.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/product-catalog"
                  className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-primary text-primary-foreground font-body font-medium rounded-lg transition-luxury hover:scale-105 golden-glow"
                >
                  <span>Shop Now</span>
                  <Icon name="ArrowRightIcon" size={20} />
                </Link>
                <Link
                  href="/product-catalog"
                  className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-transparent text-foreground font-body font-medium rounded-lg golden-border transition-luxury hover:bg-muted"
                >
                  <span>View Offers</span>
                  <Icon name="TagIcon" size={20} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}