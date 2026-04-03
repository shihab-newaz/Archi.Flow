import { apiService, createQuery, type PaginationParams } from '../api'

export interface ActivityLog {
  id: string
  actorId: string | null
  actorName?: string | null
  action: string
  entityType: string | null
  entityId: string | null
  meta: Record<string, unknown> | null
  createdAt: string
}

export interface ActivityQueryParams extends PaginationParams {
  entityType?: string
  entityId?: string
  actorId?: string
}

interface PaginatedActivityResponse {
  data: ActivityLog[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export const activityQueryKeys = {
  all: ['activity'] as const,
  list: (params?: ActivityQueryParams) => [...activityQueryKeys.all, 'list', params] as const,
  entity: (entityType: string, entityId: string, limit?: number) =>
    [...activityQueryKeys.all, 'entity', entityType, entityId, limit] as const,
}

export const activityEndpoints = {
  getActivityLogs: (params?: ActivityQueryParams) => {
    const searchParams = new URLSearchParams()

    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.entityType) searchParams.set('entityType', params.entityType)
    if (params?.entityId) searchParams.set('entityId', params.entityId)
    if (params?.actorId) searchParams.set('actorId', params.actorId)

    const path = searchParams.toString()
      ? `/api/activity?${searchParams.toString()}`
      : '/api/activity'

    return apiService.get<PaginatedActivityResponse>(path, {
      requiresAuth: true,
    })
  },

  getActivityByEntity: (entityType: string, entityId: string, limit?: number) => {
    const searchParams = new URLSearchParams()
    if (limit) searchParams.set('limit', limit.toString())

    const path = searchParams.toString()
      ? `/api/activity/${entityType}/${entityId}?${searchParams.toString()}`
      : `/api/activity/${entityType}/${entityId}`

    return apiService.get<ActivityLog[]>(path, {
      requiresAuth: true,
    })
  },
}

export const useActivityLogsQuery = (params?: ActivityQueryParams) =>
  createQuery(
    activityQueryKeys.list(params),
    () => activityEndpoints.getActivityLogs(params),
    {
      staleTime: 10_000,
    }
  )()

export const useActivityByEntityQuery = (
  entityType: string,
  entityId: string,
  limit?: number,
  enabled = true
) =>
  createQuery(
    activityQueryKeys.entity(entityType, entityId, limit),
    () => activityEndpoints.getActivityByEntity(entityType, entityId, limit),
    {
      enabled: enabled && !!entityType && !!entityId,
      staleTime: 10_000,
    }
  )()
