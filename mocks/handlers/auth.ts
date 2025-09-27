import { http, HttpResponse } from 'msw'
import { createMockUser, createAuthResponse, getTokenForRole } from '../factories'

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

  // GET /api/auth/profile
  http.get('/api/auth/profile', ({ request }) => {
    const authHeader = request.headers.get('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ status: 401, message: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')

    if (token === getTokenForRole('admin')) {
      return HttpResponse.json(createMockUser({ email: 'admin@example.com', role: 'admin' }))
    }

    if (token === getTokenForRole('teacher')) {
      return HttpResponse.json(createMockUser({ email: 'teacher@example.com', role: 'teacher' }))
    }

    if (token === getTokenForRole('student')) {
      return HttpResponse.json(createMockUser({ email: 'student@example.com', role: 'student' }))
    }

    return HttpResponse.json({ status: 401, message: 'Invalid token' }, { status: 401 })
  }),
]
