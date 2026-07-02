# ExpenseIQ

A modern, full-stack personal finance management platform designed to help users track income, expenses, budgets, and financial insights through a clean, responsive, and secure web application.

## Technology Stack

### Frontend
- **Framework:** React 18 (Vite template)
- **Language:** TypeScript
- **Styling:** Tailwind CSS

### Backend
- **Runtime:** Node.js (Express framework)
- **Language:** TypeScript
- **Database ORM:** Prisma ORM

### Database & Deployment
- **Database:** PostgreSQL
- **Hosting Targets:** Vercel (Frontend), Railway (Backend)

---

## Folder Structure

```
expenseiq/
├── backend/                  # Express + TypeScript API server
├── frontend/                 # React + Vite + TypeScript web application
├── docs/                     # Architectural documents & design specifications
├── .gitignore                # Root gitignore config
├── .prettierrc               # Prettier configuration
├── package.json              # Monorepo scripts orchestrator
└── README.md                 # Project README
```

---

## Prerequisites

Ensure you have the following installed locally:
- [Node.js](https://nodejs.org/) (v18.x or later recommended)
- [npm](https://www.npmjs.com/) (v9.x or later)

---

## Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd ExpenseIQ
    ```

2.  **Install all workspace dependencies:**
    This command will install the root, backend, and frontend dependencies:
    ```bash
    npm run install-all
    ```

3.  **Configure environment variables:**
    - Copy `backend/.env.example` to `backend/.env` and supply the required database connection and secret parameters.
    - Copy `frontend/.env.example` to `frontend/.env` and update the API base URL.

---

## Commands Reference

The following commands are available from the project root:

| Command | Action |
| :--- | :--- |
| `npm run install-all` | Installs dependencies across root, frontend, and backend packages. |
| `npm run dev` | Runs both backend and frontend development servers concurrently. |
| `npm run dev:backend` | Starts the Express API server in development (watch) mode. |
| `npm run dev:frontend`| Starts the Vite dev server for the React app. |
| `npm run build` | Compiles both backend and frontend configurations. |
| `npm run lint` | Runs ESLint syntax verification across backend and frontend workspaces. |
| `npm run format` | Runs Prettier auto-formatter on the workspace. |
