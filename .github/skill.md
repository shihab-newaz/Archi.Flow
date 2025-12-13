# Claude Skill: ArchFirm Manager Frontend

**Project:** ArchFirm Manager  
**Stack:** Next.js 15 (React 19), Prisma, Shadcn/UI, Tailwind CSS, Framer Motion  
**Theme:** "Structural Innovation" - Professional, Asymmetric, Raw

---

## 🎯 Core Principles

You are building a premium architectural firm management system. The frontend must reflect the precision, structure, and professionalism of architectural design itself.

### The Three Pillars:
1. **Modular Feature Architecture** - Group by feature, not file type
2. **Structural Design Language** - Sharp, technical, no "SaaS slop"
3. **React 19 Server Patterns** - Server Components + Server Actions

---

## 🚫 Anti-Slop Directive (NON-NEGOTIABLE)

**NEVER use:**
- ❌ Generic fonts (Inter, Roboto, San Francisco)
- ❌ Blurred purple/pink gradient blobs
- ❌ Soft, floaty box shadows
- ❌ Plain `bg-white` for main canvas (use `bg-zinc-50` or texture)
- ❌ Rounded pill buttons (`rounded-full`)
- ❌ The "sock drawer" pattern (grouping by file type)

**ALWAYS use:**
- ✅ Sharp corners or micro-radius (`rounded-[2px]`)
- ✅ Hard, crisp shadows (`shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`)
- ✅ Explicit borders (`border border-zinc-900`)
- ✅ Feature-based directory structure
- ✅ Designated typography system (Display/Sans/Mono)

---

## 📁 Directory Structure

```
src/
├── components/
│   ├── ui/                # 🧱 Shadcn primitives - DO NOT MODIFY LOGIC
│   └── custom/            # 🧩 Global reusable components
├── features/              # 📦 FEATURE MODULES (The Core Pattern)
│   ├── projects/
│   │   ├── components/    # ProjectCard, PhaseTimeline
│   │   ├── server/
│   │   │   ├── actions.ts # Mutations (createProject)
│   │   │   └── data.ts    # Queries (getProjects)
│   │   └── types.ts
│   ├── finance/
│   └── clients/
├── app/                   # 🚦 Routing layer (Server Components)
│   ├── (dashboard)/
│   │   ├── projects/
│   │   │   └── page.tsx
└── lib/                   # 🛠️ Utilities (prisma, utils, auth)
```

### Component Hierarchy:
- **Level 1 (Atoms):** `components/ui` - Shadcn primitives, customize once for project theme
- **Level 2 (Molecules):** `components/custom` - Cross-feature components (StatusBadge, DataTable)
- **Level 3 (Organisms):** `features/{name}/components` - Feature-specific (ProjectPhaseEditor)

**Import Rule:** Feature components can import from `ui` and `custom`, but NOT from other features.

---

## 🎨 Design System

### Typography Hierarchy

```typescript
// Headers & Titles
className="font-display text-3xl font-semibold tracking-tight"
// Font: Clash Display (Cabinet Grotesk fallback)
// Usage: Page titles, KPI numbers, Hero sections

// UI Text & Navigation
className="font-sans text-sm"
// Font: Space Grotesk
// Usage: Buttons, labels, sidebar links

// Data & Financials
className="font-mono text-xs uppercase tracking-tighter"
// Font: JetBrains Mono / IBM Plex Mono
// Usage: Invoice amounts, dates, IDs, tables
```

### Color Palette

```typescript
// Backgrounds
bg-zinc-50        // Canvas "Paper" layer
bg-white          // Surface (cards/inputs only)

// Text
text-zinc-900     // Primary foreground
text-zinc-500     // Muted

// Accents
text-[#FF4F00]    // Brand Primary (International Orange)
text-[#00D26A]    // Success (Emerald Green)
text-[#FF0033]    // Alert (Drafting Red)
```

### Component Styling Standards

**Buttons:**
```tsx
<Button className="rounded-[2px] border border-zinc-900 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all uppercase text-xs tracking-wide">
  Create Project
</Button>
```

**Cards:**
```tsx
<Card className="border-zinc-200 p-6 shadow-none">
  {/* Crisp borders, spacious padding, no blur */}
</Card>
```

**Inputs (Architectural Line Style):**
```tsx
<Input className="bg-transparent border-b-2 border-zinc-200 rounded-none px-0 focus:border-black focus:ring-0" />
```

**Layout Grid:**
```tsx
// Sidebar
<aside className="fixed left-0 w-64 border-r border-zinc-200 bg-zinc-50" />

// Header
<header className="h-16 border-b border-zinc-200" />
```

---

## ⚡ Data Fetching Patterns (TanStack Query + Server Actions)

### Pattern A: TanStack Query for Data Fetching

**Server-side data functions:**
```typescript
// features/projects/server/data.ts
import { prisma } from "@/lib/prisma";

export async function getProjects() {
  return await prisma.project.findMany({
    include: { client: true },
    orderBy: { updatedAt: 'desc' }
  });
}

export async function getProjectById(id: string) {
  return await prisma.project.findUnique({
    where: { id },
    include: { client: true, phases: true }
  });
}
```

**Client-side hooks with TanStack Query:**
```typescript
// features/projects/hooks/use-projects.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProjects } from "../server/data";

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: () => getProjectById(id),
    enabled: !!id,
  });
}
```

**Usage in components:**
```typescript
// features/projects/components/project-list.tsx
"use client"

import { useProjects } from "../hooks/use-projects";
import { ProjectCard } from "./project-card";

export function ProjectList() {
  const { data: projects, isLoading, error } = useProjects();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading projects</div>;

  return (
    <div className="grid gap-4">
      {projects?.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
```

**Page composition:**
```typescript
// app/(dashboard)/projects/page.tsx
import { ProjectList } from "@/features/projects/components/project-list";

export default function ProjectsPage() {
  return (
    <main className="p-8">
      <h1 className="font-display text-3xl mb-6">Projects</h1>
      <ProjectList />
    </main>
  );
}
```

### Pattern B: Server Actions for Mutations

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
  revalidatePath('/projects');
  return { message: "Project created" };
}
```


**Server Actions:**
```typescript
// features/projects/server/actions.ts
'use server'

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const projectSchema = z.object({ 
  name: z.string().min(1),
  clientId: z.string(),
  type: z.enum(['RESIDENTIAL', 'COMMERCIAL', 'INTERIOR'])
});

export async function createProject(data: z.infer<typeof projectSchema>) {
  const validated = projectSchema.parse(data);
  const project = await prisma.project.create({ data: validated });
  revalidatePath('/projects');
  return project;
}

export async function updateProject(id: string, data: Partial<z.infer<typeof projectSchema>>) {
  const project = await prisma.project.update({ where: { id }, data });
  revalidatePath('/projects');
  return project;
}
```

**TanStack Query Mutation Hook:**
```typescript
// features/projects/hooks/use-create-project.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject } from "../server/actions";
import { toast } from "sonner";

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success("Project created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create project");
      console.error(error);
    },
  });
}
```

**Usage in Form Component:**
```typescript
// features/projects/components/create-project-form.tsx
"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateProject } from "../hooks/use-create-project";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CreateProjectForm() {
  const { mutate, isPending } = useCreateProject();
  const form = useForm({
    resolver: zodResolver(projectSchema),
  });

  const onSubmit = (data) => {
    mutate(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Input {...form.register("name")} placeholder="Project name" />
      <Button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create Project"}
      </Button>
    </form>
  );
}
```

### Pattern C: Query Provider Setup

**Root layout with QueryClient:**
```typescript
// app/providers.tsx
"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

```typescript
// app/layout.tsx
import { Providers } from "./providers";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

### Pattern D: Optimistic Updates

### Pattern D: Optimistic Updates

```typescript
// features/projects/hooks/use-update-project-status.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProject } from "../server/actions";

export function useUpdateProjectStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      updateProject(id, { status }),
    
    // Optimistic update
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['projects'] });
      
      const previousProjects = queryClient.getQueryData(['projects']);
      
      queryClient.setQueryData(['projects'], (old: any[]) =>
        old.map(project => 
          project.id === id ? { ...project, status } : project
        )
      );
      
      return { previousProjects };
    },
    
    onError: (err, variables, context) => {
      queryClient.setQueryData(['projects'], context?.previousProjects);
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
```

---

## 🎬 Motion & Interactions

```typescript
// Hover: Snappy feedback
className="transition-all duration-100 ease-out"

// Staggered page load
import { motion } from "framer-motion"

<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.05 }}
>

// Tab indicator (LayoutGroup)
import { motion, LayoutGroup } from "framer-motion"

<LayoutGroup>
  {tabs.map(tab => (
    <button key={tab}>
      {active === tab && (
        <motion.div layoutId="indicator" className="absolute bg-black" />
      )}
      {tab}
    </button>
  ))}
</LayoutGroup>
```

---

## ✅ Code Generation Checklist

When creating a new feature, follow this sequence:

1. **Create feature folder:** `src/features/{feature-name}/`
2. **Define types:** `types.ts` with Zod schemas
3. **Server layer:**
   - `server/data.ts` - Query functions (for TanStack Query)
   - `server/actions.ts` - Mutation functions with `'use server'`
4. **Hooks layer:** `hooks/` - TanStack Query hooks
   - `use-{feature}.ts` - Query hooks
   - `use-create-{feature}.ts` - Mutation hooks
5. **Components:** `components/` - Feature-specific UI (mark with `"use client"`)
6. **Page composition:** `app/(dashboard)/{feature}/page.tsx`
7. **Styling:** Use `cn()` utility, Tailwind classes, theme tokens

### CSS Strategy:
- **95%** Tailwind utility classes
- **5%** `.module.css` for:
  - Complex CSS Grid layouts
  - Print styles (`@media print`)
  - Animations beyond Tailwind/Framer

---

## 🔧 Utility Imports

```typescript
import { cn } from "@/lib/utils"                          // Class name merger
import { prisma } from "@/lib/prisma"                     // DB client
import { revalidatePath } from "next/cache"               // Cache purging
import { z } from "zod"                                   // Schema validation
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"                            // Toast notifications
import { useForm } from "react-hook-form"                 // Form handling
import { zodResolver } from "@hookform/resolvers/zod"     // Zod + React Hook Form
```

---

## 📋 Example: Creating a New Feature

**Task:** Add a "Tasks" feature with TanStack Query

```bash
# 1. Create structure
src/features/tasks/
  ├── components/
  │   ├── task-list.tsx
  │   └── task-card.tsx
  ├── hooks/
  │   ├── use-tasks.ts
  │   └── use-update-task.ts
  ├── server/
  │   ├── data.ts       # getTasks(), getTaskById()
  │   └── actions.ts    # createTask(), updateTaskStatus()
  └── types.ts          # TaskSchema, TaskStatus enum

# 2. Create page
app/(dashboard)/tasks/
  └── page.tsx
```

**data.ts:**
```typescript
import { prisma } from "@/lib/prisma";

export async function getTasks(projectId?: string) {
  return await prisma.task.findMany({
    where: projectId ? { projectId } : undefined,
    orderBy: { dueDate: 'asc' }
  });
}
```

**actions.ts:**
```typescript
'use server'
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function updateTaskStatus(taskId: string, status: string) {
  const task = await prisma.task.update({ 
    where: { id: taskId }, 
    data: { status } 
  });
  revalidatePath('/tasks');
  return task;
}
```

**hooks/use-tasks.ts:**
```typescript
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "../server/data";

export function useTasks(projectId?: string) {
  return useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => getTasks(projectId),
  });
}
```

**hooks/use-update-task.ts:**
```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTaskStatus } from "../server/actions";
import { toast } from "sonner";

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      updateTaskStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success("Task updated");
    },
  });
}
```

**page.tsx:**
```typescript
import { TaskList } from "@/features/tasks/components/task-list";

export default function TasksPage() {
  return (
    <main className="p-8">
      <h1 className="font-display text-3xl mb-6">Tasks</h1>
      <TaskList />
    </main>
  );
}
```

**components/task-list.tsx:**
```tsx
"use client"
import { useTasks } from "../hooks/use-tasks";
import { TaskCard } from "./task-card";

export function TaskList() {
  const { data: tasks, isLoading } = useTasks();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="grid gap-4">
      {tasks?.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
```

**components/task-card.tsx:**
```tsx
"use client"
import { Card } from "@/components/ui/card";
import { useUpdateTask } from "../hooks/use-update-task";

export function TaskCard({ task }) {
  const { mutate, isPending } = useUpdateTask();

  return (
    <Card className="border-zinc-200 p-6 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
      <h3 className="font-sans font-semibold">{task.title}</h3>
      <p className="font-mono text-xs text-zinc-500 mt-2">
        {task.dueDate.toISOString()}
      </p>
      <button 
        onClick={() => mutate({ id: task.id, status: 'DONE' })}
        disabled={isPending}
        className="mt-4 rounded-[2px] border border-zinc-900 px-4 py-2 text-xs uppercase disabled:opacity-50"
      >
        {isPending ? "Updating..." : "Mark Complete"}
      </button>
    </Card>
  );
}
```

---

## 🎯 Quality Standards

**Before submitting code, verify:**
- [ ] Uses feature-based folder structure
- [ ] Typography follows Display/Sans/Mono hierarchy  
- [ ] Colors use Zinc palette + accent colors
- [ ] Buttons have sharp corners + hard shadows on hover
- [ ] No `bg-white` on main canvas
- [ ] TanStack Query hooks for data fetching
- [ ] Server Actions for mutations (with `revalidatePath`)
- [ ] Uses `cn()` for className merging
- [ ] Proper loading/error states in components
- [ ] Mobile responsive (test `border-r`, `border-b` layouts)

---

## 🚀 Quick Reference

| Context | Pattern |
|---------|---------|
| Page route | `app/(dashboard)/{feature}/page.tsx` → Regular component |
| Fetch data | `features/{feature}/hooks/use-{feature}.ts` → TanStack Query hook |
| Server data fn | `features/{feature}/server/data.ts` → async function |
| Mutate data | `features/{feature}/hooks/use-create-{feature}.ts` → useMutation |
| Server action | `features/{feature}/server/actions.ts` → `'use server'` |
| UI Component | `features/{feature}/components/{name}.tsx` → `"use client"` |
| Shared component | `components/custom/{name}.tsx` |
| Styling | Tailwind classes via `className` + `cn()` |
| Fonts | Display/Sans/Mono via `font-display`, `font-sans`, `font-mono` |
| Colors | Zinc grays + `#FF4F00` / `#00D26A` / `#FF0033` |
| Shadows | Hard: `shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]` |

---

**Remember:** This is an architectural firm's internal tool. The UI should feel like a CAD workspace—precise, structured, and professional. Every component should justify its existence through clarity and purpose.
