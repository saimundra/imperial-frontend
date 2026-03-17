'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import {
  calculateShippingCost,
  FREE_SHIPPING_THRESHOLD,
  OTHER_DISTRICT_SHIPPING_COST,
} from '@/lib/shipping';

interface ShippingOption {
  id: string;
  name: string;
  duration: string;
  cost: number;
}

interface ShippingCalculatorProps {
  productPrice: number;
}

const ShippingCalculator = ({ productPrice }: ShippingCalculatorProps) => {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  const nepalRegions = [
    { id: 'pokhara', name: 'Pokhara Valley (Pokhara/Kaski)' },
    { id: 'other', name: 'Other Districts' },
  ];

  const calculateShipping = (region: string) => {
    setIsCalculating(true);

    setTimeout(() => {
      const isPokharaRegion = region === 'pokhara';
      const standardShippingCost = calculateShippingCost(
        productPrice,
        isPokharaRegion ? 'kaski' : 'other',
      );

      const options: ShippingOption[] = [
        {
          id: 'standard',
          name: isPokharaRegion ? 'Pokhara Valley Delivery' : 'Other District Delivery',
          duration: isPokharaRegion ? '2-3 business days' : '3-5 business days',
          cost: standardShippingCost ?? OTHER_DISTRICT_SHIPPING_COST,
        },
      ];

      setShippingOptions(options);
      setIsCalculating(false);
    }, 800);
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const region = e.target.value;
    setSelectedRegion(region);
    if (region) {
      calculateShipping(region);
    } else {
      setShippingOptions([]);
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-4 p-6 bg-surface-elevated rounded-lg golden-border">
      <div className="flex items-center space-x-2">
        <Icon name="TruckIcon" size={24} className="text-primary" />
        <h3 className="font-heading text-xl font-semibold text-foreground">
          Shipping Calculator
        </h3>
      </div>

      <div className="space-y-3">
        <label className="font-body font-medium text-foreground block">
          Select Your Region
        </label>
        <select
          value={selectedRegion}
          onChange={handleRegionChange}
          className="w-full px-4 py-3 bg-card golden-border rounded-lg font-body text-foreground transition-luxury focus:golden-border-focus focus:outline-none"
        >
          <option value="">Choose a region...</option>
          {nepalRegions.map((region) => (
            <option key={region.id} value={region.id}>
              {region.name}
            </option>
          ))}
        </select>
      </div>

      {isCalculating && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        </div>
      )}

      {!isCalculating && shippingOptions.length > 0 && (
        <div className="space-y-3">
          <p className="font-caption text-sm text-muted-foreground">
            Available shipping options for {nepalRegions.find((r) => r.id === selectedRegion)?.name}
          </p>
          {shippingOptions.map((option) => (
            <div
              key={option.id}
              className="p-4 bg-card rounded-lg golden-border flex items-center justify-between"
            >
              <div className="space-y-1">
                <p className="font-body font-medium text-foreground">{option.name}</p>
                <p className="font-caption text-sm text-muted-foreground">{option.duration}</p>
              </div>
              <p className="font-data text-lg font-semibold text-primary">
                {option.cost === 0 ? 'FREE' : formatPrice(option.cost)}
              </p>
            </div>
          ))}

          {selectedRegion === 'pokhara' && productPrice < FREE_SHIPPING_THRESHOLD && (
            <div className="flex items-start space-x-2 p-3 bg-primary/10 rounded-lg">
              <Icon name="InformationCircleIcon" size={20} className="text-primary flex-shrink-0 mt-0.5" />
              <p className="font-caption text-sm text-foreground">
                Add {formatPrice(FREE_SHIPPING_THRESHOLD - productPrice)} more to get free shipping in Pokhara Valley.
              </p>
            </div>
          )}

          {selectedRegion === 'other' && (
            <div className="flex items-start space-x-2 p-3 bg-primary/10 rounded-lg">
              <Icon name="InformationCircleIcon" size={20} className="text-primary flex-shrink-0 mt-0.5" />
              <p className="font-caption text-sm text-foreground">
                Other districts use a flat shipping charge of {formatPrice(OTHER_DISTRICT_SHIPPING_COST)}.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShippingCalculator;