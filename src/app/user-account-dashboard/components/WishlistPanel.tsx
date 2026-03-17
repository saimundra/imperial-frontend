import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  alt: string;
  inStock: boolean;
}

interface WishlistPanelProps {
  items: WishlistItem[];
  onRemoveItem: (itemId: string) => void;
  onAddToCart: (itemId: string) => void;
}

export default function WishlistPanel({ items, onRemoveItem, onAddToCart }: WishlistPanelProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-card rounded-lg golden-border overflow-hidden">
      <div className="p-6 border-b golden-border flex items-center justify-between">
        <h2 className="font-heading text-xl font-semibold text-foreground">My Wishlist</h2>
        <span className="font-caption text-sm text-muted-foreground">{items.length} items</span>
      </div>
      
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <Icon name="HeartIcon" size={48} className="text-muted-foreground mb-4" />
          <p className="font-body text-muted-foreground text-center mb-2">Your wishlist is empty</p>
          <p className="font-caption text-sm text-muted-foreground text-center mb-6">
            Save your favorite products for later
          </p>
          <Link
            href="/product-catalog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-body font-medium transition-luxury hover:scale-105 golden-glow"
          >
            <Icon name="ShoppingBagIcon" size={20} />
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {items.map((item) => (
            <div key={item.id} className="bg-surface-elevated rounded-lg golden-border overflow-hidden transition-luxury hover:golden-glow">
              <div className="relative aspect-square overflow-hidden">
                <AppImage
                  src={item.image}
                  alt={item.alt}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center transition-luxury hover:bg-error hover:text-error-foreground"
                  aria-label="Remove from wishlist"
                >
                  <Icon name="XMarkIcon" size={20} />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-body font-medium text-foreground mb-2 line-clamp-2">{item.name}</h3>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-data text-lg font-semibold text-primary">{formatPrice(item.price)}</span>
                  {!item.inStock && (
                    <span className="font-caption text-xs text-error">Out of Stock</span>
                  )}
                </div>
                <button
                  onClick={() => onAddToCart(item.id)}
                  disabled={!item.inStock}
                  className={`w-full py-2 px-4 rounded-lg font-body font-medium transition-luxury ${
                    item.inStock
                      ? 'bg-primary text-primary-foreground hover:scale-105 golden-glow-sm'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }`}
                >
                  {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}