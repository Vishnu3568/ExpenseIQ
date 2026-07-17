# Deployment & Production Hardening Guide - ExpenseIQ

This document provides step-by-step instructions for deploying ExpenseIQ to production environments. We map the deployment of the Frontend to **Vercel**, the API Backend to **Supabase/Node** environments, and the database to **Neon Serverless PostgreSQL**.

---

## 📡 1. Database Deployment: Neon PostgreSQL

Neon is a serverless, fully-managed PostgreSQL database.

### Setup Instructions
1.  Sign in to [Neon Console](https://neon.tech/) and click **Create Project**.
2.  Select Database Version (PostgreSQL 15 or higher).
3.  Name your database `expenseiq` and copy the connection string:
    `postgresql://username:password@pg-hostname/expenseiq?sslmode=require`
4.  Run Prisma migrations from the backend folder to initialize your production schema:
    ```bash
    DATABASE_URL="postgresql://username:password@pg-hostname/expenseiq?sslmode=require" npx prisma db push
    ```

---

## ⚙️ 2. Backend Deployment: Supabase / Node Environments

To host the Express API backend, configure a Node environment (such as Supabase Functions, Render, or Railway) or a Docker container.

### Production Environment Variables
Set the following keys in your deployment provider console:

| Variable | Description | Recommended Value |
| :--- | :--- | :--- |
| `PORT` | Local runtime port | `5000` (or dynamic port) |
| `NODE_ENV` | Run mode | `production` |
| `DATABASE_URL` | Neon Connection string | `postgresql://...` (with `sslmode=require`) |
| `CLIENT_URL` | URL of the frontend deployment | `https://expense-iq.vercel.app` |
| `JWT_ACCESS_SECRET` | Secret key for access token signing | *Unpredictable 64-character string* |
| `JWT_REFRESH_SECRET` | Secret key for refresh token signing | *Unpredictable 64-character string* |

### Build & Start Commands
*   **Build Command:** `npm run build` (runs `tsc` compiler)
*   **Start Command:** `node dist/index.js`

---

## 🎨 3. Frontend Deployment: Vercel

Vercel provides static hosting and routing for React applications.

### Configuration (`vercel.json`)
To ensure client-side routing works on refresh, configure standard redirects in a `vercel.json` file:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Production Environment Variables
Set the following keys in the Vercel dashboard settings:

| Variable | Description | Value |
| :--- | :--- | :--- |
| `VITE_API_URL` | URL of your deployed backend | `https://api-expense-iq.supabase.co` |

### Build Parameters
*   **Build Command:** `npm run build` (compiles via `tsc && vite build`)
*   **Output Directory:** `dist`

---

## 🛠️ Common Deployment Issues & Troubleshooting

### 1. CORS Errors on Client Requests
*   **Symptoms:** Browser console displays `Blocked by CORS policy: Response to preflight request doesn't pass access control check`.
*   **Cause:** The backend `CLIENT_URL` environment variable does not match the exact URL of your Vercel deployment (e.g. trailing slashes mismatch).
*   **Solution:** Verify `CLIENT_URL` on the backend matches the Vercel URL exactly (e.g., `https://expense-iq.vercel.app`, no trailing slash).

### 2. Cookie Authorization Fails (Session Refresh Loop)
*   **Symptoms:** Users register or log in successfully but get logged out immediately.
*   **Cause:** Deployed cookies require HTTPS. If the backend is running over HTTP (like behind some proxy configs), cookies with `secure: true` are discarded by the browser.
*   **Solution:** Ensure the backend runs behind an SSL termination proxy. If proxy headers (`X-Forwarded-Proto`) are missing, tell Express to trust proxies by adding `app.set('trust proxy', 1)` in `index.ts`.

### 3. Database Connection Pool Starvation
*   **Symptoms:** Backend logs report `PrismaClientInitializationError: Connection pool limit reached`.
*   **Cause:** Serverless backend environments spawn instances concurrently, and each establishes independent Prisma client connections.
*   **Solution:** Append `&connection_limit=1` or `&pgbouncer=true` to your database URL parameters inside Neon/Prisma to limit connections.
