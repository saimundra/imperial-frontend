'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface CartItemProps {
  id: string;
  name: string;
  brand: string;
  category: string;
  variant: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
  alt: string;
  inStock: boolean;
  stockCount: number;
  isAuthentic: boolean;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onMoveToWishlist: (id: string) => void;
}

const CartItem = ({
  id,
  name,
  brand,
  category,
  variant,
  price,
  originalPrice,
  quantity,
  image,
  alt,
  inStock,
  stockCount,
  isAuthentic,
  onQuantityChange,
  onRemove,
  onMoveToWishlist,
}: CartItemProps) => {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleQuantityDecrease = () => {
    if (quantity > 1) {
      onQuantityChange(id, quantity - 1);
    }
  };

  const handleQuantityIncrease = () => {
    if (quantity < stockCount) {
      onQuantityChange(id, quantity + 1);
    }
  };

  const itemTotal = price * quantity;
  const savings = originalPrice && originalPrice > price ? (originalPrice - price) * quantity : 0;

  return (
    <div className="bg-card rounded-lg golden-border p-4 sm:p-6 transition-luxury hover:golden-glow-sm">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* Product Image */}
        <Link
          href={`/product-details?id=${id}`}
          className="flex-shrink-0 w-full sm:w-32 h-48 sm:h-32 rounded-lg overflow-hidden golden-border bg-background transition-luxury hover:golden-glow"
        >
          <AppImage
            src={image}
            alt={alt}
            className="w-full h-full object-cover"
          />
        </Link>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-3">
            <div className="flex-1 min-w-0">
              <Link
                href={`/product-details?id=${id}`}
                className="block group"
              >
                <p className="font-caption text-xs text-primary mb-1">
                  {brand}
                </p>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-1 transition-luxury group-hover:text-primary line-clamp-2">
                  {name}
                </h3>
              </Link>
              <p className="font-caption text-sm text-muted-foreground mb-2">
                {category} • {variant}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {isAuthentic && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-xs font-caption">
                    <Icon name="CheckBadgeIcon" size={14} />
                    Authentic
                  </span>
                )}
                {inStock ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-success/10 text-success rounded text-xs font-caption">
                    <Icon name="CheckCircleIcon" size={14} />
                    In Stock ({stockCount} left)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-error/10 text-error rounded text-xs font-caption">
                    <Icon name="XCircleIcon" size={14} />
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Price - Desktop */}
            <div className="hidden sm:block text-right flex-shrink-0">
              <p className="font-data text-xl font-semibold text-primary mb-1">
                {formatPrice(itemTotal)}
              </p>
              {originalPrice && originalPrice > price && (
                <p className="font-data text-sm text-muted-foreground line-through">
                  {formatPrice(originalPrice * quantity)}
                </p>
              )}
              {savings > 0 && (
                <p className="font-caption text-xs text-success mt-1">
                  Save {formatPrice(savings)}
                </p>
              )}
            </div>
          </div>

          {/* Quantity Controls & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Quantity Selector */}
              <div className="flex items-center gap-2">
                <span className="font-body text-sm text-muted-foreground">
                  Qty:
                </span>
                <div className="flex items-center golden-border rounded-lg overflow-hidden">
                  <button
                    onClick={handleQuantityDecrease}
                    disabled={quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center bg-muted transition-luxury hover:bg-primary hover:text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Decrease quantity"
                  >
                    <Icon name="MinusIcon" size={16} />
                  </button>
                  <span className="w-12 h-10 flex items-center justify-center font-data text-sm bg-background">
                    {quantity}
                  </span>
                  <button
                    onClick={handleQuantityIncrease}
                    disabled={quantity >= stockCount}
                    className="w-10 h-10 flex items-center justify-center bg-muted transition-luxury hover:bg-primary hover:text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Increase quantity"
                  >
                    <Icon name="PlusIcon" size={16} />
                  </button>
                </div>
              </div>

              {/* Price - Mobile */}
              <div className="sm:hidden">
                <p className="font-data text-lg font-semibold text-primary">
                  {formatPrice(itemTotal)}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onMoveToWishlist(id)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg golden-border transition-luxury hover:bg-muted hover:golden-border-hover"
                aria-label="Move to wishlist"
              >
                <Icon name="HeartIcon" size={18} />
                <span className="font-body text-sm hidden sm:inline">
                  Save for Later
                </span>
              </button>
              <button
                onClick={() => onRemove(id)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg golden-border text-error transition-luxury hover:bg-error/10 hover:border-error"
                aria-label="Remove item"
              >
                <Icon name="TrashIcon" size={18} />
                <span className="font-body text-sm hidden sm:inline">
                  Remove
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;