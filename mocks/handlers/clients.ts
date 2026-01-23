import { http, HttpResponse } from 'msw'
import type { Client } from '@/types'
import { createMockClient } from '../factories'

let clients: Client[] = [
  createMockClient({
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '555-0101',
    company: 'Tech Corp',
  }),
  createMockClient({
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    phone: '555-0102',
  }),
]

export const clientHandlers = [
  http.get('/api/clients', () => {
    return HttpResponse.json(clients)
  }),

  http.post('/api/clients', async ({ request }) => {
    const payload = (await request.json()) as Omit<Client, 'id'>
    const client: Client = {
      ...payload,
      id: Math.random().toString(36).slice(2, 9),
    }
    clients = [client, ...clients]
    return HttpResponse.json(client, { status: 201 })
  }),
]
