'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { subscribeToNewsletter } from '@/lib/api';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await subscribeToNewsletter(normalizedEmail);
      setIsSubmitted(true);
      setFeedbackMessage(
        response.created
          ? 'Thanks for subscribing. We will keep you updated.'
          : 'This email is already subscribed to our newsletter.',
      );
      setEmail('');
      setTimeout(() => {
        setIsSubmitted(false);
        setFeedbackMessage('');
      }, 3000);
    } catch (error) {
      const fallbackMessage = 'Unable to subscribe right now. Please try again.';
      setErrorMessage(error instanceof Error ? error.message : fallbackMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isHydrated) {
    return (
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="h-12 w-64 bg-muted rounded mx-auto mb-6 animate-pulse" />
            <div className="h-6 w-full bg-muted rounded mb-8 animate-pulse" />
            <div className="h-14 w-full bg-muted rounded animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 golden-border mb-6">
              <Icon name="EnvelopeIcon" size={32} className="text-primary" />
            </div>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Join Our Exclusive Beauty Club
            </h2>
            <p className="font-body text-lg text-muted-foreground">
              Subscribe to receive exclusive offers, beauty tips, and early access to new luxury products
            </p>
          </div>

          <form onSubmit={handleSubmit} className="relative">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full px-6 py-4 bg-card text-foreground font-body rounded-lg golden-border transition-luxury focus:outline-none focus:golden-border-focus placeholder:text-muted-foreground"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitted || isSubmitting}
                className="px-8 py-4 bg-primary text-primary-foreground font-body font-medium rounded-lg transition-luxury hover:scale-105 golden-glow disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isSubmitting ? (
                  <span className="flex items-center space-x-2">
                    <span>Subscribing...</span>
                  </span>
                ) : isSubmitted ? (
                  <span className="flex items-center space-x-2">
                    <Icon name="CheckCircleIcon" size={20} />
                    <span>Subscribed!</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-2">
                    <span>Subscribe</span>
                    <Icon name="PaperAirplaneIcon" size={20} />
                  </span>
                )}
              </button>
            </div>

            {feedbackMessage && !errorMessage && (
              <p className="mt-3 text-sm font-body text-success text-center">
                {feedbackMessage}
              </p>
            )}

            {errorMessage && (
              <p className="mt-3 text-sm font-body text-error text-center">
                {errorMessage}
              </p>
            )}
          </form>

          <p className="font-caption text-xs text-muted-foreground text-center mt-4">
            By subscribing, you agree to our Privacy Policy and consent to receive updates from Imperial Glow Nepal
          </p>
        </div>
      </div>
    </section>
  );
}