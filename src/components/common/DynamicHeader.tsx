'use client';

import { Suspense } from 'react';
import Header from '@/components/common/Header';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';

export default function DynamicHeader() {
  const { cartItemCount } = useCart();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <Suspense fallback={null}>
      <Header 
        cartItemCount={cartItemCount} 
        isAuthenticated={isAuthenticated} 
        userName={user?.userName}
        isAdmin={Boolean(user?.isStaff)}
        onSignOut={logout}
      />
    </Suspense>
  );
}
