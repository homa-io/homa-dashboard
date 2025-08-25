/**
 * Centralized API client configuration
 * Handles authentication, base URL, and common request/response logic
 */

export interface ApiError {
  message: string
  status: number
  code?: string
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface RequestConfig {
  headers?: Record<string, string>
  timeout?: number
  retries?: number
}

class ApiClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>
  private defaultTimeout: number

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
    this.defaultTimeout = 10000
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit & RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    }

    // Add auth token if available
    const token = this.getAuthToken()
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), options.timeout || this.defaultTimeout)
      
      config.signal = controller.signal

      const response = await fetch(url, config)
      clearTimeout(timeoutId)

      if (!response.ok) {
        throw await this.handleErrorResponse(response)
      }

      const data = await response.json()
      return {
        data,
        success: true,
        message: data.message,
      }
    } catch (error) {
      if (error instanceof Error) {
        throw {
          message: error.message,
          status: 0,
          code: 'NETWORK_ERROR',
        } as ApiError
      }
      throw error
    }
  }

  private async handleErrorResponse(response: Response): Promise<ApiError> {
    let errorMessage = `Request failed with status ${response.status}`
    let errorCode = 'UNKNOWN_ERROR'
    
    try {
      const errorData = await response.json()
      errorMessage = errorData.message || errorMessage
      errorCode = errorData.code || errorCode
    } catch {
      // Use default error message if response is not JSON
    }

    return {
      message: errorMessage,
      status: response.status,
      code: errorCode,
    }
  }

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
  }

  public async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', ...config })
  }

  public async post<T>(
    endpoint: string, 
    body?: unknown, 
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      ...config,
    })
  }

  public async put<T>(
    endpoint: string, 
    body?: unknown, 
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      ...config,
    })
  }

  public async patch<T>(
    endpoint: string, 
    body?: unknown, 
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
      ...config,
    })
  }

  public async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE', ...config })
  }

  public setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token)
    }
  }

  public clearAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken')
      sessionStorage.removeItem('authToken')
    }
  }
}

export const apiClient = new ApiClient()