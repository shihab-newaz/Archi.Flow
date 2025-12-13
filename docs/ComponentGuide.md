# Feature Development Guidelines

**Project:** ArchFirm Manager  
**Stack:** Next.js 15 (React 19), Server Actions, Prisma  
**Strict Rule:** Modular Feature Architecture

---

## 1. Directory Structure

We avoid the "sock drawer" method (grouping by file type). We group by **Feature**.

```
src/
├── components/
│   ├── ui/                # 🧱 Shadcn Primitives (Button, Input, Card) - DO NOT EDIT LOGIC HERE
│   └── custom/            # 🧩 Global Reusable Components (e.g., FileUploader, DataTable)
├── features/              # 📦 THE FEATURE MODULES
│   ├── projects/          # Feature: Projects
│   │   ├── components/    # Feature-specific UI (ProjectCard, PhaseTimeline)
│   │   ├── server/        # Server Actions & Data Fetchers
│   │   │   ├── actions.ts # Mutations (createProject, updatePhase)
│   │   │   └── data.ts    # Queries (getProjectById, listProjects)
│   │   └── types.ts       # Feature-specific TS types
│   ├── finance/
│   └── clients/
├── app/                   # 🚦 Routing Layer
│   ├── (dashboard)/
│   │   ├── projects/
│   │   │   ├── page.tsx   # Server Component (Fetches data -> Renders Feature Components)
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   └── ...
└── lib/                   # 🛠️ Global Utilities (prisma, utils, auth)
```

---

## 2. Component Hierarchy Strategy

### Level 1: `components/ui` (The Atoms)

- **Source:** shadcn/ui CLI
- **Rule:** Do not modify the logic of these files unless fixing a bug
- **Styling:** Customize the classes in these files once to match `docs/UI_UX_Guidelines.md` (e.g., removing rounded corners from buttons)

### Level 2: `components/custom` (The Molecules)

- **Source:** Custom built
- **Rule:** Components used across multiple features
- **Examples:** SortableHeader, StatusBadge, PaginationControl

### Level 3: `features/{feature}/components` (The Organisms)

- **Source:** Custom built
- **Rule:** Components specific to one business domain
- **Examples:** ProjectPhaseEditor, InvoiceGeneratorForm
- **Import Rule:** Can import from `components/ui` and `components/custom`, but NOT from other features (unless strictly shared via a shared folder)

---

## 3. Data Fetching (React 19 Patterns)

### Pattern A: Data Fetching (Server Components)

**Where:** `app/(dashboard)/projects/page.tsx`  
**Method:** Direct Prisma calls via `features/projects/server/data.ts`

```typescript
// features/projects/server/data.ts
import { prisma } from "@/lib/prisma";

export async function getProjects() {
  // No API routes needed. Direct DB access.
  return await prisma.project.findMany({
    include: { client: true },
    orderBy: { updatedAt: 'desc' }
  });
}
```

```typescript
// app/(dashboard)/projects/page.tsx
import { getProjects } from "@/features/projects/server/data";
import { ProjectGrid } from "@/features/projects/components/project-grid";

export default async function ProjectsPage() {
  const projects = await getProjects(); // ⚡ Fetched on server

  return (
    <main>
      <h1 className="font-display text-3xl">Projects</h1>
      {/* Pass data to Client Components */}
      <ProjectGrid initialData={projects} /> 
    </main>
  );
}
```

### Pattern B: Mutations (Server Actions)

**Where:** `features/projects/server/actions.ts`  
**Method:** Server Actions invoked by Client Components

```typescript
// features/projects/server/actions.ts
'use server'

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const projectSchema = z.object({ name: z.string().min(1) });

export async function createProject(prevState: any, formData: FormData) {
  const data = projectSchema.parse(Object.fromEntries(formData));
  
  await prisma.project.create({ data });
  
  revalidatePath('/projects'); // 🔄 Purge cache
  return { message: "Project created" };
}
```

### Pattern C: Streaming & Suspense

**Where:** Heavy dashboards  
**Method:** Wrap slow components in `<Suspense>`

```typescript
// app/(dashboard)/page.tsx
import { Suspense } from "react";
import { FinancialSummary } from "@/features/finance/components/summary";
import { SkeletonCard } from "@/components/ui/skeleton";

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<SkeletonCard />}>
        {/* This component fetches its own data internally via async/await */}
        <FinancialSummary />
      </Suspense>
    </div>
  );
}
```

---

## 4. CSS & Styling Strategy

- **Tailwind First:** 95% of styling should be Tailwind utility classes
- **Shadcn cn():** Always use the `cn()` utility to merge classes
- **Modules (.module.css):** strictly for:
  - Complex CSS Grid layouts (Masonry)
  - Specific print layouts for Invoices (`@media print`)
  - Complex animations not supported by Tailwind/Framer

---

## 5. Summary Checklist for New Features

1. Create `features/{name}` folder
2. Define DB queries in `server/data.ts`
3. Define mutations in `server/actions.ts`
4. Build feature-specific UI in `components/`
5. Compose the page in `app/(dashboard)/{name}/page.tsx`