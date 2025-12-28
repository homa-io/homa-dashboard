/**
 * Webhook Service
 * Handles CRUD operations for webhooks and webhook deliveries (logs)
 */

import { apiClient } from './api-client'
import type {
  Webhook,
  WebhookCreateRequest,
  WebhookUpdateRequest,
  WebhookDelivery,
  WebhookDeliveryListParams,
  WebhookDeliveryListResponse,
  WebhookListResponse,
} from '@/types/webhook.types'

// Use the admin webhooks path to match the backend routes
const BASE_PATH = '/api/admin/webhooks'
const DELIVERY_PATH = '/api/admin/webhook_deliveries'

/**
 * Get all webhooks
 */
export async function getWebhooks(): Promise<WebhookListResponse> {
  const response = await apiClient.get<Webhook[]>(BASE_PATH)
  return {
    data: response.data || [],
    total: response.data?.length || 0,
  }
}

/**
 * Get a single webhook by ID
 */
export async function getWebhook(id: number): Promise<Webhook> {
  const response = await apiClient.get<Webhook>(`${BASE_PATH}/${id}`)
  return response.data
}

/**
 * Create a new webhook
 */
export async function createWebhook(data: WebhookCreateRequest): Promise<Webhook> {
  const response = await apiClient.post<Webhook>(BASE_PATH, data)
  return response.data
}

/**
 * Update an existing webhook
 */
export async function updateWebhook(id: number, data: WebhookUpdateRequest): Promise<Webhook> {
  const response = await apiClient.put<Webhook>(`${BASE_PATH}/${id}`, data)
  return response.data
}

/**
 * Delete a webhook
 */
export async function deleteWebhook(id: number): Promise<void> {
  await apiClient.delete(`${BASE_PATH}/${id}`)
}

/**
 * Test a webhook by sending a test event
 * @param id - Webhook ID
 * @param eventType - Optional event type to test (defaults to webhook.test)
 */
export async function testWebhook(id: number, eventType?: string): Promise<{ success: boolean; message: string; event?: string }> {
  const url = eventType
    ? `${BASE_PATH}/${id}/test?event=${encodeURIComponent(eventType)}`
    : `${BASE_PATH}/${id}/test`

  const response = await apiClient.post<{ success: boolean; message: string; event?: string }>(url)
  return {
    success: response.data.success ?? true,
    message: response.data.message || 'Test webhook sent successfully',
    event: response.data.event,
  }
}

/**
 * Get webhook deliveries (logs)
 */
export async function getWebhookDeliveries(params: WebhookDeliveryListParams = {}): Promise<WebhookDeliveryListResponse> {
  const searchParams = new URLSearchParams()

  if (params.webhook_id !== undefined) {
    searchParams.set('webhook_id', params.webhook_id.toString())
  }
  if (params.event) {
    searchParams.set('event', params.event)
  }
  if (params.success !== undefined) {
    searchParams.set('success', params.success.toString())
  }
  if (params.page !== undefined) {
    searchParams.set('page', params.page.toString())
  }
  if (params.per_page !== undefined) {
    searchParams.set('per_page', params.per_page.toString())
  }

  const queryString = searchParams.toString()
  const url = `${DELIVERY_PATH}${queryString ? `?${queryString}` : ''}`

  const response = await apiClient.get<WebhookDelivery[] | WebhookDeliveryListResponse>(url)

  // Handle both array and paginated response formats
  if (Array.isArray(response.data)) {
    return {
      data: response.data,
      total: response.data.length,
      page: params.page || 1,
      per_page: params.per_page || 10,
      total_pages: 1,
    }
  }

  return response.data as WebhookDeliveryListResponse
}

/**
 * Get a single webhook delivery by ID
 */
export async function getWebhookDelivery(id: number): Promise<WebhookDelivery> {
  const response = await apiClient.get<WebhookDelivery>(`${DELIVERY_PATH}/${id}`)
  return response.data
}

/**
 * Webhook service object for convenience
 */
export const webhookService = {
  list: getWebhooks,
  get: getWebhook,
  create: createWebhook,
  update: updateWebhook,
  delete: deleteWebhook,
  test: testWebhook,
  deliveries: {
    list: getWebhookDeliveries,
    get: getWebhookDelivery,
  },
}
