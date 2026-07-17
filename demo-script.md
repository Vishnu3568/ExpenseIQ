# Presentation Demo Script - ExpenseIQ Walkthrough

This document outlines a structured **5–10 minute demonstration walkthrough** of ExpenseIQ, optimized for recruiters, hiring managers, and developer showcases.

---

## 📽️ Demo Recording & Navigation Flow

To present a cohesive walkthrough, navigate through the app features in this sequence:

```text
[Register/Onboard] ──> [Dashboard Check] ──> [Categories Check] ──>
[Transactions Logging] ──> [Budgets Check] ──> [Data Intelligence] ──>
[Exports Center] ──> [Audit Logs & Settings]
```

---

## 🎙️ Step-by-Step Walkthrough Script

### Step 1: Onboarding & Registration (1 Minute)
*   **Action:** Open `/register`. Fill out fields: Name (`Demo User`), Email (`demo@example.com`), and select **INR** in the **Preferred Currency** dropdown. Click **Sign Up**.
*   **Talking Points:**
    *   "Welcome to ExpenseIQ. We start at the onboarding screen. Our registration form lets the user choose their default workspace currency immediately upon registration—supporting INR, USD, EUR, GBP, and JPY."
    *   "The backend handles this request by securely hashing passwords and initializing standard workspace preference presets in a single database transaction."

### Step 2: The Executive Dashboard (1.5 Minutes)
*   **Action:** Land on `/dashboard`. Point cursor to cash-flow charts, net worth cards, and category utilization charts.
*   **Talking Points:**
    *   "Once registered, we are redirected to our main Executive Dashboard. Since this is a new account, we see clean empty states with shimmer loaders."
    *   "All widgets utilize dynamic React.lazy routing, meaning components only fetch and render when needed, minimizing initial bundle payload footprint down to ~1MB."

### Step 3: Classifications & Categories (1 Minute)
*   **Action:** Navigate to **Categories** in the sidebar. Click **Add Category**. Add an expense category: Name: `Automotive`, Type: `EXPENSE`, Color: `#4F46E5`, Icon: `Car`. Click **Create**.
*   **Talking Points:**
    *   "To personalize our ledger, we head to the Categories page. Here, users can manage custom classifications with colors and iconography."
    *   "Our inputs are protected at the boundary. If we input HTML tags in fields, they are automatically stripped by our backend `sanitize-html` validator middleware before database insertion to prevent stored XSS attacks."

### Step 4: Ledger & Transactions (1.5 Minutes)
*   **Action:** Go to **Transactions** sidebar. Click **Add Transaction**. Create a transaction: Title: `Fuel Refill`, Amount: `4500`, Type: `EXPENSE`, Category: `Automotive`, Date: today, Method: `Card`. Click **Create**.
*   **Talking Points:**
    *   "Next is our transaction ledger. We can log our daily cash, bank, or UPI transactions."
    *   "Once created, the record is immediately displayed. Deleting a category sets the transaction's relationship to null, preserving our financial history instead of deleting records."

### Step 5: Smart Budgets (1 Minute)
*   **Action:** Go to **Budgets** sidebar. Click **Create Budget**. Budget Category: `Automotive`, Amount: `5000`. Click **Create**. Note the budget bar reaches 90% utilization.
*   **Talking Points:**
    *   "To keep spending on track, we set up Smart Budgets. Here we set a limit on our `Automotive` category."
    *   "The system calculates utilization in real-time. The moment we logged our 4,500 expense, our budget reaches 90% utilization, and the system logs an alert notification."

### Step 6: Data Intelligence & Reports (1 Minute)
*   **Action:** Go to **Intelligence** (insights) sidebar to view comparisons, then to **Reports** sidebar. Click **Export PDF Report**.
*   **Talking Points:**
    *   "The Data Intelligence Center lets users look up their historical searches and compare monthly spending trends."
    *   "In the Reports Center, users can export PDF summaries or CSV files. These routes are rate-limited to 5 requests per minute per IP to prevent CPU overload."

### Step 7: Security Audit Logs & Settings (1 Minute)
*   **Action:** Go to **Settings** sidebar. Click **Security Logs** tab to view the paginated audit table. Click **Logout**.
*   **Talking Points:**
    *   "Every login, profile update, or setting change is tracked inside our system Security Audit timeline."
    *   "The application incorporates a global React Error Boundary that prevents app-wide crashes, and a Network Liveness Banner that detects connectivity issues by polling the `/health` endpoint."
