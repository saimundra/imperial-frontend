import type { Metadata } from 'next';
import { Suspense } from 'react';
import DynamicHeader from '@/components/common/DynamicHeader';
import Breadcrumb from '@/components/common/Breadcrumb';
import AuthenticationInteractive from './components/AuthenticationInteractive';

export const metadata: Metadata = {
  title: 'Sign In - Imperial Glow Nepal',
  description: 'Access your luxury beauty shopping account with secure login and registration on Imperial Glow Nepal.',
};

export default function UserAuthenticationPage() {
  return (
    <>
      <DynamicHeader />
      <main className="min-h-screen bg-background pt-20">
        <Breadcrumb
          items={[
            { label: 'Home', path: '/home-landing' },
            { label: 'Account', path: '/user-authentication' },
          ]}
        />
        <Suspense fallback={null}>
          <AuthenticationInteractive />
        </Suspense>
      </main>
    </>
  );
}