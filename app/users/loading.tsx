'use client';

import { PageSkeleton } from '@/components/loading';

export default function UsersLoading() {
  return <PageSkeleton type="table" showTitle showFilters />;
}
