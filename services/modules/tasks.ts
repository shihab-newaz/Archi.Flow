import { apiService, createMutation, createQuery } from '../api'
import type { Task } from '@/types'

export interface CreateTaskPayload extends Omit<Task, 'id'> {}

export const taskQueryKeys = {
  all: ['tasks'] as const,
  list: (projectId?: string) => [...taskQueryKeys.all, 'list', projectId] as const,
}

export const taskEndpoints = {
  getTasks: (projectId?: string) => {
    const params = projectId ? `?projectId=${encodeURIComponent(projectId)}` : ''
    return apiService.get<Task[]>(`/api/tasks${params}`, {
      requiresAuth: true,
    })
  },

  createTask: (payload: CreateTaskPayload) =>
    apiService.post<Task>('/api/tasks', payload, {
      requiresAuth: true,
    }),
}

export const useTasksQuery = (projectId?: string, enabled = true) =>
  createQuery(
    taskQueryKeys.list(projectId),
    () => taskEndpoints.getTasks(projectId),
    {
      enabled: enabled && !!projectId,
      staleTime: 30_000,
    }
  )()

export const useCreateTaskMutation = createMutation(
  taskEndpoints.createTask,
  {
    invalidateQueries: [taskQueryKeys.all],
  }
)
