import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import Icon from '@/components/ui/AppIcon';
import AuthenticationInteractive from '@/app/user-authentication/components/AuthenticationInteractive';

export const metadata: Metadata = {
  title: 'Login - Imperial Glow Nepal',
  description: 'Sign in to your Imperial Glow Nepal account to manage orders, wishlist, and profile.',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background pt-6">
      <div className="container mx-auto px-4">
        <Link
          href="/home-landing"
          className="inline-flex items-center gap-2 px-4 py-2 bg-card rounded-lg golden-border font-body text-sm text-foreground transition-luxury hover:golden-border-hover"
        >
          <Icon name="ArrowLeftIcon" size={16} />
          <span>Back to Home</span>
        </Link>
      </div>

      <Suspense fallback={null}>
        <AuthenticationInteractive initialMode="login" />
      </Suspense>
    </main>
  );
}
