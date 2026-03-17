import type { Metadata } from 'next';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import AuthenticationInteractive from '@/app/user-authentication/components/AuthenticationInteractive';

export const metadata: Metadata = {
  title: 'Sign Up - Imperial Glow Nepal',
  description: 'Create your Imperial Glow Nepal account for luxury beauty shopping and order tracking.',
};

export default function SignupPage() {
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

      <AuthenticationInteractive initialMode="register" />
    </main>
  );
}
