'use client';

import React, { useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface ProductImage {
  id: string;
  url: string;
  alt: string;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

const ProductImageGallery = ({ images, productName }: ProductImageGalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const handlePrevious = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative aspect-square bg-card rounded-lg overflow-hidden golden-border">
        <div className="relative w-full h-full">
          <AppImage
            src={images[selectedImageIndex].url}
            alt={images[selectedImageIndex].alt}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
            }`}
            onClick={toggleZoom}
          />
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-card/80 backdrop-blur-sm rounded-full golden-border transition-luxury hover:bg-primary hover:text-primary-foreground hover:scale-110"
              aria-label="Previous image"
            >
              <Icon name="ChevronLeftIcon" size={24} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-card/80 backdrop-blur-sm rounded-full golden-border transition-luxury hover:bg-primary hover:text-primary-foreground hover:scale-110"
              aria-label="Next image"
            >
              <Icon name="ChevronRightIcon" size={24} />
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 px-3 py-1 bg-card/80 backdrop-blur-sm rounded-full golden-border">
          <span className="font-data text-sm text-foreground">
            {selectedImageIndex + 1} / {images.length}
          </span>
        </div>

        {/* Zoom Indicator */}
        <div className="absolute top-4 right-4 px-3 py-1 bg-card/80 backdrop-blur-sm rounded-full golden-border">
          <Icon name={isZoomed ? 'MagnifyingGlassMinusIcon' : 'MagnifyingGlassPlusIcon'} size={20} />
        </div>
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => handleThumbnailClick(index)}
              className={`aspect-square rounded-lg overflow-hidden transition-luxury hover:scale-105 ${
                index === selectedImageIndex
                  ? 'golden-border-2 golden-glow' :'golden-border opacity-60 hover:opacity-100'
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <AppImage
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;