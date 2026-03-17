'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CheckoutProgress from './CheckoutProgress';
import ShippingForm from './ShippingForm';
import PaymentForm from './PaymentForm';
import OrderReview from './OrderReview';
import OrderSummaryPanel from './OrderSummaryPanel';
import { checkoutOrder, fetchCart } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { calculateShippingCost } from '@/lib/shipping';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  alt: string;
  variant?: string;
}

interface ShippingFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  postalCode: string;
  deliveryNotes: string;
}

interface PaymentFormData {
  paymentMethod: string;
  cardNumber?: string;
  cardName?: string;
  expiryDate?: string;
  cvv?: string;
  esewaId?: string;
  khaltiNumber?: string;
}

const mapCartItem = (item: {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  alt: string;
  variant: string;
}): CartItem => ({
  id: item.id,
  name: item.name,
  price: item.price,
  quantity: item.quantity,
  image: item.image,
  alt: item.alt,
  variant: item.variant,
});

const CheckoutInteractive = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shippingData, setShippingData] = useState<ShippingFormData | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentFormData | null>(null);
  const checkoutPath = '/checkout-process';

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated || isLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(checkoutPath)}`);
    }
  }, [checkoutPath, isAuthenticated, isHydrated, isLoading, router]);

  useEffect(() => {
    if (!isHydrated) return;

    const loadCart = async () => {
      try {
        const cart = await fetchCart();
        setCartItems(cart.items.map((item) => mapCartItem(item)));
      } catch {
        setCartItems([]);
      }
    };

    loadCart();
  }, [isHydrated]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = calculateShippingCost(subtotal, shippingData?.district);

  const handleShippingSubmit = (data: ShippingFormData) => {
    setShippingData(data);
    setCurrentStep(2);
    setErrorMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePaymentSubmit = (data: PaymentFormData) => {
    setPaymentData(data);
    setCurrentStep(3);
    setErrorMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderConfirm = async () => {
    if (!shippingData || !paymentData) return;

    setIsPlacingOrder(true);
    setErrorMessage('');

    try {
      const response = await checkoutOrder({
        shippingInfo: shippingData,
        paymentInfo: paymentData,
      });
      window.dispatchEvent(new Event('cartUpdated'));
      router.push(`/order-tracking?order=${encodeURIComponent(response.orderId)}`);
    } catch (error) {
      const fallbackMessage = 'Unable to place your order right now.';
      setErrorMessage(error instanceof Error ? error.message : fallbackMessage);
      setIsPlacingOrder(false);
      return;
    }

    setIsPlacingOrder(false);
  };

  const handleBackToShipping = () => {
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToPayment = () => {
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isHydrated || isLoading) {
    return (
      <div className="min-h-screen bg-background pt-6 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="h-12 bg-muted rounded-lg animate-pulse mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-96 bg-card rounded-lg animate-pulse" />
              </div>
              <div className="h-96 bg-card rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-6 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center py-20">
            <h2 className="font-heading text-3xl font-semibold text-foreground mb-4">Your cart is empty</h2>
            <p className="font-body text-muted-foreground mb-8">
              Add products to your cart before proceeding to checkout.
            </p>
            <button
              onClick={() => router.push('/shopping-cart')}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-body font-medium transition-luxury hover:scale-105 golden-glow"
            >
              Go to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-6 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <CheckoutProgress currentStep={currentStep} />

          {errorMessage && (
            <div className="mt-6 p-4 rounded-lg border border-error/30 bg-error/10 text-error font-body text-sm">
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2">
              {currentStep === 1 && (
                <div className="bg-card rounded-lg golden-border p-6">
                  <h2 className="font-heading text-2xl font-semibold text-foreground mb-6">
                    Shipping Information
                  </h2>
                  <ShippingForm
                    onSubmit={handleShippingSubmit}
                    initialData={shippingData || undefined}
                  />
                </div>
              )}

              {currentStep === 2 && (
                <div className="bg-card rounded-lg golden-border p-6">
                  <h2 className="font-heading text-2xl font-semibold text-foreground mb-6">
                    Payment Method
                  </h2>
                  <PaymentForm onSubmit={handlePaymentSubmit} onBack={handleBackToShipping} />
                </div>
              )}

              {currentStep === 3 && shippingData && paymentData && (
                <div className="bg-card rounded-lg golden-border p-6">
                  <h2 className="font-heading text-2xl font-semibold text-foreground mb-6">
                    Review Your Order
                  </h2>
                  <OrderReview
                    cartItems={cartItems}
                    shippingInfo={shippingData}
                    paymentInfo={paymentData}
                    shippingCost={shippingCost ?? 0}
                    onConfirm={handleOrderConfirm}
                    onBack={handleBackToPayment}
                  />

                  {isPlacingOrder && (
                    <p className="mt-4 text-sm font-body text-muted-foreground">Placing your order...</p>
                  )}
                </div>
              )}
            </div>

            <div className="lg:block hidden">
              <OrderSummaryPanel cartItems={cartItems} shippingCost={shippingCost} />
            </div>
          </div>

          <div className="lg:hidden mt-8">
            <OrderSummaryPanel cartItems={cartItems} shippingCost={shippingCost} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutInteractive;
