'use client';

import React, { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface ShippingFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  postalCode: string;
  deliveryNotes: string;
}

interface ShippingFormProps {
  onSubmit: (data: ShippingFormData) => void;
  initialData?: Partial<ShippingFormData>;
}

const ShippingForm = ({ onSubmit, initialData = {} }: ShippingFormProps) => {
  const [formData, setFormData] = useState<ShippingFormData>({
    fullName: initialData.fullName || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    address: initialData.address || '',
    city: initialData.city || '',
    district: initialData.district || '',
    postalCode: initialData.postalCode || '',
    deliveryNotes: initialData.deliveryNotes || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ShippingFormData, string>>>({});
  const [isDistrictOpen, setIsDistrictOpen] = useState(false);
  const districtDropdownRef = useRef<HTMLDivElement>(null);

  const nepalDistricts = [
    'Achham',
    'Arghakhanchi',
    'Baglung',
    'Baitadi',
    'Bajhang',
    'Bajura',
    'Banke',
    'Bara',
    'Bardiya',
    'Bhaktapur',
    'Bhojpur',
    'Chitwan',
    'Dadeldhura',
    'Dailekh',
    'Dang',
    'Darchula',
    'Dhading',
    'Dhankuta',
    'Dhanusha',
    'Dolakha',
    'Dolpa',
    'Doti',
    'Gorkha',
    'Gulmi',
    'Humla',
    'Ilam',
    'Jajarkot',
    'Jhapa',
    'Jumla',
    'Kailali',
    'Kalikot',
    'Kanchanpur',
    'Kapilvastu',
    'Kaski',
    'Kathmandu',
    'Kavrepalanchok',
    'Khotang',
    'Lalitpur',
    'Lamjung',
    'Mahottari',
    'Makwanpur',
    'Manang',
    'Morang',
    'Mugu',
    'Mustang',
    'Myagdi',
    'Nawalpur (East Nawalparasi)',
    'Nuwakot',
    'Okhaldhunga',
    'Palpa',
    'Panchthar',
    'Parasi (West Nawalparasi)',
    'Parbat',
    'Parsa',
    'Pyuthan',
    'Ramechhap',
    'Rasuwa',
    'Rautahat',
    'Rolpa',
    'Rukum East',
    'Rukum West',
    'Rupandehi',
    'Salyan',
    'Sankhuwasabha',
    'Saptari',
    'Sarlahi',
    'Sindhuli',
    'Sindhupalchok',
    'Siraha',
    'Solukhumbu',
    'Sunsari',
    'Surkhet',
    'Syangja',
    'Tanahun',
    'Taplejung',
    'Terhathum',
    'Udayapur',
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ShippingFormData, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.district) {
      newErrors.district = 'District is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (districtDropdownRef.current && !districtDropdownRef.current.contains(event.target as Node)) {
        setIsDistrictOpen(false);
      }
    };

    if (isDistrictOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDistrictOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof ShippingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleDistrictSelect = (district: string) => {
    handleChange('district', district);
    setIsDistrictOpen(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="fullName" className="block font-body text-sm font-medium text-foreground mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="fullName"
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            className={`w-full px-4 py-3 bg-input text-foreground rounded-lg golden-border transition-luxury focus:golden-border-focus focus:outline-none ${
              errors.fullName ? 'border-error' : ''
            }`}
            placeholder="Enter your full name"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-error flex items-center">
              <Icon name="ExclamationCircleIcon" size={16} className="mr-1" />
              {errors.fullName}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block font-body text-sm font-medium text-foreground mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={`w-full px-4 py-3 bg-input text-foreground rounded-lg golden-border transition-luxury focus:golden-border-focus focus:outline-none ${
              errors.email ? 'border-error' : ''
            }`}
            placeholder="your.email@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-error flex items-center">
              <Icon name="ExclamationCircleIcon" size={16} className="mr-1" />
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="block font-body text-sm font-medium text-foreground mb-2">
          Phone Number *
        </label>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          className={`w-full px-4 py-3 bg-input text-foreground rounded-lg golden-border transition-luxury focus:golden-border-focus focus:outline-none ${
            errors.phone ? 'border-error' : ''
          }`}
          placeholder="98XXXXXXXX"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-error flex items-center">
            <Icon name="ExclamationCircleIcon" size={16} className="mr-1" />
            {errors.phone}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="address" className="block font-body text-sm font-medium text-foreground mb-2">
          Street Address *
        </label>
        <input
          type="text"
          id="address"
          value={formData.address}
          onChange={(e) => handleChange('address', e.target.value)}
          className={`w-full px-4 py-3 bg-input text-foreground rounded-lg golden-border transition-luxury focus:golden-border-focus focus:outline-none ${
            errors.address ? 'border-error' : ''
          }`}
          placeholder="House/Building number, Street name"
        />
        {errors.address && (
          <p className="mt-1 text-sm text-error flex items-center">
            <Icon name="ExclamationCircleIcon" size={16} className="mr-1" />
            {errors.address}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="city" className="block font-body text-sm font-medium text-foreground mb-2">
            City *
          </label>
          <input
            type="text"
            id="city"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            className={`w-full px-4 py-3 bg-input text-foreground rounded-lg golden-border transition-luxury focus:golden-border-focus focus:outline-none ${
              errors.city ? 'border-error' : ''
            }`}
            placeholder="Enter city"
          />
          {errors.city && (
            <p className="mt-1 text-sm text-error flex items-center">
              <Icon name="ExclamationCircleIcon" size={16} className="mr-1" />
              {errors.city}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="district" className="block font-body text-sm font-medium text-foreground mb-2">
            District *
          </label>
          <div className="relative" ref={districtDropdownRef}>
            <button
              type="button"
              id="district"
              onClick={() => setIsDistrictOpen((current) => !current)}
              aria-haspopup="listbox"
              aria-expanded={isDistrictOpen}
              className={`w-full px-4 py-3 bg-input rounded-lg golden-border transition-luxury focus:golden-border-focus focus:outline-none flex items-center justify-between ${
                formData.district ? 'text-foreground' : 'text-muted-foreground'
              } ${errors.district ? 'border-error' : ''}`}
            >
              <span>{formData.district || 'Select District'}</span>
              <Icon
                name="ChevronDownIcon"
                size={18}
                className={`transition-luxury ${isDistrictOpen ? 'rotate-180' : 'rotate-0'}`}
              />
            </button>

            {isDistrictOpen && (
              <>
                <div className="fixed inset-0 z-[1050]" onClick={() => setIsDistrictOpen(false)} />
                <div className="absolute z-[1100] mt-2 w-full max-h-64 overflow-y-auto bg-popover rounded-lg golden-border golden-glow">
                  {nepalDistricts.map((district) => (
                    <button
                      type="button"
                      key={district}
                      onClick={() => handleDistrictSelect(district)}
                      className={`w-full text-left px-4 py-2.5 font-body transition-luxury hover:bg-muted ${
                        formData.district === district ? 'bg-muted text-primary' : 'text-foreground'
                      }`}
                    >
                      {district}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          {errors.district && (
            <p className="mt-1 text-sm text-error flex items-center">
              <Icon name="ExclamationCircleIcon" size={16} className="mr-1" />
              {errors.district}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="postalCode" className="block font-body text-sm font-medium text-foreground mb-2">
            Postal Code
          </label>
          <input
            type="text"
            id="postalCode"
            value={formData.postalCode}
            onChange={(e) => handleChange('postalCode', e.target.value)}
            className="w-full px-4 py-3 bg-input text-foreground rounded-lg golden-border transition-luxury focus:golden-border-focus focus:outline-none"
            placeholder="44600"
          />
        </div>
      </div>

      <div>
        <label htmlFor="deliveryNotes" className="block font-body text-sm font-medium text-foreground mb-2">
          Delivery Notes (Optional)
        </label>
        <textarea
          id="deliveryNotes"
          value={formData.deliveryNotes}
          onChange={(e) => handleChange('deliveryNotes', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 bg-input text-foreground rounded-lg golden-border transition-luxury focus:golden-border-focus focus:outline-none resize-none"
          placeholder="Any special instructions for delivery..."
        />
      </div>

      <button
        type="submit"
        className="w-full py-4 px-6 bg-primary text-primary-foreground font-body font-medium rounded-lg transition-luxury hover:scale-105 golden-glow flex items-center justify-center"
      >
        Continue to Payment
        <Icon name="ArrowRightIcon" size={20} className="ml-2" />
      </button>
    </form>
  );
};

export default ShippingForm;