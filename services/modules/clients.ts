import { apiService, createMutation, createQuery } from '../api'
import type { Client } from '@/types'

export interface CreateClientPayload extends Omit<Client, 'id'> {}

export const clientQueryKeys = {
  all: ['clients'] as const,
  list: () => [...clientQueryKeys.all, 'list'] as const,
}

export const clientEndpoints = {
  getClients: () =>
    apiService.get<Client[]>('/api/clients', {
      requiresAuth: true,
    }),

  createClient: (payload: CreateClientPayload) =>
    apiService.post<Client>('/api/clients', payload, {
      requiresAuth: true,
    }),
}

export const useClientsQuery = createQuery(
  clientQueryKeys.list(),
  clientEndpoints.getClients,
  {
    staleTime: 60_000,
  }
)

export const useCreateClientMutation = createMutation(
  clientEndpoints.createClient,
  {
    invalidateQueries: [clientQueryKeys.list()],
  }
)
