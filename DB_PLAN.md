# Database Structure Plan for Architecture Firm Management

Based on the requirements (Projects, Finance, Clients, Payments) and the specific needs of an architecture firm, here is a proposed relational database schema.

This schema is designed to be implemented with **PostgreSQL** and an ORM like **Prisma**, but the concepts apply to any relational DB.

## 1. Core Entities & Relationships

### Users & Auth
- **User**: System users (Architects, Staff, Admins).
  - *Fields*: `id`, `email`, `password_hash`, `role` (ADMIN, ARCHITECT, STAFF), `created_at`.
  - *Relations*: `assigned_tasks`, `managed_projects`.

### CRM (Clients)
- **Client**: The entities paying for projects.
  - *Fields*: `id`, `name` (Company or Individual), `contact_person`, `email`, `phone`, `billing_address`, `tax_id`.
  - *Relations*: `projects`, `invoices`.
  - *Note*: Can optionally link to a `User` if clients need login access (Client Portal).

### Project Management
- **Project**: The central entity.
  - *Fields*: `id`, `name`, `code` (e.g., 2024-001), `status` (ACTIVE, ON_HOLD, COMPLETED), `current_phase` (PRE_DESIGN, SCHEMATIC, DD, CD, PERMITTING, CONSTRUCTION), `address`, `total_budget`, `start_date`, `estimated_completion`.
  - *Relations*: `client`, `tasks`, `phases`, `invoices`, `expenses`, `team_members`.

- **ProjectPhase** (Architecture Specific):
  - *Fields*: `id`, `project_id`, `name` (e.g., "Schematic Design"), `status`, `start_date`, `end_date`.
  - *Purpose*: Architecture projects move through distinct standard phases.

- **Task**:
  - *Fields*: `id`, `project_id`, `phase_id` (optional), `title`, `description`, `status` (TODO, IN_PROGRESS, REVIEW, DONE), `priority`, `due_date`, `assignee_id`.

### Finance Module
- **Invoice**: Requests for payment sent to clients.
  - *Fields*: `id`, `project_id`, `client_id`, `invoice_number`, `issue_date`, `due_date`, `total_amount`, `status` (DRAFT, SENT, PARTIALLY_PAID, PAID, OVERDUE).
  - *Relations*: `items` (line items), `payments`.

- **InvoiceItem**: Line items within an invoice.
  - *Fields*: `id`, `invoice_id`, `description`, `quantity`, `unit_price`, `total`.

- **Payment**: Records of money received.
  - *Fields*: `id`, `invoice_id`, `amount`, `payment_date`, `method` (BANK_TRANSFER, CHECK, CREDIT_CARD), `reference_number`.

- **Expense**: Internal costs (e.g., printing, travel, sub-consultants).
  - *Fields*: `id`, `project_id` (optional), `logged_by_user_id`, `amount`, `category`, `date`, `description`, `receipt_url`.

## 2. Proposed Schema (Prisma Format)

```prisma
// This is a draft schema for visualization

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String
  role          UserRole  @default(STAFF)
  
  assignedTasks Task[]
  expenses      Expense[]
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum UserRole {
  ADMIN
  ARCHITECT
  STAFF
}

model Client {
  id            String    @id @default(cuid())
  name          String    // Company name or Full name
  contactPerson String?
  email         String
  phone         String?
  address       String?
  
  projects      Project[]
  invoices      Invoice[]
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Project {
  id            String        @id @default(cuid())
  name          String
  code          String?       @unique // Internal project number
  description   String?
  address       String?
  
  status        ProjectStatus @default(ACTIVE)
  phase         ArchPhase     @default(PRE_DESIGN)
  
  clientId      String
  client        Client        @relation(fields: [clientId], references: [id])
  
  budget        Decimal?
  startDate     DateTime
  endDate       DateTime?
  
  // Relations
  phases        ProjectPhase[]
  tasks         Task[]
  invoices      Invoice[]
  expenses      Expense[]
  
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}

enum ProjectStatus {
  ACTIVE
  ON_HOLD
  COMPLETED
  ARCHIVED
}

enum ArchPhase {
  PRE_DESIGN
  SCHEMATIC_DESIGN
  DESIGN_DEVELOPMENT
  CONSTRUCTION_DOCUMENTS
  BIDDING
  CONSTRUCTION_ADMINISTRATION
}

model ProjectPhase {
  id        String    @id @default(cuid())
  projectId String
  project   Project   @relation(fields: [projectId], references: [id])
  
  name      ArchPhase
  status    String    // e.g., "In Progress", "Completed"
  
  tasks     Task[]
}

model Task {
  id          String    @id @default(cuid())
  title       String
  description String?
  status      String    @default("TODO") // Consider Enum
  
  projectId   String
  project     Project   @relation(fields: [projectId], references: [id])
  
  phaseId     String?
  phase       ProjectPhase? @relation(fields: [phaseId], references: [id])
  
  assigneeId  String?
  assignee    User?     @relation(fields: [assigneeId], references: [id])
  
  dueDate     DateTime?
}

// --- FINANCE ---

model Invoice {
  id            String        @id @default(cuid())
  number        String        @unique // INV-2024-001
  
  projectId     String
  project       Project       @relation(fields: [projectId], references: [id])
  
  clientId      String
  client        Client        @relation(fields: [clientId], references: [id])
  
  issueDate     DateTime
  dueDate       DateTime
  
  status        InvoiceStatus @default(DRAFT)
  
  items         InvoiceItem[]
  payments      Payment[]
  
  totalAmount   Decimal
}

enum InvoiceStatus {
  DRAFT
  SENT
  PAID
  OVERDUE
  VOID
}

model InvoiceItem {
  id          String  @id @default(cuid())
  invoiceId   String
  invoice     Invoice @relation(fields: [invoiceId], references: [id])
  
  description String
  quantity    Decimal
  unitPrice   Decimal
  amount      Decimal // quantity * unitPrice
}

model Payment {
  id          String   @id @default(cuid())
  invoiceId   String
  invoice     Invoice  @relation(fields: [invoiceId], references: [id])
  
  amount      Decimal
  date        DateTime
  method      String   // Check, Wire, Stripe
  reference   String?  // Check number or transaction ID
}

model Expense {
  id          String   @id @default(cuid())
  description String
  amount      Decimal
  category    String   // Travel, Printing, Software
  date        DateTime
  
  projectId   String?
  project     Project? @relation(fields: [projectId], references: [id])
  
  userId      String
  user        User     @relation(fields: [userId], references: [id])
}
```
