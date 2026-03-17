import React from 'react';
import Link from 'next/link';
import BrandLogo from '@/components/common/BrandLogo';
import Icon from '@/components/ui/AppIcon';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerSections: FooterSection[] = [
  {
    title: "Shop",
    links: [
      { label: "Makeup", href: "/product-catalog?category=makeup" },
      { label: "Skincare", href: "/product-catalog?category=skincare" },
      { label: "Perfumes", href: "/product-catalog?category=perfumes" },
      { label: "New Arrivals", href: "/product-catalog?filter=new" }
    ]
  },
  {
    title: "Customer Service",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Shipping Info", href: "/shipping" },
      { label: "Returns & Exchange", href: "/returns" },
      { label: "Track Order", href: "/order-tracking#track-order-section" }
    ]
  },
  {
    title: "About",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Authenticity", href: "/authenticity" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" }
    ]
  }
];

const socialLinks = [
  { icon: "facebook", href: "#", label: "Facebook" },
  { icon: "instagram", href: "#", label: "Instagram" },
  { icon: "twitter", href: "#", label: "Twitter" }
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t golden-border">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/home-landing" className="inline-block mb-6" aria-label="Imperial Glow Nepal">
              <BrandLogo className="block h-32 w-auto object-contain" />
            </Link>
            <p className="font-body text-muted-foreground mb-6 leading-relaxed">
              Nepal's premier destination for authentic luxury makeup, skincare, and perfumes from international brands.
            </p>
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.icon}
                  href={social.href}
                  className="w-10 h-10 flex items-center justify-center rounded-full golden-border transition-luxury hover:bg-primary hover:text-primary-foreground"
                  aria-label={social.label}
                >
                  <Icon name="ShareIcon" size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-body text-muted-foreground transition-luxury hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t golden-border">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="font-caption text-sm text-muted-foreground text-center md:text-left">
              &copy; {currentYear} Imperial Glow Nepal. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Icon name="ShieldCheckIcon" size={20} className="text-primary" />
                <span className="font-caption text-xs text-muted-foreground">
                  100% Authentic
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="LockClosedIcon" size={20} className="text-primary" />
                <span className="font-caption text-xs text-muted-foreground">
                  Secure Payment
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}