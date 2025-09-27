/*
  Root handlers index - re-exports domain-specific handlers.
  Keep this file minimal so importing `mocks/handlers` remains stable for the
  rest of the app. Add new domain handler modules under `mocks/handlers/` and
  re-export them here.
*/

import { authHandlers } from './handlers/auth'

export const handlers = [...authHandlers]
