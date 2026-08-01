# Portfolio Summary & Career Materials - ExpenseIQ

This document provides ready-to-use summaries, resume bullets, LinkedIn posts, and pitch scripts for featuring ExpenseIQ in developer portfolios and career applications.

---

## 📄 1. Resume-Ready Project Description

**ExpenseIQ | Full-Stack Personal Finance & Smart Budgeting Platform**
*Tech Stack: React 18, TypeScript, TailwindCSS, Node.js, Express, PostgreSQL, Prisma ORM, Helmet, Express-Validator, Vite*

*   Engineered a high-performance, multi-tenant financial ledger and budgeting platform supporting real-time transaction tracking, custom income/expense categorizations, and automated currency localization (INR, USD, EUR, GBP, JPY).
*   Implemented a stateless dual-token (Access/Refresh) authentication architecture using HttpOnly, SameSite cookies with automated token rotation and race-condition-safe database deletions via Prisma `deleteMany`.
*   Designed an accessible, WCAG 2.1 AA-compliant frontend featuring custom React Error Boundaries, dialog keyboard focus trapping, Escape-key dismissals, and dynamic theme switching (Dark/Light).
*   Hardened production security using Helmet Content Security Policies (CSP), HSTS preloading, granular rate-limiting (Auth, Export, API), and custom HTML input sanitization (`sanitize-html`) to eliminate Stored XSS vectors.
*   Optimized frontend performance and bundle size using route-based code-splitting (`React.lazy`/`Suspense`) and Vite Rollup manual chunking, isolating heavy charting libraries (`recharts`) to cut initial page load times.

---

## 🎯 2. ATS-Friendly Bullet Points

*   **Full-Stack Development:** Developed a full-stack personal finance web application using TypeScript, React 18, Node.js, Express, and PostgreSQL, serving RESTful APIs with interactive OpenAPI/Swagger documentation.
*   **Security & Input Protection:** Integrated `sanitize-html` and `express-validator` middleware pipelines to sanitize user-editable text fields, preventing Stored XSS attacks across all endpoint routes.
*   **Authentication & AuthZ:** Constructed secure JWT authentication with short-lived access tokens stored in memory and long-lived refresh tokens stored in HttpOnly SameSite cookies.
*   **Performance Optimization:** Reduced frontend initial payload sizes by configuring manual chunk splitting in Vite and route-based code-splitting via `React.lazy`.
*   **Reliability & Monitoring:** Created structured JSON logging (`LoggerService`), dynamic liveness/readiness probes (`/health`, `/ready`), and a global network status banner for automatic connection outage recovery.
*   **Accessibility (A11y):** Implemented WCAG 2.1 AA focus management, keyboard Tab navigation trapping within modals, and semantic ARIA labeling across interactive components.

---

## 💼 3. LinkedIn Project Showcase

🚀 **Excited to share ExpenseIQ — a full-stack, enterprise-grade Personal Finance & Smart Budgeting Platform!**

ExpenseIQ was engineered from the ground up to solve complex financial tracking challenges while upholding strict standards for security, performance, and accessibility.

💡 **Key Engineering Highlights:**
🔹 **Full-Stack Architecture:** React 18 + TypeScript frontend powered by a Node.js/Express REST API and PostgreSQL via Prisma ORM.  
🔹 **Hardened Security:** Dual-token JWT auth with HttpOnly SameSite cookies, Helmet CSP policies, rate-limiting on sensitive endpoints, and automated `sanitize-html` input protection against Stored XSS.  
🔹 **Smart Budgeting Engine:** Dynamic budget utilization tracking with real-time alerts and historical category trend comparisons.  
🔹 **WCAG 2.1 AA Accessibility:** Modal focus trapping, keyboard navigation loops, Escape key dismissals, and high-contrast dark/light mode themes.  
🔹 **Production Readiness:** Route-based lazy loading, Vite vendor chunk splitting, automated health diagnostics (`/health` & `/ready`), and full OpenAPI/Swagger documentation.

🛠️ **Tech Stack:** TypeScript | React | Node.js | Express | PostgreSQL | Prisma ORM | TailwindCSS | Vite | Swagger

#FullStack #ReactJS #NodeJS #TypeScript #PostgreSQL #WebDevelopment #SoftwareEngineering #PortfolioProject

---

## ⏱️ 4. Elevator Pitch (30 Seconds)

> "ExpenseIQ is a full-stack personal finance management application I built using React 18, TypeScript, Node.js, and PostgreSQL with Prisma ORM. It allows users to track financial transactions, manage custom categories, set up smart budgets with real-time threshold alerts, and export institutional PDF/CSV financial reports. 
> 
> What sets ExpenseIQ apart is its enterprise focus: I engineered a dual-token JWT authentication system using HttpOnly cookies, added automated HTML sanitization to prevent Stored XSS, implemented WCAG-compliant accessibility focus trapping, and optimized initial bundle delivery using Vite manual chunking. It's built to be secure, fast, and production-ready."

---

## 🔊 5. Technical Explanation (2 Minutes)

> "ExpenseIQ is structured as a decoupled Single Page Application communicating with a stateless Node.js REST API over HTTPS. 
> 
> On the backend, I built a layered architecture—separating routers, validation middleware, thin controllers, and domain services. Data persistence is managed via PostgreSQL and Prisma ORM. To ensure high query efficiency on financial metrics, I designed compound database indexes on high-frequency lookups like `[userId, date]` for transactions and `[userId, status, createdAt]` for unread notifications.
> 
> For security, the system utilizes a dual-token JWT strategy. Access tokens are short-lived and stored strictly in memory, while refresh tokens are stored in HttpOnly, SameSite cookies. On the server side, refresh token hashes are verified against the database and rotated safely using `deleteMany` operations to eliminate race conditions under concurrent requests. Additionally, all incoming text data passes through an `express-validator` pipeline backed by `sanitize-html` to strip HTML tags before writing to the database.
> 
> On the frontend, ExpenseIQ uses React 18 with Context API for state management across workspace preferences, auth sessions, and notifications. To keep the initial page paint fast, I implemented route-based code-splitting using `React.lazy` and `Suspense`, combined with manual Rollup chunking in Vite to isolate heavy charting libraries like Recharts into standalone async bundles.
> 
> Finally, reliability and UX were paramount: I implemented a top-level React Error Boundary to catch render failures gracefully, automated health diagnostic endpoints (`/health` and `/ready`), and built an active Network Status Banner that pings server liveness and automatically recovers when connectivity is restored."
