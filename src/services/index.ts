/**
 * Centralized services export
 * Provides a single import point for all service modules
 */

export * from './api-client'
export * from './auth.service'
export * from './customer.service'
export * from './ticket.service'

// Re-export service instances for convenience
export { authService } from './auth.service'
export { customerService } from './customer.service'
export { ticketService } from './ticket.service'

// Service types for easy importing
export type { ApiError, ApiResponse, PaginatedResponse } from './api-client'
export type { 
  User, 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest,
  UserPreferences 
} from './auth.service'
export type { 
  CreateCustomerRequest, 
  UpdateCustomerRequest, 
  CustomerListParams,
  CustomerStatsResponse 
} from './customer.service'
export type { 
  CreateTicketRequest, 
  UpdateTicketRequest, 
  TicketListParams,
  TicketStatsResponse,
  TicketComment,
  AddCommentRequest 
} from './ticket.service'