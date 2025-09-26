import { apiService, createQuery, createMutation, type BaseEntity, type PaginationParams } from '../api'

/**
 * Academic module endpoints and types
 */

export interface Course extends BaseEntity {
  title: string
  code: string
  description: string
  credits: number
  semester: string
  year: number
  instructorId: string
  instructor?: {
    id: string
    name: string
    email: string
  }
  isActive: boolean
}

export interface Assignment extends BaseEntity {
  title: string
  description: string
  courseId: string
  dueDate: string
  maxPoints: number
  isPublished: boolean
  attachments?: string[]
}

export interface Grade extends BaseEntity {
  studentId: string
  assignmentId: string
  courseId: string
  points: number
  maxPoints: number
  percentage: number
  letterGrade: string
  feedback?: string
  gradedAt: string
  gradedBy: string
}

export interface Attendance extends BaseEntity {
  studentId: string
  courseId: string
  date: string
  status: 'present' | 'absent' | 'late' | 'excused'
  notes?: string
  markedBy: string
}

export interface CreateCoursePayload {
  title: string
  code: string
  description: string
  credits: number
  semester: string
  year: number
  instructorId: string
}

export interface UpdateCoursePayload {
  title?: string
  description?: string
  credits?: number
  semester?: string
  year?: number
  instructorId?: string
  isActive?: boolean
}

export interface CreateAssignmentPayload {
  title: string
  description: string
  courseId: string
  dueDate: string
  maxPoints: number
}

export interface UpdateAssignmentPayload {
  title?: string
  description?: string
  dueDate?: string
  maxPoints?: number
  isPublished?: boolean
}

export interface CreateGradePayload {
  studentId: string
  assignmentId: string
  points: number
  feedback?: string
}

export interface UpdateGradePayload {
  points?: number
  feedback?: string
}

export interface MarkAttendancePayload {
  studentId: string
  courseId: string
  date: string
  status: 'present' | 'absent' | 'late' | 'excused'
  notes?: string
}

/**
 * Query Keys
 */
export const academicQueryKeys = {
  all: ['academic'] as const,
  
  courses: () => [...academicQueryKeys.all, 'courses'] as const,
  coursesList: (params?: PaginationParams) => [...academicQueryKeys.courses(), 'list', params] as const,
  course: (id: string) => [...academicQueryKeys.courses(), id] as const,
  
  assignments: () => [...academicQueryKeys.all, 'assignments'] as const,
  assignmentsList: (courseId?: string, params?: PaginationParams) => 
    [...academicQueryKeys.assignments(), 'list', courseId, params] as const,
  assignment: (id: string) => [...academicQueryKeys.assignments(), id] as const,
  
  grades: () => [...academicQueryKeys.all, 'grades'] as const,
  gradesList: (courseId?: string, studentId?: string, params?: PaginationParams) => 
    [...academicQueryKeys.grades(), 'list', courseId, studentId, params] as const,
  grade: (id: string) => [...academicQueryKeys.grades(), id] as const,
  
  attendance: () => [...academicQueryKeys.all, 'attendance'] as const,
  attendanceList: (courseId?: string, studentId?: string, params?: PaginationParams) => 
    [...academicQueryKeys.attendance(), 'list', courseId, studentId, params] as const,
}

/**
 * API Endpoints
 */
export const academicEndpoints = {
  // Course operations
  getCourses: (params?: PaginationParams) =>
    apiService.getPaginated<Course>('/api/academic/courses', params, {
      requiresAuth: true,
    }),

  getCourse: (id: string) =>
    apiService.get<Course>(`/api/academic/courses/${id}`, {
      requiresAuth: true,
    }),

  createCourse: (payload: CreateCoursePayload) =>
    apiService.post<Course>('/api/academic/courses', payload, {
      requiresAuth: true,
    }),

  updateCourse: (id: string, payload: UpdateCoursePayload) =>
    apiService.patch<Course>(`/api/academic/courses/${id}`, payload, {
      requiresAuth: true,
    }),

  deleteCourse: (id: string) =>
    apiService.delete<{ message: string }>(`/api/academic/courses/${id}`, {
      requiresAuth: true,
    }),

  // Assignment operations
  getAssignments: (courseId?: string, params?: PaginationParams) => {
    const url = courseId 
      ? `/api/academic/courses/${courseId}/assignments`
      : '/api/academic/assignments'
    return apiService.getPaginated<Assignment>(url, params, {
      requiresAuth: true,
    })
  },

  getAssignment: (id: string) =>
    apiService.get<Assignment>(`/api/academic/assignments/${id}`, {
      requiresAuth: true,
    }),

  createAssignment: (payload: CreateAssignmentPayload) =>
    apiService.post<Assignment>('/api/academic/assignments', payload, {
      requiresAuth: true,
    }),

  updateAssignment: (id: string, payload: UpdateAssignmentPayload) =>
    apiService.patch<Assignment>(`/api/academic/assignments/${id}`, payload, {
      requiresAuth: true,
    }),

  deleteAssignment: (id: string) =>
    apiService.delete<{ message: string }>(`/api/academic/assignments/${id}`, {
      requiresAuth: true,
    }),

  // Grade operations
  getGrades: (courseId?: string, studentId?: string, params?: PaginationParams) => {
    let url = '/api/academic/grades'
    const queryParams = new URLSearchParams()
    
    if (courseId) queryParams.set('courseId', courseId)
    if (studentId) queryParams.set('studentId', studentId)
    if (params?.page) queryParams.set('page', params.page.toString())
    if (params?.limit) queryParams.set('limit', params.limit.toString())
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`
    }
    
    return apiService.get<Grade[]>(url, { requiresAuth: true })
  },

  getGrade: (id: string) =>
    apiService.get<Grade>(`/api/academic/grades/${id}`, {
      requiresAuth: true,
    }),

  createGrade: (payload: CreateGradePayload) =>
    apiService.post<Grade>('/api/academic/grades', payload, {
      requiresAuth: true,
    }),

  updateGrade: (id: string, payload: UpdateGradePayload) =>
    apiService.patch<Grade>(`/api/academic/grades/${id}`, payload, {
      requiresAuth: true,
    }),

  deleteGrade: (id: string) =>
    apiService.delete<{ message: string }>(`/api/academic/grades/${id}`, {
      requiresAuth: true,
    }),

  // Attendance operations
  getAttendance: (courseId?: string, studentId?: string, params?: PaginationParams) => {
    let url = '/api/academic/attendance'
    const queryParams = new URLSearchParams()
    
    if (courseId) queryParams.set('courseId', courseId)
    if (studentId) queryParams.set('studentId', studentId)
    if (params?.page) queryParams.set('page', params.page.toString())
    if (params?.limit) queryParams.set('limit', params.limit.toString())
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`
    }
    
    return apiService.get<Attendance[]>(url, { requiresAuth: true })
  },

  markAttendance: (payload: MarkAttendancePayload) =>
    apiService.post<Attendance>('/api/academic/attendance', payload, {
      requiresAuth: true,
    }),

  updateAttendance: (id: string, payload: Partial<MarkAttendancePayload>) =>
    apiService.patch<Attendance>(`/api/academic/attendance/${id}`, payload, {
      requiresAuth: true,
    }),

  deleteAttendance: (id: string) =>
    apiService.delete<{ message: string }>(`/api/academic/attendance/${id}`, {
      requiresAuth: true,
    }),
}

/**
 * React Query Hooks
 */

// Course hooks
export const useCoursesQuery = (params?: PaginationParams) =>
  createQuery(
    academicQueryKeys.coursesList(params),
    () => academicEndpoints.getCourses(params)
  )()

export const useCourseQuery = (id: string, enabled = true) =>
  createQuery(
    academicQueryKeys.course(id),
    () => academicEndpoints.getCourse(id),
    { enabled: enabled && !!id }
  )()

export const useCreateCourseMutation = createMutation(
  academicEndpoints.createCourse,
  {
    invalidateQueries: [academicQueryKeys.courses()],
  }
)

export const useUpdateCourseMutation = createMutation(
  ({ id, ...payload }: { id: string } & UpdateCoursePayload) =>
    academicEndpoints.updateCourse(id, payload),
  {
    invalidateQueries: [academicQueryKeys.courses()],
  }
)

export const useDeleteCourseMutation = createMutation(
  academicEndpoints.deleteCourse,
  {
    invalidateQueries: [academicQueryKeys.courses()],
  }
)

// Assignment hooks
export const useAssignmentsQuery = (courseId?: string, params?: PaginationParams) =>
  createQuery(
    academicQueryKeys.assignmentsList(courseId, params),
    () => academicEndpoints.getAssignments(courseId, params)
  )()

export const useAssignmentQuery = (id: string, enabled = true) =>
  createQuery(
    academicQueryKeys.assignment(id),
    () => academicEndpoints.getAssignment(id),
    { enabled: enabled && !!id }
  )()

export const useCreateAssignmentMutation = createMutation(
  academicEndpoints.createAssignment,
  {
    invalidateQueries: [academicQueryKeys.assignments()],
  }
)

export const useUpdateAssignmentMutation = createMutation(
  ({ id, ...payload }: { id: string } & UpdateAssignmentPayload) =>
    academicEndpoints.updateAssignment(id, payload),
  {
    invalidateQueries: [academicQueryKeys.assignments()],
  }
)

export const useDeleteAssignmentMutation = createMutation(
  academicEndpoints.deleteAssignment,
  {
    invalidateQueries: [academicQueryKeys.assignments()],
  }
)

// Grade hooks
export const useGradesQuery = (courseId?: string, studentId?: string, params?: PaginationParams) =>
  createQuery(
    academicQueryKeys.gradesList(courseId, studentId, params),
    () => academicEndpoints.getGrades(courseId, studentId, params)
  )()

export const useGradeQuery = (id: string, enabled = true) =>
  createQuery(
    academicQueryKeys.grade(id),
    () => academicEndpoints.getGrade(id),
    { enabled: enabled && !!id }
  )()

export const useCreateGradeMutation = createMutation(
  academicEndpoints.createGrade,
  {
    invalidateQueries: [academicQueryKeys.grades()],
  }
)

export const useUpdateGradeMutation = createMutation(
  ({ id, ...payload }: { id: string } & UpdateGradePayload) =>
    academicEndpoints.updateGrade(id, payload),
  {
    invalidateQueries: [academicQueryKeys.grades()],
  }
)

export const useDeleteGradeMutation = createMutation(
  academicEndpoints.deleteGrade,
  {
    invalidateQueries: [academicQueryKeys.grades()],
  }
)

// Attendance hooks
export const useAttendanceQuery = (courseId?: string, studentId?: string, params?: PaginationParams) =>
  createQuery(
    academicQueryKeys.attendanceList(courseId, studentId, params),
    () => academicEndpoints.getAttendance(courseId, studentId, params)
  )()

export const useMarkAttendanceMutation = createMutation(
  academicEndpoints.markAttendance,
  {
    invalidateQueries: [academicQueryKeys.attendance()],
  }
)

export const useUpdateAttendanceMutation = createMutation(
  ({ id, ...payload }: { id: string } & Partial<MarkAttendancePayload>) =>
    academicEndpoints.updateAttendance(id, payload),
  {
    invalidateQueries: [academicQueryKeys.attendance()],
  }
)

export const useDeleteAttendanceMutation = createMutation(
  academicEndpoints.deleteAttendance,
  {
    invalidateQueries: [academicQueryKeys.attendance()],
  }
)