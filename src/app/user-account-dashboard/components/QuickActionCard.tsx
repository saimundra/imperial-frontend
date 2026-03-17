import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: string;
  href: string;
  count?: number;
}

export default function QuickActionCard({ title, description, icon, href, count }: QuickActionCardProps) {
  return (
    <Link
      href={href}
      className="block bg-card rounded-lg golden-border p-6 transition-luxury hover:golden-glow hover:scale-105"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-lg bg-surface-elevated flex items-center justify-center golden-border">
          <Icon name={icon as any} size={24} className="text-primary" />
        </div>
        {count !== undefined && (
          <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground font-data text-sm font-medium golden-glow-sm">
            {count}
          </span>
        )}
      </div>
      <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="font-body text-sm text-muted-foreground">{description}</p>
    </Link>
  );
}