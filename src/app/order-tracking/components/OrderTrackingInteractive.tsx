'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { fetchRecentOrders, trackOrder } from '@/lib/api';

interface TrackingStep {
  label: string;
  date: string;
  time: string;
  location: string;
  completed: boolean;
  active: boolean;
}

interface OrderDetails {
  orderId: string;
  orderDate: string;
  estimatedDelivery: string;
  status: string;
  carrier: string;
  trackingNumber: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    district: string;
    phone: string;
  };
  trackingSteps: TrackingStep[];
}

interface RecentOrder {
  id: string;
  date: string;
  status: string;
}

export default function OrderTrackingInteractive() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<string>('');
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

  useEffect(() => {
    const loadRecentOrders = async () => {
      try {
        const orders = await fetchRecentOrders(3);
        setRecentOrders(orders);
      } catch {
        setRecentOrders([]);
      }
    };

    loadRecentOrders();
  }, []);

  useEffect(() => {
    const orderFromQuery = searchParams.get('order');
    if (!orderFromQuery) return;

    setOrderNumber(orderFromQuery);
    setSelectedOrder('');
    setError('');

    const trackFromQuery = async () => {
      setIsLoading(true);
      try {
        const order = await trackOrder(orderFromQuery);
        setOrderDetails(order as OrderDetails);
      } catch (trackError) {
        const fallbackMessage = 'Order not found. Please check your order number and try again.';
        const message = trackError instanceof Error ? trackError.message : fallbackMessage;
        setError(message || fallbackMessage);
      } finally {
        setIsLoading(false);
      }
    };

    trackFromQuery();
  }, [searchParams]);

  const handleTrackOrder = async () => {
    setError('');
    setOrderDetails(null);

    const orderToTrack = (orderNumber || selectedOrder).trim();

    if (!orderToTrack) {
      setError('Please enter an order number or select from recent orders');
      return;
    }

    setIsLoading(true);

    try {
      const order = await trackOrder(orderToTrack);
      setOrderDetails(order as OrderDetails);
      setError('');
    } catch (trackError) {
      const fallbackMessage = 'Order not found. Please check your order number and try again.';
      const message = trackError instanceof Error ? trackError.message : fallbackMessage;
      setError(message || fallbackMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return `NPR ${price.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'text-success';
      case 'in transit':
      case 'out for delivery':
        return 'text-primary';
      case 'processing':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div id="track-order-section" className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl font-semibold text-foreground mb-4">Track Your Order</h1>
          <p className="font-body text-muted-foreground">
            Monitor your luxury beauty product shipments with real-time updates
          </p>
        </div>

        <div className="bg-card rounded-lg golden-border golden-glow p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="order-number" className="block font-body text-sm font-medium text-foreground mb-2">
                Order Number
              </label>
              <div className="flex gap-4">
                <input
                  type="text"
                  id="order-number"
                  value={orderNumber}
                  onChange={(event) => {
                    setOrderNumber(event.target.value);
                    setSelectedOrder('');
                    setError('');
                  }}
                  className="flex-1 px-4 py-3 bg-input text-foreground rounded-lg golden-border transition-luxury focus:golden-border-focus focus:outline-none"
                  placeholder="Enter your order number (e.g., IG-2026-0001)"
                />
                <button
                  onClick={handleTrackOrder}
                  disabled={isLoading}
                  className="px-8 py-3 bg-primary text-primary-foreground font-body font-medium rounded-lg transition-luxury hover:scale-105 golden-glow disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {isLoading ? 'Tracking...' : 'Track Order'}
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t golden-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground font-caption">Or select from recent orders</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => {
                      setSelectedOrder(order.id);
                      setOrderNumber('');
                      setError('');
                    }}
                    className={`p-4 rounded-lg golden-border transition-luxury text-left ${
                      selectedOrder === order.id
                        ? 'bg-primary/10 border-primary golden-glow'
                        : 'bg-surface-elevated hover:golden-glow'
                    }`}
                  >
                    <p className="font-body font-medium text-foreground mb-1">{order.id}</p>
                    <p className="font-caption text-xs text-muted-foreground mb-2">{order.date}</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-caption ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </button>
                ))
              ) : (
                <p className="font-body text-sm text-muted-foreground col-span-3 text-center py-4">
                  No recent orders available for this session.
                </p>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-error/10 border border-error/20 rounded-lg flex items-start gap-3">
              <Icon name="ExclamationCircleIcon" size={20} className="text-error flex-shrink-0 mt-0.5" />
              <p className="font-body text-sm text-error">{error}</p>
            </div>
          )}
        </div>

        {orderDetails && (
          <div className="space-y-6">
            <div className="bg-card rounded-lg golden-border overflow-hidden">
              <div className="p-6 border-b golden-border">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="font-heading text-2xl font-semibold text-foreground mb-2">
                      Order {orderDetails.orderId}
                    </h2>
                    <p className="font-body text-sm text-muted-foreground">Placed on {orderDetails.orderDate}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-4 py-2 rounded-lg font-body font-medium ${getStatusColor(orderDetails.status)}`}>
                      {orderDetails.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-body font-medium text-foreground mb-3 flex items-center gap-2">
                    <Icon name="TruckIcon" size={20} className="text-primary" />
                    Shipping Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p className="font-body text-muted-foreground">
                      <span className="text-foreground">Carrier:</span> {orderDetails.carrier}
                    </p>
                    <p className="font-body text-muted-foreground">
                      <span className="text-foreground">Tracking #:</span> {orderDetails.trackingNumber}
                    </p>
                    <p className="font-body text-muted-foreground">
                      <span className="text-foreground">Est. Delivery:</span> {orderDetails.estimatedDelivery}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-body font-medium text-foreground mb-3 flex items-center gap-2">
                    <Icon name="MapPinIcon" size={20} className="text-primary" />
                    Delivery Address
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p className="font-body text-foreground">{orderDetails.shippingAddress.name}</p>
                    <p className="font-body text-muted-foreground">{orderDetails.shippingAddress.address}</p>
                    <p className="font-body text-muted-foreground">
                      {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.district}
                    </p>
                    <p className="font-body text-muted-foreground">{orderDetails.shippingAddress.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg golden-border overflow-hidden">
              <div className="p-6 border-b golden-border">
                <h2 className="font-heading text-xl font-semibold text-foreground">Shipment Progress</h2>
              </div>
              <div className="p-6">
                <div className="relative">
                  {orderDetails.trackingSteps.map((step, index) => (
                    <div key={`${step.label}-${index}`} className="flex gap-4 pb-8 last:pb-0">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center transition-luxury ${
                            step.completed
                              ? 'bg-primary golden-glow-sm'
                              : step.active
                              ? 'bg-primary/20 golden-border'
                              : 'bg-muted golden-border'
                          }`}
                        >
                          {step.completed ? (
                            <Icon name="CheckIcon" size={24} className="text-primary-foreground" />
                          ) : step.active ? (
                            <div className="w-4 h-4 rounded-full bg-primary animate-pulse" />
                          ) : (
                            <div className="w-4 h-4 rounded-full bg-muted-foreground" />
                          )}
                        </div>
                        {index < orderDetails.trackingSteps.length - 1 && (
                          <div
                            className={`w-0.5 flex-1 mt-2 ${step.completed ? 'bg-primary' : 'bg-border'}`}
                            style={{ minHeight: '60px' }}
                          />
                        )}
                      </div>
                      <div className="flex-1 pt-2">
                        <p
                          className={`font-body font-medium text-lg mb-1 ${
                            step.completed || step.active ? 'text-foreground' : 'text-muted-foreground'
                          }`}
                        >
                          {step.label}
                        </p>
                        <p className="font-caption text-sm text-muted-foreground mb-1">
                          {step.date} at {step.time}
                        </p>
                        <p className="font-caption text-xs text-muted-foreground">{step.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg golden-border overflow-hidden">
              <div className="p-6 border-b golden-border">
                <h2 className="font-heading text-xl font-semibold text-foreground">Order Items</h2>
              </div>
              <div className="divide-y divide-border">
                {orderDetails.items.map((item, index) => (
                  <div key={`${item.name}-${index}`} className="p-6 flex items-center justify-between">
                    <div>
                      <p className="font-body font-medium text-foreground">{item.name}</p>
                      <p className="font-caption text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-data text-lg font-semibold text-primary">{formatPrice(item.price)}</p>
                  </div>
                ))}
                <div className="p-6 bg-surface-elevated flex items-center justify-between">
                  <p className="font-heading text-lg font-semibold text-foreground">Total</p>
                  <p className="font-data text-2xl font-bold text-primary">{formatPrice(orderDetails.total)}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
