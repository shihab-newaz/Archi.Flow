/**
 * MSW (Mock Service Worker) initialization
 *
 * This file handles MSW setup for development environments.
 * It should be imported at the top level of your app (before React starts)
 * to avoid race conditions with API calls.
 */

export async function initMSW() {
  // Only initialize MSW in development and on the client side
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') {
    return
  }

  try {
    console.log('🚀 Initializing MSW...')

    // Dynamic import to avoid including MSW in production bundles
    const { startWorker } = await import('@/mocks/browser')

    await startWorker()

    console.log('✅ MSW initialized successfully')
  } catch (error) {
    console.error('❌ Failed to initialize MSW:', error)

    // In development, we want to know if MSW fails to start
    if (process.env.NODE_ENV === 'development') {
      throw error
    }
  }
}