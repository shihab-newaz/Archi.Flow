/**
 * Server-side auth helpers
 *
 * This file contains server-only authentication utilities.
 * It should only be imported by server components or server actions.
 */

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const AUTH_COOKIE_NAME = 'lms.auth.token'

/**
 * Require authentication on the server side
 * Redirects to login if not authenticated
 */
export async function requireAuth() {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value

  if (!token) {
    redirect('/login')
  }

  return token
}

/**
 * Get the auth token from server-side cookies
 */
export async function getServerToken() {
  const cookieStore = await cookies()
  return cookieStore.get(AUTH_COOKIE_NAME)?.value || null
}

/**
 * Check if user is authenticated on the server side
 */
export async function isAuthenticatedServer() {
  const token = await getServerToken()
  return Boolean(token)
}

/**
 * Clear auth token from server-side cookies
 */
export async function clearServerToken() {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_COOKIE_NAME)
}