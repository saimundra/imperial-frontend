import type { Metadata } from 'next';
import DynamicHeader from '@/components/common/DynamicHeader';
import Breadcrumb from '@/components/common/Breadcrumb';
import ProductCatalogInteractive from './components/ProductCatalogInteractive';

export const metadata: Metadata = {
  title: 'Product Catalog - Imperial Glow Nepal',
  description: 'Browse our extensive collection of authentic luxury makeup, skincare products, and designer perfumes. Filter by category, brand, and price to find your perfect beauty products with guaranteed authenticity.',
};

export default function ProductCatalogPage() {
  return (
    <>
      <DynamicHeader />
      <main>
        <div className="container mx-auto px-4 lg:px-8 pt-28">
          <Breadcrumb />
        </div>
        <ProductCatalogInteractive />
      </main>
    </>
  );
}