"use client"

import React, { PropsWithChildren, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { ThemeProvider } from 'next-themes'

export default function ClientProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 60_000,
          },
          mutations: {
            retry: 0,
          },
        },
      })
  )
  // Start MSW as early as possible in development to avoid races where
  // network requests fire before the service worker is active. We import
  // the worker at module load time (client-side only) so it initializes
  // before React effects run.
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    import('@/mocks/browser')
      .then(({ startWorker }) => {
        console.log('Initializing MSW (module load)...')
        return startWorker()
      })
      .then(() => {
        console.log('MSW initialized (module load)')
      })
      .catch((err: unknown) => {
        console.error('Failed to initialize MSW (module load):', err)
      })
  }

  return (
    <ThemeProvider attribute="class" enableSystem defaultTheme="system">
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  )
}
