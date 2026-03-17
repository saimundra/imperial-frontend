'use client';

import { useState, useEffect } from 'react';
import { fetchCartSummary } from '@/lib/api';

export function useCart() {
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const updateCartCount = async () => {
      try {
        const summary = await fetchCartSummary();
        if (isMounted) {
          setCartItemCount(summary.itemCount ?? 0);
        }
      } catch {
        if (isMounted) {
          setCartItemCount(0);
        }
      }
    };

    updateCartCount();

    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartUpdated', updateCartCount);
    window.addEventListener('authStateChanged', updateCartCount);

    return () => {
      isMounted = false;
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('authStateChanged', updateCartCount);
    };
  }, []);

  return { cartItemCount };
}
