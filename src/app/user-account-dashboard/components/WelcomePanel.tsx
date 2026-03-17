import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface WelcomePanelProps {
  userName: string;
  email: string;
  memberSince: string;
  loyaltyPoints: number;
}

export default function WelcomePanel({ userName, email, memberSince, loyaltyPoints }: WelcomePanelProps) {
  return (
    <div className="bg-card rounded-lg golden-border p-6 lg:p-8 golden-glow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center golden-glow">
            <Icon name="UserCircleIcon" size={40} className="text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-heading text-2xl lg:text-3xl font-semibold text-foreground mb-2">
              Welcome back, {userName}
            </h1>
            <p className="font-body text-muted-foreground mb-1">{email}</p>
            <p className="font-caption text-sm text-muted-foreground">
              Member since {memberSince}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="bg-surface-elevated rounded-lg p-4 golden-border text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Icon name="SparklesIcon" size={20} className="text-primary" />
              <span className="font-data text-2xl font-semibold text-primary">{loyaltyPoints}</span>
            </div>
            <p className="font-caption text-xs text-muted-foreground">Loyalty Points</p>
          </div>
          
          <div className="bg-surface-elevated rounded-lg p-4 golden-border text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Icon name="ShieldCheckIcon" size={20} className="text-success" />
              <span className="font-body text-sm font-medium text-success">Verified</span>
            </div>
            <p className="font-caption text-xs text-muted-foreground">Account Status</p>
          </div>
        </div>
      </div>
    </div>
  );
}