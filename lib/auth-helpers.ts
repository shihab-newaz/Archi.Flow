/**
 * Client-side auth helpers
 *
 * This file contains client-only authentication utilities.
 * For server-side auth utilities, use '@/lib/auth-helpers-server'
 */

import { redirect } from 'next/navigation'

// Constants (can be used on both client and server)
export const AUTH_COOKIE_NAME = 'lms.auth.token'
const TOKEN_STORAGE_KEY = 'lms.auth.token'

// Client-side utilities
export const getClientToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage.getItem(TOKEN_STORAGE_KEY)
}

export const persistClientToken = (
  token: string | null,
  maxAgeSeconds = 60 * 60 * 24 * 7
) => {
  if (typeof window === 'undefined') {
    return
  }

  const isSecure = window.location.protocol === 'https:'
  const secure = isSecure ? '; secure' : ''

  if (token) {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token)
    document.cookie = `${AUTH_COOKIE_NAME}=${token}; path=/; max-age=${maxAgeSeconds}; samesite=lax${secure}`
  } else {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY)
    document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0${secure}`
  }
}

export const clearClientToken = () => persistClientToken(null)

export const isAuthenticatedClient = () => Boolean(getClientToken())

// Client-side redirect utility (for client components)
export const redirectToLogin = () => {
  if (typeof window !== 'undefined') {
    window.location.href = '/login'
  } else {
    redirect('/login')
  }
}
