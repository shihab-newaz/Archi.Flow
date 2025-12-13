# Database Design & Supabase Configuration

**Project:** ArchFirm Manager  
**Provider:** Supabase (PostgreSQL)  
**ORM:** Prisma  
**Connection Mode:** Transaction Pooling (Recommended for Serverless)

---

## 1. Connection Architecture

Since we are using Next.js (Serverless), direct connections to Postgres can exhaust the connection limit. We must use Supabase's **Supavisor** (Connection Pooler).

### Environment Variables (`.env`)

```bash
# Direct connection (Used for migrations only)
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"

# Transaction Pooler connection (Used by the App/Prisma Client)
# Port 6543 is typically used for the pooler
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
```

---

## 2. Core Schema (Prisma)

This is the source of truth. Run `npx prisma push` to sync this with Supabase.

```prisma
// schema.prisma

model User {
  id            String    @id @default(uuid())
  name          String
  email         String    @unique
  passwordHash  String
  role          UserRole  @default(ARCHITECT)
  isActive      Boolean   @default(true)
  
  tasksAssigned Task[]
  docsUploaded  DesignDocument[]
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([email])
}

model Client {
  id             String      @id @default(uuid())
  name           String
  organization   String?
  phone          String      @unique
  email          String?
  type           ClientType  @default(INDIVIDUAL)
  
  projects       Project[]
  invoices       Invoice[]

  createdAt      DateTime    @default(now())
  
  @@index([name]) // Optimized for search
}

model Project {
  id              String        @id @default(uuid())
  code            String        @unique // "PRJ-2401"
  name            String
  type            ProjectType
  status          ProjectStatus @default(ONGOING)
  
  clientId        String
  client          Client        @relation(fields: [clientId], references: [id])
  
  phases          ProjectPhase[]
  documents       DesignDocument[]
  invoices        Invoice[]
  
  startDate       DateTime
  expectedEnd     DateTime?

  updatedAt       DateTime      @updatedAt
  
  @@index([status])
  @@index([clientId])
}

model ProjectPhase {
  id          String      @id @default(uuid())
  projectId   String
  project     Project     @relation(fields: [projectId], references: [id])
  
  name        String
  status      PhaseStatus @default(NOT_STARTED)
  orderIndex  Int
  
  @@unique([projectId, orderIndex]) // Prevent duplicate order
}

model DesignDocument {
  id              String    @id @default(uuid())
  projectId       String
  project         Project   @relation(fields: [projectId], references: [id])
  
  title           String
  fileUrl         String    // Supabase Storage Public URL
  type            DocType
  isClientVisible Boolean   @default(false)

  uploadedById    String
  uploadedBy      User      @relation(fields: [uploadedById], references: [id])
  
  createdAt       DateTime  @default(now())
}

// ... (Financial models Invoice/Payment same as TDD)
```

---

## 3. Storage Configuration (Supabase Storage)

We will use Supabase Storage (S3 wrapper) for storing heavy architectural files (DWG, PDF, Renders).

- **Bucket:** `project-files`
- **Public Access:** FALSE (Files should be secure by default)
- **Allowed MIME Types:** `image/*`, `application/pdf`, `application/acad` (AutoCAD)
- **File Size Limit:** 50MB

### Storage Folder Structure

```
project-files/
  ├── {projectId}/
  │   ├── plans/
  │   │   └── floor-plan-v1.pdf
  │   ├── renders/
  │   │   └── living-room-final.jpg
  │   └── contracts/
          └── signed-agreement.pdf
```

### Storage Security Policies (RLS)

Go to **Supabase Dashboard → Storage → Policies**.

**READ Policy (Authenticated Users):**
- **Name:** "Authenticated users can view files"
- **Definition:** `auth.role() = 'authenticated'`

**WRITE Policy (Architects & Admins):**
- **Name:** "Staff can upload files"
- **Definition:** `auth.role() = 'authenticated'` (Assuming app handles logic, or stricter: check user metadata)

---

## 4. PostgreSQL Extensions

Enable these in **Supabase Dashboard → Database → Extensions**.

- **`pg_trgm`:** Essential for fuzzy search (e.g., searching Client names or Project codes)
- **`uuid-ossp`:** For generating UUIDs (already enabled by default in new projects)

---

## 5. Row Level Security (RLS) Strategy

**Note:** Since we are using Prisma with a direct Database URL in Next.js Server Actions, the database connection has "Service Role" (Super Admin) privileges. RLS is technically bypassed by Prisma unless you use the "Supabase Client".

However, as a safety net (defense in depth), we should define these policies in SQL if we ever expose the DB to the client side.

```sql
-- Enable RLS on sensitive tables
ALTER TABLE "Invoice" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Payment" ENABLE ROW LEVEL SECURITY;

-- Policy: Only Admins and Finance can VIEW financials
CREATE POLICY "Finance View Access" ON "Invoice"
FOR SELECT
USING (
  exists (
    select 1 from "User" 
    where id = auth.uid() 
    and role in ('ADMIN', 'FINANCE')
  )
);

-- Policy: Architects can VIEW Projects (but not Money)
ALTER TABLE "Project" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff View Projects" ON "Project"
FOR SELECT
USING (
  exists (
    select 1 from "User" 
    where id = auth.uid() 
    and role in ('ADMIN', 'ARCHITECT', 'FINANCE', 'PM')
  )
);
```

---

## 6. Backup & Maintenance

- **Point-in-Time Recovery (PITR):** Enable in Supabase Pro plan if budget allows
- **Daily Backups:** Enabled by default
- **Vacuuming:** Auto-managed by Supabase

---

## 7. Migration Workflow

1. Modify `schema.prisma`
2. Run `npx prisma migrate dev --name <change_name>` (Uses `DIRECT_URL`)
3. Deploy changes to Supabase