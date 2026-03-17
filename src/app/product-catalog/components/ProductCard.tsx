'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  alt: string;
  category: string;
  inStock: boolean;
  isAuthentic: boolean;
  rating: number;
  reviewCount: number;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
  onAddToWishlist: (productId: string) => void;
  isInWishlist: boolean;
}

const ProductCard = ({
  product,
  onAddToCart,
  onAddToWishlist,
  isInWishlist,
}: ProductCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (price: number) => {
    return `Rs. ${price.toLocaleString('en-NP')}`;
  };

  const discountPercentage = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product.id);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToWishlist(product.id);
  };

  return (
    <Link
      href={`/product-details?id=${product.id}`}
      className="group block bg-card rounded-lg golden-border overflow-hidden transition-luxury hover:golden-glow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-background overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}
        <AppImage
          src={product.image}
          alt={product.alt}
          className={`w-full h-full object-cover transition-luxury ${
            isHovered ? 'scale-110' : 'scale-100'
          } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isAuthentic && (
            <div className="flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground rounded text-xs font-caption font-medium golden-glow-sm">
              <Icon name="CheckBadgeIcon" size={14} />
              <span>Authentic</span>
            </div>
          )}
          {discountPercentage > 0 && (
            <div className="px-2 py-1 bg-error text-error-foreground rounded text-xs font-caption font-medium">
              {discountPercentage}% OFF
            </div>
          )}
          {!product.inStock && (
            <div className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs font-caption font-medium">
              Out of Stock
            </div>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 p-2 bg-card/80 backdrop-blur-sm rounded-full transition-luxury hover:bg-card hover:scale-110 golden-border"
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Icon
            name="HeartIcon"
            size={20}
            variant={isInWishlist ? 'solid' : 'outline'}
            className={isInWishlist ? 'text-error' : 'text-foreground'}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Brand */}
        <p className="font-caption text-xs text-muted-foreground uppercase tracking-wider mb-1">
          {product.brand}
        </p>

        {/* Product Name */}
        <h3 className="font-body font-medium text-foreground mb-2 line-clamp-2 min-h-[3rem]">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
              <Icon
                key={index}
                name="StarIcon"
                size={14}
                variant={index < Math.floor(product.rating) ? 'solid' : 'outline'}
                className={index < Math.floor(product.rating) ? 'text-primary' : 'text-muted-foreground'}
              />
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="font-data text-lg font-semibold text-primary">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="font-data text-sm text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`w-full py-3 px-4 rounded-lg font-body font-medium transition-luxury flex items-center justify-center gap-2 ${
            product.inStock
              ? 'bg-primary text-primary-foreground hover:scale-105 golden-glow'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          <Icon name="ShoppingCartIcon" size={20} />
          <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;