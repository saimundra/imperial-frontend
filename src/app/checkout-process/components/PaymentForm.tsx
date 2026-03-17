'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';


interface PaymentFormData {
  paymentMethod: string;
  esewaId?: string;
  khaltiNumber?: string;
}

interface PaymentFormProps {
  onSubmit: (data: PaymentFormData) => void;
  onBack: () => void;
}

const PaymentForm = ({ onSubmit, onBack }: PaymentFormProps) => {
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [formData, setFormData] = useState<PaymentFormData>({
    paymentMethod: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof PaymentFormData, string>>>({});

  const paymentMethods = [
    {
      id: 'esewa',
      name: 'eSewa',
      icon: 'DevicePhoneMobileIcon',
      description: 'Pay with your eSewa wallet',
    },
    {
      id: 'khalti',
      name: 'Khalti',
      icon: 'DevicePhoneMobileIcon',
      description: 'Pay with your Khalti wallet',
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: 'BanknotesIcon',
      description: 'Pay when you receive',
    },
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PaymentFormData, string>> = {};

    if (!paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
      setErrors(newErrors);
      return false;
    }

    if (paymentMethod === 'esewa') {
      if (!formData.esewaId?.trim()) {
        newErrors.esewaId = 'eSewa ID is required';
      }
    } else if (paymentMethod === 'khalti') {
      if (!formData.khaltiNumber || formData.khaltiNumber.length !== 10) {
        newErrors.khaltiNumber = 'Please enter a valid 10-digit Khalti number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ ...formData, paymentMethod });
    }
  };

  const handleChange = (field: keyof PaymentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-heading text-xl font-semibold text-foreground mb-4">
          Select Payment Method
        </h3>
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            type="button"
            onClick={() => {
              setPaymentMethod(method.id);
              setErrors({});
            }}
            className={`w-full p-4 rounded-lg golden-border transition-luxury text-left ${
              paymentMethod === method.id
                ? 'bg-muted golden-border-hover' : 'bg-card hover:bg-muted'
            } focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 active:outline-none active:ring-0 appearance-none`}
            style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    paymentMethod === method.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}
                >
                  <Icon name={method.icon as any} size={24} />
                </div>
                <div>
                  <p className="font-body font-medium text-foreground">{method.name}</p>
                  <p className="font-caption text-sm text-muted-foreground">{method.description}</p>
                </div>
              </div>
              {paymentMethod === method.id && (
                <Icon name="CheckCircleIcon" size={24} className="text-primary" />
              )}
            </div>
          </button>
        ))}
        {errors.paymentMethod && (
          <p className="text-sm text-error flex items-center">
            <Icon name="ExclamationCircleIcon" size={16} className="mr-1" />
            {errors.paymentMethod}
          </p>
        )}
      </div>

      {paymentMethod === 'esewa' && (
        <div className="space-y-4 p-6 bg-surface-elevated rounded-lg golden-border">
          <h4 className="font-heading text-lg font-semibold text-foreground">eSewa Payment</h4>
          <div>
            <label htmlFor="esewaId" className="block font-body text-sm font-medium text-foreground mb-2">
              eSewa ID *
            </label>
            <input
              type="text"
              id="esewaId"
              value={formData.esewaId || ''}
              onChange={(e) => handleChange('esewaId', e.target.value)}
              className={`w-full px-4 py-3 bg-input text-foreground rounded-lg golden-border transition-luxury focus:golden-border-focus focus:outline-none ${
                errors.esewaId ? 'border-error' : ''
              }`}
              placeholder="Enter your eSewa ID"
            />
            {errors.esewaId && (
              <p className="mt-1 text-sm text-error flex items-center">
                <Icon name="ExclamationCircleIcon" size={16} className="mr-1" />
                {errors.esewaId}
              </p>
            )}
          </div>
        </div>
      )}

      {paymentMethod === 'khalti' && (
        <div className="space-y-4 p-6 bg-surface-elevated rounded-lg golden-border">
          <h4 className="font-heading text-lg font-semibold text-foreground">Khalti Payment</h4>
          <div>
            <label htmlFor="khaltiNumber" className="block font-body text-sm font-medium text-foreground mb-2">
              Khalti Number *
            </label>
            <input
              type="tel"
              id="khaltiNumber"
              value={formData.khaltiNumber || ''}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 10) {
                  handleChange('khaltiNumber', value);
                }
              }}
              className={`w-full px-4 py-3 bg-input text-foreground rounded-lg golden-border transition-luxury focus:golden-border-focus focus:outline-none ${
                errors.khaltiNumber ? 'border-error' : ''
              }`}
              placeholder="98XXXXXXXX"
              maxLength={10}
            />
            {errors.khaltiNumber && (
              <p className="mt-1 text-sm text-error flex items-center">
                <Icon name="ExclamationCircleIcon" size={16} className="mr-1" />
                {errors.khaltiNumber}
              </p>
            )}
          </div>
        </div>
      )}

      {paymentMethod === 'cod' && (
        <div className="p-6 bg-surface-elevated rounded-lg golden-border">
          <div className="flex items-start space-x-4">
            <Icon name="InformationCircleIcon" size={24} className="text-primary flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-heading text-lg font-semibold text-foreground mb-2">
                Cash on Delivery
              </h4>
              <p className="font-body text-muted-foreground">
                Pay with cash when your order is delivered. Please keep the exact amount ready for a smooth transaction.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-4 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-4 px-6 bg-muted text-foreground font-body font-medium rounded-lg transition-luxury hover:bg-surface-elevated focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 active:outline-none active:ring-0 flex items-center justify-center"
          style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
        >
          <Icon name="ArrowLeftIcon" size={20} className="mr-2" />
          Back to Shipping
        </button>
        <button
          type="submit"
          className="flex-1 py-4 px-6 bg-primary text-primary-foreground font-body font-medium rounded-lg transition-luxury hover:scale-105 golden-glow focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 active:outline-none active:ring-0 flex items-center justify-center"
          style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
        >
          Review Order
          <Icon name="ArrowRightIcon" size={20} className="ml-2" />
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;