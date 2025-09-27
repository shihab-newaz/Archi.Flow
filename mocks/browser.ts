/*
  MSW browser worker initialization - review notes / best practices

  - In development prefer a small, deterministic set of handlers. When adding
    new handlers, keep them well named and grouped by domain (auth, users,...).
  - The worker should be started once on app boot. Importing dynamically as
    done in `ClientProviders` is correct to avoid including MSW in production
    bundles.
  - Consider exposing a `resetHandlers()` helper here to allow tests to
    override or restore handlers between runs.
  - `onUnhandledRequest` can be configured to 'warn' or 'bypass' depending on
    whether you want strict coverage of network calls during development.
  - When using `serviceWorker.url`, ensure `public/mockServiceWorker.js` is
    present and kept in sync with MSW's version. Keep it under `public/`.

  The runtime behavior below is preserved to avoid surprises in developer
  environments. These comments are instructional only.
*/

import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)

// Export a start function consumers can call
export async function startWorker() {
  if (typeof window === 'undefined') return

  console.log('Starting MSW worker...')
  await worker.start({
    quiet: false,
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
    onUnhandledRequest: (request) => {
      // Only log unhandled requests that are not to localhost:3333
      if (!request.url.includes('localhost:3333')) {
        console.log('MSW: Unhandled request:', request.method, request.url)
      }
    },
  })
  console.log('MSW worker started successfully')
}
