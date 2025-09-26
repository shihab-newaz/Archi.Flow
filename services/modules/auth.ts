import { apiService, createQuery, createMutation, type BaseEntity } from '../api'

/**
 * Authentication module endpoints and types
 */

export interface AuthUser extends BaseEntity {
  name: string
  email: string
  role?: string
  avatarUrl?: string | null
}

export interface AuthResponse {
  user: AuthUser
  token?: string
  message?: string
}

export interface LogoutResponse {
  message: string
}

export interface LoginPayload {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  token: string
  password: string
  confirmPassword: string
}

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

/**
 * Query Keys
 */
export const authQueryKeys = {
  all: ['auth'] as const,
  profile: () => [...authQueryKeys.all, 'profile'] as const,
  permissions: () => [...authQueryKeys.all, 'permissions'] as const,
}

/**
 * API Endpoints
 */
export const authEndpoints = {
  // Authentication
  login: (payload: LoginPayload) =>
    apiService.post<AuthResponse>('/api/auth/login', payload, {
      requiresAuth: false,
    }),

  register: (payload: RegisterPayload) =>
    apiService.post<AuthResponse>('/api/auth/register', payload, {
      requiresAuth: false,
    }),

  logout: () =>
    apiService.post<LogoutResponse>('/api/auth/logout', undefined, {
      requiresAuth: true,
    }),

  // Profile management
  getProfile: () =>
    apiService.get<AuthUser>('/api/auth/profile', {
      requiresAuth: true,
    }),

  updateProfile: (payload: Partial<AuthUser>) =>
    apiService.patch<AuthUser>('/api/auth/profile', payload, {
      requiresAuth: true,
    }),

  // Password management
  forgotPassword: (payload: ForgotPasswordPayload) =>
    apiService.post<{ message: string }>('/api/auth/forgot-password', payload, {
      requiresAuth: false,
    }),

  resetPassword: (payload: ResetPasswordPayload) =>
    apiService.post<{ message: string }>('/api/auth/reset-password', payload, {
      requiresAuth: false,
    }),

  changePassword: (payload: ChangePasswordPayload) =>
    apiService.patch<{ message: string }>('/api/auth/change-password', payload, {
      requiresAuth: true,
    }),

  // Verification
  verifyEmail: (token: string) =>
    apiService.post<{ message: string }>('/api/auth/verify-email', { token }, {
      requiresAuth: false,
    }),

  resendVerification: () =>
    apiService.post<{ message: string }>('/api/auth/resend-verification', undefined, {
      requiresAuth: true,
    }),
}

/**
 * React Query Hooks
 */

// Queries
export const useProfileQuery = createQuery(
  authQueryKeys.profile(),
  authEndpoints.getProfile,
  {
    staleTime: 5 * 60 * 1000, // 5 minutes
  }
)

// Mutations
export const useLoginMutation = createMutation(
  authEndpoints.login,
  {
    invalidateQueries: [authQueryKeys.profile()],
  }
)

export const useRegisterMutation = createMutation(
  authEndpoints.register,
  {
    invalidateQueries: [authQueryKeys.profile()],
  }
)

export const useLogoutMutation = createMutation(
  authEndpoints.logout,
  {
    invalidateQueries: [authQueryKeys.all],
  }
)

export const useUpdateProfileMutation = createMutation(
  authEndpoints.updateProfile,
  {
    invalidateQueries: [authQueryKeys.profile()],
  }
)

export const useForgotPasswordMutation = createMutation(
  authEndpoints.forgotPassword
)

export const useResetPasswordMutation = createMutation(
  authEndpoints.resetPassword
)

export const useChangePasswordMutation = createMutation(
  authEndpoints.changePassword
)

export const useVerifyEmailMutation = createMutation(
  authEndpoints.verifyEmail
)

export const useResendVerificationMutation = createMutation(
  authEndpoints.resendVerification
)