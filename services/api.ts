'use client'

import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from '@tanstack/react-query'

import { ApiError, apiClient, type ApiRequestConfig } from '@/lib/apiClient'

/**
 * Central API service providing consistent patterns for all API operations
 */

export interface BaseEntity {
  id: string
  createdAt?: string
  updatedAt?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
  sort?: string
  order?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

/**
 * Generic query hook factory for consistent data fetching
 */
export const createQuery = <TData, TError = ApiError>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<TData>,
  options?: Omit<
    UseQueryOptions<TData, TError, TData, readonly unknown[]>,
    'queryKey' | 'queryFn'
  >
) => {
  return () =>
    useQuery<TData, TError, TData, readonly unknown[]>({
      queryKey,
      queryFn,
      staleTime: 60_000, // Default 60 seconds
      ...options,
    })
}

/**
 * Generic mutation hook factory for consistent data mutations
 */
export const createMutation = <TData, TError = ApiError, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: {
    onSuccess?: (
      data: TData,
      variables: TVariables,
      context: unknown
    ) => void | Promise<void>
    onError?: (
      error: TError,
      variables: TVariables,
      context: unknown
    ) => void | Promise<void>
    invalidateQueries?: (readonly unknown[])[]
  }
) => {
  return (
    userOptions?: UseMutationOptions<TData, TError, TVariables>
  ) => {
    const queryClient = useQueryClient()

    return useMutation<TData, TError, TVariables>({
      mutationFn,
      onSuccess: async (data: TData, variables: TVariables, context: unknown) => {
        // Invalidate specified queries
        if (options?.invalidateQueries) {
          await Promise.all(
            options.invalidateQueries.map(queryKey =>
              queryClient.invalidateQueries({ queryKey })
            )
          )
        }

        // Run custom success handler
        await options?.onSuccess?.(data, variables, context)
      },
      onError: (error: TError, variables: TVariables, context: unknown) => {
        options?.onError?.(error, variables, context)
      },
      ...userOptions,
    })
  }
}

/**
 * Utility functions for common API patterns
 */
export const apiService = {
  /**
   * Standard GET request
   */
  get: <TResponse>(
    path: string,
    config?: ApiRequestConfig
  ): Promise<TResponse> => apiClient.get<TResponse>(path, config),

  /**
   * Standard POST request
   */
  post: <TResponse, TBody = unknown>(
    path: string,
    data?: TBody,
    config?: ApiRequestConfig<TBody>
  ): Promise<TResponse> =>
    apiClient.post<TResponse, TBody>(path, { ...config, json: data }),

  /**
   * Standard PUT request
   */
  put: <TResponse, TBody = unknown>(
    path: string,
    data?: TBody,
    config?: ApiRequestConfig<TBody>
  ): Promise<TResponse> =>
    apiClient.put<TResponse, TBody>(path, { ...config, json: data }),

  /**
   * Standard PATCH request
   */
  patch: <TResponse, TBody = unknown>(
    path: string,
    data?: TBody,
    config?: ApiRequestConfig<TBody>
  ): Promise<TResponse> =>
    apiClient.patch<TResponse, TBody>(path, { ...config, json: data }),

  /**
   * Standard DELETE request
   */
  delete: <TResponse>(
    path: string,
    config?: ApiRequestConfig
  ): Promise<TResponse> => apiClient.delete<TResponse>(path, config),

  /**
   * Get paginated data
   */
  getPaginated: <TData>(
    path: string,
    params?: PaginationParams,
    config?: ApiRequestConfig
  ): Promise<PaginatedResponse<TData>> => {
    const searchParams = new URLSearchParams()
    
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.search) searchParams.set('search', params.search)
    if (params?.sort) searchParams.set('sort', params.sort)
    if (params?.order) searchParams.set('order', params.order)

    const url = searchParams.toString() 
      ? `${path}?${searchParams.toString()}`
      : path

    return apiClient.get<PaginatedResponse<TData>>(url, config)
  },
}

/**
 * Invalidate queries utility
 */
export const invalidateQueries = async (
  queryClient: QueryClient,
  queryKeys: (readonly unknown[])[]
) => {
  await Promise.all(
    queryKeys.map(queryKey =>
      queryClient.invalidateQueries({ queryKey })
    )
  )
}

export type { ApiError, ApiRequestConfig }