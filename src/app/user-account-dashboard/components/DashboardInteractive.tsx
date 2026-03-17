'use client';

import React, { useState, useEffect } from 'react';
import { addItemToCart, removeWishlistItem } from '@/lib/api';
import WelcomePanel from './WelcomePanel';
import QuickActionCard from './QuickActionCard';
import OrderHistoryTable from './OrderHistoryTable';
import WishlistPanel from './WishlistPanel';
import OrderTrackingSection from './OrderTrackingSection';
import RecentActivity from './RecentActivity';

interface DashboardInteractiveProps {
  userData: {
    userName: string;
    email: string;
    memberSince: string;
    loyaltyPoints: number;
  };
  quickActions: Array<{
    title: string;
    description: string;
    icon: string;
    href: string;
    count?: number;
  }>;
  orderHistory: Array<{
    orderId: string;
    date: string;
    items: string;
    status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
    total: number;
  }>;
  wishlistItems: Array<{
    id: string;
    name: string;
    price: number;
    image: string;
    alt: string;
    inStock: boolean;
  }>;
  activeOrders: Array<{
    orderId: string;
    estimatedDelivery: string;
    trackingSteps: Array<{
      label: string;
      date: string;
      completed: boolean;
      active: boolean;
    }>;
  }>;
  activities: Array<{
    id: string;
    type: 'order' | 'wishlist' | 'promotion';
    title: string;
    description: string;
    timestamp: string;
    icon: string;
  }>;
}

export default function DashboardInteractive({
  userData,
  quickActions,
  orderHistory,
  wishlistItems: initialWishlistItems,
  activeOrders,
  activities,
}: DashboardInteractiveProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [wishlistItems, setWishlistItems] = useState(initialWishlistItems);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    setWishlistItems(initialWishlistItems);
  }, [initialWishlistItems]);

  const handleRemoveFromWishlist = async (itemId: string) => {
    if (!isHydrated) return;

    try {
      await removeWishlistItem(itemId);
      setWishlistItems((prev) => prev.filter((item) => item.id !== itemId));
      window.dispatchEvent(new Event('wishlistUpdated'));
    } catch (error) {
      console.error('Unable to remove wishlist item:', error);
    }
  };

  const handleAddToCart = async (itemId: string) => {
    if (!isHydrated) return;

    try {
      await addItemToCart(itemId, 1);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Unable to add wishlist item to cart:', error);
    }
  };

  if (!isHydrated) {
    return (
      <div className="space-y-8">
        <WelcomePanel {...userData} />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <QuickActionCard key={index} {...action} />
          ))}
        </div>

        <OrderHistoryTable orders={orderHistory} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <OrderTrackingSection activeOrders={activeOrders} />
          <RecentActivity activities={activities} />
        </div>

        <WishlistPanel
          items={initialWishlistItems}
          onRemoveItem={() => {}}
          onAddToCart={() => {}}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <WelcomePanel {...userData} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <QuickActionCard key={index} {...action} />
        ))}
      </div>

      <OrderHistoryTable orders={orderHistory} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <OrderTrackingSection activeOrders={activeOrders} />
        <RecentActivity activities={activities} />
      </div>

      <WishlistPanel
        items={wishlistItems}
        onRemoveItem={handleRemoveFromWishlist}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}