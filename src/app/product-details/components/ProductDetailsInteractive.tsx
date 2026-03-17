'use client';

import React, { useState, useEffect } from 'react';
import ProductImageGallery from './ProductImageGallery';
import ProductInfo from './ProductInfo';
import ProductDescription from './ProductDescription';
import AddToCartSection from './AddToCartSection';
import CustomerReviews from './CustomerReviews';
import RelatedProducts from './RelatedProducts';
import { addItemToCart, addWishlistItem, getStoredAuthToken } from '@/lib/api';

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
}

export interface Variant {
  id: string;
  name: string;
  available: boolean;
}

export interface Review {
  id: string;
  userName: string;
  userImage: string;
  userImageAlt: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  helpful: number;
  images?: { url: string; alt: string }[];
}

export interface RelatedProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  imageAlt: string;
  rating: number;
  reviewCount: number;
}

export interface ProductData {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  stockStatus: 'in-stock' | 'low-stock' | 'out-of-stock';
  stockQuantity?: number;
  sku: string;
  isAuthentic: boolean;
  images: ProductImage[];
  variants?: Variant[];
  description: string;
  features: string[];
  ingredients?: string[];
  howToUse?: string[];
  warnings?: string[];
  reviews: Review[];
  ratingDistribution: { stars: number; count: number; percentage: number }[];
  relatedProducts: RelatedProduct[];
}

interface ProductDetailsInteractiveProps {
  productData: ProductData;
}

const ProductDetailsInteractive = ({ productData }: ProductDetailsInteractiveProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleAddToCart = async (productId: string, quantity: number, variantId?: string) => {
    try {
      await addItemToCart(productId, quantity);
      window.dispatchEvent(new Event('cartUpdated'));
      console.log('Added to cart:', { productId, quantity, variantId });
    } catch (error) {
      console.error('Unable to add to cart:', error);
    }
  };

  const handleAddToWishlist = async (productId: string) => {
    if (!getStoredAuthToken()) {
      return false;
    }

    try {
      await addWishlistItem(productId);
      window.dispatchEvent(new Event('wishlistUpdated'));
      return true;
    } catch (error) {
      console.error('Unable to add to wishlist:', error);
      return false;
    }
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Product Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Column - Image Gallery */}
        <div>
          <ProductImageGallery images={productData.images} productName={productData.name} />
        </div>

        {/* Right Column - Product Info & Actions */}
        <div className="space-y-6">
          <ProductInfo
            name={productData.name}
            brand={productData.brand}
            category={productData.category}
            price={productData.price}
            originalPrice={productData.originalPrice}
            rating={productData.rating}
            stockStatus={productData.stockStatus}
            stockQuantity={productData.stockQuantity}
            sku={productData.sku}
            isAuthentic={productData.isAuthentic}
          />

          <AddToCartSection
            productId={productData.id}
            productName={productData.name}
            variants={productData.variants}
            stockStatus={productData.stockStatus}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
          />
        </div>
      </div>

      {/* Tabs Section */}
      <div className="space-y-6">
        <div className="flex items-center space-x-4 border-b golden-border">
          <button
            onClick={() => setActiveTab('description')}
            className={`px-6 py-4 font-body font-medium transition-luxury relative ${
              activeTab === 'description' ?'text-primary' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            Description
            {activeTab === 'description' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary golden-glow-sm" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-4 font-body font-medium transition-luxury relative ${
              activeTab === 'reviews' ?'text-primary' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            Reviews
            {activeTab === 'reviews' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary golden-glow-sm" />
            )}
          </button>
        </div>

        <div className="min-h-[400px]">
          {activeTab === 'description' ? (
            <ProductDescription
              description={productData.description}
              features={productData.features}
              ingredients={productData.ingredients}
              howToUse={productData.howToUse}
              warnings={productData.warnings}
            />
          ) : (
            <CustomerReviews
              reviews={productData.reviews}
              averageRating={productData.rating}
              totalReviews={productData.reviewCount}
              ratingDistribution={productData.ratingDistribution}
            />
          )}
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts products={productData.relatedProducts} />
    </div>
  );
};

export default ProductDetailsInteractive;