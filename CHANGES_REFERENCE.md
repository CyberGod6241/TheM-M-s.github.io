# Files Modified - Quick Reference

## Modified Files

### 1. `client/src/utils/api.js` - Complete Rewrite

**Purpose**: HTTP API layer with Firebase authentication

**New Functions**:

- `getMenuItems()` - Fetch all menu
- `createMenuItem(itemData)` - Add menu item
- `updateMenuItem(itemId, itemData)` - Edit menu item
- `deleteMenuItem(itemId)` - Remove menu item
- `placeOrder(orderData)` - Create order with token
- `getAllOrders()` - Get all orders (admin)
- `getUserOrders()` - Get user's orders
- `updateOrderStatus(orderId, status)` - Update order (admin)
- `deleteOrder(orderId)` - Remove order (admin)
- `getUserRole()` - Check if admin
- `syncUser(userData)` - Sync user to backend

**Key Feature**: All non-public endpoints include Firebase ID token in Authorization header

---

### 2. `client/src/components/ProtectedRoute.jsx` - New File

**Purpose**: Protect admin routes with role checking

**Usage**:

```jsx
<ProtectedRoute userRole={userRole} authed={authed} isLoading={authLoading}>
  <Admin menuItems={menuItems} setMenuItems={setMenuItems} />
</ProtectedRoute>
```

---

### 3. `client/src/App.jsx` - Major Updates

**Changes**:

- Import `ProtectedRoute`, `getUserRole`, `placeOrder`
- Add state: `userRole`
- Fetch user role on auth change
- Fetch menu from API on mount
- Updated `handlePlaceOrder` to use new API
- Wrapped admin route with `ProtectedRoute`

**Line Changes**:

- Added `useEffect` to fetch orders after auth (lines ~133)
- Updated menu loading to use new API (lines ~149)
- New `handlePlaceOrder` with Firebase token (lines ~86)
- `<ProtectedRoute>` wrapping admin route (lines ~313)

---

### 4. `client/src/Dashboard/LandingPage.jsx` - Updated

**Changes**:

- Added `useState` and `useEffect` for data fetching
- Fetch menu from API on component mount
- Groups items by category
- Falls back to hardcoded menu on error

---

### 5. `client/src/Admin/pages/MenuManager.jsx` - API Integration

**Changes**:

- Import: `createMenuItem`, `updateMenuItem`, `deleteMenuItem`
- `saveItem()` - Now async, calls API for create/update
- `toggleAvail()` - Now async, calls API
- `deleteItem()` - Now async, calls API
- Added error handling and toast notifications

**API Calls**:

- CREATE: `await createMenuItem({ name, emoji, category, unitPrice, unitLabel, img, available })`
- UPDATE: `await updateMenuItem(id, { ...updates })`
- DELETE: `await deleteMenuItem(id)`

---

### 6. `client/src/Dashboard/Admin.jsx` - Order Fetching

**Changes**:

- Import: `getAllOrders`, `updateOrderStatus`
- Add `useEffect` to fetch all orders on auth
- Updated `updateOrderStatus` to call API
- Falls back to `SEED_ORDERS` if API fails

---

### 7. `client/src/Admin/pages/Orders.jsx` - Async Status Updates

**Changes**:

- `handleStatus()` now async
- Status buttons disabled during update
- Loading state with "..." indicator
- Prevents race conditions

---

## No Changes Needed (Already Working)

- `client/src/Dashboard/Customer.jsx` - Receives menu from App.jsx
- `client/src/Dashboard/OrderSection.jsx` - Collects form data
- `client/src/Customer/pages/MenuCard.jsx` - Renders from props
- All other components use existing props

---

## API Base URL

All API requests use: `http://localhost:3000/api`

Configure in `client/src/utils/api.js` line 8:

```javascript
const API_BASE = "http://localhost:3000/api";
```

## Firebase Integration

Token extraction in `client/src/utils/api.js`:

```javascript
const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");
  return user.getIdToken();
};
```

All secure endpoints include:

```
Authorization: Bearer {firebaseToken}
```

---

## Seed Data Fallback

If API is unavailable:

- Menu uses `SEED_MENU` from `client/src/Admin/constants/data.js`
- Orders use `SEED_ORDERS` from `client/src/Admin/constants/data.js`

This ensures the app continues to work during development/API downtime.
