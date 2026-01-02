// Query keys for React Query cache management
export { queryKeys } from './query-keys';

// React Query hooks
export * from './useDepartments';
export * from './useUsers';
export * from './useSettings';
export * from './useActivityLogs';

// Legacy hooks (still useful for non-React-Query patterns)
export * from './use-api';
export { useDarkMode } from './useDarkMode';
export { useIsMobile } from './use-mobile';
export { useToast, toast } from './use-toast';

// Activity tracking
export { useActivityTracker } from './useActivityTracker';

// WebSocket hooks
export { useAgentWebSocket } from './useAgentWebSocket';
export type { WebSocketMessage, UseAgentWebSocketOptions, UseAgentWebSocketReturn } from './useAgentWebSocket';
