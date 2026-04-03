import { http, HttpResponse } from 'msw'
import {
  createMockUser,
  createAuthResponse,
  createMockProfile,
  getTokenForRole,
} from '../factories'

let currentUser = createMockProfile({
  name: 'Architect One',
  email: 'architect@example.com',
  role: 'admin',
})

const isAuthorized = (authHeader: string | null) =>
  Boolean(authHeader && authHeader.startsWith('Bearer '))

// Auth handlers (login, logout, profile)
export const authHandlers = [
  // POST /api/auth/login
  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string; rememberMe?: boolean }

    // Simple credential checks for local development
    if (body.email === 'admin@example.com' && body.password === 'password123') {
      const user = createMockUser({ email: 'admin@example.com', role: 'admin' })
      return HttpResponse.json(createAuthResponse(user, getTokenForRole('admin')))
    }

    if (body.email === 'teacher@example.com' && body.password === 'password123') {
      const user = createMockUser({ email: 'teacher@example.com', role: 'teacher' })
      return HttpResponse.json(createAuthResponse(user, getTokenForRole('teacher')))
    }

    if (body.email === 'student@example.com' && body.password === 'password123') {
      const user = createMockUser({ email: 'student@example.com', role: 'student' })
      return HttpResponse.json(createAuthResponse(user, getTokenForRole('student')))
    }

    // Invalid credentials
    return HttpResponse.json(
      {
        status: 401,
        message: 'Invalid email or password',
        details: 'Please check your credentials and try again',
      },
      { status: 401 }
    )
  }),

  // POST /api/auth/logout
  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ message: 'Logged out successfully' })
  }),

  // POST /api/auth/register
  http.post('/api/auth/register', async ({ request }) => {
    const body = (await request.json()) as { name: string; email: string }
    const user = createMockUser({
      name: body.name ?? 'New User',
      email: body.email ?? 'new@example.com',
      role: 'student',
    })
    currentUser = { ...currentUser, ...user }
    return HttpResponse.json(createAuthResponse(user, getTokenForRole('student')))
  }),

  // POST /api/auth/refresh
  http.post('/api/auth/refresh', async ({ request }) => {
    const body = (await request.json()) as { refreshToken?: string }

    if (!body?.refreshToken) {
      return HttpResponse.json({ status: 400, message: 'Refresh token is required' }, { status: 400 })
    }

    return HttpResponse.json(createAuthResponse(currentUser, getTokenForRole(currentUser.role), 'Session refreshed'))
  }),

  // GET /api/auth/profile
  http.get('/api/auth/profile', ({ request }) => {
    const authHeader = request.headers.get('Authorization')

    if (!isAuthorized(authHeader)) {
      return HttpResponse.json({ status: 401, message: 'Unauthorized' }, { status: 401 })
    }

    return HttpResponse.json(currentUser)
  }),

  // PATCH /api/auth/profile
  http.patch('/api/auth/profile', async ({ request }) => {
    const authHeader = request.headers.get('Authorization')

    if (!isAuthorized(authHeader)) {
      return HttpResponse.json({ status: 401, message: 'Unauthorized' }, { status: 401 })
    }

    const updates = (await request.json()) as Partial<typeof currentUser>
    currentUser = { ...currentUser, ...updates }
    return HttpResponse.json(currentUser)
  }),

  // POST /api/auth/forgot-password
  http.post('/api/auth/forgot-password', async ({ request }) => {
    const body = (await request.json()) as { email: string }
    if (!body?.email) {
      return HttpResponse.json({ message: 'Email is required' }, { status: 400 })
    }
    return HttpResponse.json({ message: 'Password reset email sent' })
  }),

  // POST /api/auth/reset-password
  http.post('/api/auth/reset-password', async ({ request }) => {
    const body = (await request.json()) as { token: string }
    if (!body?.token) {
      return HttpResponse.json({ message: 'Reset token is required' }, { status: 400 })
    }
    return HttpResponse.json({ message: 'Password reset successful' })
  }),

  // POST /api/auth/change-password
  http.post('/api/auth/change-password', async ({ request }) => {
    const body = (await request.json()) as { currentPassword?: string; newPassword?: string }
    if (!body?.currentPassword || !body?.newPassword) {
      return HttpResponse.json({ message: 'Invalid password payload' }, { status: 400 })
    }
    return HttpResponse.json({ message: 'Password updated' })
  }),

  // POST /api/auth/verify-email
  http.post('/api/auth/verify-email', async ({ request }) => {
    const body = (await request.json()) as { token?: string }
    if (!body?.token) {
      return HttpResponse.json({ message: 'Verification token required' }, { status: 400 })
    }
    return HttpResponse.json({ message: 'Email verified' })
  }),

  // POST /api/auth/resend-verification
  http.post('/api/auth/resend-verification', async ({ request }) => {
    const body = (await request.json()) as { email?: string }
    if (!body?.email) {
      return HttpResponse.json({ message: 'Email required' }, { status: 400 })
    }
    return HttpResponse.json({ message: 'Verification email sent' })
  }),
]
