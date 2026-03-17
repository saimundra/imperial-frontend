'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { getStoredAuthToken } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

interface CartSummaryProps {
  subtotal: number;
  shipping: number | null;
  discount: number;
  total: number;
  itemCount: number;
  onApplyPromoCode: (code: string) => Promise<void> | void;
  promoCodeError?: string;
  appliedPromoCode?: string;
}

const CartSummary = ({
  subtotal,
  shipping,
  discount,
  total,
  itemCount,
  onApplyPromoCode,
  promoCodeError,
  appliedPromoCode,
}: CartSummaryProps) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [promoCode, setPromoCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const checkoutPath = '/checkout-process';

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) {
      return;
    }

    setIsApplying(true);
    try {
      await onApplyPromoCode(promoCode.trim());
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemovePromoCode = () => {
    setPromoCode('');
    void onApplyPromoCode('');
  };

  const handleProceedToCheckout = () => {
    const isSignedIn = isAuthenticated || Boolean(getStoredAuthToken());
    const nextPath = isSignedIn
      ? checkoutPath
      : `/login?redirect=${encodeURIComponent(checkoutPath)}`;

    router.push(nextPath);
  };

  return (
    <div className="p-6 sticky top-24">
      <h2 className="font-heading text-2xl font-semibold text-foreground mb-6">
        Order Summary
      </h2>

      {/* Promo Code Section */}
      <div className="mb-6">
        <label
          htmlFor="promoCode"
          className="block font-body text-sm text-muted-foreground mb-2"
        >
          Promo Code
        </label>
        {appliedPromoCode ? (
          <div className="flex items-center justify-between p-3 bg-success/10 golden-border rounded-lg">
            <div className="flex items-center gap-2">
              <Icon name="CheckCircleIcon" size={20} className="text-success" />
              <span className="font-data text-sm text-success">
                {appliedPromoCode}
              </span>
            </div>
            <button
              onClick={handleRemovePromoCode}
              className="text-muted-foreground transition-luxury hover:text-error"
              aria-label="Remove promo code"
            >
              <Icon name="XMarkIcon" size={20} />
            </button>
          </div>
        ) : (
          <>
            <div className="flex gap-2">
              <input
                id="promoCode"
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="Enter code"
                className="flex-1 px-4 py-3 bg-input golden-border rounded-lg font-body text-foreground placeholder:text-muted-foreground transition-luxury focus:outline-none focus:golden-border-focus"
              />
              <button
                onClick={() => void handleApplyPromoCode()}
                disabled={!promoCode.trim() || isApplying}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-body font-medium transition-luxury hover:scale-105 golden-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isApplying ? 'Applying...' : 'Apply'}
              </button>
            </div>
            {promoCodeError && (
              <p className="flex items-center gap-2 mt-2 text-sm text-error font-caption">
                <Icon name="ExclamationCircleIcon" size={16} />
                {promoCodeError}
              </p>
            )}
          </>
        )}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-4 mb-6 pb-6">
        <div className="flex items-center justify-between">
          <span className="font-body text-muted-foreground">
            Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </span>
          <span className="font-data text-foreground">
            {formatPrice(subtotal)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-body text-muted-foreground">
            Shipping
          </span>
          <span className="font-data text-foreground">
            {shipping === null ? (
              <span className="text-muted-foreground text-sm">Calculated at checkout</span>
            ) : shipping === 0 ? (
              <span className="text-success">FREE</span>
            ) : (
              formatPrice(shipping)
            )}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex items-center justify-between">
            <span className="font-body text-success">
              Discount
            </span>
            <span className="font-data text-success">
              -{formatPrice(discount)}
            </span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="flex items-center justify-between mb-6">
        <span className="font-heading text-xl font-semibold text-foreground">
          {shipping === null ? 'Total before shipping' : 'Total'}
        </span>
        <span className="font-data text-2xl font-bold text-primary">
          {formatPrice(total)}
        </span>
      </div>

      {/* Checkout Button */}
      <button
        type="button"
        onClick={handleProceedToCheckout}
        className="block w-full py-4 px-6 text-center font-body font-semibold text-lg bg-primary text-primary-foreground rounded-lg transition-luxury hover:scale-105 golden-glow mb-3"
      >
        Proceed to Checkout
      </button>

      {/* Continue Shopping */}
      <Link
        href="/product-catalog"
        className="block w-full py-3 px-6 text-center font-body font-medium golden-border rounded-lg transition-luxury hover:bg-muted hover:golden-border-hover"
      >
        Continue Shopping
      </Link>

      {/* Trust Signals */}
      <div className="mt-6 pt-6 space-y-3">
        <div className="flex items-start gap-3">
          <Icon name="ShieldCheckIcon" size={20} className="text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-body text-sm font-medium text-foreground">
              Secure Payment
            </p>
            <p className="font-caption text-xs text-muted-foreground">
              SSL encrypted checkout
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Icon name="TruckIcon" size={20} className="text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-body text-sm font-medium text-foreground">
              Free Shipping
            </p>
            <p className="font-caption text-xs text-muted-foreground">
              Above Rs. 5,000 in Pokhara Valley. Pokhara/Kaski under Rs. 5,000 cost Rs. 200; other districts cost Rs. 250.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Icon name="ArrowPathIcon" size={20} className="text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-body text-sm font-medium text-foreground">
              Easy Returns
            </p>
            <p className="font-caption text-xs text-muted-foreground">
              7-day return policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;