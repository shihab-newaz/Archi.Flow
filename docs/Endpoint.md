# API Endpoint Wiki

**Project:** ArchFirm Manager  
**Version:** 1.0  
**Base URL:** `/api` (or Server Actions equivalent)

---

## 1. Authentication & User Management

**Auth Strategy:** NextAuth.js (JWT)

| Method | Endpoint | Access | Description | Payload (Body) | Response |
|--------|----------|--------|-------------|----------------|----------|
| POST | `/auth/login` | Public | Authenticate user | `{ email, password }` | `{ user: { id, name, role }, token }` |
| POST | `/auth/logout` | Authenticated | Destroy session | - | `{ message: "Logged out" }` |
| GET | `/users` | Admin | List all internal users | - | `[{ id, name, email, role, isActive }]` |
| POST | `/users` | Admin | Create new employee | `{ name, email, password, role }` | `{ id, email }` |
| PATCH | `/users/:id` | Admin | Deactivate/Update user | `{ isActive: boolean, role? }` | `{ id, isActive }` |

---

## 2. Client Management

| Method | Endpoint | Access | Description | Payload (Body) | Response |
|--------|----------|--------|-------------|----------------|----------|
| GET | `/clients` | All | List clients (Searchable) | `?search=name&type=INDIVIDUAL` | `[{ id, name, phone, type, projectCount }]` |
| POST | `/clients` | All | Register new client | `{ name, phone, email?, address?, type }` | `{ id, name }` |
| GET | `/clients/:id` | All | Get client details & history | - | `{ id, projects: [{ id, name, status }] }` |
| PUT | `/clients/:id` | Admin/Finance | Update client info | `{ phone, address, ... }` | `{ id, updatedFields }` |

---

## 3. Project Management

| Method | Endpoint | Access | Description | Payload (Body) | Response |
|--------|----------|--------|-------------|----------------|----------|
| GET | `/projects` | All | List projects (Filterable) | `?status=ONGOING&type=INTERIOR` | `[{ id, code, name, clientName, status, progress }]` |
| POST | `/projects` | All | Create new project | `{ name, type, location, clientId, startDate }` | `{ id, code }` |
| GET | `/projects/:id` | All | Get full project details | - | `{ id, phases: [], feeSummary: (Role Dependent) }` |
| PATCH | `/projects/:id` | Admin/PM | Update status/dates | `{ status, actualEnd }` | `{ id, status }` |

### 3.1 Project Phases

| Method | Endpoint | Access | Description | Payload (Body) | Response |
|--------|----------|--------|-------------|----------------|----------|
| POST | `/projects/:id/phases` | All | Add a phase | `{ name, orderIndex, startDate }` | `{ id, name }` |
| PATCH | `/phases/:id` | All | Update phase status | `{ status: "COMPLETED" }` | `{ id, status }` |

---

## 4. Financial Module

**Strict RBAC:** Admin & Finance Roles Only

| Method | Endpoint | Access | Description | Payload (Body) | Response |
|--------|----------|--------|-------------|----------------|----------|
| GET | `/projects/:id/finance` | Admin/Fin | Get detailed fee breakdown | - | `{ totalFee, totalPaid, totalDue, invoices: [] }` |
| POST | `/projects/:id/fee` | Admin Only | Set/Update Project Fee | `{ amount, currency }` | `{ projectId, totalFee }` |
| POST | `/invoices` | Admin/Fin | Generate Invoice | `{ projectId, amount, dueDate, notes }` | `{ id, invoiceNumber, status: "DRAFT" }` |
| PATCH | `/invoices/:id` | Admin/Fin | Change Invoice Status | `{ status: "SENT" }` | `{ id, status }` |
| POST | `/payments` | Admin/Fin | Record Payment | `{ invoiceId, amount, method, ref }` | `{ id, invoiceStatus }` |

---

## 5. Document Registry

| Method | Endpoint | Access | Description | Payload (Body) | Response |
|--------|----------|--------|-------------|----------------|----------|
| GET | `/projects/:id/docs` | All | List documents | `?phase=DESIGN&type=PLAN` | `[{ id, title, url, version, uploadedBy }]` |
| POST | `/documents` | All | Save Doc Metadata | `{ projectId, title, type, url, version, isClientVisible }` | `{ id }` |
| POST | `/documents/presign` | All | Get S3 Upload URL | `{ fileName, fileType }` | `{ uploadUrl, fileKey }` |

---

## 6. Tasks

| Method | Endpoint | Access | Description | Payload (Body) | Response |
|--------|----------|--------|-------------|----------------|----------|
| GET | `/projects/:id/tasks` | All | List tasks | `?status=TODO` | `[{ id, title, assignedTo, dueDate }]` |
| POST | `/tasks` | All | Create task | `{ projectId, title, assignedToId?, dueDate }` | `{ id }` |
| PATCH | `/tasks/:id` | All | Update status | `{ status: "DONE" }` | `{ id, status }` |

---

## 7. Error Codes & Standards

- **200 OK:** Successful operation
- **201 Created:** Resource created successfully
- **400 Bad Request:** Validation error (e.g., Missing required field)
- **401 Unauthorized:** User not logged in
- **403 Forbidden:** Role does not have permission (e.g., Architect accessing `/invoices`)
- **404 Not Found:** Resource ID does not exist
- **500 Internal Server Error:** Database or Logic failure

### Data Types

- **Money:** Decimal (sent as string in JSON to preserve precision, e.g., `"50000.00"`)
- **Date:** ISO 8601 String (`"2023-10-27T10:00:00Z"`)