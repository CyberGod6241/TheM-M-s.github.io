# Kumchop Admin Panel

Full-featured restaurant admin dashboard for the Kumchop ordering system.

---

## Folder Structure

```
src/
├── App.jsx                          # Root — auth guard, layout shell, global state
│
├── constants/
│   ├── theme.js                     # Brand colour tokens (T.orange, T.card, …)
│   └── data.js                      # STATUSES, SEED_MENU, SEED_ORDERS, BLANK_MENU_ITEM
│
├── utils/
│   └── helpers.js                   # fmt(), fmtDt(), statusColor()
│
├── components/
│   ├── ui/
│   │   └── index.jsx                # Badge, StatCard, Input, Select, Btn, MiniBar, Toast
│   └── layout/
│       └── Sidebar.jsx              # Collapsible sidebar with nav + logout
│
└── pages/
    ├── Login.jsx                    # Auth screen (username + password)
    ├── Dashboard.jsx                # KPI cards, charts, recent orders
    ├── Orders.jsx                   # Order card list + detail modal + status updater
    ├── MenuManager.jsx              # Menu grid + add/edit modal + availability toggle
    ├── Analytics.jsx                # Revenue, category, status, top-customer charts
    └── Settings.jsx                 # Restaurant info, hours, toggles, password change
```

---

## Quick Start

```bash
npx create-react-app kumchop-admin
cd kumchop-admin
npm install -D tailwindcss
npx tailwindcss init

# Copy the src/ folder from this project into your CRA src/
npm start
```

Demo credentials: **admin** / **kumchop2025**

---

## Data Flow

```
App.jsx
  ├─ orders state  ──► Orders.jsx, Dashboard.jsx, Analytics.jsx
  ├─ menuItems state ─► MenuManager.jsx, Dashboard.jsx
  ├─ updateOrderStatus() ─► Orders.jsx (also call your API here)
  └─ showToast() ──────► MenuManager.jsx, Settings.jsx
```

All inter-component communication flows through props from `App.jsx`.
No external state library is required — the app is small enough that
`useState` at the root level is perfectly adequate.

---

## Connecting a Real Backend

### Order status update (Orders.jsx)
Replace the `updateOrderStatus` function in `App.jsx`:

```js
const updateOrderStatus = async (id, status) => {
  const prev = orders;
  // Optimistic update
  setOrders((o) => o.map((x) => (x.id === id ? { ...x, status } : x)));
  try {
    await fetch(`/api/orders/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    showToast(`Order ${id} → ${status}`, "success");
  } catch {
    setOrders(prev); // roll back
    showToast("Update failed", "error");
  }
};
```

### Seed data → real API
In `App.jsx`, replace `useState(SEED_ORDERS)` with a `useEffect` fetch:

```js
useEffect(() => {
  fetch("/api/orders")
    .then((r) => r.json())
    .then(setOrders);
}, []);
```
