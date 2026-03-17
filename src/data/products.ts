export interface Product {
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
  isNew?: boolean;
  discount?: number;
}

// This data would typically come from an API
// For now, it's centralized here instead of duplicated across components
export const products: Product[] = [
  {
    id: 'prod-001',
    name: 'Luxury Matte Lipstick - Ruby Red',
    brand: 'MAC Cosmetics',
    price: 3500,
    originalPrice: 4200,
    image: 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg',
    alt: 'Red matte lipstick tube with gold cap on black background',
    category: 'makeup',
    inStock: true,
    isAuthentic: true,
    rating: 4.8,
    reviewCount: 234,
    discount: 17,
  },
  {
    id: 'prod-002',
    name: 'Hydrating Face Serum with Hyaluronic Acid',
    brand: 'The Ordinary',
    price: 2800,
    image: 'https://images.pexels.com/photos/3735657/pexels-photo-3735657.jpeg',
    alt: 'Clear glass serum bottle with dropper on black marble surface',
    category: 'skincare',
    inStock: true,
    isAuthentic: true,
    rating: 4.9,
    reviewCount: 567,
    isNew: true,
  },
  {
    id: 'prod-003',
    name: 'Eau de Parfum - Midnight Rose',
    brand: 'Chanel',
    price: 15000,
    originalPrice: 18000,
    image: 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg',
    alt: 'Elegant perfume bottle with gold accents on black velvet background',
    category: 'perfumes',
    inStock: true,
    isAuthentic: true,
    rating: 4.7,
    reviewCount: 189,
    discount: 17,
  },
  {
    id: 'prod-004',
    name: 'Vitamin C Brightening Cream',
    brand: 'Clinique',
    price: 4200,
    image: 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg',
    alt: 'White cream jar with gold lid on white marble surface',
    category: 'skincare',
    inStock: true,
    isAuthentic: true,
    rating: 4.6,
    reviewCount: 342,
  },
  {
    id: 'prod-005',
    name: 'Velvet Matte Foundation - Porcelain',
    brand: 'Estée Lauder',
    price: 5500,
    originalPrice: 6200,
    image: 'https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg',
    alt: 'Luxury foundation bottle with pump on black background',
    category: 'makeup',
    inStock: false,
    isAuthentic: true,
    rating: 4.5,
    reviewCount: 445,
    discount: 11,
  },
  {
    id: 'prod-006',
    name: 'Premium Eyeshadow Palette - Nude Elegance',
    brand: 'Urban Decay',
    price: 6800,
    image: 'https://images.pexels.com/photos/2533263/pexels-photo-2533263.jpeg',
    alt: 'Gold eyeshadow palette with multiple neutral shades',
    category: 'makeup',
    inStock: true,
    isAuthentic: true,
    rating: 4.9,
    reviewCount: 678,
    isNew: true,
  },
  {
    id: 'prod-007',
    name: 'Luxury Eau de Toilette - Ocean Breeze',
    brand: 'Dior',
    price: 12500,
    image: 'https://images.pexels.com/photos/1961795/pexels-photo-1961795.jpeg',
    alt: 'Blue perfume bottle with silver accents on glass surface',
    category: 'perfumes',
    inStock: true,
    isAuthentic: true,
    rating: 4.8,
    reviewCount: 234,
  },
  {
    id: 'prod-008',
    name: 'Anti-Aging Night Cream',
    brand: 'Lancôme',
    price: 7800,
    originalPrice: 8900,
    image: 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg',
    alt: 'Pink cream jar with silver lid on pink background',
    category: 'skincare',
    inStock: true,
    isAuthentic: true,
    rating: 4.7,
    reviewCount: 512,
    discount: 12,
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === 'all') return products;
  return products.filter(p => p.category === category);
}

export function getProductsByIds(ids: string[]): Product[] {
  return products.filter(p => ids.includes(p.id));
}
