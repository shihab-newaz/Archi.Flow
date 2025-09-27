# Copilot / AI contributor instructions

This file gives focused, actionable guidance for AI coding agents working in this repo (a Next.js 15 + TypeScript app using Tailwind/shadcn, Zustand and TanStack Query).

Keep suggestions small, concrete, and follow existing project conventions. Reference these files when in doubt: `app/layout.tsx`, `lib/apiClient.ts`, `lib/auth-helpers.ts`, `modules/auth/**`, `services/**`, `components/ui/**`, `components/custom/**`, `store/zustand/**`, and `mocks/**`.

Key rules (short):
- App Router / Server vs Client: files under `app/` are Server Components by default. Add `"use client"` only at the top of components that need client-side hooks/state (example: `modules/auth/components/LoginForm.tsx`).
- API: use `lib/apiClient.ts` (apiClient.get/post/put/etc) for HTTP. It wraps fetch, sets credentials: 'include', default cache `no-store`, and supports `requiresAuth` which reads cookies on the server and local storage on the client. Default API base: `process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333'`.
- Auth: auth helpers live in `lib/auth-helpers*.ts`. The codebase relies on a cookie name constant (`AUTH_COOKIE_NAME`) for server-side reads — preserve this pattern when adding auth flows.
- Services & React Query: add endpoint wrappers in `services/modules/*.ts` and expose hooks from `services/index.ts` (mutations use optimistic invalidation where appropriate). Follow existing `useLoginMutation` usage in `LoginForm.tsx` for shape and onSuccess/onError handlers.
- UI components: `components/ui/` contains shadcn primitives. Wrap or compose them in `components/custom/` when you need reusable variants (see `Button.tsx`, `Input.tsx`). Use `forwardRef` and TypeScript interfaces for props.
- State: client state uses Zustand stores under `store/zustand/` (e.g. `useUiStore`), keep stores small and expose setters/selectors.

Developer workflows & scripts:
- Start dev: `npm run dev` (uses `next dev --turbopack`).
- Build: `npm run build` (`next build --turbopack`), Start production: `npm run start`.
- Lint / Format: `npm run lint`, `npm run format`.
- Mocking: MSW is used for local mocking. Worker file is `public/mockServiceWorker.js` and mocks are in `mocks/` (see `mocks/browser.ts` and `mocks/handlers.ts`). When adding API mocks, update `mocks/handlers.ts` and regenerate the worker if needed.

Patterns and gotchas:
- Server cookie access: `lib/apiClient.ts` uses `next/headers` when running server-side — avoid reading `document.cookie` in server components.
- HTTP errors: `apiClient` throws `ApiError` with `{status,message,details}`; callers expect this shape (see `LoginForm` error handling). Keep that shape when creating new error flows.
- 204 responses: `apiClient` returns `undefined` for 204 — handle that in callers.
- Content negotiation: `apiClient` checks Content-Type; non-JSON returns text.
- Credentials: fetch uses `credentials: 'include'` — backend sessions/cookies assumed.

When adding code (recommended checklist):
1. Add service helper in `services/modules/<area>.ts` using `apiClient`.
2. If UI, prefer composing shadcn primitives in `components/custom/` and add props interfaces.
3. Add React Query hooks or use existing `services` exports for data fetching/mutations.
4. Add MSW handlers in `mocks/handlers.ts` for local development if the endpoint is not available.
5. Run `npm run lint` and `npm run dev` locally (Turbopack) to validate.

Examples to reference:
- API wrapper: `lib/apiClient.ts` — use `apiClient.post<AuthResponse>('/auth/login', { json: payload })` or the provided `services` helpers.
- Login flow: `modules/auth/components/LoginForm.tsx` shows form validation (zod + react-hook-form), mutation usage, toast handling, and redirect on success.
- Zustand: `store/zustand/ui.ts` shows toggle pattern for UI state.

Do not change:
- Global layout and provider wiring in `app/layout.tsx` and `components/providers/ClientProviders.tsx` without verifying SSR/CSR implications.
- `public/mockServiceWorker.js` location — MSW tooling expects it under `public/` (see package.json `msw.workerDirectory`).

If anything is ambiguous, ask which environment (local dev with MSW vs production API) the change targets. After edits, run lint and confirm no compile or runtime TypeScript or Next.js errors.

---
Please review and tell me any parts you want expanded (examples, more file anchors, or CI notes) and I will iterate.
