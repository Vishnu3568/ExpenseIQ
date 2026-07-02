# Software Design Document - ExpenseIQ

This document details the software design specifications, database models, API design, and core architecture components of ExpenseIQ.

## 1. Product Vision
ExpenseIQ is a secure, full-stack personal finance application. It enables users to log income and expenses, establish category-specific budgets, review dynamic monthly breakdowns, and view savings metrics.

## 2. Technology Stack
- **Frontend:** React, TypeScript, Tailwind CSS, Vite.
- **Backend:** Node.js, Express, TypeScript.
- **Database:** PostgreSQL, Prisma ORM.
- **Authentication:** JWT, bcrypt.
- **Hosting:** Vercel (Frontend), Railway (Backend).

## 3. Database Schema Blueprint
The application manages resources through five primary entities:
- **User:** Manages auth credentials, profile data, and currency configurations.
- **Session:** Tracks refresh token keys.
- **Category:** Categorizes operations (either system defaults or user custom tags).
- **Transaction:** Standard ledger events capturing financial movements.
- **Budget:** Defines monthly category spending limits.

Refer to the database section in project planning documents for detailed tables, indexes, and constraint declarations.
