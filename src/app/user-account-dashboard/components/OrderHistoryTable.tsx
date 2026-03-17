import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface OrderItem {
  orderId: string;
  date: string;
  items: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
}

interface OrderHistoryTableProps {
  orders: OrderItem[];
}

const statusConfig = {
  Processing: { color: 'text-warning', bg: 'bg-warning/10', icon: 'ClockIcon' },
  Shipped: { color: 'text-primary', bg: 'bg-primary/10', icon: 'TruckIcon' },
  Delivered: { color: 'text-success', bg: 'bg-success/10', icon: 'CheckCircleIcon' },
  Cancelled: { color: 'text-error', bg: 'bg-error/10', icon: 'XCircleIcon' },
};

export default function OrderHistoryTable({ orders }: OrderHistoryTableProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-card rounded-lg golden-border overflow-hidden">
      <div className="p-6 border-b golden-border">
        <h2 className="font-heading text-xl font-semibold text-foreground">Order History</h2>
      </div>
      
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface-elevated">
            <tr>
              <th className="px-6 py-4 text-left font-body text-sm font-medium text-muted-foreground">Order ID</th>
              <th className="px-6 py-4 text-left font-body text-sm font-medium text-muted-foreground">Date</th>
              <th className="px-6 py-4 text-left font-body text-sm font-medium text-muted-foreground">Items</th>
              <th className="px-6 py-4 text-left font-body text-sm font-medium text-muted-foreground">Status</th>
              <th className="px-6 py-4 text-left font-body text-sm font-medium text-muted-foreground">Total</th>
              <th className="px-6 py-4 text-left font-body text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order) => {
              const config = statusConfig[order.status];
              return (
                <tr key={order.orderId} className="transition-luxury hover:bg-muted">
                  <td className="px-6 py-4">
                    <span className="font-data text-sm text-foreground">{order.orderId}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-body text-sm text-foreground">{order.date}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-body text-sm text-muted-foreground">{order.items}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${config.bg}`}>
                      <Icon name={config.icon as any} size={16} className={config.color} />
                      <span className={`font-caption text-xs font-medium ${config.color}`}>
                        {order.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-data text-sm font-medium text-primary">{formatPrice(order.total)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/order-tracking?order=${encodeURIComponent(order.orderId)}#track-order-section`}
                      className="inline-flex items-center gap-1 font-body text-sm text-primary transition-luxury hover:text-secondary"
                    >
                      Track Order
                      <Icon name="ChevronRightIcon" size={16} />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden divide-y divide-border">
        {orders.map((order) => {
          const config = statusConfig[order.status];
          return (
            <div key={order.orderId} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="font-data text-sm text-foreground block mb-1">{order.orderId}</span>
                  <span className="font-body text-xs text-muted-foreground">{order.date}</span>
                </div>
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${config.bg}`}>
                  <Icon name={config.icon as any} size={14} className={config.color} />
                  <span className={`font-caption text-xs font-medium ${config.color}`}>
                    {order.status}
                  </span>
                </div>
              </div>
              <p className="font-body text-sm text-muted-foreground mb-3">{order.items}</p>
              <div className="flex items-center justify-between">
                <span className="font-data text-sm font-medium text-primary">{formatPrice(order.total)}</span>
                <Link
                  href={`/order-tracking?order=${encodeURIComponent(order.orderId)}#track-order-section`}
                  className="inline-flex items-center gap-1 font-body text-sm text-primary transition-luxury hover:text-secondary"
                >
                  Track Order
                  <Icon name="ChevronRightIcon" size={16} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}