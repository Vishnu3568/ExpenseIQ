# ExpenseIQ

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black&style=flat-square)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white&style=flat-square)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x+-339933?logo=node.js&logoColor=white&style=flat-square)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?logo=postgresql&logoColor=white&style=flat-square)](https://www.postgresql.org/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-5.x-2D3748?logo=prisma&logoColor=white&style=flat-square)](https://www.prisma.io/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white&style=flat-square)](https://expressjs.com/)

An enterprise-grade, multi-tenant personal finance management and smart budgeting application. Built for security, performance, and accessibility, ExpenseIQ enables users to track financial transactions, build smart budgets, manage category classifications, and export institutional financial reports.

---

## 🚀 Key Highlights

*   **Secure Session Architecture:** Dual-token Access/Refresh system using HttpOnly, SameSite cookies and structured JSON logger monitoring.
*   **Smart Budgets Engine:** Dynamic overall and category budget checks with real-time utilization triggers.
*   **Accessible Interfaces:** Built to satisfy WCAG 2.1 AA parameters, featuring dialog tab focus traps, Escape-key dismissals, and dark/light system theme integration.
*   **Modular Bundling:** Dynamic route-based lazy loading with dedicated vendor-lib splits to minimize initial page payloads.

---

## 🛠️ Features

*   **Transaction Management:** Filter, paginate, and track cash, bank, credit card, and UPI transactions.
*   **Custom Category Framework:** Dynamic income/expense classifications with customizable iconographies and color tags.
*   **Data Intelligence Center:** Historical trend comparison engine and interactive search history management.
*   **Export Center:** Download structured CSV files and institutional PDF report summaries.
*   **Security Logs & Audit Trail:** Interactive user timeline documenting security occurrences, login changes, and profile adjustments.
*   **OpenAPI Documentation:** Interactive Swagger interface describing API payloads.

---

## 💻 Tech Stack

### Frontend
*   **Core:** React 18, TypeScript, TailwindCSS
*   **State & Routing:** Context APIs, React Router DOM (v6), React Hook Form
*   **Charts & Icons:** Recharts, Lucide React

### Backend
*   **Framework:** Node.js, Express, TypeScript, `ts-node-dev`
*   **Database ORM:** Prisma Client
*   **Validations:** Express Validator, Sanitize-HTML

### Database
*   **Engine:** PostgreSQL

---

## 🏢 Architecture Overview

ExpenseIQ is designed as a decoupled single-page application (SPA) communicating with a stateless REST API. The system follows a unidirectional data flow:

```
[React App Shell] ──(Axios HTTPS)──> [Express Routers] ──> [Validation Middleware]
                                                                    │
[Prisma Client DB] <── [Database Services] <── [Controllers] <──────┘
```

---

## 📁 Folder Structure

```text
ExpenseIQ/
├── backend/
│   ├── prisma/             # Schema definitions and migrations
│   └── src/
│       ├── controllers/    # API endpoints handlers
│       ├── middleware/     # Auth, error, logging, rate limits
│       ├── routes/         # Express router endpoints
│       ├── services/       # Core business logic services
│       ├── utils/          # Token, hash, and exception classes
│       └── validators/     # Express validator definitions
└── frontend/
    └── src/
        ├── components/     # UI, transactions, budgets, charts
        ├── context/        # Auth, workspace, notification contexts
        ├── hooks/          # Custom hooks (api, settings, notifications)
        ├── layouts/        # Application shell layouts
        ├── pages/          # Lazy-loaded route views
        └── routes/         # Protected and public routing
```

---

## ⚙️ Installation Guide

### Prerequisites
*   Node.js 18.x or higher
*   PostgreSQL 15+ database

### Clone and Install Dependencies

```bash
git clone https://github.com/yourusername/ExpenseIQ.git
cd ExpenseIQ

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

## 🔒 Environment Variables

### Backend (`backend/.env`)
Create a `.env` file in the `backend/` directory:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://username:password@localhost:5432/expenseiq?schema=public"
JWT_ACCESS_SECRET="your-super-secret-access-key-here"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-here"
```

### Frontend (`frontend/.env`)
Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000
```

---

## 🏃 Running Locally

### 1. Initialize the Database
Generate the Prisma Client and push the schema to PostgreSQL:

```bash
cd backend
npx prisma generate
npx prisma db push
```

### 2. Run API Server (Backend)
```bash
npm run dev
```

### 3. Run Web App (Frontend)
Open a new terminal window:
```bash
cd frontend
npm run dev
```

The application is served at `http://localhost:5173`. The backend API runs at `http://localhost:5000`.

---

## 🚀 GitHub Pages Automated Deployment

ExpenseIQ includes an automated GitHub Actions deployment pipeline (`.github/workflows/deploy.yml`). On pushing to `main`, GitHub Actions automatically builds and publishes the React static frontend bundle to GitHub Pages.

To enable GitHub Pages in your repository:
1. Go to repository **Settings** -> **Pages**.
2. Set **Source** to **GitHub Actions**.

---

## 📡 API Documentation
API documentation is served interactively via Swagger UI when running in development mode:

*   **URL:** `http://localhost:5000/api-docs/`

---

## 🖼️ Screenshots
*(Screenshots placeholder section)*
*   **Executive Dashboard:** Main chart dashboards summarizing cash-flow metrics.
*   **Transaction Flow:** Paginated transaction tables.
*   **Smart Budgets:** Category utilization budget bars.

---

## 🛡️ Security Features
*   **XSS Mitigation:** Integrates `sanitize-html` to filter and strip all HTML elements from user-editable inputs before database insertion.
*   **Robust CORS & Security Headers:** Hardened Helmet configuration sets strict CSP rules and forces HSTS secure connections for 1 year.
*   **Granular Rate Limiting:** Enforces distinct rate limits for login attempts, password adjustments, registration requests, and report exports.
*   **Audit Logging:** Logs all key events (logins, failed auth, password edits) to the Database.

---

## ⚡ Performance Optimizations
*   **Route Lazy Loading:** Splitting page bundle payloads via React Suspense and dynamic chunk imports.
*   **Manual Rollup Chunking:** Grouping heavy visualization tools (`recharts`) into a separate, asynchronously-loaded bundle.
*   **Prisma Client Reuse:** Shared static connection instance to avoid database connection pool exhaustion.

---

## 🏆 Production Hardening
*   **Unified Error Boundaries:** Root-level React `ErrorBoundary` fallback captures component render crashes.
*   **Connection Status Alerts:** Renders a global banner verifying server API status via active `/health` polling.

---

## 🔮 Future Improvements
*   **Multi-Workspace Collaborations:** Support multiple users joining shared workspaces.
*   **Additional File Formats:** Excel and raw JSON backup exports.

---

## 👤 Author
*   **ExpenseIQ Engineering Team**
