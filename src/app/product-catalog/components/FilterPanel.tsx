'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

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

interface FilterPanelProps {
  filters: FilterOptions;
  activeFilters: ActiveFilters;
  onFilterChange: (filters: ActiveFilters) => void;
  onClearFilters: () => void;
  productCount: number;
  isMobile?: boolean;
  onClose?: () => void;
}

const FilterPanel = ({
  filters,
  activeFilters,
  onFilterChange,
  onClearFilters,
  productCount,
  isMobile = false,
  onClose,
}: FilterPanelProps) => {
  const [localFilters, setLocalFilters] = useState<ActiveFilters>(activeFilters);

  useEffect(() => {
    setLocalFilters(activeFilters);
  }, [activeFilters]);

  const handleCategoryChange = (category: string) => {
    const newFilters = { ...localFilters, category };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleBrandChange = (brand: string) => {
    const newFilters = { ...localFilters, brand };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (type: 'min' | 'max', value: number) => {
    const newFilters = {
      ...localFilters,
      [type === 'min' ? 'priceMin' : 'priceMax']: value,
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleAvailabilityChange = (availability: string) => {
    const newFilters = { ...localFilters, availability };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClear = () => {
    const clearedFilters: ActiveFilters = {
      category: 'all',
      brand: 'all',
      priceMin: filters.priceRange.min,
      priceMax: filters.priceRange.max,
      availability: 'all',
    };
    setLocalFilters(clearedFilters);
    onClearFilters();
  };

  const hasActiveFilters =
    localFilters.category !== 'all' ||
    localFilters.brand !== 'all' ||
    localFilters.priceMin !== filters.priceRange.min ||
    localFilters.priceMax !== filters.priceRange.max ||
    localFilters.availability !== 'all';

  return (
    <div className={`bg-card rounded-lg golden-border ${isMobile ? 'h-full' : ''}`}>
      {isMobile && (
        <div className="flex items-center justify-between p-4 border-b golden-border">
          <h3 className="font-heading text-xl font-semibold text-foreground">Filters</h3>
          <button
            onClick={onClose}
            className="p-2 transition-luxury hover:text-primary"
            aria-label="Close filters"
          >
            <Icon name="XMarkIcon" size={24} />
          </button>
        </div>
      )}

      <div className={`${isMobile ? 'overflow-y-auto' : ''}`} style={isMobile ? { height: 'calc(100% - 140px)' } : {}}>
        <div className="p-6 space-y-6">
          {/* Category Filter */}
          <div>
            <label className="block font-body font-medium text-foreground mb-3">
              Category
            </label>
            <div className="space-y-2">
              {filters.categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-luxury ${
                    localFilters.category === category
                      ? 'bg-primary text-primary-foreground golden-glow'
                      : 'bg-muted text-foreground hover:bg-surface-elevated'
                  }`}
                >
                  <span className="font-body capitalize">{category}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div>
            <label className="block font-body font-medium text-foreground mb-3">
              Brand
            </label>
            <select
              value={localFilters.brand}
              onChange={(e) => handleBrandChange(e.target.value)}
              className="w-full px-4 py-3 bg-input text-foreground rounded-lg golden-border transition-luxury focus:golden-border-focus focus:outline-none"
            >
              {filters.brands.map((brand) => (
                <option key={brand} value={brand} className="bg-card">
                  {brand === 'all' ? 'All Brands' : brand}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div>
            <label className="block font-body font-medium text-foreground mb-3">
              Price Range (NPR)
            </label>
            <div className="space-y-4">
              <div>
                <label className="block font-caption text-sm text-muted-foreground mb-2">
                  Minimum: Rs. {localFilters.priceMin.toLocaleString('en-NP')}
                </label>
                <input
                  type="range"
                  min={filters.priceRange.min}
                  max={filters.priceRange.max}
                  step={500}
                  value={localFilters.priceMin}
                  onChange={(e) => handlePriceChange('min', Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
              <div>
                <label className="block font-caption text-sm text-muted-foreground mb-2">
                  Maximum: Rs. {localFilters.priceMax.toLocaleString('en-NP')}
                </label>
                <input
                  type="range"
                  min={filters.priceRange.min}
                  max={filters.priceRange.max}
                  step={500}
                  value={localFilters.priceMax}
                  onChange={(e) => handlePriceChange('max', Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>
          </div>

          {/* Availability Filter */}
          <div>
            <label className="block font-body font-medium text-foreground mb-3">
              Availability
            </label>
            <div className="space-y-2">
              {filters.availability.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAvailabilityChange(option)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-luxury ${
                    localFilters.availability === option
                      ? 'bg-primary text-primary-foreground golden-glow'
                      : 'bg-muted text-foreground hover:bg-surface-elevated'
                  }`}
                >
                  <span className="font-body capitalize">{option}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t golden-border bg-surface-elevated">
        <div className="flex items-center justify-between mb-3">
          <span className="font-caption text-sm text-muted-foreground">
            {productCount} {productCount === 1 ? 'product' : 'products'} found
          </span>
          {hasActiveFilters && (
            <button
              onClick={handleClear}
              className="font-caption text-sm text-primary transition-luxury hover:underline"
            >
              Clear All
            </button>
          )}
        </div>
        {isMobile && (
          <button
            onClick={onClose}
            className="w-full py-3 px-6 bg-primary text-primary-foreground rounded-lg font-body font-medium transition-luxury hover:scale-105 golden-glow"
          >
            Apply Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterPanel;