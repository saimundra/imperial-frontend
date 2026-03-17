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

interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  postalCode: string;
  deliveryNotes: string;
}

interface PaymentInfo {
  paymentMethod: string;
  cardNumber?: string;
  esewaId?: string;
  khaltiNumber?: string;
}

interface OrderReviewProps {
  cartItems: CartItem[];
  shippingInfo: ShippingInfo;
  paymentInfo: PaymentInfo;
  shippingCost: number;
  onConfirm: () => void;
  onBack: () => void;
}

const OrderReview = ({
  cartItems,
  shippingInfo,
  paymentInfo,
  shippingCost,
  onConfirm,
  onBack,
}: OrderReviewProps) => {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + shippingCost;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getPaymentMethodDisplay = () => {
    switch (paymentInfo.paymentMethod) {
      case 'card':
        return `Card ending in ${paymentInfo.cardNumber?.slice(-4)}`;
      case 'esewa':
        return `eSewa (${paymentInfo.esewaId})`;
      case 'khalti':
        return `Khalti (${paymentInfo.khaltiNumber})`;
      case 'cod':
        return 'Cash on Delivery';
      default:
        return 'Not selected';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg golden-border p-6">
        <h3 className="font-heading text-xl font-semibold text-foreground mb-4 flex items-center">
          <Icon name="ShoppingBagIcon" size={24} className="mr-2 text-primary" />
          Order Items
        </h3>
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 pb-4 border-b golden-border last:border-0 last:pb-0">
              <div className="w-20 h-20 rounded-lg overflow-hidden golden-border flex-shrink-0">
                <AppImage
                  src={item.image}
                  alt={item.alt}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-body font-medium text-foreground truncate">{item.name}</h4>
                {item.variant && (
                  <p className="font-caption text-sm text-muted-foreground">{item.variant}</p>
                )}
                <p className="font-caption text-sm text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <p className="font-data text-sm font-medium text-primary">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-lg golden-border p-6">
        <h3 className="font-heading text-xl font-semibold text-foreground mb-4 flex items-center">
          <Icon name="TruckIcon" size={24} className="mr-2 text-primary" />
          Shipping Information
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="font-body text-muted-foreground">Name:</span>
            <span className="font-body font-medium text-foreground">{shippingInfo.fullName}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-body text-muted-foreground">Email:</span>
            <span className="font-body font-medium text-foreground">{shippingInfo.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-body text-muted-foreground">Phone:</span>
            <span className="font-body font-medium text-foreground">{shippingInfo.phone}</span>
          </div>
          <div className="flex justify-between items-start">
            <span className="font-body text-muted-foreground">Address:</span>
            <span className="font-body font-medium text-foreground text-right max-w-xs">
              {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.district}
              {shippingInfo.postalCode && ` - ${shippingInfo.postalCode}`}
            </span>
          </div>
          {shippingInfo.deliveryNotes && (
            <div className="flex justify-between items-start">
              <span className="font-body text-muted-foreground">Notes:</span>
              <span className="font-body font-medium text-foreground text-right max-w-xs">
                {shippingInfo.deliveryNotes}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-card rounded-lg golden-border p-6">
        <h3 className="font-heading text-xl font-semibold text-foreground mb-4 flex items-center">
          <Icon name="CreditCardIcon" size={24} className="mr-2 text-primary" />
          Payment Method
        </h3>
        <div className="flex justify-between">
          <span className="font-body text-muted-foreground">Payment:</span>
          <span className="font-body font-medium text-foreground">{getPaymentMethodDisplay()}</span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="font-heading text-xl font-semibold text-foreground mb-4">Order Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="font-body text-muted-foreground">Subtotal:</span>
            <span className="font-data text-foreground">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-body text-muted-foreground">Shipping:</span>
            <span className="font-data text-foreground">
              {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
            </span>
          </div>
          <div className="pt-3">
            <div className="flex justify-between items-center">
              <span className="font-heading text-lg font-semibold text-foreground">Total:</span>
              <span className="font-data text-2xl font-bold text-primary">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-4 px-6 bg-muted text-foreground font-body font-medium rounded-lg transition-luxury hover:bg-surface-elevated flex items-center justify-center"
        >
          <Icon name="ArrowLeftIcon" size={20} className="mr-2" />
          Back to Payment
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="flex-1 py-4 px-6 bg-primary text-primary-foreground font-body font-medium rounded-lg transition-luxury hover:scale-105 golden-glow flex items-center justify-center"
        >
          <Icon name="CheckCircleIcon" size={20} className="mr-2" />
          Confirm Order
        </button>
      </div>

      <div className="flex items-center justify-center space-x-4 pt-4">
        <Icon name="LockClosedIcon" size={20} className="text-success" />
        <p className="font-caption text-sm text-muted-foreground">
          Your payment information is secure and encrypted
        </p>
      </div>
    </div>
  );
};

export default OrderReview;