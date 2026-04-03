import { apiService, createMutation, createQuery, type PaginationParams } from '../api'

export type PaymentStatus = 'PENDING' | 'PARTIAL' | 'PAID'
export type PaymentMethod = 'CASH' | 'BANK' | 'MOBILE'

export interface InvoicePayment {
  id: string
  projectId: string
  projectName?: string
  clientId: string
  clientName?: string | null
  amountCents: number
  currency: string
  status: PaymentStatus
  dueDate: string | null
  description: string | null
  paidCents: number
  outstandingCents: number
  createdAt: string
  updatedAt: string
}

export interface PaymentTransaction {
  id: string
  paymentId: string
  amountCents: number
  method: PaymentMethod
  reference: string | null
  recordedBy: string | null
  recorderName?: string | null
  recordedAt: string
}

export interface ProjectPaymentSummary {
  projectId: string
  invoiceTotal: number
  paidTotal: number
  outstanding: number
  currency: string
}

export interface PaymentsQueryParams extends PaginationParams {
  projectId?: string
  clientId?: string
  status?: PaymentStatus
}

interface PaginatedPaymentsResponse {
  data: InvoicePayment[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface CreateInvoicePayload {
  projectId: string
  clientId: string
  amountCents: number
  currency?: string
  dueDate?: string
  description?: string
}

export interface UpdateInvoicePayload {
  amountCents?: number
  dueDate?: string | null
  description?: string | null
  status?: PaymentStatus
}

export interface RecordPaymentTransactionPayload {
  amountCents: number
  method: PaymentMethod
  reference?: string
}

export const paymentQueryKeys = {
  all: ['payments'] as const,
  list: (params?: PaymentsQueryParams) => [...paymentQueryKeys.all, 'list', params] as const,
  detail: (id: string) => [...paymentQueryKeys.all, 'detail', id] as const,
  transactions: (id: string) => [...paymentQueryKeys.all, 'transactions', id] as const,
  projectSummary: (projectId: string) => [...paymentQueryKeys.all, 'summary', projectId] as const,
}

export const paymentEndpoints = {
  getPayments: (params?: PaymentsQueryParams) => {
    const searchParams = new URLSearchParams()

    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.projectId) searchParams.set('projectId', params.projectId)
    if (params?.clientId) searchParams.set('clientId', params.clientId)
    if (params?.status) searchParams.set('status', params.status)

    const path = searchParams.toString()
      ? `/api/payments?${searchParams.toString()}`
      : '/api/payments'

    return apiService.get<PaginatedPaymentsResponse>(path, {
      requiresAuth: true,
    })
  },

  getPayment: (id: string) =>
    apiService.get<InvoicePayment>(`/api/payments/${id}`, {
      requiresAuth: true,
    }),

  createInvoice: (payload: CreateInvoicePayload) =>
    apiService.post<InvoicePayment, CreateInvoicePayload>('/api/payments', payload, {
      requiresAuth: true,
    }),

  updateInvoice: (id: string, payload: UpdateInvoicePayload) =>
    apiService.patch<InvoicePayment, UpdateInvoicePayload>(`/api/payments/${id}`, payload, {
      requiresAuth: true,
    }),

  getTransactions: (paymentId: string) =>
    apiService.get<PaymentTransaction[]>(`/api/payments/${paymentId}/transactions`, {
      requiresAuth: true,
    }),

  recordTransaction: (paymentId: string, payload: RecordPaymentTransactionPayload) =>
    apiService.post<PaymentTransaction, RecordPaymentTransactionPayload>(
      `/api/payments/${paymentId}/transactions`,
      payload,
      {
        requiresAuth: true,
      }
    ),

  getProjectSummary: (projectId: string) =>
    apiService.get<ProjectPaymentSummary>(`/api/payments/project/${projectId}/summary`, {
      requiresAuth: true,
    }),
}

export const useInvoicePaymentsQuery = (params?: PaymentsQueryParams) =>
  createQuery(
    paymentQueryKeys.list(params),
    () => paymentEndpoints.getPayments(params).then((response) => response.data),
    {
      staleTime: 30_000,
    }
  )()

export const useInvoicePaymentQuery = (id: string, enabled = true) =>
  createQuery(
    paymentQueryKeys.detail(id),
    () => paymentEndpoints.getPayment(id),
    {
      enabled: enabled && !!id,
    }
  )()

export const usePaymentTransactionsQuery = (paymentId: string, enabled = true) =>
  createQuery(
    paymentQueryKeys.transactions(paymentId),
    () => paymentEndpoints.getTransactions(paymentId),
    {
      enabled: enabled && !!paymentId,
      staleTime: 10_000,
    }
  )()

export const useProjectPaymentSummaryQuery = (projectId: string, enabled = true) =>
  createQuery(
    paymentQueryKeys.projectSummary(projectId),
    () => paymentEndpoints.getProjectSummary(projectId),
    {
      enabled: enabled && !!projectId,
      staleTime: 30_000,
    }
  )()

export const useCreateInvoiceMutation = createMutation(paymentEndpoints.createInvoice, {
  invalidateQueries: [paymentQueryKeys.all],
})

export const useUpdateInvoiceMutation = createMutation(
  ({ id, ...payload }: { id: string } & UpdateInvoicePayload) =>
    paymentEndpoints.updateInvoice(id, payload),
  {
    invalidateQueries: [paymentQueryKeys.all],
  }
)

export const useRecordPaymentTransactionMutation = createMutation(
  ({ paymentId, ...payload }: { paymentId: string } & RecordPaymentTransactionPayload) =>
    paymentEndpoints.recordTransaction(paymentId, payload),
  {
    invalidateQueries: [paymentQueryKeys.all],
  }
)
