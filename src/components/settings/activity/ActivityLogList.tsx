'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ActivityLog,
  ActivityLogFilters,
  activityLogService,
  EntityTypeLabels,
  ActionTypeLabels,
  EntityTypes,
  ActionTypes,
} from '@/services/activity-log.service';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  Eye,
  RefreshCw,
} from 'lucide-react';

const PAGE_SIZE = 20;

export function ActivityLogList() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<ActivityLogFilters>({
    limit: PAGE_SIZE,
    offset: 0,
  });
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await activityLogService.getActivityLogs({
        ...filters,
        offset: (page - 1) * PAGE_SIZE,
      });
      setLogs(response.data || []);
      setTotal(response.meta?.total || 0);
    } catch (error) {
      console.error('Failed to fetch activity logs:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleFilterChange = (key: keyof ActivityLogFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === 'all' ? undefined : value,
    }));
    setPage(1);
  };

  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case ActionTypes.CREATE:
        return 'default';
      case ActionTypes.UPDATE:
        return 'secondary';
      case ActionTypes.DELETE:
        return 'destructive';
      case ActionTypes.STATUS_CHANGE:
        return 'outline';
      case ActionTypes.ASSIGN:
      case ActionTypes.UNASSIGN:
        return 'secondary';
      case ActionTypes.LOGIN:
      case ActionTypes.LOGOUT:
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Activity Log
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchLogs}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex gap-4 mb-4">
          <Select
            value={filters.entity_type || 'all'}
            onValueChange={(value) => handleFilterChange('entity_type', value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Entity Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Entities</SelectItem>
              {Object.entries(EntityTypes).map(([key, value]) => (
                <SelectItem key={key} value={value}>
                  {EntityTypeLabels[value] || value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.action || 'all'}
            onValueChange={(value) => handleFilterChange('action', value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              {Object.entries(ActionTypes).map(([key, value]) => (
                <SelectItem key={key} value={value}>
                  {ActionTypeLabels[value] || value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-48" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-8" />
                    </TableCell>
                  </TableRow>
                ))
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No activity logs found
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={log.user?.avatar} />
                          <AvatarFallback>
                            {log.user?.name?.charAt(0) || 'S'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {log.user?.name || 'System'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getActionBadgeVariant(log.action)}>
                        {ActionTypeLabels[log.action] || log.action}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {EntityTypeLabels[log.entity_type] || log.entity_type}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ID: {log.entity_id}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <ActivityLogDetails log={log} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(log.created_at), {
                        addSuffix: true,
                      })}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedLog(log)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-muted-foreground">
            Showing {logs.length} of {total} entries
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {page} of {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>

      {/* Details Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Activity Log Details</DialogTitle>
          </DialogHeader>
          {selectedLog && <ActivityLogDetailsDialog log={selectedLog} />}
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function ActivityLogDetails({ log }: { log: ActivityLog }) {
  if (log.action === ActionTypes.STATUS_CHANGE) {
    const oldStatus = log.old_values?.status as string;
    const newStatus = log.new_values?.status as string;
    return (
      <span className="text-sm">
        Changed status from <Badge variant="outline">{oldStatus}</Badge> to{' '}
        <Badge variant="outline">{newStatus}</Badge>
      </span>
    );
  }

  if (log.action === ActionTypes.UPDATE && log.new_values) {
    const changedFields = Object.keys(log.new_values);
    return (
      <span className="text-sm text-muted-foreground">
        Updated: {changedFields.slice(0, 3).join(', ')}
        {changedFields.length > 3 && ` +${changedFields.length - 3} more`}
      </span>
    );
  }

  if (log.action === ActionTypes.ASSIGN && log.metadata) {
    return (
      <span className="text-sm text-muted-foreground">
        {log.metadata.assigned_user_id
          ? `Assigned to user`
          : log.metadata.assigned_department_id
          ? `Assigned to department`
          : 'Assignment updated'}
      </span>
    );
  }

  return (
    <span className="text-sm text-muted-foreground">
      {log.action} {log.entity_type}
    </span>
  );
}

function ActivityLogDetailsDialog({ log }: { log: ActivityLog }) {
  return (
    <ScrollArea className="max-h-[60vh]">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm font-medium text-muted-foreground">Entity Type</span>
            <p className="text-sm">{EntityTypeLabels[log.entity_type] || log.entity_type}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-muted-foreground">Entity ID</span>
            <p className="text-sm font-mono">{log.entity_id}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-muted-foreground">Action</span>
            <p className="text-sm">{ActionTypeLabels[log.action] || log.action}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-muted-foreground">User</span>
            <p className="text-sm">{log.user?.name || 'System'}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-muted-foreground">Timestamp</span>
            <p className="text-sm">{new Date(log.created_at).toLocaleString()}</p>
          </div>
          {log.ip_address && (
            <div>
              <span className="text-sm font-medium text-muted-foreground">IP Address</span>
              <p className="text-sm font-mono">{log.ip_address}</p>
            </div>
          )}
        </div>

        {log.old_values && Object.keys(log.old_values).length > 0 && (
          <div>
            <span className="text-sm font-medium text-muted-foreground">Previous Values</span>
            <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-auto">
              {JSON.stringify(log.old_values, null, 2)}
            </pre>
          </div>
        )}

        {log.new_values && Object.keys(log.new_values).length > 0 && (
          <div>
            <span className="text-sm font-medium text-muted-foreground">New Values</span>
            <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-auto">
              {JSON.stringify(log.new_values, null, 2)}
            </pre>
          </div>
        )}

        {log.metadata && Object.keys(log.metadata).length > 0 && (
          <div>
            <span className="text-sm font-medium text-muted-foreground">Metadata</span>
            <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-auto">
              {JSON.stringify(log.metadata, null, 2)}
            </pre>
          </div>
        )}

        {log.user_agent && (
          <div>
            <span className="text-sm font-medium text-muted-foreground">User Agent</span>
            <p className="text-xs text-muted-foreground break-all">{log.user_agent}</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

export default ActivityLogList;
