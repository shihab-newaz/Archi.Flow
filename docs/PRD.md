# Product Requirements Document (PRD)

**Project:** ArchFirm Manager  
**Focus:** Logic & UI Flows

---

## 1. Objective

Build a web-based ERP for TSF Architects to manage the lifecycle of architectural projects, ensuring financial accuracy and operational transparency.

---

## 2. User Personas

- **Admin:** Needs high-level overview and total control
- **Finance:** Needs efficient data entry for money
- **Architect:** Needs easy access to drawings and task lists

---

## 3. Functional Requirements

### 3.1 Authentication

- **REQ-01:** Email/Password Login
- **REQ-02:** Secure session persistence (7 days)
- **REQ-03:** Unauthorized redirect to Dashboard

### 3.2 Client Module

- **REQ-04:** Create Client (Name, Contact, Type)
- **REQ-05:** Unique Phone Number validation
- **REQ-06:** View linked Projects per Client

### 3.3 Project Core

- **REQ-07:** Create Project with auto-generated Code (e.g., PRJ-001)
- **REQ-08:** Phase Management (Status: Not Started → In Progress → Completed)
- **REQ-09:** Project Completion logic dependent on Phases

### 3.4 Financial Logic (Critical)

- **REQ-10:** Define Total Fee (BDT)
- **REQ-11:** Invoice Generation constraints (Sum of Invoices ≤ Total Fee warning)
- **REQ-12:** Payment Methods: Cash, Cheque, Bank, Mobile Banking
- **REQ-13:** Auto-calc: Due = Total Fee - Total Paid

### 3.5 Documentation

- **REQ-14:** Upload Metadata (Title, Version, URL)
- **REQ-15:** Tag by Phase & Discipline
- **REQ-16:** "Client Visible" toggle

---

## 4. UI Flows

### 4.1 Dashboard

- **KPI Cards:** Active Projects, Total Receivables (Admin only), Pending Tasks
- **Activity Feed:** Recent uploads or phase changes

### 4.2 Project Detail Page (Tabs)

- **Overview:** Client info, Location, Status
- **Timeline:** Phase tracking
- **Docs:** Searchable file table
- **Financials (Restricted):** Invoice list, Payment entry, Fee summary

---

## 5. Non-Functional Requirements

- **NFR-01:** Dashboard load time < 1.5s
- **NFR-02:** Currency formatting (BDT ৳)
- **NFR-03:** Mobile responsiveness for "Site Supervision" use

---

## 6. Edge Cases

| Scenario | Behavior |
|----------|----------|
| Deletion | Cannot delete Client with active Projects |
| Partial Payments | Supported; Invoice status becomes "Partial" |
| Revisions | New file entry created for every version (No overwrites) |