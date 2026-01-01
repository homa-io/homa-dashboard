'use client';

import React from 'react';
import { ActivityLogList } from '@/components/settings/activity';

export default function ActivityLogPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Activity Log</h1>
        <p className="text-muted-foreground">
          Track all changes and actions performed in the system
        </p>
      </div>
      <ActivityLogList />
    </div>
  );
}
