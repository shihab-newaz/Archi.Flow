# Software Requirements Specification (SRS)

**Project:** ArchFirm Manager  
**Version:** 1.0  
**Status:** Approved

---

## 1. Introduction

### 1.1 Purpose

This SRS defines the requirements for a web application designed for an architectural firm (TSF Architects). The system manages projects, clients, financials, and documentation.

### 1.2 Scope

The application will:

- Centralize project data (interior & exterior)
- Manage client information and history
- Track financials (fees, invoices, payments)
- Store design asset metadata
- Provide role-based access control

### 1.3 Definitions

- **Project:** A design job (building, interior, renovation)
- **Phase:** Stages of a project (Concept, Working Drawing, Supervision)
- **User:** Admin, Architect, Finance, etc.

---

## 2. Overall Description

### 2.1 Product Perspective

- **Type:** Internal Web Application
- **Stack:** Next.js (App Router), Prisma, PostgreSQL
- **Deployment:** Vercel / Node.js Environment

### 2.2 User Classes

- **Admin:** Full access (Owner)
- **Architect:** Project details, drawings, tasks. Limited financial view
- **Finance:** Invoices, payments, financial reports
- **Client (Future):** Read-only portal

---

## 3. System Features (Functional Requirements)

### 3.1 User Management

- **F1.1:** Email/Password Login (NextAuth)
- **F1.2:** Role assignment (Admin, Architect, Finance)
- **F1.3:** Admin can deactivate users

### 3.2 Client Management

- **F2.1:** CRUD operations for Clients
- **F2.2:** Store details: Name, Org, Phone, Email, Address, Type
- **F2.3:** Link Clients to Projects

### 3.3 Project Management

- **F3.1:** Create Project: Name, Code, Type, Location, Client, Dates
- **F3.2:** Define Scope (Arch, Interior, Landscape)
- **F3.3:** Manage Phases (Status: Not Started, In Progress, Done)
- **F3.4:** Dashboard with status filters

### 3.4 Design & Document Management

- **F4.1:** Registry for drawings/renders (Plan, Section, 3D)
- **F4.2:** Metadata: Title, Version, Link (S3/Drive), Phase tag
- **F4.3:** "Client Visible" toggle for future portal

### 3.5 Financial Management

- **F5.1:** Set Total Project Fee
- **F5.2:** Generate Invoices (Draft, Sent, Paid, Overdue)
- **F5.3:** Record Payments (Cash, Bank, Mobile Banking)
- **F5.4:** Calculation: Total Fee - Paid = Due
- **F5.5:** RBAC: Only Admin/Finance can edit financials

### 3.6 Tasks (Basic)

- **F6.1:** Simple Todo/In-Progress/Done tasks per project
- **F6.2:** Assign to users

---

## 4. Non-Functional Requirements

- **N1.1 Security:** HTTPS, Bcrypt/Argon2 password hashing
- **N1.2 Performance:** <2s page load
- **N1.3 Reliability:** Daily DB backups
- **N1.4 Scalability:** Support hundreds of projects

---

## 5. Data Model Overview

| Entity | Fields |
|--------|--------|
| **User** | id, name, email, role, passwordHash |
| **Client** | id, name, contact info, type |
| **Project** | id, code, name, type, status, clientId |
| **ProjectPhase** | id, projectId, name, status |
| **DesignDocument** | id, projectId, type, url, version |
| **Invoice** | id, projectId, amount, status |
| **Payment** | id, invoiceId, amount, method |