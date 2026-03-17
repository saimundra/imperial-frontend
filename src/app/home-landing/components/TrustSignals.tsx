import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface TrustFeature {
  id: number;
  icon: string;
  title: string;
  description: string;
}

const mockFeatures: TrustFeature[] = [
  {
    id: 1,
    icon: "ShieldCheckIcon",
    title: "100% Authentic",
    description: "All products are genuine and sourced directly from authorized distributors"
  },
  {
    id: 2,
    icon: "TruckIcon",
    title: "Free Delivery",
    description: "Free shipping above Rs. 5,000 in Pokhara Valley, with flat delivery charges for other districts"
  },
  {
    id: 3,
    icon: "ArrowPathIcon",
    title: "Easy Returns",
    description: "Hassle-free 7-day return policy for unopened products"
  },
  {
    id: 4,
    icon: "LockClosedIcon",
    title: "Secure Payment",
    description: "Safe and encrypted payment processing for your peace of mind"
  }
];

export default function TrustSignals() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {mockFeatures.map((feature) => (
            <div
              key={feature.id}
              className="flex flex-col items-center text-center p-6 rounded-lg bg-card golden-border transition-luxury hover:golden-glow"
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 golden-border mb-4">
                <Icon name={feature.icon as any} size={32} className="text-primary" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="font-body text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}