# Frontend Architecture & App Shell - ExpenseIQ

The ExpenseIQ frontend is a React application built with TypeScript, TailwindCSS, and Vite. It utilizes a state-driven application shell with strict route protection boundaries.

---

## 🗺️ Routing & Session Protection

The routing engine [AppRoutes.tsx](file:///e:/Project%2520Folder/ExpenseIQ/frontend/src/routes/AppRoutes.tsx) separates pages into Public and Private layouts:
*   **Public routes:** Login, Register.
*   **Protected routes:** Dashboard, Transactions, Categories, Budgets, Reports, Data Intelligence, Settings, Notifications, Activity. Protected routes verify session credentials and automatically redirect unauthorized requests back to `/login`.

---

## ⚡ React Code Splitting & Performance

To optimize initial page load speeds, the build uses dynamic bundling configurations:
*   **Page Lazy Loading:** Every main view is dynamically imported using `React.lazy` and loaded inside a `React.Suspense` container displaying a premium loading spinner.
*   **Rollup Chunk Optimization:** Defined manual splitting rules in `vite.config.ts` to isolate heavy charting libraries (`recharts`) and icon assets into individual async bundles. This prevents initial page load blocks and keeps the core vendor bundle below warning thresholds.
*   **Static Base Path Resolution:** Configured `base: './'` in `vite.config.ts` to support relative asset bundling for GitHub Pages and subpath hosting environments.

---

## 🔄 Application Context Architecture

Global state is managed via React Context Providers:
*   **AuthContext:** Controls session storage, login/logout network calls, token refresh routines, and user variables.
*   **WorkspaceContext:** Handles tenant workspace preferences (currencies, date formats, dark/light themes, dashboard preferences).
*   **NotificationContext:** Tracks unread notification alert counts and manages category rule triggers.

---

## ♿ Accessibility & Focus Management

ExpenseIQ implements strict keyboard accessibility rules satisfying WCAG 2.1 AA parameters:
1.  **Dialog Focus Trapping:** Overhauled [Modal.tsx](file:///e:/Project%2520Folder/ExpenseIQ/frontend/src/components/ui/Modal.tsx) to capture `Tab` focus loops, preventing focus from exiting active overlays.
2.  **Focus Restoration:** Stores the trigger button element in a ref and returns keyboard focus back to it on modal close.
3.  **Escape Key Bindings:** Closes open modals, dropdown dialogs, and notification bars when the user presses `Esc`.
4.  **Semantic ARIA Tags:** Outfits form components with correct indicators (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`).

---

## 🛡️ Global Error Boundary Shell

A top-level React `ErrorBoundary` component wraps the app context tree. If any rendering error or unhandled component exception occurs inside the React tree, the ErrorBoundary intercepts the crash, logs the details, and displays a user-friendly crash screen with a quick "Reload Application" recovery button.
