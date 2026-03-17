import type { Metadata } from 'next';
import DynamicHeader from '@/components/common/DynamicHeader';
import Breadcrumb from '@/components/common/Breadcrumb';
import ShoppingCartInteractive from './components/ShoppingCartInteractive';

export const metadata: Metadata = {
  title: 'Shopping Cart - Imperial Glow Nepal',
  description: 'Review your selected luxury beauty products and proceed to secure checkout. Manage quantities, apply promo codes, and enjoy free shipping on orders over Rs. 5,000.',
};

export default function ShoppingCartPage() {
  return (
    <div className="min-h-screen bg-background">
      <DynamicHeader />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <Breadcrumb
            items={[
              { label: 'Home', path: '/home-landing' },
              { label: 'Shopping Cart', path: '/shopping-cart' },
            ]}
          />
          
          <ShoppingCartInteractive />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card golden-border-t mt-16">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* About */}
            <div>
              <h3 className="font-heading text-lg font-semibold text-primary mb-4">
                Imperial Glow Nepal
              </h3>
              <p className="font-body text-sm text-muted-foreground mb-4">
                Your trusted destination for authentic luxury beauty products in Nepal. We guarantee 100% genuine international brands.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="/product-catalog" className="font-body text-sm text-muted-foreground transition-luxury hover:text-primary">
                    Shop All Products
                  </a>
                </li>
                <li>
                  <a href="/user-account-dashboard" className="font-body text-sm text-muted-foreground transition-luxury hover:text-primary">
                    My Account
                  </a>
                </li>
                <li>
                  <a href="/order-tracking#track-order-section" className="font-body text-sm text-muted-foreground transition-luxury hover:text-primary">
                    Track Order
                  </a>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
                Customer Service
              </h3>
              <ul className="space-y-2">
                <li>
                  <span className="font-body text-sm text-muted-foreground">
                    Shipping & Returns
                  </span>
                </li>
                <li>
                  <span className="font-body text-sm text-muted-foreground">
                    Privacy Policy
                  </span>
                </li>
                <li>
                  <span className="font-body text-sm text-muted-foreground">
                    Terms & Conditions
                  </span>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
                Contact Us
              </h3>
              <ul className="space-y-2">
                <li className="font-body text-sm text-muted-foreground">
                  Kathmandu, Nepal
                </li>
                <li className="font-body text-sm text-muted-foreground">
                  +977 1-4567890
                </li>
                <li className="font-body text-sm text-muted-foreground">
                  support@imperialglow.com.np
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t golden-border text-center">
            <p className="font-caption text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Imperial Glow Nepal. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}