import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface ProductInfoProps {
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  stockStatus: 'in-stock' | 'low-stock' | 'out-of-stock';
  stockQuantity?: number;
  sku: string;
  isAuthentic: boolean;
}

const ProductInfo = ({
  name,
  brand,
  category,
  price,
  originalPrice,
  rating,
  stockStatus,
  stockQuantity,
  sku,
  isAuthentic,
}: ProductInfoProps) => {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const discountPercentage = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Icon key={i} name="StarIcon" size={20} variant="solid" className="text-primary" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <Icon name="StarIcon" size={20} className="text-muted" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Icon name="StarIcon" size={20} variant="solid" className="text-primary" />
            </div>
          </div>
        );
      } else {
        stars.push(<Icon key={i} name="StarIcon" size={20} className="text-muted" />);
      }
    }
    return stars;
  };

  const getStockStatusDisplay = () => {
    switch (stockStatus) {
      case 'in-stock':
        return (
          <div className="flex items-center space-x-2 text-success">
            <Icon name="CheckCircleIcon" size={20} variant="solid" />
            <span className="font-body font-medium">In Stock</span>
            {stockQuantity && stockQuantity > 10 && (
              <span className="font-caption text-sm text-muted-foreground">
                ({stockQuantity} available)
              </span>
            )}
          </div>
        );
      case 'low-stock':
        return (
          <div className="flex items-center space-x-2 text-warning">
            <Icon name="ExclamationTriangleIcon" size={20} variant="solid" />
            <span className="font-body font-medium">
              Low Stock {stockQuantity && `(Only ${stockQuantity} left)`}
            </span>
          </div>
        );
      case 'out-of-stock':
        return (
          <div className="flex items-center space-x-2 text-error">
            <Icon name="XCircleIcon" size={20} variant="solid" />
            <span className="font-body font-medium">Out of Stock</span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Brand & Category */}
      <div className="flex items-center space-x-2 text-muted-foreground">
        <span className="font-caption text-sm uppercase tracking-wider">{brand}</span>
        <span className="text-muted">•</span>
        <span className="font-caption text-sm">{category}</span>
      </div>

      {/* Product Name */}
      <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground">
        {name}
      </h1>

      {/* Rating & Reviews */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">{renderStars(rating)}</div>
        <span className="font-data text-sm text-foreground">{rating.toFixed(1)}</span>
      </div>

      {/* Authenticity Badge */}
      {isAuthentic && (
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-lg golden-border">
          <Icon name="ShieldCheckIcon" size={20} variant="solid" className="text-primary" />
          <span className="font-body font-medium text-primary">100% Authentic Product</span>
        </div>
      )}

      {/* Pricing */}
      <div className="space-y-2">
        <div className="flex items-baseline space-x-4">
          <span className="font-heading text-4xl font-semibold text-primary">
            {formatPrice(price)}
          </span>
          {originalPrice && originalPrice > price && (
            <>
              <span className="font-data text-xl text-muted-foreground line-through">
                {formatPrice(originalPrice)}
              </span>
              <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full font-body font-medium text-sm">
                Save {discountPercentage}%
              </span>
            </>
          )}
        </div>
        <p className="font-caption text-sm text-muted-foreground">
          Inclusive of all taxes • Free shipping on orders above Rs. 5,000 in Pokhara Valley
        </p>
      </div>

      {/* Stock Status */}
      <div className="pt-4 border-t golden-border">{getStockStatusDisplay()}</div>

      {/* SKU */}
      <div className="flex items-center space-x-2 text-muted-foreground">
        <span className="font-caption text-sm">SKU:</span>
        <span className="font-data text-sm">{sku}</span>
      </div>
    </div>
  );
};

export default ProductInfo;