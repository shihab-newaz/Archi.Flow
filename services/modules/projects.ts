import { apiService, createMutation, createQuery } from '../api'
import type { Project } from '@/types'

export interface CreateProjectPayload extends Omit<Project, 'id'> {}
export interface UpdateProjectPayload extends Partial<Omit<Project, 'id'>> {}

export const projectQueryKeys = {
  all: ['projects'] as const,
  list: () => [...projectQueryKeys.all, 'list'] as const,
  detail: (id: string) => [...projectQueryKeys.all, 'detail', id] as const,
}

export const projectEndpoints = {
  getProjects: () =>
    apiService.get<Project[]>('/api/projects', {
      requiresAuth: true,
    }),

  getProject: (id: string) =>
    apiService.get<Project>(`/api/projects/${id}`, {
      requiresAuth: true,
    }),

  createProject: (payload: CreateProjectPayload) =>
    apiService.post<Project>('/api/projects', payload, {
      requiresAuth: true,
    }),

  updateProject: (id: string, payload: UpdateProjectPayload) =>
    apiService.patch<Project>(`/api/projects/${id}`, payload, {
      requiresAuth: true,
    }),
}

export const useProjectsQuery = createQuery(
  projectQueryKeys.list(),
  projectEndpoints.getProjects,
  {
    staleTime: 60_000,
  }
)

export const useProjectQuery = (id: string, enabled = true) =>
  createQuery(
    projectQueryKeys.detail(id),
    () => projectEndpoints.getProject(id),
    {
      enabled: enabled && !!id,
    }
  )()

export const useCreateProjectMutation = createMutation(
  projectEndpoints.createProject,
  {
    invalidateQueries: [projectQueryKeys.list()],
  }
)

export const useUpdateProjectMutation = createMutation(
  ({ id, ...payload }: { id: string } & UpdateProjectPayload) =>
    projectEndpoints.updateProject(id, payload),
  {
    invalidateQueries: [projectQueryKeys.list()],
  }
)
