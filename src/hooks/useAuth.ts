'use client';

import { useState, useEffect } from 'react';
import {
  ApiUser,
  clearStoredAuth,
  fetchCurrentUser,
  getStoredAuthToken,
  loginWithGoogleIdToken,
  loginUser,
  logoutUser,
  registerUser,
} from '@/lib/api';

export interface User {
  id: string;
  userName: string;
  email: string;
  phone?: string;
  memberSince?: string;
  loyaltyPoints?: number;
  isStaff?: boolean;
}

const mapApiUserToUser = (apiUser: ApiUser): User => ({
  id: String(apiUser.id),
  userName: apiUser.userName,
  email: apiUser.email,
  phone: apiUser.phone,
  memberSince: apiUser.memberSince,
  loyaltyPoints: apiUser.loyaltyPoints,
  isStaff: apiUser.isStaff,
});

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const syncAuthState = async () => {
      const token = getStoredAuthToken();
      if (!token) {
        if (isMounted) {
          setIsAuthenticated(false);
          setUser(null);
        }
        return;
      }

      try {
        const currentUser = await fetchCurrentUser();
        if (!isMounted) return;

        setIsAuthenticated(true);
        setUser(mapApiUserToUser(currentUser));
      } catch {
        clearStoredAuth();
        if (!isMounted) return;
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    const initializeAuth = async () => {
      await syncAuthState();
      if (isMounted) {
        setIsLoading(false);
      }
    };

    const handleAuthStateChanged = () => {
      void syncAuthState();
    };

    initializeAuth();

    if (typeof window !== 'undefined') {
      window.addEventListener('authStateChanged', handleAuthStateChanged);
      window.addEventListener('storage', handleAuthStateChanged);
    }

    return () => {
      isMounted = false;
      if (typeof window !== 'undefined') {
        window.removeEventListener('authStateChanged', handleAuthStateChanged);
        window.removeEventListener('storage', handleAuthStateChanged);
      }
    };
  }, []);

  const login = (userData: User) => {
    setIsAuthenticated(true);
    setUser(userData);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('authStateChanged'));
    }
  };

  const loginWithCredentials = async (email: string, password: string) => {
    try {
      const response = await loginUser({ email, password });
      const mappedUser = mapApiUserToUser(response.user);
      login(mappedUser);
      return { success: true as const, user: mappedUser };
    } catch (error) {
      const fallbackMessage = 'Unable to sign in. Please check your credentials.';
      const message = error instanceof Error ? error.message : fallbackMessage;
      return { success: false as const, error: message };
    }
  };

  const loginWithGoogle = async (idToken: string) => {
    try {
      const response = await loginWithGoogleIdToken(idToken);
      const mappedUser = mapApiUserToUser(response.user);
      login(mappedUser);
      return { success: true as const, user: mappedUser };
    } catch (error) {
      const fallbackMessage = 'Unable to sign in with Google right now.';
      const message = error instanceof Error ? error.message : fallbackMessage;
      return { success: false as const, error: message };
    }
  };

  const registerAccount = async (payload: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    try {
      const response = await registerUser({
        full_name: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        password: payload.password,
      });
      const mappedUser = mapApiUserToUser(response.user);
      login(mappedUser);
      return { success: true as const, user: mappedUser };
    } catch (error) {
      const fallbackMessage = 'Unable to create account right now.';
      const message = error instanceof Error ? error.message : fallbackMessage;
      return { success: false as const, error: message };
    }
  };

  const logout = async () => {
    await logoutUser();
    setIsAuthenticated(false);
    setUser(null);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('authStateChanged'));
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  return {
    isAuthenticated,
    user,
    isLoading,
    login,
    loginWithCredentials,
    loginWithGoogle,
    registerAccount,
    logout,
  };
}
