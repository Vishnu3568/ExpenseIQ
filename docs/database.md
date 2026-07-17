# Database Design & Prisma Schema - ExpenseIQ

ExpenseIQ utilizes **PostgreSQL** relational schemas mapped through **Prisma ORM**. The data model is optimized for transaction tracking, tenant personalization, and audit logging.

---

## 🔑 Relational Integrity & Cascade Behaviors

To maintain database integrity while preventing orphan records, explicit cascade constraints are configured in `schema.prisma`:
*   **Cascade Delete (`onDelete: Cascade`):** Deleting a `User` automatically removes all associated `Workspace`, `RefreshToken`, `Transaction`, `Category`, `Budget`, `Notification`, and `AuditLog` records.
*   **Preserved History (`onDelete: SetNull`):** When a custom `Category` is deleted, associated `Transaction` records are **not** deleted. Instead, the `categoryId` column is set to `null`, ensuring the historical ledger remains fully preserved for financial reporting.

---

## ⚡ Query Index Mappings

High-frequency query filters use explicit database indexes to ensure sub-millisecond retrieval times as the table sizes grow:

### 1. User Table
*   `email` (Unique Index) -> Fast login validation.

### 2. Transaction Table
*   `[userId, date]` (Compound Index) -> Speeds up dashboard filtering, category aggregations, and cash-flow charting.
*   `[userId, type]` (Compound Index) -> Speeds up income/expense reports.

### 3. Notification Table
*   `[userId, status, createdAt]` (Compound Index) -> Resolves quick unread notification count badge rendering.

### 4. Audit Log Table
*   `[userId, createdAt]` (Compound Index) -> Supports timeline security auditing.

### 5. Refresh Token Table
*   `tokenHash` (Unique Index) -> Resolves session rotation lookups.

---

## 📋 Database Normalization & Custom Types

*   **Preferences Storage:** User preferences (Dashboard layouts, exports, and alerts) are stored in structured `Json` fields in the `Workspace` model to allow flex preference structures without requiring frequent migrations.
*   **Enums:** Database-level Enums enforce strict integrity:
    *   `TransactionType`: `INCOME`, `EXPENSE`
    *   `BudgetType`: `OVERALL`, `CATEGORY`
    *   `BudgetStatus`: `ACTIVE`, `COMPLETED`, `ARCHIVED`
