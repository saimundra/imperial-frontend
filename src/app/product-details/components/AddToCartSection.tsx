'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Variant {
  id: string;
  name: string;
  available: boolean;
}

interface AddToCartSectionProps {
  productId: string;
  productName: string;
  variants?: Variant[];
  stockStatus: 'in-stock' | 'low-stock' | 'out-of-stock';
  onAddToCart?: (productId: string, quantity: number, variantId?: string) => void;
  onAddToWishlist?: (productId: string) => Promise<boolean | void> | boolean | void;
}

const AddToCartSection = ({
  productId,
  productName,
  variants,
  stockStatus,
  onAddToCart,
  onAddToWishlist,
}: AddToCartSectionProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string>(
    variants?.find((v) => v.available)?.id || ''
  );
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isAddedToWishlist, setIsAddedToWishlist] = useState(false);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (stockStatus === 'out-of-stock') return;
    if (variants && variants.length > 0 && !selectedVariant) return;

    if (onAddToCart) {
      onAddToCart(productId, quantity, selectedVariant);
    }

    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  const handleAddToWishlist = async () => {
    if (!onAddToWishlist) {
      return;
    }

    const result = await onAddToWishlist(productId);
    if (result === false) {
      return;
    }

    setIsAddedToWishlist(true);
    setTimeout(() => setIsAddedToWishlist(false), 2000);
  };

  const isDisabled = stockStatus === 'out-of-stock' || (variants && variants.length > 0 && !selectedVariant);

  return (
    <div className="space-y-6 p-6 bg-surface-elevated rounded-lg golden-border">
      {/* Variant Selection */}
      {variants && variants.length > 0 && (
        <div className="space-y-3">
          <label className="font-body font-medium text-foreground block">
            Select Shade/Size
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {variants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => variant.available && setSelectedVariant(variant.id)}
                disabled={!variant.available}
                className={`px-4 py-3 rounded-lg font-body text-sm transition-luxury ${
                  selectedVariant === variant.id
                    ? 'bg-primary text-primary-foreground golden-glow'
                    : variant.available
                    ? 'bg-card golden-border hover:golden-border-hover' :'bg-muted text-muted-foreground opacity-50 cursor-not-allowed'
                }`}
              >
                {variant.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="space-y-3">
        <label className="font-body font-medium text-foreground block">Quantity</label>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-card rounded-lg golden-border p-1">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              className="w-10 h-10 flex items-center justify-center rounded transition-luxury hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Decrease quantity"
            >
              <Icon name="MinusIcon" size={20} />
            </button>
            <span className="font-data text-lg w-12 text-center">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= 10}
              className="w-10 h-10 flex items-center justify-center rounded transition-luxury hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Increase quantity"
            >
              <Icon name="PlusIcon" size={20} />
            </button>
          </div>
          <span className="font-caption text-sm text-muted-foreground">Max 10 per order</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleAddToCart}
          disabled={isDisabled}
          className={`w-full py-4 px-6 rounded-lg font-body font-medium text-lg transition-luxury flex items-center justify-center space-x-2 ${
            isDisabled
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'bg-primary text-primary-foreground hover:scale-105 golden-glow'
          }`}
        >
          {isAddedToCart ? (
            <>
              <Icon name="CheckCircleIcon" size={24} variant="solid" />
              <span>Added to Cart!</span>
            </>
          ) : (
            <>
              <Icon name="ShoppingCartIcon" size={24} />
              <span>Add to Cart</span>
            </>
          )}
        </button>

        <button
          onClick={handleAddToWishlist}
          className="w-full py-4 px-6 rounded-lg font-body font-medium text-lg bg-card golden-border transition-luxury hover:golden-border-hover hover:scale-105 flex items-center justify-center space-x-2"
        >
          {isAddedToWishlist ? (
            <>
              <Icon name="HeartIcon" size={24} variant="solid" className="text-primary" />
              <span>Added to Wishlist!</span>
            </>
          ) : (
            <>
              <Icon name="HeartIcon" size={24} />
              <span>Add to Wishlist</span>
            </>
          )}
        </button>
      </div>

      {/* Additional Info */}
      <div className="space-y-2 pt-4 border-t golden-border">
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Icon name="TruckIcon" size={20} />
          <span className="font-caption text-sm">Free shipping on orders above Rs. 5,000 in Pokhara Valley</span>
        </div>
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Icon name="ArrowPathIcon" size={20} />
          <span className="font-caption text-sm">Easy 7-day return policy</span>
        </div>
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Icon name="ShieldCheckIcon" size={20} />
          <span className="font-caption text-sm">100% authentic products guaranteed</span>
        </div>
      </div>
    </div>
  );
};

export default AddToCartSection;