'use client'

import { PropsWithChildren, useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/hooks/use-theme'

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

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      import('@/mocks/browser')
        .then(({ startWorker }) => {
          console.log('Initializing MSW...')
          return startWorker()
        })
        .then(() => {
          console.log('MSW initialized successfully')
        })
        .catch((err: unknown) => {
          console.error('Failed to initialize MSW:', err)
        })
    }
  }, [])

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  )
}
