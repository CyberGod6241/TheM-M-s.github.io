# Real Data Integration - Implementation Guide

## ✅ What Has Been Completed

### 1. Frontend API Layer

**File**: `client/src/utils/api.js`

Complete HTTP API integration with:

- Menu management (fetch, create, update, delete)
- Order management (place, fetch, update status, delete)
- User management (fetch role, sync user)
- Firebase ID token authentication on all requests

### 2. Role-Based Access Control

**File**: `client/src/components/ProtectedRoute.jsx`

Secure admin routes with:

- Role verification before rendering
- Automatic redirect for non-admin users
- Auth loading state handling

### 3. App-Level Data Fetching

**File**: `client/src/App.jsx`

- Fetches user role on authentication
- Fetches menu items on app load
- Wraps admin route with ProtectedRoute
- Updated checkout to use new order API

### 4. Landing Page Real Data

**File**: `client/src/Dashboard/LandingPage.jsx`

- Fetches menu from API
- Groups items by category
- Falls back to hardcoded menu on error

### 5. Admin Panel CRUD Operations

**File**: `client/src/Admin/pages/MenuManager.jsx`

- Create: `POST /api/menu` with item data
- Update: `PUT /api/menu/:id` with changes
- Delete: `DELETE /api/menu/:id` with confirmation
- All operations include error handling and toast notifications

### 6. Order Management

**Files**: `client/src/Dashboard/Admin.jsx`, `client/src/Admin/pages/Orders.jsx`

- Fetches all orders on admin load
- Updates order status via API
- Async UI feedback during updates
- Fallback to seed data if API unavailable

## 🚀 Next Steps: Backend Implementation

You need to create a Node.js/Express backend with these endpoints:

### Base URL: `http://localhost:3000/api`

#### Menu Endpoints

```javascript
// GET /menu - List all menu items
GET /api/menu
// Response: Array of menu items or { data: [...] }

// POST /menu - Create menu item (requires admin)
POST /api/menu
// Headers: Authorization: Bearer {firebaseToken}
// Body: {
//   name: string,
//   emoji: string,
//   category: string,
//   unitPrice: number,
//   unitLabel: string,
//   img: string (URL),
//   available: boolean
// }

// PUT /menu/:id - Update menu item (requires admin)
PUT /api/menu/:id
// Headers: Authorization: Bearer {firebaseToken}
// Body: { name, emoji, category, unitPrice, unitLabel, img, available }

// DELETE /menu/:id - Delete menu item (requires admin)
DELETE /api/menu/:id
// Headers: Authorization: Bearer {firebaseToken}
```

#### Order Endpoints

```javascript
// GET /orders - Get all orders (admin only)
GET /api/orders
// Headers: Authorization: Bearer {firebaseToken}
// Response: Array of orders or { data: [...] }

// GET /orders?userId={id} - Get user's orders
GET /api/orders?userId={userId}
// Headers: Authorization: Bearer {firebaseToken}

// POST /orders - Create new order
POST /api/orders
// Headers: Authorization: Bearer {firebaseToken}
// Body: {
//   cartItems: [
//     { id, name, quantity, unitPrice, subtotal }
//   ],
//   totalAmount: number,
//   deliveryType: 'delivery' | 'pickup',
//   address: string | null,
//   phone: string,
//   note: string
// }
// Response: { id: orderId, ... }

// PUT /orders/:id/status - Update order status (admin only)
PUT /api/orders/:id/status
// Headers: Authorization: Bearer {firebaseToken}
// Body: { status: string }

// DELETE /orders/:id - Delete order (admin only)
DELETE /api/orders/:id
// Headers: Authorization: Bearer {firebaseToken}
```

#### User Endpoints

```javascript
// GET /users/:id/role - Get user role
GET /api/users/:id/role
// Headers: Authorization: Bearer {firebaseToken}
// Response: { role: 'admin' | 'customer' } or just 'admin' | 'customer'

// POST /users/sync - Sync user to backend
POST /api/users/sync
// Headers: Authorization: Bearer {firebaseToken}
// Body: { any user data to sync }
```

## 🔐 Authentication Pattern

All requests (except GET /menu) require:

```javascript
// Headers
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {firebaseIdToken}"
}
```

### Backend verification:

1. Extract token from `Authorization` header
2. Verify with Firebase Admin SDK:

```javascript
const admin = require("firebase-admin");
const token = req.headers.authorization.split("Bearer ")[1];
const decodedToken = await admin.auth().verifyIdToken(token);
const userId = decodedToken.uid;
```

## 📋 Data Flow Examples

### Placing an Order (Customer)

1. User adds items to cart in Customer component
2. User fills checkout form (name, phone, address, note, delivery type)
3. `handlePlaceOrder()` in App.jsx collects form data
4. Calls `placeOrder()` API with:
   - Array of cart items
   - Total amount
   - Delivery/pickup type
   - Address (if delivery)
   - Phone and special instructions
   - **Firebase ID token in header**
5. Backend creates order with userId from token
6. Returns order ID
7. Success modal displayed

### Updating Menu Item (Admin)

1. Admin clicks "Edit" on menu item
2. Modal opens with item data
3. Admin makes changes and clicks "Save Changes"
4. `updateMenuItem()` called with:
   - Item ID
   - Updated fields
   - **Firebase ID token in header**
5. Backend verifies user is admin
6. Updates item in database
7. Toast confirmation shown

## 🧪 Testing with curl

```bash
# Get menu (no auth needed)
curl http://localhost:3000/api/menu

# Create menu item (requires admin token)
curl -X POST http://localhost:3000/api/menu \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -d '{
    "name": "Jollof Rice",
    "emoji": "🍛",
    "category": "Rice & Swallows",
    "unitPrice": 2500,
    "unitLabel": "plate",
    "img": "https://...",
    "available": true
  }'

# Place order
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -d '{
    "cartItems": [
      { "id": 1, "name": "Jollof Rice", "quantity": 2, "unitPrice": 2500, "subtotal": 5000 }
    ],
    "totalAmount": 5000,
    "deliveryType": "delivery",
    "address": "123 Main St, Lagos",
    "phone": "08012345678",
    "note": "No spice"
  }'
```

## 📦 Error Handling

The frontend gracefully handles:

- Network errors (falls back to seed data)
- Missing user role (defaults to "customer")
- Failed API calls (shows toast notifications)
- Unauthenticated requests (redirects to login)

## 🔍 Key Features Enabled

✅ Real menu data from backend
✅ Customer checkout with Firebase token
✅ Admin CRUD operations on menu
✅ Order status management
✅ Role-based route protection
✅ Automatic fallback to seed data
✅ Toast notifications for feedback
✅ Error logging for debugging
