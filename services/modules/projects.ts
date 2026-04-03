import { apiService, createMutation, createQuery, type PaginationParams } from '../api'

export type ProjectStatus = 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED'
export type ProjectMemberRole = 'OWNER' | 'MEMBER' | 'VIEWER'

export interface Project {
  id: string
  name: string
  description: string | null
  status: ProjectStatus
  startDate: string | null
  endDate: string | null
  createdAt: string
  updatedAt: string
  openTasks?: number
  totalTasks?: number
  completionPercentage?: number
}

export interface PaginatedProjectsResponse {
  data: Project[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ProjectMember {
  id: string
  userId: string
  userName: string | null
  userEmail: string
  role: ProjectMemberRole
  addedAt: string
}

export interface ProjectPhase {
  id: string
  name: string
  position: number
  createdAt: string
  updatedAt: string
  taskCount?: number
}

export interface ProjectsQueryParams extends PaginationParams {
  status?: ProjectStatus
}

export interface CreateProjectPayload {
  name: string
  description?: string
  status?: ProjectStatus
  startDate?: string
  endDate?: string
}

export interface UpdateProjectPayload {
  name?: string
  description?: string
  status?: ProjectStatus
  startDate?: string | null
  endDate?: string | null
}

export interface AddProjectMemberPayload {
  userId: string
  role: ProjectMemberRole
}

export interface UpdateProjectMemberPayload {
  role: ProjectMemberRole
}

export interface CreateProjectPhasePayload {
  name: string
  position?: number
}

export interface UpdateProjectPhasePayload {
  name?: string
  position?: number
}

export const projectQueryKeys = {
  all: ['projects'] as const,
  list: (params?: ProjectsQueryParams) => [...projectQueryKeys.all, 'list', params] as const,
  detail: (id: string) => [...projectQueryKeys.all, 'detail', id] as const,
  members: (id: string) => [...projectQueryKeys.all, 'members', id] as const,
  phases: (id: string) => [...projectQueryKeys.all, 'phases', id] as const,
}

export const projectEndpoints = {
  getProjects: (params?: ProjectsQueryParams) => {
    const searchParams = new URLSearchParams()

    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.search) searchParams.set('search', params.search)
    if (params?.status) searchParams.set('status', params.status)

    const path = searchParams.toString()
      ? `/api/projects?${searchParams.toString()}`
      : '/api/projects'

    return apiService.get<PaginatedProjectsResponse>(path, {
      requiresAuth: true,
    })
  },

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

  archiveProject: (id: string) =>
    apiService.delete<void>(`/api/projects/${id}`, {
      requiresAuth: true,
    }),

  getMembers: (projectId: string) =>
    apiService.get<ProjectMember[]>(`/api/projects/${projectId}/members`, {
      requiresAuth: true,
    }),

  addMember: (projectId: string, payload: AddProjectMemberPayload) =>
    apiService.post<ProjectMember, AddProjectMemberPayload>(
      `/api/projects/${projectId}/members`,
      payload,
      {
        requiresAuth: true,
      }
    ),

  updateMemberRole: (
    projectId: string,
    memberId: string,
    payload: UpdateProjectMemberPayload
  ) =>
    apiService.patch<ProjectMember, UpdateProjectMemberPayload>(
      `/api/projects/${projectId}/members/${memberId}`,
      payload,
      {
        requiresAuth: true,
      }
    ),

  removeMember: (projectId: string, memberId: string) =>
    apiService.delete<void>(`/api/projects/${projectId}/members/${memberId}`, {
      requiresAuth: true,
    }),

  getPhases: (projectId: string) =>
    apiService.get<ProjectPhase[]>(`/api/projects/${projectId}/phases`, {
      requiresAuth: true,
    }),

  createPhase: (projectId: string, payload: CreateProjectPhasePayload) =>
    apiService.post<ProjectPhase, CreateProjectPhasePayload>(
      `/api/projects/${projectId}/phases`,
      payload,
      {
        requiresAuth: true,
      }
    ),

  updatePhase: (
    projectId: string,
    phaseId: string,
    payload: UpdateProjectPhasePayload
  ) =>
    apiService.patch<ProjectPhase, UpdateProjectPhasePayload>(
      `/api/projects/${projectId}/phases/${phaseId}`,
      payload,
      {
        requiresAuth: true,
      }
    ),

  reorderPhases: (projectId: string, phaseIds: string[]) =>
    apiService.post<ProjectPhase[], { phaseIds: string[] }>(
      `/api/projects/${projectId}/phases/reorder`,
      { phaseIds },
      {
        requiresAuth: true,
      }
    ),

  deletePhase: (projectId: string, phaseId: string) =>
    apiService.delete<void>(`/api/projects/${projectId}/phases/${phaseId}`, {
      requiresAuth: true,
    }),
}

export const useProjectsQuery = (params?: ProjectsQueryParams) =>
  createQuery(
    projectQueryKeys.list(params),
    () => projectEndpoints.getProjects(params).then((response) => response.data),
    {
      staleTime: 60_000,
    }
  )()

export const useProjectQuery = (id: string, enabled = true) =>
  createQuery(
    projectQueryKeys.detail(id),
    () => projectEndpoints.getProject(id),
    {
      enabled: enabled && !!id,
    }
  )()

export const useProjectMembersQuery = (projectId: string, enabled = true) =>
  createQuery(
    projectQueryKeys.members(projectId),
    () => projectEndpoints.getMembers(projectId),
    {
      enabled: enabled && !!projectId,
      staleTime: 30_000,
    }
  )()

export const useProjectPhasesQuery = (projectId: string, enabled = true) =>
  createQuery(
    projectQueryKeys.phases(projectId),
    () => projectEndpoints.getPhases(projectId),
    {
      enabled: enabled && !!projectId,
      staleTime: 30_000,
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
    invalidateQueries: [projectQueryKeys.all],
  }
)

export const useArchiveProjectMutation = createMutation(
  projectEndpoints.archiveProject,
  {
    invalidateQueries: [projectQueryKeys.all],
  }
)

export const useAddProjectMemberMutation = createMutation(
  ({ projectId, ...payload }: { projectId: string } & AddProjectMemberPayload) =>
    projectEndpoints.addMember(projectId, payload),
  {
    invalidateQueries: [projectQueryKeys.all],
  }
)

export const useUpdateProjectMemberRoleMutation = createMutation(
  ({
    projectId,
    memberId,
    ...payload
  }: {
    projectId: string
    memberId: string
  } & UpdateProjectMemberPayload) => projectEndpoints.updateMemberRole(projectId, memberId, payload),
  {
    invalidateQueries: [projectQueryKeys.all],
  }
)

export const useRemoveProjectMemberMutation = createMutation(
  ({ projectId, memberId }: { projectId: string; memberId: string }) =>
    projectEndpoints.removeMember(projectId, memberId),
  {
    invalidateQueries: [projectQueryKeys.all],
  }
)

export const useCreateProjectPhaseMutation = createMutation(
  ({ projectId, ...payload }: { projectId: string } & CreateProjectPhasePayload) =>
    projectEndpoints.createPhase(projectId, payload),
  {
    invalidateQueries: [projectQueryKeys.all],
  }
)

export const useUpdateProjectPhaseMutation = createMutation(
  ({
    projectId,
    phaseId,
    ...payload
  }: {
    projectId: string
    phaseId: string
  } & UpdateProjectPhasePayload) => projectEndpoints.updatePhase(projectId, phaseId, payload),
  {
    invalidateQueries: [projectQueryKeys.all],
  }
)

export const useReorderProjectPhasesMutation = createMutation(
  ({ projectId, phaseIds }: { projectId: string; phaseIds: string[] }) =>
    projectEndpoints.reorderPhases(projectId, phaseIds),
  {
    invalidateQueries: [projectQueryKeys.all],
  }
)

export const useDeleteProjectPhaseMutation = createMutation(
  ({ projectId, phaseId }: { projectId: string; phaseId: string }) =>
    projectEndpoints.deletePhase(projectId, phaseId),
  {
    invalidateQueries: [projectQueryKeys.all],
  }
)
