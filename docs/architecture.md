# System Architecture - ExpenseIQ

This document provides a high-level overview of the architectural framework of the ExpenseIQ system, documenting the structural patterns, decoupled components, and data integrations.

---

## 🏛️ High-Level System Architecture

ExpenseIQ utilizes a decoupled **Single Page Application (SPA)** client communicating with a stateless **RESTful API** backend. The backend persists transaction and budgeting logs in a **PostgreSQL** relational database layer via **Prisma ORM**. Automated build and deployment of the frontend static bundle is orchestrated via GitHub Actions workflows (`.github/workflows/deploy.yml`).

```mermaid
graph TD
    Client[React SPA App Shell]
    API[Express REST API Backend]
    DB[(PostgreSQL Database)]
    Logger[JSON Structured Logger]
    EventBus[Domain Event Bus]

    Client -->|HTTPS / JSON / Cookies| API
    API -->|Prisma Client| DB
    API -.->|Events| EventBus
    API -.->|Logs| Logger
```

---

## 📊 Request Lifecycle & System Flow

Every client action follows a structured pipeline passing through security validation and event-driven updates.

```mermaid
sequenceDiagram
    autonumber
    actor User as React Client
    participant API as Express Router
    participant Auth as Auth Middleware
    participant Val as Input Validator
    participant Ctrl as Controller
    participant Svc as Domain Service
    participant DB as Prisma / PostgreSQL
    participant Event as Domain Event Bus

    User->>API: HTTP Request (Headers + Body + Cookies)
    API->>Auth: Validate JWT / Cookies
    Auth-->>API: Active Session Authorized
    API->>Val: Check Input Sanitization & Schemas
    Val-->>API: Inputs Sanitized (HTML tags stripped)
    API->>Ctrl: Execute Route Handler
    Ctrl->>Svc: Invoke Service Method
    Svc->>DB: Query / Mutate Data
    DB-->>Svc: Query Results / Transaction Confirmation
    Svc->>Event: Emit Event (e.g., TRANSACTION_CREATED)
    Event-->>Svc: Async Event Execution (Audit/Alert Notifications)
    Svc-->>Ctrl: Service Output Payload
    Ctrl-->>User: JSON Response Envelope (200 OK / 201 Created)
```

---

## 💾 Database Entity-Relationship (ER) Diagram

The PostgreSQL relational structure is mapped below, demonstrating key-relationship cascades, unique indices, and database constraints.

```mermaid
erDiagram
    User ||--o{ Workspace : "owns"
    User ||--o{ Transaction : "records"
    User ||--o{ Category : "creates"
    User ||--o{ Budget : "defines"
    User ||--o{ Notification : "receives"
    User ||--o{ AuditLog : "triggers"
    User ||--o{ RefreshToken : "possesses"
    Workspace ||--o{ SavedView : "contains"
    Category ||--o{ Transaction : "classifies"
    Category ||--o{ Budget : "restricts"

    User {
        string id PK
        string email UK
        string passwordHash
        string name
        string currency
        datetime createdAt
        datetime updatedAt
    }

    Workspace {
        string id PK
        string userId FK
        string currency
        string timezone
        string locale
        string numberFormat
        string dateFormat
        string theme
        json dashboardPreferences
        json exportPreferences
        json notificationPreferences
        datetime createdAt
        datetime updatedAt
    }

    Transaction {
        string id PK
        string userId FK
        string categoryId FK
        string title
        decimal amount
        string type
        datetime date
        string paymentMethod
        string description
        string notes
        datetime createdAt
        datetime updatedAt
    }

    Category {
        string id PK
        string userId FK
        string name
        string type
        string color
        string icon
        int sortOrder
        datetime createdAt
        datetime updatedAt
    }

    Budget {
        string id PK
        string userId FK
        string categoryId FK
        string name
        decimal amount
        string type
        datetime startDate
        datetime endDate
        string status
        string notes
        datetime createdAt
        datetime updatedAt
    }

    Notification {
        string id PK
        string userId FK
        string type
        string title
        string message
        string status
        string priority
        string source
        string entityType
        string entityId
        string actionUrl
        json metadata
        datetime createdAt
        datetime updatedAt
    }

    AuditLog {
        string id PK
        string userId FK
        string action
        string entityType
        string entityId
        json details
        string ipAddress
        string userAgent
        datetime createdAt
    }

    RefreshToken {
        string id PK
        string tokenHash UK
        string userId FK
        datetime expiresAt
        datetime createdAt
    }

    SavedView {
        string id PK
        string workspaceId FK
        string name
        json filters
        datetime createdAt
        datetime updatedAt
    }
```
