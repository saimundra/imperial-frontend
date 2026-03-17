import type { Metadata } from 'next';
import DynamicHeader from '@/components/common/DynamicHeader';
import Breadcrumb from '@/components/common/Breadcrumb';
import CheckoutInteractive from './components/CheckoutInteractive';

export const metadata: Metadata = {
  title: 'Checkout - Imperial Glow Nepal',
  description: 'Complete your luxury beauty product purchase with secure checkout. Multiple payment options including eSewa, Khalti, and Cash on Delivery available for Nepal.',
};

export default function CheckoutProcessPage() {
  const breadcrumbItems = [
    { label: 'Home', path: '/home-landing' },
    { label: 'Shopping Cart', path: '/shopping-cart' },
    { label: 'Checkout', path: '/checkout-process' },
  ];

  return (
    <>
      <DynamicHeader />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 pt-28">
          <Breadcrumb items={breadcrumbItems} />
        </div>
        <CheckoutInteractive />
      </main>
    </>
  );
}