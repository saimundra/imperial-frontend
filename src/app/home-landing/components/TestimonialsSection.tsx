'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  comment: string;
  image: string;
  alt: string;
  date: string;
}

const mockTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Kathmandu",
    rating: 5,
    comment: "Absolutely love the authentic products! The quality is exceptional and delivery was prompt. Imperial Glow has become my go-to for all luxury beauty needs.",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    alt: "Professional headshot of young South Asian woman with long black hair wearing elegant gold jewelry",
    date: "January 2026"
  },
  {
    id: 2,
    name: "Anjali Thapa",
    location: "Pokhara",
    rating: 5,
    comment: "Finally found a reliable source for genuine international brands in Nepal. The customer service is outstanding and products are always authentic.",
    image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
    alt: "Portrait of confident South Asian woman with short black hair in professional attire smiling at camera",
    date: "December 2025"
  },
  {
    id: 3,
    name: "Suman Rai",
    location: "Lalitpur",
    rating: 5,
    comment: "The luxury perfumes collection is amazing! Received my order in perfect condition with beautiful packaging. Highly recommend Imperial Glow.",
    image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg",
    alt: "Elegant portrait of South Asian woman with wavy black hair wearing traditional jewelry",
    date: "January 2026"
  }
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + mockTestimonials.length) % mockTestimonials.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % mockTestimonials.length);
  };

  if (!isHydrated) {
    return (
      <section className="py-16 lg:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-6 w-48 bg-muted rounded mx-auto mb-4 animate-pulse" />
            <div className="h-12 w-96 bg-muted rounded mx-auto animate-pulse" />
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="bg-background rounded-2xl p-8 animate-pulse">
              <div className="h-32 bg-muted rounded mb-4" />
              <div className="h-6 bg-muted rounded w-1/2" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  const testimonial = mockTestimonials[currentIndex];

  return (
    <section className="py-16 lg:py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="font-caption text-sm tracking-widest text-primary uppercase mb-4">
            Customer Reviews
          </p>
          <h2 className="font-heading text-4xl lg:text-5xl font-bold text-foreground mb-6">
            What Our Customers Say
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-background rounded-2xl p-8 lg:p-12 golden-border golden-glow">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-20 h-20 rounded-full overflow-hidden golden-border mb-4">
                <AppImage
                  src={testimonial.image}
                  alt={testimonial.alt}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-heading text-2xl font-semibold text-foreground mb-1">
                {testimonial.name}
              </h3>
              <p className="font-caption text-sm text-muted-foreground mb-4">
                {testimonial.location} • {testimonial.date}
              </p>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Icon
                    key={i}
                    name="StarIcon"
                    size={20}
                    variant="solid"
                    className="text-primary"
                  />
                ))}
              </div>
            </div>

            <div className="relative">
              <Icon
                name="ChatBubbleLeftIcon"
                size={48}
                className="text-primary/20 absolute -top-4 -left-4"
              />
              <p className="font-body text-lg text-foreground leading-relaxed relative z-10">
                {testimonial.comment}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4 mt-8">
            <button
              onClick={handlePrev}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-card golden-border transition-luxury hover:bg-primary hover:text-primary-foreground"
              aria-label="Previous testimonial"
            >
              <Icon name="ChevronLeftIcon" size={24} />
            </button>

            <div className="flex items-center space-x-2">
              {mockTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-luxury ${
                    index === currentIndex
                      ? 'bg-primary w-6 golden-glow' :'bg-muted hover:bg-primary/50'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-card golden-border transition-luxury hover:bg-primary hover:text-primary-foreground"
              aria-label="Next testimonial"
            >
              <Icon name="ChevronRightIcon" size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}