/*
  Root handlers index - re-exports domain-specific handlers.
  Keep this file minimal so importing `mocks/handlers` remains stable for the
  rest of the app. Add new domain handler modules under `mocks/handlers/` and
  re-export them here.
*/

import { authHandlers } from './handlers/auth'
import { projectHandlers } from './handlers/projects'
import { clientHandlers } from './handlers/clients'
import { taskHandlers } from './handlers/tasks'

export const handlers = [
  ...authHandlers,
  ...projectHandlers,
  ...clientHandlers,
  ...taskHandlers,
]
