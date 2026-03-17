'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface RelatedProduct {
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

interface RelatedProductsProps {
  products: RelatedProduct[];
  onAddToCart: (productId: string) => void;
}

const RelatedProducts = ({ products, onAddToCart }: RelatedProductsProps) => {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="StarIcon"
        size={14}
        variant={index < Math.floor(rating) ? 'solid' : 'outline'}
        className={index < Math.floor(rating) ? 'text-primary' : 'text-muted-foreground'}
      />
    ));
  };

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-2xl font-semibold text-foreground">
          You May Also Like
        </h2>
        <Link
          href="/product-catalog"
          className="flex items-center gap-2 font-body text-sm text-primary transition-luxury hover:gap-3"
        >
          View All
          <Icon name="ArrowRightIcon" size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const discount = product.originalPrice && product.originalPrice > product.price
            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
            : 0;

          return (
            <div
              key={product.id}
              className="bg-card rounded-lg golden-border overflow-hidden transition-luxury hover:golden-glow group"
            >
              <Link
                href={`/product-details?id=${product.id}`}
                className="block relative aspect-square bg-background overflow-hidden"
              >
                <AppImage
                  src={product.image}
                  alt={product.alt}
                  className="w-full h-full object-cover transition-luxury group-hover:scale-105"
                />
                {discount > 0 && (
                  <span className="absolute top-3 right-3 px-2 py-1 bg-error text-white text-xs font-caption font-medium rounded">
                    -{discount}%
                  </span>
                )}
                {product.isAuthentic && (
                  <span className="absolute top-3 left-3 px-2 py-1 bg-primary/90 text-primary-foreground text-xs font-caption font-medium rounded flex items-center gap-1">
                    <Icon name="CheckBadgeIcon" size={12} />
                    Authentic
                  </span>
                )}
              </Link>

              <div className="p-4">
                <Link href={`/product-details?id=${product.id}`}>
                  <p className="font-caption text-xs text-primary mb-1">
                    {product.brand}
                  </p>
                  <h3 className="font-body font-medium text-foreground mb-2 line-clamp-2 transition-luxury group-hover:text-primary">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-center gap-1 mb-3">
                  {renderStars(product.rating)}
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-data text-lg font-semibold text-primary">
                      {formatPrice(product.price)}
                    </p>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <p className="font-data text-sm text-muted-foreground line-through">
                        {formatPrice(product.originalPrice)}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onAddToCart(product.id)}
                  className="w-full py-2.5 px-4 bg-primary text-primary-foreground rounded-lg font-body font-medium transition-luxury hover:scale-105 golden-glow-sm flex items-center justify-center gap-2"
                >
                  <Icon name="ShoppingCartIcon" size={18} />
                  Add to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedProducts;