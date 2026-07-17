# Backend Architecture & Service Layer - ExpenseIQ

The ExpenseIQ backend is a stateless Express application written in TypeScript, using Prisma ORM to interact with PostgreSQL. It adheres to standard layered architecture patterns.

---

## 🏗️ Layer Structure

```text
  [Router Layer]        - Mapping endpoints, validation checks, and CORS rules.
        │
  [Validator Layer]     - Shared schemas, input type validation, and HTML sanitizers.
        │
 [Controller Layer]     - Request parsing, thin controllers, and response execution.
        │
   [Service Layer]      - Core domain services, transactional logic, and DB operations.
        │
  [Database Layer]      - Prisma Client, PostgreSQL models, and event triggers.
```

---

## 📡 Request & Response Pipelines

### 1. Unified Validation & HTML Sanitization
All client-provided text is validated and sanitized at the boundary to block stored XSS.
*   **Centralized Validation Schemas:** Centralized validators inside [sharedValidator.ts](file:///e:/Project%2520Folder/ExpenseIQ/backend/src/validators/sharedValidator.ts) enforce structured checks for emails and password complexities.
*   **HTML Sanitization:** Request bodies run through `.customSanitizer(sanitizeText)` which strips HTML/script tags (using `sanitize-html`) before database execution:
    ```typescript
    export const sanitizeText = (value: any) => {
      if (typeof value !== 'string') return value;
      return sanitizeHtml(value, {
        allowedTags: [],
        allowedAttributes: {},
      });
    };
    ```

### 2. Global Error Handling
Errors are caught by the Express global middleware handler [errorMiddleware.ts](file:///e:/Project%2520Folder/ExpenseIQ/backend/src/middleware/errorMiddleware.ts).
*   **Custom Exceptions:** Domain operations throw structured custom exceptions inheriting from `AppError` (e.g. `UnauthorizedError`, `ValidationError`, `ForbiddenError`, `ConflictError`).
*   **Payload Standardization:** The error handler returns standard JSON response bodies:
    ```json
    {
      "success": false,
      "error": {
        "code": "BAD_REQUEST",
        "message": "Detailed error validation details..."
      }
    }
    ```
*   **Trace Protection:** Stack traces are logged to the backend but completely omitted from the client response in production modes (`NODE_ENV === 'production'`).

---

## 📝 Structured JSON Logging

ExpenseIQ uses a custom logging service [LoggerService.ts](file:///e:/Project%2520Folder/ExpenseIQ/backend/src/services/LoggerService.ts) to produce structured logs.
*   **Log Formats:** Logs are categorized into `INFO`, `WARN`, `ERROR`, and `SECURITY`.
*   **Duration Metrics:** Tracks request durations and routes execution timings in milliseconds.
*   **Production Safety:** Avoids standard, unformatted `console.log` statements.

---

## 🩺 Health & Diagnostics Probes

*   **Liveness Probe (`/health`):** Verifies the server application is up, exposing system metrics (uptime, memory allocation).
*   **Readiness Probe (`/ready`):** Confirms end-to-end database connectivity by executing a raw SQL query (`SELECT 1`) via the Prisma Client. Returns a `200 OK` status when connected, or `503 Service Unavailable` if the database is disconnected.
