'use client';

import React, { useEffect, useMemo, useState } from 'react';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import RelatedProducts from './RelatedProducts';
import EmptyCart from './EmptyCart';
import Icon from '@/components/ui/AppIcon';
import {
  ApiError,
  addItemToCart,
  addWishlistItem,
  fetchCart,
  fetchProducts,
  getStoredAuthToken,
  removeCartItem,
  updateCartItemQuantity,
  validatePromoCode,
  type ApiCartItem,
  type ApiProduct,
} from '@/lib/api';

interface CartItemData {
  cartItemId: number;
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
}

interface RelatedProductData {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  alt: string;
  rating: number;
  reviewCount: number;
  isAuthentic: boolean;
}

const mapCartItem = (item: ApiCartItem): CartItemData => ({
  cartItemId: item.cartItemId,
  id: item.id,
  name: item.name,
  brand: item.brand,
  category: item.category,
  variant: item.variant,
  price: item.price,
  originalPrice: item.originalPrice || undefined,
  quantity: item.quantity,
  image: item.image,
  alt: item.alt,
  inStock: item.inStock,
  stockCount: item.stockCount,
  isAuthentic: item.isAuthentic,
});

const mapRelatedProduct = (item: ApiProduct): RelatedProductData => ({
  id: item.id,
  name: item.name,
  brand: item.brand,
  price: item.price,
  originalPrice: item.originalPrice || undefined,
  image: item.image,
  alt: item.alt,
  rating: Number(item.rating),
  reviewCount: item.reviewCount,
  isAuthentic: item.isAuthentic,
});

const ShoppingCartInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);
  const [allProducts, setAllProducts] = useState<ApiProduct[]>([]);
  const [appliedPromoCode, setAppliedPromoCode] = useState('');
  const [appliedPromoDiscount, setAppliedPromoDiscount] = useState(0);
  const [promoCodeError, setPromoCodeError] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const loadData = async () => {
      try {
        const [cart, products] = await Promise.all([fetchCart(), fetchProducts()]);
        setCartItems(cart.items.map(mapCartItem));
        setAllProducts(products);
      } catch {
        setCartItems([]);
      }
    };

    loadData();
  }, [isHydrated]);

  const relatedProducts = useMemo<RelatedProductData[]>(() => {
    const cartIds = new Set(cartItems.map((item) => item.id));
    return allProducts
      .filter((product) => !cartIds.has(product.id))
      .slice(0, 4)
      .map(mapRelatedProduct);
  }, [allProducts, cartItems]);

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateDiscount = () => {
    if (!appliedPromoCode) return 0;
    return (calculateSubtotal() * appliedPromoDiscount) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount();
  };

  const showNotificationMessage = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const handleQuantityChange = async (id: string, quantity: number) => {
    const cartItem = cartItems.find((item) => item.id === id);
    if (!cartItem) return;

    try {
      const updated = await updateCartItemQuantity(cartItem.cartItemId, quantity);
      setCartItems(updated.items.map(mapCartItem));
      window.dispatchEvent(new Event('cartUpdated'));
      showNotificationMessage('Quantity updated');
    } catch {
      showNotificationMessage('Unable to update quantity right now.');
    }
  };

  const handleRemoveItem = async (id: string) => {
    const cartItem = cartItems.find((item) => item.id === id);
    if (!cartItem) return;

    try {
      const updated = await removeCartItem(cartItem.cartItemId);
      setCartItems(updated.items.map(mapCartItem));
      window.dispatchEvent(new Event('cartUpdated'));
      showNotificationMessage('Item removed from cart');
    } catch {
      showNotificationMessage('Unable to remove item right now.');
    }
  };

  const handleMoveToWishlist = async (id: string) => {
    if (!getStoredAuthToken()) {
      showNotificationMessage('Please sign in to save items to your wishlist.');
      return;
    }

    const cartItem = cartItems.find((item) => item.id === id);
    if (!cartItem) return;

    try {
      await addWishlistItem(id);
      const updated = await removeCartItem(cartItem.cartItemId);
      setCartItems(updated.items.map(mapCartItem));
      window.dispatchEvent(new Event('cartUpdated'));
      window.dispatchEvent(new Event('wishlistUpdated'));
      showNotificationMessage('Item moved to wishlist');
    } catch (error) {
      const fallbackMessage = 'Unable to move item to wishlist right now.';
      const message = error instanceof Error ? error.message : fallbackMessage;
      showNotificationMessage(message);
    }
  };

  const handleApplyPromoCode = async (code: string) => {
    const normalizedCode = code.trim().toUpperCase();

    if (!normalizedCode) {
      setAppliedPromoCode('');
      setAppliedPromoDiscount(0);
      setPromoCodeError('');
      return;
    }

    try {
      const response = await validatePromoCode(normalizedCode);
      setAppliedPromoCode(response.code);
      setAppliedPromoDiscount(response.discountPercentage);
      setPromoCodeError('');
      showNotificationMessage(`Promo code ${response.code} applied successfully!`);
    } catch (error) {
      setAppliedPromoCode('');
      setAppliedPromoDiscount(0);
      setPromoCodeError(error instanceof ApiError ? error.message : 'Invalid promo code.');
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      const updated = await addItemToCart(productId, 1);
      setCartItems(updated.items.map(mapCartItem));
      window.dispatchEvent(new Event('cartUpdated'));
      showNotificationMessage('Product added to cart');
    } catch {
      showNotificationMessage('Unable to add product right now.');
    }
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary">
          <Icon name="ShoppingCartIcon" size={48} />
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-heading text-3xl font-semibold text-foreground">Shopping Cart</h1>
            <p className="font-caption text-sm text-muted-foreground">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          {cartItems.map((item) => (
            <CartItem
              key={item.cartItemId}
              id={item.id}
              name={item.name}
              brand={item.brand}
              category={item.category}
              variant={item.variant}
              price={item.price}
              originalPrice={item.originalPrice}
              quantity={item.quantity}
              image={item.image}
              alt={item.alt}
              inStock={item.inStock}
              stockCount={item.stockCount}
              isAuthentic={item.isAuthentic}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemoveItem}
              onMoveToWishlist={handleMoveToWishlist}
            />
          ))}
        </div>

        <div className="lg:col-span-1">
          <CartSummary
            subtotal={calculateSubtotal()}
            shipping={null}
            discount={calculateDiscount()}
            total={calculateTotal()}
            itemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
            onApplyPromoCode={handleApplyPromoCode}
            promoCodeError={promoCodeError}
            appliedPromoCode={appliedPromoCode}
          />
        </div>
      </div>

      <RelatedProducts products={relatedProducts} onAddToCart={handleAddToCart} />

      {showNotification && (
        <div className="fixed bottom-8 right-8 z-[2000] animate-slide-up">
          <div className="bg-card golden-border rounded-lg p-4 golden-glow flex items-center gap-3 min-w-[300px]">
            <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
              <Icon name="CheckCircleIcon" size={20} className="text-success" />
            </div>
            <p className="font-body text-sm text-foreground">{notificationMessage}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default ShoppingCartInteractive;
