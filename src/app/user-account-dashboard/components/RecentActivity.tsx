import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface Activity {
  id: string;
  type: 'order' | 'wishlist' | 'promotion';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

const activityConfig = {
  order: { color: 'text-primary', bg: 'bg-primary/10' },
  wishlist: { color: 'text-error', bg: 'bg-error/10' },
  promotion: { color: 'text-success', bg: 'bg-success/10' },
};

export default function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="bg-card rounded-lg golden-border overflow-hidden">
      <div className="p-6 border-b golden-border">
        <h2 className="font-heading text-xl font-semibold text-foreground">Recent Activity</h2>
      </div>
      
      {activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <Icon name="ClockIcon" size={48} className="text-muted-foreground mb-4" />
          <p className="font-body text-muted-foreground text-center">No recent activity</p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {activities.map((activity) => {
            const config = activityConfig[activity.type];
            return (
              <div key={activity.id} className="p-4 transition-luxury hover:bg-muted">
                <div className="flex gap-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full ${config.bg} flex items-center justify-center`}>
                    <Icon name={activity.icon as any} size={20} className={config.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-body font-medium text-foreground mb-1">{activity.title}</h3>
                    <p className="font-caption text-sm text-muted-foreground mb-2">{activity.description}</p>
                    <p className="font-caption text-xs text-muted-foreground">{activity.timestamp}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}