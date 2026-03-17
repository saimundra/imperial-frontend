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
  imageAlt: string;
  rating: number;
  reviewCount: number;
}

interface RelatedProductsProps {
  products: RelatedProduct[];
}

const RelatedProducts = ({ products }: RelatedProductsProps) => {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Icon
          key={i}
          name="StarIcon"
          size={14}
          variant={i < Math.round(rating) ? 'solid' : 'outline'}
          className={i < Math.round(rating) ? 'text-primary' : 'text-muted'}
        />
      );
    }
    return stars;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground">
          You May Also Like
        </h2>
        <Link
          href="/product-catalog"
          className="flex items-center space-x-2 text-primary transition-luxury hover:scale-105"
        >
          <span className="font-body font-medium">View All</span>
          <Icon name="ArrowRightIcon" size={20} />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product-details?id=${product.id}`}
            className="group bg-card rounded-lg overflow-hidden golden-border transition-luxury hover:golden-glow hover:scale-105"
          >
            <div className="aspect-square overflow-hidden bg-background">
              <AppImage
                src={product.image}
                alt={product.imageAlt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            <div className="p-4 space-y-2">
              <p className="font-caption text-xs text-muted-foreground uppercase tracking-wider truncate">
                {product.brand}
              </p>
              <h3 className="font-body font-medium text-foreground line-clamp-2 min-h-[2.5rem]">
                {product.name}
              </h3>

              <div className="flex items-center space-x-1">
                {renderStars(product.rating)}
              </div>

              <div className="flex items-baseline space-x-2">
                <span className="font-data text-lg font-semibold text-primary">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="font-data text-sm text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;