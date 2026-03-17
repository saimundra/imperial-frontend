'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import { getStoredAuthToken } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string;
}

interface ShoppingCartPreviewProps {
  items?: CartItem[];
  onRemoveItem?: (itemId: string) => void;
  onUpdateQuantity?: (itemId: string, quantity: number) => void;
}

const ShoppingCartPreview = ({
  items = [],
  onRemoveItem,
  onUpdateQuantity,
}: ShoppingCartPreviewProps) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const checkoutPath = '/checkout-process';

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleRemoveItem = (itemId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRemoveItem) {
      onRemoveItem(itemId);
    }
  };

  const handleQuantityChange = (itemId: string, newQuantity: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onUpdateQuantity && newQuantity > 0) {
      onUpdateQuantity(itemId, newQuantity);
    }
  };

  const handleCheckoutClick = () => {
    setIsOpen(false);

    const isSignedIn = isAuthenticated || Boolean(getStoredAuthToken());
    const nextPath = isSignedIn
      ? checkoutPath
      : `/login?redirect=${encodeURIComponent(checkoutPath)}`;

    router.push(nextPath);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 transition-luxury hover:text-primary hover:scale-105"
        aria-label="Shopping cart"
      >
        <Icon name="ShoppingCartIcon" size={24} />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold bg-primary text-primary-foreground rounded-full golden-glow-sm">
            {totalItems > 9 ? '9+' : totalItems}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[1050]"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-2rem)] bg-popover rounded-lg golden-border golden-glow z-[1100] overflow-hidden">
            <div className="p-4 border-b golden-border">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-xl font-semibold text-foreground">
                  Shopping Cart
                </h3>
                <span className="font-caption text-sm text-muted-foreground">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </span>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <Icon name="ShoppingCartIcon" size={48} className="text-muted-foreground mb-4" />
                  <p className="font-body text-muted-foreground text-center mb-2">
                    Your cart is empty
                  </p>
                  <p className="font-caption text-sm text-muted-foreground text-center">
                    Add some luxury beauty products to get started
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {items.map((item) => (
                    <div key={item.id} className="p-4 hover:bg-muted transition-luxury">
                      <div className="flex space-x-4">
                        <div className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden golden-border">
                          <AppImage
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-body font-medium text-foreground truncate mb-1">
                            {item.name}
                          </h4>
                          {item.variant && (
                            <p className="font-caption text-xs text-muted-foreground mb-2">
                              {item.variant}
                            </p>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={(e) => handleQuantityChange(item.id, item.quantity - 1, e)}
                                className="w-6 h-6 flex items-center justify-center rounded golden-border transition-luxury hover:bg-muted hover:golden-border-hover"
                                aria-label="Decrease quantity"
                              >
                                <Icon name="MinusIcon" size={14} />
                              </button>
                              <span className="font-data text-sm w-8 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={(e) => handleQuantityChange(item.id, item.quantity + 1, e)}
                                className="w-6 h-6 flex items-center justify-center rounded golden-border transition-luxury hover:bg-muted hover:golden-border-hover"
                                aria-label="Increase quantity"
                              >
                                <Icon name="PlusIcon" size={14} />
                              </button>
                            </div>
                            <p className="font-data text-sm font-medium text-primary">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => handleRemoveItem(item.id, e)}
                          className="flex-shrink-0 p-1 transition-luxury hover:text-error"
                          aria-label="Remove item"
                        >
                          <Icon name="XMarkIcon" size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <>
                <div className="p-4 border-t golden-border bg-surface-elevated">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-body font-medium text-foreground">Subtotal</span>
                    <span className="font-data text-lg font-semibold text-primary">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                  <Link
                    href="/shopping-cart"
                    className="block w-full py-3 px-6 text-center font-body font-medium bg-primary text-primary-foreground rounded-lg transition-luxury hover:scale-105 golden-glow mb-2"
                    onClick={() => setIsOpen(false)}
                  >
                    View Cart
                  </Link>
                  <button
                    type="button"
                    className="block w-full py-3 px-6 text-center font-body font-medium bg-secondary text-secondary-foreground rounded-lg transition-luxury hover:scale-105"
                    onClick={handleCheckoutClick}
                  >
                    Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ShoppingCartPreview;