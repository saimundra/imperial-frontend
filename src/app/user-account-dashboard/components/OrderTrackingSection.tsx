import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface TrackingStep {
  label: string;
  date: string;
  completed: boolean;
  active: boolean;
}

interface ActiveOrder {
  orderId: string;
  estimatedDelivery: string;
  trackingSteps: TrackingStep[];
}

interface OrderTrackingSectionProps {
  activeOrders: ActiveOrder[];
}

export default function OrderTrackingSection({ activeOrders }: OrderTrackingSectionProps) {
  return (
    <div className="bg-card rounded-lg golden-border overflow-hidden">
      <div className="p-6 border-b golden-border">
        <h2 className="font-heading text-xl font-semibold text-foreground">Active Orders</h2>
      </div>
      
      {activeOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <Icon name="TruckIcon" size={48} className="text-muted-foreground mb-4" />
          <p className="font-body text-muted-foreground text-center">No active orders</p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {activeOrders.map((order) => (
            <div key={order.orderId} className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-body font-medium text-foreground mb-1">Order {order.orderId}</h3>
                  <p className="font-caption text-sm text-muted-foreground">
                    Estimated delivery: {order.estimatedDelivery}
                  </p>
                </div>
                <Link
                  href={`/order-tracking?order=${encodeURIComponent(order.orderId)}#track-order-section`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-surface-elevated rounded-lg golden-border transition-luxury hover:golden-glow text-left sm:text-center"
                >
                  <Icon name="MapPinIcon" size={20} className="text-primary" />
                  <span className="font-body text-sm text-foreground">Track Package</span>
                </Link>
              </div>
              
              <div className="relative">
                {order.trackingSteps.map((step, index) => (
                  <div key={index} className="flex gap-4 pb-8 last:pb-0">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-luxury ${
                          step.completed
                            ? 'bg-primary golden-glow-sm'
                            : step.active
                            ? 'bg-primary/20 golden-border' :'bg-muted golden-border'
                        }`}
                      >
                        {step.completed ? (
                          <Icon name="CheckIcon" size={20} className="text-primary-foreground" />
                        ) : (
                          <div className={`w-3 h-3 rounded-full ${step.active ? 'bg-primary' : 'bg-muted-foreground'}`} />
                        )}
                      </div>
                      {index < order.trackingSteps.length - 1 && (
                        <div
                          className={`w-0.5 flex-1 mt-2 ${
                            step.completed ? 'bg-primary' : 'bg-border'
                          }`}
                          style={{ minHeight: '40px' }}
                        />
                      )}
                    </div>
                    <div className="flex-1 pt-2">
                      <p
                        className={`font-body font-medium mb-1 ${
                          step.completed || step.active ? 'text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        {step.label}
                      </p>
                      <p className="font-caption text-sm text-muted-foreground">{step.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}