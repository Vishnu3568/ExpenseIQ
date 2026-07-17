# API Flow & Endpoint Mapping - ExpenseIQ

ExpenseIQ REST APIs expose stateless endpoints protected by JWT session validators and rate limiters.

---

## 📡 Base URL & Request Formats

*   **API Base URL:** `http://localhost:5000`
*   **Content-Type:** `application/json`
*   **Cookie Domain Scope:** Restricted to `/api/auth` path.

---

## 🗺️ REST Endpoint Map

### 1. Authentication (`/api/auth`)
*   `POST /api/auth/register` — Create new profile and workspace.
*   `POST /api/auth/login` — Authenticate credentials and return access token.
*   `POST /api/auth/refresh` — Rotate refresh session and update cookie.
*   `POST /api/auth/logout` — Invalidate refresh token and clear cookies.
*   `GET /api/auth/me` — Retrieve active profile parameters.

### 2. Workspace & Settings (`/api/workspace`)
*   `GET /api/workspace/profile` — Fetch user settings and workspace configurations.
*   `PUT /api/workspace/profile` — Update name, bio, and phone parameters.
*   `PUT /api/workspace/password` — Change password keys (requires old password).
*   `PUT /api/workspace/preferences` — Update currencies, locales, date/number formats.
*   `PUT /api/workspace/theme` — Set light, dark, or system themes.
*   `PUT /api/workspace/dashboard` — Set favorite widgets and landing paths.
*   `PUT /api/workspace/export` — Set preferred report templates.
*   `PUT /api/workspace/notifications` — Edit alert preferences.
*   `GET /api/workspace/audit-logs` — Fetch paginated security actions feed.
*   `GET /api/workspace/activity-timeline` — Fetch paginated user actions feed.
*   `POST /api/workspace/backup` — Export database backup (restricted rate limit).
*   `POST /api/workspace/purge` — Reset/clear account databases.

### 3. Categories (`/api/categories`)
*   `GET /api/categories` — Fetch all user categories.
*   `POST /api/categories` — Create custom category.
*   `PUT /api/categories/:id` — Update category fields.
*   `DELETE /api/categories/:id` — Safely remove category (sets transaction refs to null).

### 4. Transactions (`/api/transactions`)
*   `GET /api/transactions` — Get paginated, filtered transactions list.
*   `POST /api/transactions` — Create new financial ledger transaction.
*   `PUT /api/transactions/:id` — Update transaction transaction details.
*   `DELETE /api/transactions/:id` — Delete transaction record.

### 5. Budgets (`/api/budgets`)
*   `GET /api/budgets` — Fetch all active budgets.
*   `POST /api/budgets` — Define custom budget parameters.
*   `PUT /api/budgets/:id` — Update budget.
*   `DELETE /api/budgets/:id` — Delete budget.

### 6. Reports & Data Exports (`/api/reports`)
*   `POST /api/reports/pdf` — Compile PDF report (returns binary stream).
*   `POST /api/reports/csv` — Compile CSV file (returns flat sheet stream).

---

## 🔒 Rate Limiting Parameters

To protect server resource limits, routes are shielded with specific thresholds:
*   **Authentication Limits:** Registration is limited to 3 requests / 1 hour. Login is limited to 5 requests / 15 minutes.
*   **Export Limits:** CSV/PDF compilation calls are limited to 5 requests / 1 minute.
*   **General API Limits:** Default routes are limited to 200 requests / 15 minutes per IP address.
