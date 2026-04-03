'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

import { clearClientAuthState } from '@/lib/auth-token'
import { authQueryKeys } from '@/services'

const SESSION_EXPIRED_EVENT = 'auth:session-expired'

export default function AuthSessionHandler() {
  const router = useRouter()
  const pathname = usePathname()
  const queryClient = useQueryClient()

  useEffect(() => {
    const handleSessionExpired = (event: Event) => {
      const customEvent = event as CustomEvent<{ fromPath?: string }>
      const fromPath = customEvent.detail?.fromPath ?? pathname ?? '/'

      clearClientAuthState()
      queryClient.removeQueries({ queryKey: authQueryKeys.all })

      toast.error('Your session expired. Please sign in again.')

      if (pathname?.startsWith('/login') || pathname?.startsWith('/register')) {
        return
      }

      router.replace(`/login?from=${encodeURIComponent(fromPath)}`)
    }

    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired)

    return () => {
      window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired)
    }
  }, [pathname, queryClient, router])

  return null
}