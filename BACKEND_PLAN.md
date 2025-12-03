# Backend Implementation Plan

This document outlines the plan for implementing the backend logic for the Architecture Firm Management application using **Next.js Server Actions** and **Prisma**.

## 1. Technology Stack

-   **Framework**: Next.js 15 (App Router)
-   **Database**: PostgreSQL (via **Supabase**)
-   **ORM**: Prisma
-   **Validation**: Zod
-   **API Pattern**: Server Actions (for mutations) + Direct DB calls (for RSC data fetching)

## 2. Directory Structure

We will organize the backend logic into `app/actions` for mutations and `lib/data` for data fetching (or keep fetching co-located if simple).

```
app/
  actions/           # Server Actions (Mutations)
    auth.ts          # Login/Logout (if needed)
    projects.ts      # Create, Update, Delete Projects
    clients.ts       # Client management
    finance.ts       # Invoices, Payments, Expenses
    tasks.ts         # Task management
  (protected)/       # App Routes
    projects/
      page.tsx       # Fetches data directly via Prisma
lib/
  db.ts              # Prisma Client instance
  validations/       # Zod schemas
    project.ts
    client.ts
    finance.ts
prisma/
  schema.prisma      # Database Schema
```

## 3. Implementation Steps

### Step 1: Database Setup
-   Initialize Prisma: `npx prisma init`
-   Update `prisma/schema.prisma` with the schema defined in `DB_PLAN.md`.
-   Run migration: `npx prisma migrate dev --name init`

### Step 2: Validation Schemas (Zod)
Create Zod schemas in `lib/validations` to ensure data integrity before hitting the DB.

-   **ProjectSchema**: Validates project creation/updates (dates, budget, status).
-   **ClientSchema**: Validates client details (email, phone).
-   **InvoiceSchema**: Validates invoice items and totals.

### Step 3: Server Actions (Mutations)
Implement Server Actions in `app/actions`. These will:
1.  Validate input using Zod.
2.  Check authentication (mock or real).
3.  Perform DB operation via Prisma.
4.  `revalidatePath` to update UI.

**Key Actions:**
-   `createProject(data)`
-   `updateProjectStatus(id, status)`
-   `createClient(data)`
-   `createInvoice(data)`
-   `recordPayment(invoiceId, amount)`

### Step 4: Data Fetching
For Server Components (Pages), we will fetch data directly using Prisma.
For Client Components (if needed), we can pass data down or use Server Actions as getters (though direct fetch in RSC is preferred).

## 4. API & Integration Strategy

-   **Forms**: Use `react-hook-form` combined with Server Actions.
-   **Optimistic Updates**: Use `useOptimistic` hook for immediate UI feedback on status changes (e.g., moving a task).
-   **Error Handling**: Actions will return `{ success: boolean, error?: string }` to handle failures gracefully.

## 5. Immediate Next Actions
1.  Install Prisma and Zod.
2.  Set up the `schema.prisma` file.
3.  Generate the Prisma Client.
