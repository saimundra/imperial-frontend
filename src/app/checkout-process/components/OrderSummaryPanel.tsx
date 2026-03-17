'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  alt: string;
  variant?: string;
}

interface OrderSummaryPanelProps {
  cartItems: CartItem[];
  shippingCost: number | null;
}

const OrderSummaryPanel = ({ cartItems, shippingCost }: OrderSummaryPanelProps) => {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + (shippingCost ?? 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-card rounded-lg golden-border p-6 sticky top-24">
      <h3 className="font-heading text-xl font-semibold text-foreground mb-6">Order Summary</h3>
      
      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center space-x-4">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden golden-border flex-shrink-0">
              <AppImage
                src={item.image}
                alt={item.alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                {item.quantity}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-body text-sm font-medium text-foreground truncate">{item.name}</h4>
              {item.variant && (
                <p className="font-caption text-xs text-muted-foreground truncate">{item.variant}</p>
              )}
            </div>
            <p className="font-data text-sm font-medium text-primary">
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <div className="pt-4 space-y-3">
        <div className="flex justify-between">
          <span className="font-body text-muted-foreground">Subtotal</span>
          <span className="font-data text-foreground">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-body text-muted-foreground">Shipping</span>
          <span className="font-data text-foreground">
            {shippingCost === null
              ? 'Select district'
              : shippingCost === 0
              ? 'FREE'
              : formatPrice(shippingCost)}
          </span>
        </div>
        <div className="pt-3">
          <div className="flex justify-between items-center">
            <span className="font-heading text-lg font-semibold text-foreground">
              {shippingCost === null ? 'Total before shipping' : 'Total'}
            </span>
            <span className="font-data text-2xl font-bold text-primary">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-surface-elevated rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="ShieldCheckIcon" size={20} className="text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-body text-sm font-medium text-foreground mb-1">
              100% Authentic Products
            </p>
            <p className="font-caption text-xs text-muted-foreground">
              All products are sourced directly from authorized distributors
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-surface-elevated rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="TruckIcon" size={20} className="text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-body text-sm font-medium text-foreground mb-1">
              Free Shipping
            </p>
            <p className="font-caption text-xs text-muted-foreground">
              On orders above Rs. 5,000 within Pokhara Valley. Pokhara and Kaski share the same delivery rate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryPanel;