'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  alt: string;
  ctaText: string;
  ctaLink: string;
}

const mockSlides: HeroSlide[] = [
  {
    id: 1,
    title: "Luxury Redefined",
    subtitle: "Authentic International Beauty Brands",
    description: "Discover premium makeup, skincare, and perfumes from world-renowned brands, exclusively curated for Nepal.",
    image: "https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg",
    alt: "Elegant display of luxury makeup products including lipsticks and eyeshadow palettes on black marble surface with golden accents",
    ctaText: "Explore Collection",
    ctaLink: "/product-catalog"
  },
  {
    id: 2,
    title: "Skincare Excellence",
    subtitle: "Transform Your Beauty Routine",
    description: "Premium skincare solutions from trusted international brands, delivering visible results and lasting radiance.",
    image: "https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg",
    alt: "Luxurious skincare products arranged on black background with golden botanical elements and cream textures",
    ctaText: "Shop Skincare",
    ctaLink: "/product-catalog?category=skincare"
  },
  {
    id: 3,
    title: "Signature Fragrances",
    subtitle: "Captivating Perfumes Collection",
    description: "Exquisite perfumes from prestigious brands, each bottle telling a unique story of elegance and sophistication.",
    image: "https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg",
    alt: "Collection of designer perfume bottles with golden caps displayed on black velvet with soft lighting",
    ctaText: "Discover Perfumes",
    ctaLink: "/product-catalog?category=perfumes"
  }
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % mockSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isHydrated]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + mockSlides.length) % mockSlides.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % mockSlides.length);
  };

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  if (!isHydrated) {
    return (
      <section className="relative w-full h-[600px] lg:h-[700px] bg-card overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
        <div className="relative z-20 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <div className="h-8 w-48 bg-muted rounded mb-4 animate-pulse" />
            <div className="h-16 w-full bg-muted rounded mb-6 animate-pulse" />
            <div className="h-24 w-full bg-muted rounded mb-8 animate-pulse" />
            <div className="h-12 w-48 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  const slide = mockSlides[currentSlide];

  return (
    <section className="relative w-full h-[600px] lg:h-[700px] bg-card overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <AppImage
          src={slide.image}
          alt={slide.alt}
          className="w-full h-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl">
          <p className="font-caption text-sm tracking-widest text-primary uppercase mb-4 golden-glow-sm">
            {slide.subtitle}
          </p>
          <h1 className="font-heading text-5xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
            {slide.title}
          </h1>
          <p className="font-body text-lg lg:text-xl text-muted-foreground mb-8 leading-relaxed">
            {slide.description}
          </p>
          <Link
            href={slide.ctaLink}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-primary text-primary-foreground font-body font-medium rounded-lg transition-luxury hover:scale-105 golden-glow"
          >
            <span>{slide.ctaText}</span>
            <Icon name="ArrowRightIcon" size={20} />
          </Link>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex items-center space-x-4">
        <button
          onClick={handlePrevSlide}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-card/80 backdrop-blur-sm golden-border transition-luxury hover:bg-primary hover:text-primary-foreground"
          aria-label="Previous slide"
        >
          <Icon name="ChevronLeftIcon" size={24} />
        </button>

        <div className="flex items-center space-x-2">
          {mockSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-3 h-3 rounded-full transition-luxury ${
                index === currentSlide
                  ? 'bg-primary w-8 golden-glow' :'bg-muted hover:bg-primary/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNextSlide}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-card/80 backdrop-blur-sm golden-border transition-luxury hover:bg-primary hover:text-primary-foreground"
          aria-label="Next slide"
        >
          <Icon name="ChevronRightIcon" size={24} />
        </button>
      </div>
    </section>
  );
}