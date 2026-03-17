import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

const EmptyCart = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-32 h-32 mb-6 rounded-full bg-muted flex items-center justify-center golden-border">
        <Icon name="ShoppingCartIcon" size={64} className="text-muted-foreground" />
      </div>
      
      <h2 className="font-heading text-3xl font-semibold text-foreground mb-3 text-center">
        Your Cart is Empty
      </h2>
      
      <p className="font-body text-muted-foreground text-center mb-8 max-w-md">
        Looks like you haven&apos;t added any luxury beauty products to your cart yet. Start shopping to discover our authentic collection.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/product-catalog"
          className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-body font-semibold transition-luxury hover:scale-105 golden-glow flex items-center gap-2"
        >
          <Icon name="SparklesIcon" size={20} />
          Start Shopping
        </Link>
        
        <Link
          href="/user-account-dashboard?tab=wishlist"
          className="px-8 py-4 golden-border rounded-lg font-body font-medium transition-luxury hover:bg-muted hover:golden-border-hover flex items-center gap-2"
        >
          <Icon name="HeartIcon" size={20} />
          View Wishlist
        </Link>
      </div>
      
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon name="CheckBadgeIcon" size={24} className="text-primary" />
          </div>
          <h3 className="font-body font-semibold text-foreground mb-1">
            100% Authentic
          </h3>
          <p className="font-caption text-sm text-muted-foreground">
            Verified genuine products
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon name="TruckIcon" size={24} className="text-primary" />
          </div>
          <h3 className="font-body font-semibold text-foreground mb-1">
            Free Shipping
          </h3>
          <p className="font-caption text-sm text-muted-foreground">
            Above Rs. 5,000 in Pokhara Valley
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon name="ShieldCheckIcon" size={24} className="text-primary" />
          </div>
          <h3 className="font-body font-semibold text-foreground mb-1">
            Secure Payment
          </h3>
          <p className="font-caption text-sm text-muted-foreground">
            SSL encrypted checkout
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptyCart;