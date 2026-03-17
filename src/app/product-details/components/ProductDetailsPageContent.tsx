'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import Breadcrumb from '@/components/common/Breadcrumb';
import Icon from '@/components/ui/AppIcon';
import {
  ApiError,
  fetchProductById,
  fetchProducts,
  type ApiProduct,
} from '@/lib/api';
import ProductDetailsInteractive, { type ProductData } from './ProductDetailsInteractive';

const DEFAULT_PRODUCT_ID = 'prod-001';

const CATEGORY_LABELS: Record<string, string> = {
  makeup: 'Makeup',
  skincare: 'Skincare',
  perfumes: 'Perfumes',
};

const CATEGORY_FEATURES: Record<string, string[]> = {
  makeup: [
    'Buildable coverage with smooth, lightweight finish',
    'Long-lasting formula designed for all-day wear',
    'Easy blendability for natural or glam looks',
    'Suitable for day-to-day and occasion makeup routines',
  ],
  skincare: [
    'Hydrating formula that supports skin barrier health',
    'Gentle texture suitable for daily routines',
    'Helps improve skin texture and radiance over time',
    'Pairs well with layered AM/PM skincare steps',
  ],
  perfumes: [
    'Premium fragrance profile with balanced top, heart, and base notes',
    'Designed for long-lasting wear throughout the day',
    'Elegant scent suited for both casual and formal settings',
    'Travel and gifting friendly luxury presentation',
  ],
};

const CATEGORY_INGREDIENTS: Record<string, string[]> = {
  makeup: ['Aqua (Water)', 'Glycerin', 'Dimethicone', 'Titanium Dioxide', 'Iron Oxides'],
  skincare: ['Aqua (Water)', 'Hyaluronic Acid', 'Niacinamide', 'Ceramides', 'Panthenol'],
  perfumes: ['Alcohol Denat.', 'Parfum (Fragrance)', 'Aqua (Water)', 'Linalool', 'Limonene'],
};

const CATEGORY_HOW_TO_USE: Record<string, string[]> = {
  makeup: [
    'Start with clean and moisturized skin.',
    'Apply a small amount and blend evenly.',
    'Layer gradually for additional coverage as needed.',
  ],
  skincare: [
    'Cleanse and pat skin dry before application.',
    'Apply evenly to face and neck with gentle motions.',
    'Use consistently once or twice daily for best results.',
  ],
  perfumes: [
    'Spray lightly on pulse points such as wrists and neck.',
    'Avoid rubbing the fragrance after application.',
    'Store in a cool, dry place away from direct sunlight.',
  ],
};

const DEFAULT_WARNINGS = [
  'For external use only.',
  'Avoid direct contact with eyes and broken skin.',
  'Discontinue use if irritation occurs.',
  'Keep out of reach of children.',
];

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

const buildSku = (product: ApiProduct): string => {
  const normalizedBrand = product.brand.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  const brandCode = normalizedBrand.slice(0, 3) || 'PRD';
  const productCode = product.id.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  return `${brandCode}-${productCode}`;
};

const buildStockStatus = (
  inStock: boolean,
  stockQuantity: number,
): ProductData['stockStatus'] => {
  if (!inStock || stockQuantity <= 0) {
    return 'out-of-stock';
  }

  if (stockQuantity <= 10) {
    return 'low-stock';
  }

  return 'in-stock';
};

const buildRatingDistribution = (
  averageRating: number,
  totalReviews: number,
): ProductData['ratingDistribution'] => {
  const safeTotal = Math.max(0, totalReviews);
  const safeAverage = clamp(averageRating, 1, 5);

  if (safeTotal === 0) {
    return [5, 4, 3, 2, 1].map((stars) => ({ stars, count: 0, percentage: 0 }));
  }

  const templates =
    safeAverage >= 4.5
      ? [0.68, 0.22, 0.07, 0.02, 0.01]
      : safeAverage >= 4
    ? [0.56, 0.26, 0.12, 0.04, 0.02]
      : safeAverage >= 3.5
      ? [0.42, 0.3, 0.17, 0.08, 0.03]
      : [0.28, 0.31, 0.24, 0.12, 0.05];

  const counts = templates.map((value) => Math.round(value * safeTotal));
  const assigned = counts.reduce((sum, count) => sum + count, 0);
  const difference = safeTotal - assigned;
  counts[0] += difference;

  return [5, 4, 3, 2, 1].map((stars, index) => ({
    stars,
    count: Math.max(0, counts[index]),
    percentage: Math.round((Math.max(0, counts[index]) / safeTotal) * 100),
  }));
};

const mapRelatedProduct = (
  product: ApiProduct,
): ProductData['relatedProducts'][number] => ({
  id: product.id,
  name: product.name,
  brand: product.brand,
  price: product.price,
  originalPrice: product.originalPrice || undefined,
  image: product.image,
  imageAlt: product.alt,
  rating: Number(product.rating),
  reviewCount: product.reviewCount,
});

const mapApiProductToDetail = (
  product: ApiProduct,
  relatedProducts: ApiProduct[],
): ProductData => {
  const categoryKey = product.category.toLowerCase();
  const categoryLabel = CATEGORY_LABELS[categoryKey] || 'Products';
  const description =
    product.description && product.description.trim().length > 0
      ? product.description
      : `${product.name} by ${product.brand} is part of our authentic ${categoryLabel.toLowerCase()} collection, curated for customers across Nepal.`;

  return {
    id: product.id,
    name: product.name,
    brand: product.brand,
    category: categoryLabel,
    price: product.price,
    originalPrice: product.originalPrice || undefined,
    rating: Number(product.rating),
    reviewCount: product.reviewCount,
    stockStatus: buildStockStatus(product.inStock, product.stock_quantity),
    stockQuantity: product.stock_quantity,
    sku: buildSku(product),
    isAuthentic: product.isAuthentic,
    images: [
      {
        id: `${product.id}-primary`,
        url: product.image,
        alt: product.alt,
      },
    ],
    description,
    features: CATEGORY_FEATURES[categoryKey] || CATEGORY_FEATURES.makeup,
    ingredients: CATEGORY_INGREDIENTS[categoryKey] || CATEGORY_INGREDIENTS.makeup,
    howToUse: CATEGORY_HOW_TO_USE[categoryKey] || CATEGORY_HOW_TO_USE.makeup,
    warnings: DEFAULT_WARNINGS,
    reviews: [],
    ratingDistribution: buildRatingDistribution(Number(product.rating), product.reviewCount),
    relatedProducts: relatedProducts.map(mapRelatedProduct),
  };
};

const ProductDetailsPageContent = () => {
  const searchParams = useSearchParams();
  const requestedId = searchParams.get('id')?.trim() || DEFAULT_PRODUCT_ID;

  const [productData, setProductData] = useState<ProductData | null>(null);
  const [categorySlug, setCategorySlug] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const loadProductData = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const product = await fetchProductById(requestedId);
        setCategorySlug(product.category);

        const sameCategoryProducts = await fetchProducts({ category: product.category }).catch(
          () => [] as ApiProduct[]
        );
        const allProducts = await fetchProducts().catch(() => [] as ApiProduct[]);

        const deduplicatedRelated = Array.from(
          new Map([...sameCategoryProducts, ...allProducts].map((item) => [item.id, item])).values(),
        )
          .filter((item) => item.id !== product.id)
          .slice(0, 4);

        if (!isCancelled) {
          setProductData(mapApiProductToDetail(product, deduplicatedRelated));
        }
      } catch (error) {
        if (isCancelled) {
          return;
        }

        if (error instanceof ApiError && error.status === 404) {
          setErrorMessage('Product not found.');
        } else {
          setErrorMessage('Unable to load product details right now. Please try again.');
        }

        setProductData(null);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    loadProductData();

    return () => {
      isCancelled = true;
    };
  }, [requestedId]);

  const breadcrumbItems = useMemo(() => {
    const categoryPath =
      categorySlug === 'all' ? '/product-catalog' : `/product-catalog?category=${categorySlug}`;

    return [
      { label: 'Home', path: '/home-landing' },
      { label: productData?.category || 'Products', path: categoryPath },
      { label: productData?.name || 'Product Details', path: `/product-details?id=${requestedId}` },
    ];
  }, [productData, categorySlug, requestedId]);

  if (isLoading) {
    return (
      <>
        <Breadcrumb items={breadcrumbItems} />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent" />
        </div>
      </>
    );
  }

  if (errorMessage || !productData) {
    return (
      <>
        <Breadcrumb items={breadcrumbItems} />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="max-w-lg w-full text-center p-8 bg-card rounded-lg golden-border space-y-4">
            <div className="flex justify-center">
              <Icon name="ExclamationCircleIcon" size={44} className="text-warning" />
            </div>
            <h1 className="font-heading text-2xl font-semibold text-foreground">Unable to load product</h1>
            <p className="font-body text-muted-foreground">{errorMessage || 'Please try again later.'}</p>
            <Link
              href="/product-catalog"
              className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-primary text-primary-foreground font-body font-medium transition-luxury hover:scale-105"
            >
              Browse Catalog
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <ProductDetailsInteractive productData={productData} />
    </>
  );
};

export default ProductDetailsPageContent;
