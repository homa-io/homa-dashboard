'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  RefreshCw,
  Play,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  History,
  AlertCircle
} from 'lucide-react';
import { jobsService, Job, JobExecution } from '@/services/jobs.service';
import { formatDistanceToNow, format } from 'date-fns';

export function JobsSettings() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [runningJob, setRunningJob] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [executions, setExecutions] = useState<JobExecution[]>([]);
  const [executionsLoading, setExecutionsLoading] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await jobsService.getJobs();
      setJobs(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleRunJob = async (jobName: string) => {
    try {
      setRunningJob(jobName);
      await jobsService.runJob(jobName);
      // Refresh jobs after a short delay to show updated status
      setTimeout(fetchJobs, 1000);
    } catch (err: any) {
      alert(err.message || 'Failed to run job');
    } finally {
      setRunningJob(null);
    }
  };

  const handleViewHistory = async (jobName: string) => {
    setSelectedJob(jobName);
    setIsHistoryOpen(true);
    setExecutionsLoading(true);
    try {
      const data = await jobsService.getExecutions(jobName, 50);
      setExecutions(data);
    } catch (err: any) {
      console.error('Failed to load executions:', err);
      setExecutions([]);
    } finally {
      setExecutionsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'running':
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            Running
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatSchedule = (schedule: string): string => {
    // Parse common cron patterns for human-readable display
    const parts = schedule.split(' ');
    if (parts.length !== 6) return schedule;

    const [sec, min, hour, dayOfMonth, month, dayOfWeek] = parts;

    // Every X minutes
    if (sec === '0' && min.startsWith('*/') && hour === '*') {
      const interval = min.replace('*/', '');
      return `Every ${interval} minutes`;
    }

    // Daily at specific time
    if (sec === '0' && min === '0' && hour !== '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
      return `Daily at ${hour}:00`;
    }

    // Hourly
    if (sec === '0' && min === '0' && hour === '*') {
      return 'Every hour';
    }

    // Weekly
    if (sec === '0' && min === '0' && hour !== '*' && dayOfWeek !== '*') {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const day = days[parseInt(dayOfWeek)] || dayOfWeek;
      return `${day}s at ${hour}:00`;
    }

    return schedule;
  };

  const formatDuration = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-1 sm:mb-2">Background Jobs</h2>
        <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
          Monitor and manage scheduled background tasks.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-base sm:text-lg">Scheduled Jobs</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              View job status and execution history
            </CardDescription>
          </div>
          <Button
            variant="outline"
            onClick={fetchJobs}
            disabled={loading}
            className="w-full sm:w-auto text-xs sm:text-sm h-9 sm:h-10"
          >
            <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="text-center py-8 text-red-500">
              <AlertCircle className="w-8 h-8 mx-auto mb-2" />
              <p>{error}</p>
              <Button variant="outline" onClick={fetchJobs} className="mt-4">
                Retry
              </Button>
            </div>
          )}

          {!error && loading && (
            <div className="text-center py-8 text-muted-foreground">
              <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin" />
              <p>Loading jobs...</p>
            </div>
          )}

          {!error && !loading && jobs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="w-8 h-8 mx-auto mb-2" />
              <p>No scheduled jobs found.</p>
            </div>
          )}

          {!error && !loading && jobs.length > 0 && (
            <>
              {/* Mobile Card View */}
              <div className="block sm:hidden space-y-3">
                {jobs.map((job) => (
                  <div key={job.name} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{job.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{job.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{formatSchedule(job.schedule)}</span>
                    </div>
                    {job.last_execution && (
                      <div className="flex items-center gap-2">
                        {getStatusBadge(job.last_execution.status)}
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(job.last_execution.started_at), { addSuffix: true })}
                        </span>
                      </div>
                    )}
                    {!job.last_execution && (
                      <span className="text-xs text-muted-foreground">Never run</span>
                    )}
                    <div className="flex items-center gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewHistory(job.name)}
                        className="flex-1 h-8 text-xs"
                      >
                        <History className="w-3 h-3 mr-1" />
                        History
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRunJob(job.name)}
                        disabled={runningJob === job.name}
                        className="flex-1 h-8 text-xs"
                      >
                        {runningJob === job.name ? (
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        ) : (
                          <Play className="w-3 h-3 mr-1" />
                        )}
                        Run Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto -mx-3 sm:-mx-6 px-3 sm:px-6">
                <Table className="min-w-[700px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm">Job Name</TableHead>
                      <TableHead className="text-xs sm:text-sm">Schedule</TableHead>
                      <TableHead className="text-xs sm:text-sm">Last Run</TableHead>
                      <TableHead className="text-xs sm:text-sm">Status</TableHead>
                      <TableHead className="text-xs sm:text-sm">Duration</TableHead>
                      <TableHead className="w-[150px] text-xs sm:text-sm">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jobs.map((job) => (
                      <TableRow key={job.name}>
                        <TableCell>
                          <div>
                            <div className="font-medium text-sm">{job.name}</div>
                            <div className="text-xs text-muted-foreground">{job.description}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            {formatSchedule(job.schedule)}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          {job.last_execution ? (
                            <span title={format(new Date(job.last_execution.started_at), 'PPpp')}>
                              {formatDistanceToNow(new Date(job.last_execution.started_at), { addSuffix: true })}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">Never</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {job.last_execution ? (
                            getStatusBadge(job.last_execution.status)
                          ) : (
                            <Badge variant="outline">-</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          {job.last_execution ? (
                            formatDuration(job.last_execution.duration_ms)
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewHistory(job.name)}
                              className="h-8 w-8 p-0"
                              title="View History"
                            >
                              <History className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRunJob(job.name)}
                              disabled={runningJob === job.name}
                              className="h-8 w-8 p-0"
                              title="Run Now"
                            >
                              {runningJob === job.name ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Play className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Execution History Dialog */}
      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent className="w-[95vw] sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">
              Execution History: {selectedJob}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Recent executions for this job
            </DialogDescription>
          </DialogHeader>

          {executionsLoading && (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 mx-auto animate-spin text-muted-foreground" />
            </div>
          )}

          {!executionsLoading && executions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="w-8 h-8 mx-auto mb-2" />
              <p>No execution history found.</p>
            </div>
          )}

          {!executionsLoading && executions.length > 0 && (
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {executions.map((exec) => (
                <div
                  key={exec.id}
                  className={`border rounded-lg p-3 ${
                    exec.status === 'failed' ? 'border-red-200 bg-red-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(exec.status)}
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(exec.started_at), 'PPpp')}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDuration(exec.duration_ms)}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Instance: {exec.instance_id}</span>
                    {exec.records_processed > 0 && (
                      <span>Processed: {exec.records_processed}</span>
                    )}
                  </div>
                  {exec.error && (
                    <div className="mt-2 p-2 bg-red-100 rounded text-xs text-red-700 font-mono">
                      {exec.error}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
