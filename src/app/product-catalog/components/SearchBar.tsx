'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
}

const SearchBar = ({
  value,
  onChange,
  onSearch,
  placeholder = 'Search for products, brands...',
}: SearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div
        className={`flex items-center gap-3 px-4 py-3 bg-card rounded-lg golden-border transition-luxury ${
          isFocused ? 'golden-border-focus golden-glow-sm' : ''
        }`}
      >
        <Icon name="MagnifyingGlassIcon" size={20} className="text-muted-foreground" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-foreground font-body placeholder:text-muted-foreground focus:outline-none"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 transition-luxury hover:text-primary"
            aria-label="Clear search"
          >
            <Icon name="XMarkIcon" size={20} />
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-body font-medium transition-luxury hover:scale-105 golden-glow-sm"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;