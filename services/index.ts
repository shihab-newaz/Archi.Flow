/**
 * Centralized exports for all service modules
 */

// Core API service
export * from './api'

// Module endpoints and hooks
export * from './modules/auth'
export * from './modules/users'
export * from './modules/academic'
export * from './modules/finance'
export * from './modules/projects'
export * from './modules/clients'
export * from './modules/tasks'

/**
 * Re-export commonly used types and utilities
 */
export type {
  ApiError,
  ApiRequestConfig,
  BaseEntity,
  PaginationParams,
  PaginatedResponse,
} from './api'

/**
 * Module-specific query key collections
 */
export { authQueryKeys } from './modules/auth'
export { userQueryKeys } from './modules/users'
export { academicQueryKeys } from './modules/academic'
export { financeQueryKeys } from './modules/finance'
export { projectQueryKeys } from './modules/projects'
export { clientQueryKeys } from './modules/clients'
export { taskQueryKeys } from './modules/tasks'