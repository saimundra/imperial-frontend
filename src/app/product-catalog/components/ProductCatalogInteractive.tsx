'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import FilterPanel from './FilterPanel';
import ProductCard from './ProductCard';
import SortDropdown from './SortDropdown';
import SearchBar from './SearchBar';
import {
  addItemToCart,
  addWishlistItem,
  fetchCart,
  fetchProducts,
  fetchWishlistItems,
  getStoredAuthToken,
  removeWishlistItem,
  type ApiProduct,
} from '@/lib/api';

const CATEGORY_OPTIONS = ['all', 'makeup', 'skincare', 'perfumes'];

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

interface FilterOptions {
  categories: string[];
  brands: string[];
  priceRange: { min: number; max: number };
  availability: string[];
}

interface ActiveFilters {
  category: string;
  brand: string;
  priceMin: number;
  priceMax: number;
  availability: string;
}

interface SortOption {
  value: string;
  label: string;
}

const DEFAULT_PRICE_RANGE = { min: 0, max: 20000 };

const mapApiProduct = (product: ApiProduct): Product => ({
  id: product.id,
  name: product.name,
  brand: product.brand,
  price: product.price,
  originalPrice: product.originalPrice || undefined,
  image: product.image,
  alt: product.alt,
  category: product.category,
  inStock: product.inStock,
  isAuthentic: product.isAuthentic,
  rating: Number(product.rating),
  reviewCount: product.reviewCount,
});

const ProductCatalogInteractive = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isHydrated, setIsHydrated] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    category: 'all',
    brand: 'all',
    priceMin: DEFAULT_PRICE_RANGE.min,
    priceMax: DEFAULT_PRICE_RANGE.max,
    availability: 'all',
  });

  const showNotificationMessage = useCallback((message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  }, []);

  const loadCatalogData = useCallback(async () => {
    try {
      const [products, cart] = await Promise.all([fetchProducts(), fetchCart()]);
      setAllProducts(products.map(mapApiProduct));
      setCartItems(cart.items.map((item) => item.id));
    } catch {
      showNotificationMessage('Unable to load products. Please try again.');
    }
  }, [showNotificationMessage]);

  const loadWishlistState = useCallback(async () => {
    if (!getStoredAuthToken()) {
      setWishlistItems([]);
      return;
    }

    try {
      const wishlist = await fetchWishlistItems();
      setWishlistItems(wishlist.map((item) => item.id));
    } catch {
      setWishlistItems([]);
    }
  }, []);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const loadInitialData = async () => {
      await Promise.all([loadCatalogData(), loadWishlistState()]);
      setIsLoadingProducts(false);
    };

    void loadInitialData();
  }, [isHydrated, loadCatalogData, loadWishlistState]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const handleProductsUpdated = () => {
      void loadCatalogData();
    };

    window.addEventListener('productsUpdated', handleProductsUpdated);
    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdated);
    };
  }, [isHydrated, loadCatalogData]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const handleWishlistUpdated = () => {
      void loadWishlistState();
    };

    const handleAuthStateChanged = () => {
      void loadWishlistState();
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdated);
    window.addEventListener('authStateChanged', handleAuthStateChanged);

    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdated);
      window.removeEventListener('authStateChanged', handleAuthStateChanged);
    };
  }, [isHydrated, loadWishlistState]);

  useEffect(() => {
    const requestedCategory = searchParams.get('category')?.toLowerCase() ?? 'all';
    const nextCategory = CATEGORY_OPTIONS.includes(requestedCategory)
      ? requestedCategory
      : 'all';

    setActiveFilters((currentFilters) => {
      if (currentFilters.category === nextCategory) {
        return currentFilters;
      }

      return {
        ...currentFilters,
        category: nextCategory,
      };
    });
  }, [searchParams]);

  const uniqueBrands = ['all', ...new Set(allProducts.map((product) => product.brand))];

  const filterOptions: FilterOptions = {
    categories: CATEGORY_OPTIONS,
    brands: uniqueBrands,
    priceRange: DEFAULT_PRICE_RANGE,
    availability: ['all', 'in stock', 'out of stock'],
  };

  const sortOptions: SortOption[] = [
    { value: 'popularity', label: 'Most Popular' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest Arrivals' },
    { value: 'rating', label: 'Highest Rated' },
  ];

  const filterProducts = (products: Product[]): Product[] => {
    return products.filter((product) => {
      const matchesCategory =
        activeFilters.category === 'all' || product.category === activeFilters.category;
      const matchesBrand =
        activeFilters.brand === 'all' || product.brand === activeFilters.brand;
      const matchesPrice =
        product.price >= activeFilters.priceMin && product.price <= activeFilters.priceMax;
      const matchesAvailability =
        activeFilters.availability === 'all' ||
        (activeFilters.availability === 'in stock' && product.inStock) ||
        (activeFilters.availability === 'out of stock' && !product.inStock);
      const matchesSearch =
        searchQuery === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase());

      return (
        matchesCategory && matchesBrand && matchesPrice && matchesAvailability && matchesSearch
      );
    });
  };

  const sortProducts = (products: Product[]): Product[] => {
    const sorted = [...products];

    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'newest':
        return sorted.reverse();
      case 'popularity':
      default:
        return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
    }
  };

  const filteredProducts = filterProducts(allProducts);
  const displayedProducts = sortProducts(filteredProducts);

  const updateCategoryQuery = (category: string) => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());

    if (category === 'all') {
      nextSearchParams.delete('category');
    } else {
      nextSearchParams.set('category', category);
    }

    const nextUrl = nextSearchParams.toString()
      ? `${pathname}?${nextSearchParams.toString()}`
      : pathname;

    router.replace(nextUrl, { scroll: false });
  };

  const handleFilterChange = (filters: ActiveFilters) => {
    setActiveFilters(filters);

    if (filters.category !== activeFilters.category) {
      updateCategoryQuery(filters.category);
    }
  };

  const handleClearFilters = () => {
    setActiveFilters({
      category: 'all',
      brand: 'all',
      priceMin: filterOptions.priceRange.min,
      priceMax: filterOptions.priceRange.max,
      availability: 'all',
    });
    updateCategoryQuery('all');
  };

  const handleAddToCart = async (productId: string) => {
    const product = allProducts.find((item) => item.id === productId);
    if (!product) return;

    try {
      const updatedCart = await addItemToCart(productId, 1);
      const updatedItemIds = updatedCart.items.map((item) => item.id);
      setCartItems(updatedItemIds);
      window.dispatchEvent(new Event('cartUpdated'));

      if (cartItems.includes(productId)) {
        showNotificationMessage(`${product.name} quantity updated in cart!`);
      } else {
        showNotificationMessage(`${product.name} added to cart!`);
      }
    } catch (error) {
      const fallbackMessage = 'Unable to add item to cart.';
      const message = error instanceof Error ? error.message : fallbackMessage;
      showNotificationMessage(message);
    }
  };

  const handleAddToWishlist = async (productId: string) => {
    const product = allProducts.find((item) => item.id === productId);
    if (!product) return;

    if (!getStoredAuthToken()) {
      showNotificationMessage('Please sign in to save items to your wishlist.');
      return;
    }

    try {
      if (wishlistItems.includes(productId)) {
        await removeWishlistItem(productId);
        setWishlistItems((currentItems) => currentItems.filter((id) => id !== productId));
        showNotificationMessage(`${product.name} removed from wishlist.`);
      } else {
        await addWishlistItem(productId);
        setWishlistItems((currentItems) =>
          currentItems.includes(productId) ? currentItems : [...currentItems, productId],
        );
        showNotificationMessage(`${product.name} added to wishlist.`);
      }

      window.dispatchEvent(new Event('wishlistUpdated'));
    } catch (error) {
      const fallbackMessage = 'Unable to update wishlist right now.';
      const message = error instanceof Error ? error.message : fallbackMessage;
      showNotificationMessage(message);
    }
  };

  const handleSearch = () => {
    // Search is handled by filterProducts.
  };

  if (!isHydrated || isLoadingProducts) {
    return (
      <div className="min-h-screen bg-background pt-8 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-muted rounded-lg w-full max-w-2xl" />
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="h-96 bg-muted rounded-lg" />
              <div className="lg:col-span-3 space-y-6">
                <div className="h-12 bg-muted rounded-lg" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-96 bg-muted rounded-lg" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-8 pb-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-8">
          <h1 className="font-heading text-4xl lg:text-5xl font-semibold text-foreground mb-4">
            Luxury Beauty Collection
          </h1>
          <p className="font-body text-muted-foreground max-w-2xl">
            Discover authentic international beauty brands. From premium makeup to luxury skincare
            and designer perfumes, find your perfect products with guaranteed authenticity.
          </p>
        </div>

        <div className="mb-8">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <FilterPanel
                filters={filterOptions}
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                productCount={displayedProducts.length}
              />
            </div>
          </aside>

          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-3 bg-card text-foreground rounded-lg golden-border transition-luxury hover:golden-border-hover"
                >
                  <Icon name="AdjustmentsHorizontalIcon" size={20} />
                  <span className="font-body">Filters</span>
                </button>
                <p className="font-caption text-sm text-muted-foreground">
                  {displayedProducts.length} {displayedProducts.length === 1 ? 'product' : 'products'}
                </p>
              </div>
              <SortDropdown options={sortOptions} value={sortBy} onChange={setSortBy} />
            </div>

            {displayedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onAddToWishlist={handleAddToWishlist}
                    isInWishlist={wishlistItems.includes(product.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <Icon name="MagnifyingGlassIcon" size={64} className="text-muted-foreground mb-4" />
                <h3 className="font-heading text-2xl font-semibold text-foreground mb-2">
                  No Products Found
                </h3>
                <p className="font-body text-muted-foreground text-center mb-6">
                  We couldn't find any products matching your filters. Try adjusting your search
                  criteria.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-body font-medium transition-luxury hover:scale-105 golden-glow"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isMobileFilterOpen && (
        <>
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[1050] lg:hidden"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-card z-[1100] lg:hidden overflow-hidden">
            <FilterPanel
              filters={filterOptions}
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              productCount={displayedProducts.length}
              isMobile={true}
              onClose={() => setIsMobileFilterOpen(false)}
            />
          </div>
        </>
      )}

      {showNotification && (
        <div className="fixed bottom-8 right-8 z-[2000] animate-slide-up">
          <div className="bg-card golden-border rounded-lg p-4 golden-glow flex items-center gap-3 min-w-[300px] shadow-lg">
            <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
              <Icon name="CheckCircleIcon" size={20} className="text-success" />
            </div>
            <p className="font-body text-sm text-foreground">{notificationMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCatalogInteractive;
