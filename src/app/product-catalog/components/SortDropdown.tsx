'use client';

import React, { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface SortOption {
  value: string;
  label: string;
}

interface SortDropdownProps {
  options: SortOption[];
  value: string;
  onChange: (value: string) => void;
}

const SortDropdown = ({ options, value, onChange }: SortDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3 bg-card text-foreground rounded-lg golden-border transition-luxury hover:golden-border-hover focus:golden-border-focus focus:outline-none min-w-[200px]"
      >
        <Icon name="AdjustmentsHorizontalIcon" size={20} />
        <span className="font-body flex-1 text-left">{selectedOption?.label}</span>
        <Icon
          name="ChevronDownIcon"
          size={20}
          className={`transition-luxury ${isOpen ? 'rotate-180' : 'rotate-0'}`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[1050]"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-full bg-popover rounded-lg golden-border golden-glow z-[1100] overflow-hidden">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full text-left px-4 py-3 font-body transition-luxury hover:bg-muted ${
                  value === option.value ? 'bg-muted text-primary' : 'text-foreground'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SortDropdown;