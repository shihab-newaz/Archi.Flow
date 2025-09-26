import { apiService, createQuery, createMutation, type BaseEntity, type PaginationParams, type PaginatedResponse } from '../api'

/**
 * User management module endpoints and types
 */

export interface User extends BaseEntity {
  name: string
  email: string
  role: string
  avatarUrl?: string | null
  isActive: boolean
  emailVerified: boolean
  lastLoginAt?: string
}

export interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  dateOfBirth?: string
  address?: string
  bio?: string
  avatarUrl?: string | null
}

export interface CreateUserPayload {
  name: string
  email: string
  password: string
  role: string
}

export interface UpdateUserPayload {
  name?: string
  email?: string
  role?: string
  isActive?: boolean
}

export interface UpdateProfilePayload {
  name?: string
  phone?: string
  dateOfBirth?: string
  address?: string
  bio?: string
}

/**
 * Query Keys
 */
export const userQueryKeys = {
  all: ['users'] as const,
  lists: () => [...userQueryKeys.all, 'list'] as const,
  list: (params?: PaginationParams) => [...userQueryKeys.lists(), params] as const,
  details: () => [...userQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...userQueryKeys.details(), id] as const,
  profile: (id: string) => [...userQueryKeys.all, 'profile', id] as const,
}

/**
 * API Endpoints
 */
export const userEndpoints = {
  // User CRUD operations
  getUsers: (params?: PaginationParams) =>
    apiService.getPaginated<User>('/api/users', params, {
      requiresAuth: true,
    }),

  getUser: (id: string) =>
    apiService.get<User>(`/api/users/${id}`, {
      requiresAuth: true,
    }),

  createUser: (payload: CreateUserPayload) =>
    apiService.post<User>('/api/users', payload, {
      requiresAuth: true,
    }),

  updateUser: (id: string, payload: UpdateUserPayload) =>
    apiService.patch<User>(`/api/users/${id}`, payload, {
      requiresAuth: true,
    }),

  deleteUser: (id: string) =>
    apiService.delete<{ message: string }>(`/api/users/${id}`, {
      requiresAuth: true,
    }),

  // Profile operations
  getUserProfile: (id: string) =>
    apiService.get<UserProfile>(`/api/users/${id}/profile`, {
      requiresAuth: true,
    }),

  updateUserProfile: (id: string, payload: UpdateProfilePayload) =>
    apiService.patch<UserProfile>(`/api/users/${id}/profile`, payload, {
      requiresAuth: true,
    }),

  // Avatar operations
  uploadAvatar: (id: string, file: File) => {
    const formData = new FormData()
    formData.append('avatar', file)
    
    return apiService.post<{ avatarUrl: string }>(`/api/users/${id}/avatar`, formData, {
      requiresAuth: true,
    })
  },

  deleteAvatar: (id: string) =>
    apiService.delete<{ message: string }>(`/api/users/${id}/avatar`, {
      requiresAuth: true,
    }),

  // Bulk operations
  bulkUpdateUsers: (userIds: string[], payload: UpdateUserPayload) =>
    apiService.patch<{ updated: number }>('/api/users/bulk', 
      { userIds, ...payload }, 
      { requiresAuth: true }
    ),

  bulkDeleteUsers: (userIds: string[]) =>
    apiService.delete<{ deleted: number }>('/api/users/bulk', {
      requiresAuth: true,
      json: { userIds },
    }),
}

/**
 * React Query Hooks
 */

// Queries
export const useUsersQuery = (params?: PaginationParams) =>
  createQuery(
    userQueryKeys.list(params),
    () => userEndpoints.getUsers(params),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  )()

export const useUserQuery = (id: string, enabled = true) =>
  createQuery(
    userQueryKeys.detail(id),
    () => userEndpoints.getUser(id),
    {
      enabled: enabled && !!id,
    }
  )()

export const useUserProfileQuery = (id: string, enabled = true) =>
  createQuery(
    userQueryKeys.profile(id),
    () => userEndpoints.getUserProfile(id),
    {
      enabled: enabled && !!id,
    }
  )()

// Mutations
export const useCreateUserMutation = createMutation(
  userEndpoints.createUser,
  {
    invalidateQueries: [userQueryKeys.lists()],
  }
)

export const useUpdateUserMutation = createMutation(
  ({ id, ...payload }: { id: string } & UpdateUserPayload) =>
    userEndpoints.updateUser(id, payload),
  {
    invalidateQueries: [userQueryKeys.lists(), userQueryKeys.details()],
  }
)

export const useDeleteUserMutation = createMutation(
  userEndpoints.deleteUser,
  {
    invalidateQueries: [userQueryKeys.lists()],
  }
)

export const useUpdateUserProfileMutation = createMutation(
  ({ id, ...payload }: { id: string } & UpdateProfilePayload) =>
    userEndpoints.updateUserProfile(id, payload),
  {
    invalidateQueries: [userQueryKeys.profile(''), userQueryKeys.details()],
  }
)

export const useUploadAvatarMutation = createMutation(
  ({ id, file }: { id: string; file: File }) =>
    userEndpoints.uploadAvatar(id, file),
  {
    invalidateQueries: [userQueryKeys.profile(''), userQueryKeys.details()],
  }
)

export const useDeleteAvatarMutation = createMutation(
  userEndpoints.deleteAvatar,
  {
    invalidateQueries: [userQueryKeys.profile(''), userQueryKeys.details()],
  }
)

export const useBulkUpdateUsersMutation = createMutation(
  ({ userIds, ...payload }: { userIds: string[] } & UpdateUserPayload) =>
    userEndpoints.bulkUpdateUsers(userIds, payload),
  {
    invalidateQueries: [userQueryKeys.lists(), userQueryKeys.details()],
  }
)

export const useBulkDeleteUsersMutation = createMutation(
  userEndpoints.bulkDeleteUsers,
  {
    invalidateQueries: [userQueryKeys.lists()],
  }
)