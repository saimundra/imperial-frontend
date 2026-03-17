'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import BrandLogo from '@/components/common/BrandLogo';
import Icon from '@/components/ui/AppIcon';

interface HeaderProps {
  cartItemCount?: number;
  isAuthenticated?: boolean;
  userName?: string;
  isAdmin?: boolean;
  onSignOut?: () => Promise<void> | void;
}

const Header = ({ 
  cartItemCount = 0, 
  isAuthenticated = false,
  userName = 'Guest',
  isAdmin = false,
  onSignOut,
}: HeaderProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const navigationItems = [
    { label: 'Home', path: '/home-landing', icon: 'HomeIcon' },
    { label: 'Makeup', path: '/product-catalog?category=makeup', icon: 'SparklesIcon' },
    { label: 'Skincare', path: '/product-catalog?category=skincare', icon: 'BeakerIcon' },
    { label: 'Perfumes', path: '/product-catalog?category=perfumes', icon: 'CubeIcon' },
  ];

  const isActivePath = (path: string) => {
    const [targetPath, queryString] = path.split('?');

    if (targetPath === '/home-landing') {
      return pathname === targetPath;
    }

    if (pathname !== targetPath) {
      return false;
    }

    if (!queryString) {
      return true;
    }

    const targetCategory = new URLSearchParams(queryString).get('category');
    return searchParams.get('category') === targetCategory;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleAccountMenu = () => {
    setIsAccountMenuOpen(!isAccountMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    setIsAccountMenuOpen(false);
    closeMobileMenu();

    try {
      await onSignOut?.();
    } finally {
      router.push('/home-landing');
      router.refresh();
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[1000] bg-card transition-luxury ${
        isScrolled ? 'golden-glow-sm' : ''
      }`}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-24 px-4 lg:px-8">
          {/* Logo */}
          <Link 
            href="/home-landing" 
            className="flex-shrink-0 transition-luxury"
            onClick={closeMobileMenu}
            aria-label="Imperial Glow Nepal"
          >
            <BrandLogo className="block h-24 w-auto object-contain" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`relative py-2 font-body font-medium transition-luxury hover:text-primary ${
                  isActivePath(item.path)
                    ? 'text-primary' :'text-foreground'
                }`}
              >
                {item.label}
                {isActivePath(item.path) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary golden-glow-sm" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <Link
              href="/shopping-cart"
              className="relative p-2 transition-luxury hover:text-primary hover:scale-105"
              onClick={closeMobileMenu}
            >
              <Icon name="ShoppingCartIcon" size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold bg-primary text-primary-foreground rounded-full golden-glow-sm">
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </Link>

            {/* Account Menu - Desktop */}
            <div className="hidden lg:block relative">
              <button
                onClick={toggleAccountMenu}
                className="flex items-center space-x-2 p-2 transition-luxury hover:text-primary hover:scale-105"
                aria-label="Account menu"
              >
                <Icon name="UserCircleIcon" size={24} />
              </button>

              {isAccountMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-[1050]"
                    onClick={() => setIsAccountMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-64 bg-popover rounded-lg golden-border golden-glow z-[1100] overflow-hidden">
                    <div className="p-4 border-b golden-border">
                      <p className="font-body font-medium text-foreground">
                        {isAuthenticated ? userName : 'Welcome, Guest'}
                      </p>
                      <p className="text-sm text-muted-foreground font-caption">
                        {isAuthenticated ? 'Manage your account' : 'Sign in to continue'}
                      </p>
                    </div>
                    <div className="py-2">
                      {isAuthenticated ? (
                        <>
                          {isAdmin && (
                            <Link
                              href="/admin-panel"
                              className="flex items-center space-x-3 px-4 py-3 transition-luxury hover:bg-muted"
                              onClick={() => setIsAccountMenuOpen(false)}
                            >
                              <Icon name="AdjustmentsHorizontalIcon" size={20} />
                              <span className="font-body">Admin Panel</span>
                            </Link>
                          )}
                          <Link
                            href="/user-account-dashboard"
                            className="flex items-center space-x-3 px-4 py-3 transition-luxury hover:bg-muted"
                            onClick={() => setIsAccountMenuOpen(false)}
                          >
                            <Icon name="UserIcon" size={20} />
                            <span className="font-body">My Account</span>
                          </Link>
                          <Link
                            href="/user-account-dashboard?tab=orders"
                            className="flex items-center space-x-3 px-4 py-3 transition-luxury hover:bg-muted"
                            onClick={() => setIsAccountMenuOpen(false)}
                          >
                            <Icon name="ShoppingBagIcon" size={20} />
                            <span className="font-body">My Orders</span>
                          </Link>
                          <Link
                            href="/order-tracking"
                            className="flex items-center space-x-3 px-4 py-3 transition-luxury hover:bg-muted"
                            onClick={() => setIsAccountMenuOpen(false)}
                          >
                            <Icon name="TruckIcon" size={20} />
                            <span className="font-body">Track Order</span>
                          </Link>
                          <Link
                            href="/user-account-dashboard?tab=wishlist"
                            className="flex items-center space-x-3 px-4 py-3 transition-luxury hover:bg-muted"
                            onClick={() => setIsAccountMenuOpen(false)}
                          >
                            <Icon name="HeartIcon" size={20} />
                            <span className="font-body">Wishlist</span>
                          </Link>
                          <div className="border-t golden-border my-2" />
                          <button
                            className="flex items-center space-x-3 px-4 py-3 w-full transition-luxury hover:bg-muted text-left"
                            onClick={() => {
                              void handleSignOut();
                            }}
                          >
                            <Icon name="ArrowRightOnRectangleIcon" size={20} />
                            <span className="font-body">Sign Out</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/login"
                            className="flex items-center space-x-3 px-4 py-3 transition-luxury hover:bg-muted"
                            onClick={() => setIsAccountMenuOpen(false)}
                          >
                            <Icon name="ArrowRightOnRectangleIcon" size={20} />
                            <span className="font-body">Sign In</span>
                          </Link>
                          <Link
                            href="/signup"
                            className="flex items-center space-x-3 px-4 py-3 transition-luxury hover:bg-muted"
                            onClick={() => setIsAccountMenuOpen(false)}
                          >
                            <Icon name="UserPlusIcon" size={20} />
                            <span className="font-body">Create Account</span>
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 transition-luxury hover:text-primary hover:scale-105"
              aria-label="Toggle mobile menu"
            >
              <Icon name={isMobileMenuOpen ? 'XMarkIcon' : 'Bars3Icon'} size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-background z-[1050] lg:hidden"
            onClick={closeMobileMenu}
          />
          <div className="fixed top-20 right-0 bottom-0 w-80 max-w-[85vw] bg-card z-[1100] lg:hidden overflow-y-auto golden-border-l">
            <nav className="py-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center space-x-4 px-6 py-4 transition-luxury hover:bg-muted ${
                    isActivePath(item.path)
                      ? 'text-primary bg-muted golden-border-l-2' :'text-foreground'
                  }`}
                  onClick={closeMobileMenu}
                >
                  <Icon name={item.icon as any} size={24} />
                  <span className="font-body font-medium">{item.label}</span>
                </Link>
              ))}

              <div className="border-t golden-border my-4" />

              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Link
                      href="/admin-panel"
                      className="flex items-center space-x-4 px-6 py-4 transition-luxury hover:bg-muted"
                      onClick={closeMobileMenu}
                    >
                      <Icon name="AdjustmentsHorizontalIcon" size={24} />
                      <span className="font-body font-medium">Admin Panel</span>
                    </Link>
                  )}
                  <Link
                    href="/user-account-dashboard"
                    className="flex items-center space-x-4 px-6 py-4 transition-luxury hover:bg-muted"
                    onClick={closeMobileMenu}
                  >
                    <Icon name="UserIcon" size={24} />
                    <span className="font-body font-medium">My Account</span>
                  </Link>
                  <Link
                    href="/user-account-dashboard?tab=orders"
                    className="flex items-center space-x-4 px-6 py-4 transition-luxury hover:bg-muted"
                    onClick={closeMobileMenu}
                  >
                    <Icon name="ShoppingBagIcon" size={24} />
                    <span className="font-body font-medium">My Orders</span>
                  </Link>
                  <Link
                    href="/order-tracking"
                    className="flex items-center space-x-4 px-6 py-4 transition-luxury hover:bg-muted"
                    onClick={closeMobileMenu}
                  >
                    <Icon name="TruckIcon" size={24} />
                    <span className="font-body font-medium">Track Order</span>
                  </Link>
                  <Link
                    href="/user-account-dashboard?tab=wishlist"
                    className="flex items-center space-x-4 px-6 py-4 transition-luxury hover:bg-muted"
                    onClick={closeMobileMenu}
                  >
                    <Icon name="HeartIcon" size={24} />
                    <span className="font-body font-medium">Wishlist</span>
                  </Link>
                  <div className="border-t golden-border my-4" />
                  <button
                    className="flex items-center space-x-4 px-6 py-4 w-full transition-luxury hover:bg-muted text-left"
                    onClick={() => {
                      void handleSignOut();
                    }}
                  >
                    <Icon name="ArrowRightOnRectangleIcon" size={24} />
                    <span className="font-body font-medium">Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center space-x-4 px-6 py-4 transition-luxury hover:bg-muted"
                    onClick={closeMobileMenu}
                  >
                    <Icon name="ArrowRightOnRectangleIcon" size={24} />
                    <span className="font-body font-medium">Sign In</span>
                  </Link>
                  <Link
                    href="/signup"
                    className="flex items-center space-x-4 px-6 py-4 transition-luxury hover:bg-muted"
                    onClick={closeMobileMenu}
                  >
                    <Icon name="UserPlusIcon" size={24} />
                    <span className="font-body font-medium">Create Account</span>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;