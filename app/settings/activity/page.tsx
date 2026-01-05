'use client';

import React from 'react';
import { ActivityLogList } from '@/components/settings/activity';
import { SettingsLayout } from '@/components/settings/SettingsLayout';

export default function ActivityLogPage() {
  return (
    <SettingsLayout activeTab="activity">
      <div className="space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-1">Activity Log</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Track all changes and actions performed in the system
          </p>
        </div>
        <ActivityLogList />
      </div>
    </SettingsLayout>
  );
}
