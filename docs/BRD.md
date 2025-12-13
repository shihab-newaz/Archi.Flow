# Business Requirements Document (BRD)

**Project:** ArchFirm Manager  
**Target Audience:** Developers, Stakeholders

---

## 1. Executive Summary

TSF Architects requires a centralized internal web application to replace fragmented data sources (Excel, WhatsApp, Drive). The system will serve as the **"Single Source of Truth"** for projects, clients, and firm financials.

---

## 2. Business Objectives

- **Centralization:** Eliminate data silos
- **Financial Clarity:** Real-time view of Invoiced vs. Paid vs. Due amounts
- **Operational Efficiency:** Reduce time spent searching for drawings or project status
- **Security:** Protect sensitive financial data via Role-Based Access Control (RBAC)

---

## 3. Scope

### 3.1 In Scope (MVP)

- Internal User & Role Management
- Client Database
- Project Lifecycle Tracking (Phases)
- Document Registry (Metadata & Links)
- Financial Module (Fees, Invoices, Payments)
- Basic Dashboards

### 3.2 Out of Scope (Phase 2)

- Client-facing login portal
- Direct integration with external accounting software
- Automated SMS/Email notifications

---

## 4. Stakeholders

- **Business Owner:** Approves features, uses financial dashboards
- **Architects:** Update phases, upload docs
- **Finance Team:** Manage billing and collections

---

## 5. Pain Points & Solutions

| Pain Point | Solution |
|------------|----------|
| Scattered Data | Unified Postgres Database with linked entities |
| Missed Invoices | Dashboard alerts for Overdue Invoices |
| Privacy Risks | RBAC to hide financial data from non-admin staff |
| Version Confusion | Document registry with version labeling |

---

## 6. Success Metrics

- **Time Savings:** Project status retrieval < 2 minutes
- **Financial Health:** Zero missed invoices per quarter
- **Adoption:** 100% of active projects managed within the system

---

## 7. Risks

| Risk | Mitigation |
|------|------------|
| Adoption Resistance | Simple UI, Minimal data entry required |
| Data Migration | Import only active projects initially |