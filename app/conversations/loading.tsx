'use client';

import { ConversationListSkeleton } from '@/components/loading';

export default function ConversationsLoading() {
  return (
    <div className="p-6">
      <ConversationListSkeleton />
    </div>
  );
}
