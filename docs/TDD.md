# Technical Design Document (TDD)

**Project:** ArchFirm Manager  
**Stack:** Next.js, Prisma, PostgreSQL

---

## 1. Architecture

- **Type:** Monolith (Next.js App Router)
- **Frontend:** React Server Components (RSC) + Client Components
- **Backend:** Next.js Server Actions
- **Database:** PostgreSQL (Relational)
- **ORM:** Prisma
- **Auth:** NextAuth.js v5 (JWT Strategy)
- **Styling:** Tailwind CSS + Shadcn/UI

---

## 2. Database Schema (Prisma)

See `schema.prisma` file for implementation.

### Key Models

- **User:** Supports Roles (ADMIN, ARCHITECT, FINANCE)
- **Client:** One-to-Many with Projects
- **Project:** Central entity. Contains Phases, Docs, Invoices
- **ProjectPhase:** Orderable list (Concept → Design → Execution)
- **DesignDocument:** Stores fileUrl (S3/UploadThing link), not binary
- **Invoice:** Linked to Project & Client
- **Payment:** Linked to Invoice

---

## 3. Project Structure

```
/src
  /app
    /(auth)          # Login route
    /(dashboard)     # Protected layout with Sidebar
      /projects      # List, Detail, Create
      /clients       # Client management
      /finance       # Finance dashboard
      /api           # Webhooks (if needed)
  /components
    /ui              # Shadcn primitives
    /features        # Domain specific (e.g., InvoiceTable)
  /lib
    prisma.ts        # DB Client
    utils.ts         # Helpers
  /server
    /actions         # Server Actions (Mutations)
    /data            # Data Fetchers (Queries)
```

---

## 4. Implementation Strategy

### 4.1 Authentication & RBAC

- Use NextAuth Middleware (`middleware.ts`) to protect routes
- Inject user Role into the Session object
- **Rule:** ARCHITECT role cannot access `/finance` routes or API actions

### 4.2 Data Fetching

- Use Server Components for fetching data (Direct Prisma calls)
- Use Server Actions for Form submissions (POST/PUT/DELETE)
- Use Zod for schema validation on both Client and Server

### 4.3 File Handling

- Offload storage to S3 or UploadThing
- Store only the URL and Metadata in Postgres

---

## 5. Roadmap

- **Sprint 1:** Init repo, DB setup, Auth, User Management
- **Sprint 2:** Client & Project CRUD, Phase logic
- **Sprint 3:** Financial Module (Invoices/Payments/Calcs)
- **Sprint 4:** Doc Registry, Dashboard Charts, UI Polish