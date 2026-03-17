'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Breadcrumb from '@/components/common/Breadcrumb';
import DashboardInteractive from './DashboardInteractive';
import { fetchDashboardData } from '@/lib/api';

interface DashboardData {
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
  preferences: Array<{
    id: string;
    label: string;
    description: string;
    enabled: boolean;
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

export default function UserAccountDashboardClient() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isDashboardLoading, setIsDashboardLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/user-authentication');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (!isAuthenticated) {
      setDashboardData(null);
      setIsDashboardLoading(false);
      return;
    }

    let isMounted = true;

    const loadDashboard = async (showLoading = false) => {
      if (showLoading && isMounted) {
        setIsDashboardLoading(true);
      }

      try {
        const response = await fetchDashboardData();
        if (!isMounted) return;
        setDashboardData(response);
      } catch {
        if (!isMounted) return;
        setDashboardData({
          orderHistory: [],
          wishlistItems: [],
          activeOrders: [],
          preferences: [],
          activities: [],
        });
      } finally {
        if (showLoading && isMounted) {
          setIsDashboardLoading(false);
        }
      }
    };

    const handleWishlistUpdated = () => {
      void loadDashboard();
    };

    void loadDashboard(true);
    window.addEventListener('wishlistUpdated', handleWishlistUpdated);

    return () => {
      isMounted = false;
      window.removeEventListener('wishlistUpdated', handleWishlistUpdated);
    };
  }, [isAuthenticated]);

  if (isLoading || isDashboardLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-primary text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const userData = {
    userName: user.userName,
    email: user.email,
    memberSince: user.memberSince || new Date().toISOString().split('T')[0],
    loyaltyPoints: user.loyaltyPoints || 0,
  };

  const safeDashboardData = dashboardData || {
    orderHistory: [],
    wishlistItems: [],
    activeOrders: [],
    preferences: [],
    activities: [],
  };

  const quickActions = [
    {
      title: "My Orders",
      description: "Track and manage your orders",
      icon: "ShoppingBagIcon",
      href: "/user-account-dashboard?tab=orders",
      count: safeDashboardData.orderHistory.length,
    },
    {
      title: "Wishlist",
      description: "View your saved items",
      icon: "HeartIcon",
      href: "/user-account-dashboard?tab=wishlist",
      count: safeDashboardData.wishlistItems.length,
    },
    {
      title: "Account Settings",
      description: "Update your preferences",
      icon: "CogIcon",
      href: "/user-account-dashboard?tab=settings",
    },
    {
      title: "Loyalty Rewards",
      description: `${userData.loyaltyPoints} points available`,
      icon: "GiftIcon",
      href: "/user-account-dashboard?tab=rewards",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main>
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-4">
            <Breadcrumb
              items={[
                { label: 'Home', path: '/home-landing' },
                { label: 'My Account', path: '/user-account-dashboard' },
              ]}
            />
            <a
              href="/home-landing"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-body text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Back to Home
            </a>
          </div>
          
          <DashboardInteractive 
            userData={userData}
            quickActions={quickActions}
            orderHistory={safeDashboardData.orderHistory}
            wishlistItems={safeDashboardData.wishlistItems}
            activeOrders={safeDashboardData.activeOrders}
            activities={safeDashboardData.activities}
          />
        </div>
      </main>
    </div>
  );
}
