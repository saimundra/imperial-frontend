'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { fetchProducts, type ApiProduct } from '@/lib/api';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  alt: string;
  category: string;
  rating: number;
  inStock: boolean;
  isNew?: boolean;
  discountPercentage?: number;
}

const mapApiProduct = (product: ApiProduct): Product => {
  const price = Number(product.price);
  const originalPrice = product.originalPrice == null ? undefined : Number(product.originalPrice);
  const discountPercentage =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : undefined;

  return {
    id: product.id,
    name: product.name,
    brand: product.brand,
    price,
    originalPrice,
    image: product.image,
    alt: product.alt,
    category: product.category,
    rating: Number(product.rating),
    inStock: product.inStock,
    isNew: product.isNew,
    discountPercentage,
  };
};

export default function FeaturedProducts() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  const loadFeaturedProducts = useCallback(async (withLoadingState = false) => {
    if (withLoadingState) {
      setIsLoadingProducts(true);
    }

    try {
      const products = await fetchProducts({ ordering: 'newest' });
      const mappedProducts = products.map(mapApiProduct);
      const featured = mappedProducts.filter((product) => product.inStock).slice(0, 6);
      setFeaturedProducts(featured);
    } catch {
      setFeaturedProducts([]);
    } finally {
      if (withLoadingState) {
        setIsLoadingProducts(false);
      }
    }
  }, []);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    void loadFeaturedProducts(true);
  }, [isHydrated, loadFeaturedProducts]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const handleProductsUpdated = () => {
      void loadFeaturedProducts();
    };

    window.addEventListener('productsUpdated', handleProductsUpdated);
    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdated);
    };
  }, [isHydrated, loadFeaturedProducts]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (!isHydrated || isLoadingProducts) {
    return (
      <section className="py-16 lg:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-6 w-48 bg-muted rounded mx-auto mb-4 animate-pulse" />
            <div className="h-12 w-96 bg-muted rounded mx-auto mb-6 animate-pulse" />
            <div className="h-6 w-full max-w-2xl bg-muted rounded mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-background rounded-lg p-4 animate-pulse">
                <div className="aspect-square bg-muted rounded-lg mb-4" />
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-6 bg-muted rounded mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="font-caption text-sm tracking-widest text-primary uppercase mb-4">
            Trending Now
          </p>
          <h2 className="font-heading text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Featured Products
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Handpicked luxury beauty essentials loved by our customers
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {featuredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/product-details?id=${product.id}`}
              className="group bg-background rounded-lg overflow-hidden golden-border transition-luxury hover:golden-glow"
            >
              <div className="relative aspect-square overflow-hidden">
                <AppImage
                  src={product.image}
                  alt={product.alt}
                  className="w-full h-full object-cover transition-luxury group-hover:scale-110"
                />
                {product.isNew && (
                  <span className="absolute top-4 left-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-caption font-medium rounded-full golden-glow-sm">
                    NEW
                  </span>
                )}
                {product.discountPercentage && product.discountPercentage > 0 && (
                  <span className="absolute top-4 right-4 px-3 py-1 bg-error text-error-foreground text-xs font-caption font-medium rounded-full">
                    -{product.discountPercentage}%
                  </span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-luxury flex items-end justify-center pb-6">
                  <button className="px-6 py-2 bg-primary text-primary-foreground font-body font-medium rounded-lg transition-luxury hover:scale-105 golden-glow">
                    Quick View
                  </button>
                </div>
              </div>

              <div className="p-6">
                <p className="font-caption text-xs text-primary uppercase tracking-wide mb-2">
                  {product.brand}
                </p>
                <h3 className="font-body text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-luxury">
                  {product.name}
                </h3>

                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Icon
                        key={i}
                        name="StarIcon"
                        size={14}
                        variant={i < Math.floor(product.rating) ? 'solid' : 'outline'}
                        className={i < Math.floor(product.rating) ? 'text-primary' : 'text-muted-foreground'}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-data text-lg font-semibold text-primary">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="font-data text-sm text-muted-foreground line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  {product.inStock ? (
                    <span className="flex items-center space-x-1 text-success text-xs font-caption">
                      <Icon name="CheckCircleIcon" size={14} />
                      <span>In Stock</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1 text-error text-xs font-caption">
                      <Icon name="XCircleIcon" size={14} />
                      <span>Out of Stock</span>
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {featuredProducts.length === 0 && (
          <div className="text-center mt-8">
            <p className="font-body text-muted-foreground">No featured products are available right now.</p>
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            href="/product-catalog"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-secondary text-secondary-foreground font-body font-medium rounded-lg transition-luxury hover:scale-105"
          >
            <span>View All Products</span>
            <Icon name="ArrowRightIcon" size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}