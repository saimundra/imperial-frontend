import type { Metadata } from 'next';
import { Suspense } from 'react';
import DynamicHeader from '@/components/common/DynamicHeader';
import Breadcrumb from '@/components/common/Breadcrumb';
import OrderTrackingInteractive from './components/OrderTrackingInteractive';

export const metadata: Metadata = {
  title: 'Track Your Order - Imperial Glow Nepal',
  description: 'Monitor your luxury beauty product shipments with real-time tracking and delivery updates for Nepal regions.',
};

export default function OrderTrackingPage() {
  return (
    <>
      <DynamicHeader />
      <main className="min-h-screen bg-background pt-20">
        <Breadcrumb
          items={[
            { label: 'Home', path: '/home-landing' },
            { label: 'Track Order', path: '/order-tracking' },
          ]}
        />
        <Suspense fallback={null}>
          <OrderTrackingInteractive />
        </Suspense>
      </main>
    </>
  );
}