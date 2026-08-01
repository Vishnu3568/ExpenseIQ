# Contributing to ExpenseIQ

Thank you for your interest in contributing to ExpenseIQ! We welcome contributions from the community.

## 🛠️ Development Setup

1.  **Fork and Clone the Repository**
    ```bash
    git clone https://github.com/yourusername/ExpenseIQ.git
    cd ExpenseIQ
    ```

2.  **Install Dependencies**
    ```bash
    # Install backend dependencies
    cd backend
    npm install

    # Install frontend dependencies
    cd ../frontend
    npm install
    ```

3.  **Configure Environment Variables**
    *   Copy `backend/.env.example` to `backend/.env` and update your PostgreSQL connection parameters.
    *   Copy `frontend/.env.example` to `frontend/.env`.

4.  **Database Migration & Client Generation**
    ```bash
    cd backend
    npx prisma db push
    npx prisma generate
    ```

5.  **Run Development Servers**
    *   Backend: `cd backend && npm run dev`
    *   Frontend: `cd frontend && npm run dev`

---

## 📐 Coding Standards & Guidelines

*   **TypeScript:** Enforce strict type definitions. Avoid using `any`.
*   **Linting & Formatting:** Ensure code passes ESLint checks without warnings before submitting PRs.
    ```bash
    npm run lint
    npm run build
    ```
*   **Security:** Never commit secrets, API keys, or database credentials. Always sanitize user inputs at API boundaries.
*   **Accessibility:** Maintain WCAG 2.1 AA compliance for UI elements (keyboard focus management, ARIA attributes).

---

## 🔀 Pull Request Process

1.  Create a feature branch from `main` (`git checkout -b feature/my-feature`).
2.  Commit your changes using semantic commit messages (`feat: ...`, `fix: ...`, `docs: ...`).
3.  Run build and lint commands to verify zero errors.
4.  Submit a Pull Request targeting the `main` branch with a clear description of changes.
