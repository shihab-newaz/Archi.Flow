import { apiService, createQuery, createMutation, type BaseEntity, type PaginationParams } from '../api'

/**
 * Finance module endpoints and types
 */

export interface Student extends BaseEntity {
  name: string
  email: string
  studentId: string
  enrollmentDate: string
  class: string
  section?: string
}

export interface Fee extends BaseEntity {
  studentId: string
  feeType: 'tuition' | 'library' | 'lab' | 'transport' | 'hostel' | 'other'
  amount: number
  dueDate: string
  academicYear: string
  semester: string
  description?: string
  isRecurring: boolean
  status: 'pending' | 'paid' | 'overdue' | 'waived'
}

export interface Payment extends BaseEntity {
  studentId: string
  feeId: string
  amount: number
  paymentDate: string
  paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'check' | 'online'
  transactionId?: string
  receiptNumber: string
  processedBy: string
  notes?: string
  status: 'completed' | 'pending' | 'failed' | 'refunded'
}

export interface Scholarship extends BaseEntity {
  name: string
  description: string
  amount: number
  percentage?: number
  type: 'merit' | 'need' | 'sports' | 'academic' | 'other'
  criteria: string
  isActive: boolean
  validFrom: string
  validTo: string
}

export interface StudentScholarship extends BaseEntity {
  studentId: string
  scholarshipId: string
  awardedDate: string
  amount: number
  academicYear: string
  status: 'active' | 'expired' | 'revoked'
  awardedBy: string
}

export interface CreateFeePayload {
  studentId: string
  feeType: Fee['feeType']
  amount: number
  dueDate: string
  academicYear: string
  semester: string
  description?: string
  isRecurring: boolean
}

export interface UpdateFeePayload {
  amount?: number
  dueDate?: string
  description?: string
  status?: Fee['status']
}

export interface CreatePaymentPayload {
  studentId: string
  feeId: string
  amount: number
  paymentMethod: Payment['paymentMethod']
  transactionId?: string
  notes?: string
}

export interface CreateScholarshipPayload {
  name: string
  description: string
  amount: number
  percentage?: number
  type: Scholarship['type']
  criteria: string
  validFrom: string
  validTo: string
}

export interface AwardScholarshipPayload {
  studentId: string
  scholarshipId: string
  amount: number
  academicYear: string
}

/**
 * Query Keys
 */
export const financeQueryKeys = {
  all: ['finance'] as const,
  
  students: () => [...financeQueryKeys.all, 'students'] as const,
  studentsList: (params?: PaginationParams) => [...financeQueryKeys.students(), 'list', params] as const,
  student: (id: string) => [...financeQueryKeys.students(), id] as const,
  
  fees: () => [...financeQueryKeys.all, 'fees'] as const,
  feesList: (studentId?: string, params?: PaginationParams) => 
    [...financeQueryKeys.fees(), 'list', studentId, params] as const,
  fee: (id: string) => [...financeQueryKeys.fees(), id] as const,
  
  payments: () => [...financeQueryKeys.all, 'payments'] as const,
  paymentsList: (studentId?: string, params?: PaginationParams) => 
    [...financeQueryKeys.payments(), 'list', studentId, params] as const,
  payment: (id: string) => [...financeQueryKeys.payments(), id] as const,
  
  scholarships: () => [...financeQueryKeys.all, 'scholarships'] as const,
  scholarshipsList: (params?: PaginationParams) => [...financeQueryKeys.scholarships(), 'list', params] as const,
  scholarship: (id: string) => [...financeQueryKeys.scholarships(), id] as const,
  
  studentScholarships: () => [...financeQueryKeys.all, 'student-scholarships'] as const,
  studentScholarshipsList: (studentId?: string, params?: PaginationParams) => 
    [...financeQueryKeys.studentScholarships(), 'list', studentId, params] as const,
}

/**
 * API Endpoints
 */
export const financeEndpoints = {
  // Student operations (finance context)
  getStudents: (params?: PaginationParams) =>
    apiService.getPaginated<Student>('/api/finance/students', params, {
      requiresAuth: true,
    }),

  getStudent: (id: string) =>
    apiService.get<Student>(`/api/finance/students/${id}`, {
      requiresAuth: true,
    }),

  getStudentFinancialSummary: (id: string) =>
    apiService.get<{
      totalFees: number
      paidAmount: number
      pendingAmount: number
      overdueAmount: number
      scholarships: number
    }>(`/api/finance/students/${id}/summary`, {
      requiresAuth: true,
    }),

  // Fee operations
  getFees: (studentId?: string, params?: PaginationParams) => {
    const url = studentId 
      ? `/api/finance/students/${studentId}/fees`
      : '/api/finance/fees'
    return apiService.getPaginated<Fee>(url, params, {
      requiresAuth: true,
    })
  },

  getFee: (id: string) =>
    apiService.get<Fee>(`/api/finance/fees/${id}`, {
      requiresAuth: true,
    }),

  createFee: (payload: CreateFeePayload) =>
    apiService.post<Fee>('/api/finance/fees', payload, {
      requiresAuth: true,
    }),

  updateFee: (id: string, payload: UpdateFeePayload) =>
    apiService.patch<Fee>(`/api/finance/fees/${id}`, payload, {
      requiresAuth: true,
    }),

  deleteFee: (id: string) =>
    apiService.delete<{ message: string }>(`/api/finance/fees/${id}`, {
      requiresAuth: true,
    }),

  // Payment operations
  getPayments: (studentId?: string, params?: PaginationParams) => {
    const url = studentId 
      ? `/api/finance/students/${studentId}/payments`
      : '/api/finance/payments'
    return apiService.getPaginated<Payment>(url, params, {
      requiresAuth: true,
    })
  },

  getPayment: (id: string) =>
    apiService.get<Payment>(`/api/finance/payments/${id}`, {
      requiresAuth: true,
    }),

  createPayment: (payload: CreatePaymentPayload) =>
    apiService.post<Payment>('/api/finance/payments', payload, {
      requiresAuth: true,
    }),

  generateReceipt: (paymentId: string) =>
    apiService.get<Blob>(`/api/finance/payments/${paymentId}/receipt`, {
      requiresAuth: true,
    }),

  refundPayment: (id: string, reason: string) =>
    apiService.post<Payment>(`/api/finance/payments/${id}/refund`, 
      { reason }, 
      { requiresAuth: true }
    ),

  // Scholarship operations
  getScholarships: (params?: PaginationParams) =>
    apiService.getPaginated<Scholarship>('/api/finance/scholarships', params, {
      requiresAuth: true,
    }),

  getScholarship: (id: string) =>
    apiService.get<Scholarship>(`/api/finance/scholarships/${id}`, {
      requiresAuth: true,
    }),

  createScholarship: (payload: CreateScholarshipPayload) =>
    apiService.post<Scholarship>('/api/finance/scholarships', payload, {
      requiresAuth: true,
    }),

  updateScholarship: (id: string, payload: Partial<CreateScholarshipPayload>) =>
    apiService.patch<Scholarship>(`/api/finance/scholarships/${id}`, payload, {
      requiresAuth: true,
    }),

  deleteScholarship: (id: string) =>
    apiService.delete<{ message: string }>(`/api/finance/scholarships/${id}`, {
      requiresAuth: true,
    }),

  // Student scholarship operations
  getStudentScholarships: (studentId?: string, params?: PaginationParams) => {
    const url = studentId 
      ? `/api/finance/students/${studentId}/scholarships`
      : '/api/finance/student-scholarships'
    return apiService.getPaginated<StudentScholarship>(url, params, {
      requiresAuth: true,
    })
  },

  awardScholarship: (payload: AwardScholarshipPayload) =>
    apiService.post<StudentScholarship>('/api/finance/student-scholarships', payload, {
      requiresAuth: true,
    }),

  revokeScholarship: (id: string, reason: string) =>
    apiService.patch<StudentScholarship>(`/api/finance/student-scholarships/${id}/revoke`, 
      { reason }, 
      { requiresAuth: true }
    ),

  // Reports
  getFinancialReport: (params: {
    startDate: string
    endDate: string
    type?: 'summary' | 'detailed'
    studentId?: string
  }) =>
    apiService.get<{
      totalRevenue: number
      totalPending: number
      totalOverdue: number
      paymentsByMethod: Record<string, number>
      feesByType: Record<string, number>
    }>('/api/finance/reports', {
      requiresAuth: true,
      // Add query parameters
    }),
}

/**
 * React Query Hooks
 */

// Student hooks
export const useFinanceStudentsQuery = (params?: PaginationParams) =>
  createQuery(
    financeQueryKeys.studentsList(params),
    () => financeEndpoints.getStudents(params)
  )()

export const useFinanceStudentQuery = (id: string, enabled = true) =>
  createQuery(
    financeQueryKeys.student(id),
    () => financeEndpoints.getStudent(id),
    { enabled: enabled && !!id }
  )()

export const useStudentFinancialSummaryQuery = (id: string, enabled = true) =>
  createQuery(
    [...financeQueryKeys.student(id), 'summary'],
    () => financeEndpoints.getStudentFinancialSummary(id),
    { enabled: enabled && !!id }
  )()

// Fee hooks
export const useFeesQuery = (studentId?: string, params?: PaginationParams) =>
  createQuery(
    financeQueryKeys.feesList(studentId, params),
    () => financeEndpoints.getFees(studentId, params)
  )()

export const useFeeQuery = (id: string, enabled = true) =>
  createQuery(
    financeQueryKeys.fee(id),
    () => financeEndpoints.getFee(id),
    { enabled: enabled && !!id }
  )()

export const useCreateFeeMutation = createMutation(
  financeEndpoints.createFee,
  {
    invalidateQueries: [financeQueryKeys.fees()],
  }
)

export const useUpdateFeeMutation = createMutation(
  ({ id, ...payload }: { id: string } & UpdateFeePayload) =>
    financeEndpoints.updateFee(id, payload),
  {
    invalidateQueries: [financeQueryKeys.fees()],
  }
)

export const useDeleteFeeMutation = createMutation(
  financeEndpoints.deleteFee,
  {
    invalidateQueries: [financeQueryKeys.fees()],
  }
)

// Payment hooks
export const usePaymentsQuery = (studentId?: string, params?: PaginationParams) =>
  createQuery(
    financeQueryKeys.paymentsList(studentId, params),
    () => financeEndpoints.getPayments(studentId, params)
  )()

export const usePaymentQuery = (id: string, enabled = true) =>
  createQuery(
    financeQueryKeys.payment(id),
    () => financeEndpoints.getPayment(id),
    { enabled: enabled && !!id }
  )()

export const useCreatePaymentMutation = createMutation(
  financeEndpoints.createPayment,
  {
    invalidateQueries: [financeQueryKeys.payments(), financeQueryKeys.fees()],
  }
)

export const useRefundPaymentMutation = createMutation(
  ({ id, reason }: { id: string; reason: string }) =>
    financeEndpoints.refundPayment(id, reason),
  {
    invalidateQueries: [financeQueryKeys.payments(), financeQueryKeys.fees()],
  }
)

// Scholarship hooks
export const useScholarshipsQuery = (params?: PaginationParams) =>
  createQuery(
    financeQueryKeys.scholarshipsList(params),
    () => financeEndpoints.getScholarships(params)
  )()

export const useScholarshipQuery = (id: string, enabled = true) =>
  createQuery(
    financeQueryKeys.scholarship(id),
    () => financeEndpoints.getScholarship(id),
    { enabled: enabled && !!id }
  )()

export const useCreateScholarshipMutation = createMutation(
  financeEndpoints.createScholarship,
  {
    invalidateQueries: [financeQueryKeys.scholarships()],
  }
)

export const useUpdateScholarshipMutation = createMutation(
  ({ id, ...payload }: { id: string } & Partial<CreateScholarshipPayload>) =>
    financeEndpoints.updateScholarship(id, payload),
  {
    invalidateQueries: [financeQueryKeys.scholarships()],
  }
)

export const useDeleteScholarshipMutation = createMutation(
  financeEndpoints.deleteScholarship,
  {
    invalidateQueries: [financeQueryKeys.scholarships()],
  }
)

// Student scholarship hooks
export const useStudentScholarshipsQuery = (studentId?: string, params?: PaginationParams) =>
  createQuery(
    financeQueryKeys.studentScholarshipsList(studentId, params),
    () => financeEndpoints.getStudentScholarships(studentId, params)
  )()

export const useAwardScholarshipMutation = createMutation(
  financeEndpoints.awardScholarship,
  {
    invalidateQueries: [financeQueryKeys.studentScholarships()],
  }
)

export const useRevokeScholarshipMutation = createMutation(
  ({ id, reason }: { id: string; reason: string }) =>
    financeEndpoints.revokeScholarship(id, reason),
  {
    invalidateQueries: [financeQueryKeys.studentScholarships()],
  }
)