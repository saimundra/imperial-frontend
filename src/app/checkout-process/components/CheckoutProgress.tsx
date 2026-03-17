'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface CheckoutProgressProps {
  currentStep: number;
}

interface Step {
  id: number;
  label: string;
  icon: string;
}

const CheckoutProgress = ({ currentStep }: CheckoutProgressProps) => {
  const steps: Step[] = [
    { id: 1, label: 'Shipping', icon: 'TruckIcon' },
    { id: 2, label: 'Payment', icon: 'CreditCardIcon' },
    { id: 3, label: 'Review', icon: 'CheckCircleIcon' },
  ];

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center relative">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-luxury ${
                  currentStep >= step.id
                    ? 'bg-primary text-primary-foreground golden-glow'
                    : 'bg-muted text-muted-foreground golden-border'
                }`}
              >
                <Icon name={step.icon as any} size={24} />
              </div>
              <span
                className={`mt-2 font-caption text-sm ${
                  currentStep >= step.id ? 'text-primary font-medium' : 'text-muted-foreground'
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-4 relative top-[-20px]">
                <div
                  className={`h-full transition-luxury ${
                    currentStep > step.id ? 'bg-primary golden-glow-sm' : 'bg-muted'
                  }`}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CheckoutProgress;