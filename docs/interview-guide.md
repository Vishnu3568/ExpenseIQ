# Technical Interview & Discussion Guide - ExpenseIQ

This guide prepares developers for technical interviews by detailing architecture decisions, design tradeoffs, key interview talking points, STAR stories, and Q&As based on ExpenseIQ's implementation.

---

## 🎙️ 1. Key Interview Talking Points

1.  **Dual-Token Security Architecture:** Explain why access tokens are kept in memory and refresh tokens are stored in HttpOnly SameSite cookies. Highlight how token rotation prevents replay attacks and how Prisma `deleteMany` prevents race conditions during token invalidation.
2.  **Boundary Defense & Input Sanitization:** Explain how `express-validator` and `sanitize-html` sanitizers strip HTML/script tags from user inputs (names, descriptions, notes) at the request boundary before database persistence to prevent Stored XSS.
3.  **Frontend Performance Optimization:** Discuss bundle splitting strategies in Vite. Explain how isolating heavy vendor dependencies like `recharts` into separate manual chunks and dynamic page lazy loading (`React.lazy`/`Suspense`) kept initial vendor payload sizes optimized.
4.  **Database Indexing & Schema Design:** Detail how compound indexes (e.g. `[userId, date]` on Transactions) optimize date-range queries for financial charts and reports. Discuss soft integrity rules like `onDelete: SetNull` for Categories to preserve historical ledger records.
5.  **Accessibility & Focus Trapping:** Discuss implementing WCAG 2.1 AA compliant modal dialogs with focus trapping loops, Escape key listeners, and focus restoration to the trigger element on modal dismissal.

---

## ❓ 2. Frequently Asked Interview Questions & Answers

### Q1: How did you handle user authentication and session security in ExpenseIQ?
**Answer:**  
"I implemented a dual-token authentication flow using JWTs. The short-lived access token is stored strictly in client memory to avoid XSS vulnerability risks associated with `localStorage`. The long-lived refresh token is stored in an HttpOnly, SameSite `strict` cookie restricted to the `/api/auth` path. 

When refreshing access tokens, the server verifies the hashed refresh token against PostgreSQL, rotates both tokens, and invalidates the old refresh token. To prevent race condition crashes during concurrent refresh requests, I used `prisma.refreshToken.deleteMany` instead of `delete`."

---

### Q2: How did you prevent Cross-Site Scripting (XSS) attacks?
**Answer:**  
"I applied a multi-layered defense. First, access tokens are never kept in `localStorage`. Second, React natively escapes output rendered in the JSX tree. Third, and most importantly, I added a custom input sanitizer to the Express validation pipeline using `sanitize-html`. Any user input across category names, transaction notes, or user profile bios is stripped of HTML and script tags before being persisted to PostgreSQL."

---

### Q3: How did you optimize frontend performance and initial load time?
**Answer:**  
"I tackled frontend performance through code-splitting and asset optimization in Vite. I wrapped page routes in `React.lazy` and `Suspense` so components are only loaded when navigated to. 

Additionally, large dependencies like `recharts` can bloat the main vendor bundle. I configured custom manual Rollup chunking rules in `vite.config.ts` to isolate charting engines into a dedicated `vendor-charts` async chunk, keeping our core bundle light and improving first contentful paint times."

---

### Q4: How does ExpenseIQ handle database schema design for financial integrity?
**Answer:**  
"In financial applications, preserving transaction history is critical. For instance, when a user deletes a custom expense category, we cannot delete the associated transactions or the user's historical ledger would be corrupted. 

In the Prisma schema, I set `onDelete: SetNull` on the `Category -> Transaction` relationship. This unlinks the category while keeping the transaction record and financial totals intact. Conversely, for user account deletion, I set `onDelete: Cascade` to ensure complete multitenant data cleanup."

---

### Q5: How did you approach application error handling and resilience?
**Answer:**  
"On the backend, I established a unified hierarchy of custom typed exception classes inheriting from an `AppError` base class (e.g. `ValidationError`, `UnauthorizedError`, `NotFoundError`). A global Express error middleware intercepts all uncaught errors, logs structured JSON error metadata via `LoggerService`, and returns standardized error envelopes without exposing internal stack trace leaks in production.

On the frontend, I wrapped the main component tree in a custom React `ErrorBoundary` fallback to catch render failures gracefully and provide a manual application reload action."

---

## ⭐ 3. STAR-Format Project Stories

### Story 1: Preventing Concurrent Refresh Token Race Conditions
*   **Situation:** During testing of the JWT refresh token rotation mechanism, rapid concurrent requests (such as simultaneous dashboard widget fetches on page load) triggered database 500 error crashes.
*   **Task:** Ensure refresh token rotation is secure against replay attacks while remaining resilient under concurrent client requests.
*   **Action:** I analyzed backend crash trace logs and identified that a standard `prisma.refreshToken.delete` call threw an error if a parallel request had already removed the token record milliseconds earlier. I replaced the strict `delete` query with `prisma.refreshToken.deleteMany({ where: { tokenHash } })`, which safely handles multi-request token invalidations without throwing exceptions.
*   **Result:** Completely eliminated 500 errors during token rotation while maintaining strict session security and database consistency.

---

### Story 2: Improving Frontend Accessibility and Keyboard Navigation
*   **Situation:** Auditing ExpenseIQ against WCAG 2.1 AA accessibility standards revealed that modal dialogs allowed keyboard focus to escape into background elements, creating a poor experience for screen reader and keyboard-only users.
*   **Task:** Refactor modal dialogs to implement proper focus trapping, keyboard shortcuts, and ARIA accessibility standards without breaking existing UI layouts.
*   **Action:** I refactored the base `Modal.tsx` component using React `useRef` and `useEffect` hooks. I implemented a focus trap algorithm that traps `Tab` and `Shift+Tab` cycles inside the modal's focusable elements, added a global `Escape` key listener for modal dismissal, and stored a reference to the trigger element to restore focus when the modal closes.
*   **Result:** Achieved 100% WCAG 2.1 AA compliance for modal interactions and significantly improved keyboard usability across all transaction, budget, and category dialogs.
