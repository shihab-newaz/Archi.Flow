import {
  apiService,
  createMutation,
  createQuery,
  type BaseEntity,
  type PaginationParams,
} from '../api'

export type UserRole = 'ADMIN' | 'ARCHITECT' | 'ENGINEER' | 'CLIENT'

export interface User extends BaseEntity {
  name: string | null
  email: string
  role: UserRole
  isActive: boolean
}

export interface UsersQueryParams extends PaginationParams {
  role?: UserRole
  includeInactive?: boolean
}

export interface UsersResponse {
  data: User[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface CreateUserPayload {
  name: string
  email: string
  password: string
  role: UserRole
}

export interface UpdateUserPayload {
  name?: string
  role?: UserRole
}

export const userQueryKeys = {
  all: ['users'] as const,
  lists: () => [...userQueryKeys.all, 'list'] as const,
  list: (params?: UsersQueryParams) => [...userQueryKeys.lists(), params] as const,
  details: () => [...userQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...userQueryKeys.details(), id] as const,
}

export const userEndpoints = {
  getUsers: (params?: UsersQueryParams) => {
    const searchParams = new URLSearchParams()

    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.search) searchParams.set('search', params.search)
    if (params?.role) searchParams.set('role', params.role)
    if (params?.includeInactive) searchParams.set('includeInactive', 'true')

    const path = searchParams.toString()
      ? `/api/users?${searchParams.toString()}`
      : '/api/users'

    return apiService.get<UsersResponse>(path, {
      requiresAuth: true,
    })
  },

  getUser: (id: string) =>
    apiService.get<User>(`/api/users/${id}`, {
      requiresAuth: true,
    }),

  createUser: (payload: CreateUserPayload) =>
    apiService.post<User, CreateUserPayload>('/api/users', payload, {
      requiresAuth: true,
    }),

  updateUser: (id: string, payload: UpdateUserPayload) =>
    apiService.patch<User, UpdateUserPayload>(`/api/users/${id}`, payload, {
      requiresAuth: true,
    }),

  deactivateUser: (id: string) =>
    apiService.delete<void>(`/api/users/${id}`, {
      requiresAuth: true,
    }),

  reactivateUser: (id: string) =>
    apiService.post<User>(`/api/users/${id}/reactivate`, undefined, {
      requiresAuth: true,
    }),
}

export const useUsersQuery = (params?: UsersQueryParams) =>
  createQuery(userQueryKeys.list(params), () => userEndpoints.getUsers(params), {
    staleTime: 60_000,
  })()

export const useUserQuery = (id: string, enabled = true) =>
  createQuery(userQueryKeys.detail(id), () => userEndpoints.getUser(id), {
    enabled: enabled && !!id,
  })()

export const useCreateUserMutation = createMutation(userEndpoints.createUser, {
  invalidateQueries: [userQueryKeys.lists()],
})

export const useUpdateUserMutation = createMutation(
  ({ id, ...payload }: { id: string } & UpdateUserPayload) =>
    userEndpoints.updateUser(id, payload),
  {
    invalidateQueries: [userQueryKeys.lists(), userQueryKeys.details()],
  }
)

export const useDeactivateUserMutation = createMutation(userEndpoints.deactivateUser, {
  invalidateQueries: [userQueryKeys.lists(), userQueryKeys.details()],
})

export const useReactivateUserMutation = createMutation(userEndpoints.reactivateUser, {
  invalidateQueries: [userQueryKeys.lists(), userQueryKeys.details()],
})