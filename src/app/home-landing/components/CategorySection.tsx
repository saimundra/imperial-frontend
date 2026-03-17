import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
  alt: string;
  link: string;
  icon: string;
  productCount: number;
}

const mockCategories: Category[] = [
  {
    id: 1,
    name: "Makeup",
    description: "Premium cosmetics from international brands for flawless beauty",
    image: "https://images.pexels.com/photos/2113855/pexels-photo-2113855.jpeg",
    alt: "Assorted luxury makeup products including foundation bottles, lipsticks, and brushes on black marble surface",
    link: "/product-catalog?category=makeup",
    icon: "SparklesIcon",
    productCount: 245
  },
  {
    id: 2,
    name: "Skincare",
    description: "Advanced skincare solutions for radiant and healthy skin",
    image: "https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg",
    alt: "Elegant skincare serum bottles and cream jars with golden caps on white marble with green leaves",
    link: "/product-catalog?category=skincare",
    icon: "BeakerIcon",
    productCount: 189
  },
  {
    id: 3,
    name: "Perfumes",
    description: "Exquisite fragrances from world-renowned perfume houses",
    image: "https://images.pexels.com/photos/1961795/pexels-photo-1961795.jpeg",
    alt: "Designer perfume bottles with ornate golden details displayed on black velvet fabric",
    link: "/product-catalog?category=perfumes",
    icon: "CubeIcon",
    productCount: 156
  }
];

export default function CategorySection() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="font-caption text-sm tracking-widest text-primary uppercase mb-4">
            Explore Our Collections
          </p>
          <h2 className="font-heading text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Shop by Category
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover authentic luxury beauty products across our carefully curated categories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {mockCategories.map((category) => (
            <Link
              key={category.id}
              href={category.link}
              className="group relative overflow-hidden rounded-lg golden-border bg-card transition-luxury hover:golden-glow"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <AppImage
                  src={category.image}
                  alt={category.alt}
                  className="w-full h-full object-cover transition-luxury group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/20 backdrop-blur-sm golden-border">
                    <Icon name={category.icon as any} size={20} className="text-primary" />
                  </div>
                  <h3 className="font-heading text-2xl font-semibold text-foreground">
                    {category.name}
                  </h3>
                </div>
                <p className="font-body text-sm text-muted-foreground mb-4">
                  {category.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-caption text-xs text-primary">
                    {category.productCount} Products
                  </span>
                  <div className="flex items-center space-x-2 text-primary transition-luxury group-hover:translate-x-2">
                    <span className="font-body text-sm font-medium">Explore</span>
                    <Icon name="ArrowRightIcon" size={16} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}