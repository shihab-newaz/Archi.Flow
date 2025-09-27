export interface MockUser {
  id: string
  name: string
  email: string
  role: string
  avatarUrl: string | null
  createdAt: string
  updatedAt: string
}

export function createMockUser(
  opts: Partial<MockUser> & { email?: string; role?: string } = {}
): MockUser {
  const now = new Date().toISOString()
  const role = opts.role ?? 'student'
  const email =
    opts.email ??
    (role === 'admin' ? 'admin@example.com' : `${role}@example.com`)
  const defaultNames: Record<string, string> = {
    admin: 'John Admin',
    teacher: 'Sarah Teacher',
    student: 'Alex Student',
  }

  return {
    id:
      opts.id ??
      (role === 'student'
        ? '12345678-90ab-cdef-1234-567890abcdef'
        : (opts.id ?? 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d')),
    name: opts.name ?? defaultNames[role] ?? `${role} User`,
    email,
    role,
    avatarUrl:
      opts.avatarUrl ??
      (role === 'admin'
        ? null
        : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent((opts.name ?? defaultNames[role]) as string)}`),
    createdAt: opts.createdAt ?? now,
    updatedAt: opts.updatedAt ?? now,
  }
}

export const roleTokenMap: Record<string, string> = {
  admin: 'mock-jwt-token-admin',
  teacher: 'mock-jwt-token-teacher',
  student: 'mock-jwt-token-student',
}

export function getTokenForRole(role = 'student') {
  return roleTokenMap[role] ?? `mock-jwt-token-${role}`
}

export function createAuthResponse(
  user: MockUser,
  token?: string,
  message = 'Login successful'
) {
  return {
    user,
    token: token ?? getTokenForRole(user.role),
    message,
  }
}
