import type { Client, Project, Task } from '@/types'

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
    tokens: {
      accessToken: token ?? getTokenForRole(user.role),
      refreshToken: `mock-refresh-token-${user.role}`,
    },
    message,
  }
}

const now = () => new Date().toISOString()

export const createMockClient = (overrides: Partial<Client> = {}): Client => ({
  id: overrides.id ?? Math.random().toString(36).slice(2, 9),
  name: overrides.name ?? 'Alice Johnson',
  email: overrides.email ?? 'alice@example.com',
  phone: overrides.phone ?? '555-0101',
  company: overrides.company,
})

export const createMockProject = (overrides: Partial<Project> = {}): Project => ({
  id: overrides.id ?? Math.random().toString(36).slice(2, 9),
  name: overrides.name ?? 'Modern Loft Renovation',
  clientId: overrides.clientId ?? '1',
  status: overrides.status ?? 'Active',
  phase: overrides.phase ?? 'Design',
  budget: overrides.budget ?? 150000,
  startDate: overrides.startDate ?? '2023-10-01',
  endDate: overrides.endDate,
  address: overrides.address ?? '123 Main St, Cityville',
  thumbnail: overrides.thumbnail,
})

export const createMockTask = (overrides: Partial<Task> = {}): Task => ({
  id: overrides.id ?? Math.random().toString(36).slice(2, 9),
  projectId: overrides.projectId ?? '1',
  title: overrides.title ?? 'Finalize Floor Plan',
  status: overrides.status ?? 'In Progress',
  dueDate: overrides.dueDate ?? '2023-11-15',
  assignee: overrides.assignee ?? 'Architect A',
})

export const createMockProfile = (overrides: Partial<MockUser> = {}) => ({
  ...createMockUser({ role: 'admin' }),
  ...overrides,
  updatedAt: overrides.updatedAt ?? now(),
})
