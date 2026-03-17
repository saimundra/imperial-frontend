'use client';

import React, { useState, useEffect } from 'react';


interface PreferenceToggle {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

interface AccountPreferencesProps {
  preferences: PreferenceToggle[];
  onTogglePreference: (id: string) => void;
}

export default function AccountPreferences({ preferences, onTogglePreference }: AccountPreferencesProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="bg-card rounded-lg golden-border overflow-hidden">
        <div className="p-6 border-b golden-border">
          <h2 className="font-heading text-xl font-semibold text-foreground">Account Preferences</h2>
        </div>
        <div className="p-6 space-y-6">
          {preferences.map((pref) => (
            <div key={pref.id} className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-body font-medium text-foreground mb-1">{pref.label}</h3>
                <p className="font-caption text-sm text-muted-foreground">{pref.description}</p>
              </div>
              <div className="w-12 h-6 rounded-full bg-muted" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg golden-border overflow-hidden">
      <div className="p-6 border-b golden-border">
        <h2 className="font-heading text-xl font-semibold text-foreground">Account Preferences</h2>
      </div>
      <div className="p-6 space-y-6">
        {preferences.map((pref) => (
          <div key={pref.id} className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-body font-medium text-foreground mb-1">{pref.label}</h3>
              <p className="font-caption text-sm text-muted-foreground">{pref.description}</p>
            </div>
            <button
              onClick={() => onTogglePreference(pref.id)}
              className={`relative w-12 h-6 rounded-full transition-luxury ${
                pref.enabled ? 'bg-primary golden-glow-sm' : 'bg-muted'
              }`}
              aria-label={`Toggle ${pref.label}`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-luxury ${
                  pref.enabled ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}