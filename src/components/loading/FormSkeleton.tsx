'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface FormSkeletonProps {
  fields?: number;
  showTitle?: boolean;
  showButtons?: boolean;
}

export function FormSkeleton({
  fields = 4,
  showTitle = true,
  showButtons = true,
}: FormSkeletonProps) {
  return (
    <Card>
      {showTitle && (
        <CardHeader>
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
      )}
      <CardContent className="space-y-6">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
        {showButtons && (
          <div className="flex gap-2 pt-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-20" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function InputSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

export function TextareaSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
}
