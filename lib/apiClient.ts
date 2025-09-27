import { AUTH_COOKIE_NAME, getClientToken } from '@/lib/auth-helpers'

const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? '' // Use relative URLs in development for MSW
  : (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333')

interface ApiRequestConfig<TBody = unknown> extends Omit<RequestInit, 'body'> {
  json?: TBody
  requiresAuth?: boolean
  body?: BodyInit | null
}

export interface ApiErrorShape {
  status: number
  message: string
  details?: unknown
}

export class ApiError extends Error {
  readonly status: number
  readonly details?: unknown

  constructor({ status, message, details }: ApiErrorShape) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

const resolveAuthHeader = async (
  requiresAuth?: boolean
): Promise<string | undefined> => {
  if (!requiresAuth) {
    return undefined
  }

  if (typeof window !== 'undefined') {
    const token = getClientToken()
    return token ? `Bearer ${token}` : undefined
  }

  try {
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value
    return token ? `Bearer ${token}` : undefined
  } catch (error) {
    console.error('Failed to resolve auth token from cookies', error)
    return undefined
  }
}

const resolveResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let payload: unknown = null

    try {
      payload = await response.json()
    } catch {
      payload = await response.text()
    }

    const message =
      typeof payload === 'object' && payload !== null && 'message' in payload
        ? String((payload as Record<string, unknown>).message)
        : response.statusText || 'Unexpected API error'

    throw new ApiError({
      status: response.status,
      message,
      details: payload,
    })
  }

  if (response.status === 204) {
    return undefined as T
  }

  const contentType = response.headers.get('Content-Type') ?? ''
  if (contentType.includes('application/json')) {
    return (await response.json()) as T
  }

  return (await response.text()) as T
}

const apiFetch = async <TResponse, TBody = unknown>(
  path: string,
  { json, requiresAuth = false, headers, ...init }: ApiRequestConfig<TBody> = {}
): Promise<TResponse> => {
  const resolvedHeaders = new Headers(headers)

  if (json !== undefined && !resolvedHeaders.has('Content-Type')) {
    resolvedHeaders.set('Content-Type', 'application/json')
  }

  const authHeader = await resolveAuthHeader(requiresAuth)
  if (authHeader && !resolvedHeaders.has('Authorization')) {
    resolvedHeaders.set('Authorization', authHeader)
  }

  const target = path.startsWith('http') ? path : `${API_BASE_URL}${path}`

  // Helpful debug logging in development so we can see exact request targets
  if (process.env.NODE_ENV === 'development') {
    try {
      // eslint-disable-next-line no-console
      console.debug('[apiClient] Request target:', target)
    } catch {}
  }

  const response = await fetch(target, {
    ...init,
    method: init.method ?? (json ? 'POST' : 'GET'),
    headers: resolvedHeaders,
    body: json !== undefined ? JSON.stringify(json) : init.body,
    credentials: 'include',
    cache: init.cache ?? 'no-store',
  })

  return resolveResponse<TResponse>(response)
}

const withMethod =
  (method: ApiRequestConfig['method']) =>
  async <TResponse, TBody = unknown>(
    path: string,
    options?: ApiRequestConfig<TBody>
  ): Promise<TResponse> =>
    apiFetch<TResponse, TBody>(path, { ...options, method })

export const apiClient = {
  request: apiFetch,
  get: withMethod('GET'),
  post: withMethod('POST'),
  put: withMethod('PUT'),
  patch: withMethod('PATCH'),
  delete: withMethod('DELETE'),
}

export type { ApiRequestConfig }
