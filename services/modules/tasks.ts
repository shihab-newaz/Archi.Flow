import { apiService, createMutation, createQuery, type PaginationParams } from '../api'

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'

export interface Task {
  id: string
  phaseId: string
  title: string
  description: string | null
  status: TaskStatus
  priority: number
  dueDate: string | null
  assignedTo: string | null
  assigneeName?: string | null
  createdAt: string
  updatedAt: string
}

export interface TasksQueryParams extends PaginationParams {
  phaseId?: string
  status?: TaskStatus
  assignedTo?: string
  priority?: number
}

export interface PaginatedTasksResponse {
  data: Task[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface CreateTaskPayload {
  phaseId: string
  title: string
  description?: string
  status?: TaskStatus
  priority?: number
  dueDate?: string
  assignedTo?: string
}

export interface UpdateTaskPayload {
  title?: string
  description?: string | null
  status?: TaskStatus
  priority?: number
  dueDate?: string | null
  assignedTo?: string | null
}

export const taskQueryKeys = {
  all: ['tasks'] as const,
  list: (params?: TasksQueryParams) => [...taskQueryKeys.all, 'list', params] as const,
  detail: (id: string) => [...taskQueryKeys.all, 'detail', id] as const,
}

export const taskEndpoints = {
  getTasks: (params?: TasksQueryParams) => {
    const searchParams = new URLSearchParams()

    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.phaseId) searchParams.set('phaseId', params.phaseId)
    if (params?.status) searchParams.set('status', params.status)
    if (params?.assignedTo) searchParams.set('assignedTo', params.assignedTo)
    if (params?.priority) searchParams.set('priority', params.priority.toString())

    const path = searchParams.toString()
      ? `/api/tasks?${searchParams.toString()}`
      : '/api/tasks'

    return apiService.get<PaginatedTasksResponse>(path, {
      requiresAuth: true,
    })
  },

  getTask: (id: string) =>
    apiService.get<Task>(`/api/tasks/${id}`, {
      requiresAuth: true,
    }),

  createTask: (payload: CreateTaskPayload) =>
    apiService.post<Task, CreateTaskPayload>('/api/tasks', payload, {
      requiresAuth: true,
    }),

  updateTask: (id: string, payload: UpdateTaskPayload) =>
    apiService.patch<Task, UpdateTaskPayload>(`/api/tasks/${id}`, payload, {
      requiresAuth: true,
    }),

  bulkUpdateStatus: (taskIds: string[], status: TaskStatus) =>
    apiService.post<{ message: string }, { taskIds: string[]; status: TaskStatus }>(
      '/api/tasks/bulk-status',
      { taskIds, status },
      {
        requiresAuth: true,
      }
    ),

  deleteTask: (id: string) =>
    apiService.delete<void>(`/api/tasks/${id}`, {
      requiresAuth: true,
    }),
}

export const useTasksQuery = (params?: TasksQueryParams, enabled = true) =>
  createQuery(
    taskQueryKeys.list(params),
    () => taskEndpoints.getTasks(params).then((response) => response.data),
    {
      enabled,
      staleTime: 30_000,
    }
  )()

export const useTaskQuery = (id: string, enabled = true) =>
  createQuery(
    taskQueryKeys.detail(id),
    () => taskEndpoints.getTask(id),
    {
      enabled: enabled && !!id,
    }
  )()

export const useCreateTaskMutation = createMutation(
  taskEndpoints.createTask,
  {
    invalidateQueries: [taskQueryKeys.all],
  }
)

export const useUpdateTaskMutation = createMutation(
  ({ id, ...payload }: { id: string } & UpdateTaskPayload) =>
    taskEndpoints.updateTask(id, payload),
  {
    invalidateQueries: [taskQueryKeys.all],
  }
)

export const useBulkUpdateTaskStatusMutation = createMutation(
  ({ taskIds, status }: { taskIds: string[]; status: TaskStatus }) =>
    taskEndpoints.bulkUpdateStatus(taskIds, status),
  {
    invalidateQueries: [taskQueryKeys.all],
  }
)

export const useDeleteTaskMutation = createMutation(
  taskEndpoints.deleteTask,
  {
    invalidateQueries: [taskQueryKeys.all],
  }
)
