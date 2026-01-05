import { apiClient } from './api-client';

export interface JobExecution {
  id: string;
  job_name: string;
  instance_id: string;
  status: 'running' | 'completed' | 'failed';
  started_at: string;
  completed_at?: string;
  duration_ms: number;
  records_processed: number;
  error?: string;
  metadata?: string;
}

export interface Job {
  name: string;
  description: string;
  schedule: string;
  enabled: boolean;
  last_execution?: JobExecution;
}

export interface JobsResponse {
  success: boolean;
  data: Job[];
}

export interface ExecutionsResponse {
  success: boolean;
  data: JobExecution[];
}

export const jobsService = {
  async getJobs(): Promise<Job[]> {
    const response = await apiClient.get<JobsResponse>('/api/admin/jobs');
    return response.data?.data || [];
  },

  async getExecutions(jobName?: string, limit: number = 20): Promise<JobExecution[]> {
    const params = new URLSearchParams();
    if (jobName) params.append('job_name', jobName);
    params.append('limit', limit.toString());

    const response = await apiClient.get<ExecutionsResponse>(`/api/admin/jobs/executions?${params}`);
    return response.data?.data || [];
  },

  async runJob(jobName: string): Promise<void> {
    await apiClient.post(`/api/admin/jobs/${jobName}/run`);
  }
};
