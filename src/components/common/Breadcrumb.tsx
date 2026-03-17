'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb = ({ items, className = '' }: BreadcrumbProps) => {
  const pathname = usePathname();

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items && items.length > 0) {
      return items;
    }

    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', path: '/home-landing' }
    ];

    let currentPath = '';
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`;
      
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      breadcrumbs.push({
        label,
        path: currentPath
      });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = generateBreadcrumbs();

  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`py-4 ${className}`}
    >
      <ol className="flex items-center flex-wrap gap-2">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          const isFirst = index === 0;

          return (
            <li key={item.path} className="flex items-center">
              {!isFirst && (
                <Icon 
                  name="ChevronRightIcon" 
                  size={16} 
                  className="text-muted-foreground mx-2" 
                />
              )}
              {isLast ? (
                <span className="font-body text-sm font-medium text-primary truncate max-w-[200px] sm:max-w-none">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.path}
                  className="font-body text-sm text-muted-foreground transition-luxury hover:text-primary truncate max-w-[150px] sm:max-w-none"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;