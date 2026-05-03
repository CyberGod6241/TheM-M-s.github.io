# Implementation Checklist

## ✅ Frontend Complete

### Core Integration

- [x] API layer with HTTP methods
- [x] Firebase ID token authentication
- [x] Role-based access control
- [x] Protected admin routes
- [x] Menu data fetching from API
- [x] Order creation with backend
- [x] Order status management
- [x] Error handling and fallbacks
- [x] Toast notifications

### Components Updated

- [x] App.jsx - Menu fetching, role checking, checkout integration
- [x] LandingPage - Real menu data
- [x] MenuManager - CRUD operations
- [x] Admin Dashboard - Order fetching and management
- [x] Orders page - Status updates
- [x] ProtectedRoute - Admin access control

### Files Created

- [x] ProtectedRoute.jsx
- [x] INTEGRATION_GUIDE.md
- [x] CHANGES_REFERENCE.md
- [x] BACKEND_EXAMPLES.md

---

## 🔧 Backend Setup Required

### 1. Set Up Express Server

- [ ] Create `server/src/index.js` or `server/server.js`
- [ ] Install dependencies: `express`, `cors`, `firebase-admin`
- [ ] Initialize Firebase Admin SDK
- [ ] Add environment variables

### 2. Implement API Endpoints

**Menu Endpoints**

- [ ] `GET /api/menu` - List menu items
- [ ] `POST /api/menu` - Create menu item (admin)
- [ ] `PUT /api/menu/:id` - Update menu item (admin)
- [ ] `DELETE /api/menu/:id` - Delete menu item (admin)

**Order Endpoints**

- [ ] `GET /api/orders` - Get all orders (admin)
- [ ] `GET /api/orders?userId={id}` - Get user's orders
- [ ] `POST /api/orders` - Create order
- [ ] `PUT /api/orders/:id/status` - Update status (admin)
- [ ] `DELETE /api/orders/:id` - Delete order (admin)

**User Endpoints**

- [ ] `GET /api/users/:id/role` - Get user role
- [ ] `POST /api/users/sync` - Sync user

### 3. Database Setup

**Firestore Collections Needed**

- [ ] `menuItems` collection with menu data
- [ ] `orders` collection for orders
- [ ] `users` collection for user data

### 4. Authentication

- [ ] Set up Firebase Admin SDK credentials
- [ ] Create admin user(s)
- [ ] Set custom claims `{ "admin": true }` for admin users
- [ ] Implement token verification middleware

### 5. Testing

- [ ] Test with Postman or curl
- [ ] Verify authentication works
- [ ] Test menu CRUD operations
- [ ] Test order creation
- [ ] Test admin-only operations

---

## 📝 Configuration Checklist

### Frontend Config

- [x] API base URL set to `http://localhost:3000/api`
- [x] Firebase config in place
- [x] Seed data fallback configured

### Backend Config

- [ ] Firebase service account key downloaded
- [ ] `.env` file created with Firebase credentials
- [ ] PORT set to 3000
- [ ] CORS enabled for `http://localhost:3000` and `http://localhost:5173`

---

## 🧪 Testing Scenarios

Once backend is ready:

### Test 1: Fetch Menu

- [ ] Reload landing page
- [ ] Verify menu items from API show up
- [ ] Check console for no errors

### Test 2: Admin Create Item

- [ ] Login as admin user
- [ ] Go to Admin > Menu
- [ ] Click "+ Add Item"
- [ ] Fill in form and click "Add to Menu"
- [ ] Verify toast shows success
- [ ] Verify new item appears in list

### Test 3: Customer Checkout

- [ ] Login as customer
- [ ] Add items to cart
- [ ] Click "Checkout"
- [ ] Fill in form and click "Place Order"
- [ ] Verify success modal shows order ID
- [ ] Check backend has order with correct userId

### Test 4: Update Order Status

- [ ] Login as admin
- [ ] Go to Orders page
- [ ] Click on an order
- [ ] Change status
- [ ] Verify toast shows success
- [ ] Refresh and verify status persisted

### Test 5: Edit Menu Item

- [ ] Login as admin
- [ ] Click "Edit" on menu item
- [ ] Change name and price
- [ ] Click "Save Changes"
- [ ] Verify changes appear
- [ ] Verify seed data not used when editing

---

## 🚀 Deployment Notes

### Development

- Frontend: `npm run dev` (Vite)
- Backend: `npm start` or `node server.js`
- Both on localhost

### Production

- Use environment variables for API URL
- Store Firebase credentials securely
- Use HTTPS for all requests
- Enable proper CORS for your domain
- Set up database backup
- Consider rate limiting on API

---

## 📚 Key Concepts

### Authentication Flow

1. User logs in with Firebase
2. Frontend gets ID token
3. Token sent in every API request header
4. Backend verifies with Firebase Admin SDK
5. User ID extracted from token

### Authorization Flow

1. User ID from token sent to backend
2. Backend fetches user role from auth custom claims
3. Role checked for admin operations
4. Access granted/denied accordingly

### Fallback Behavior

- If API unavailable, app uses seed data
- Menu still shows to customers
- Order creation fails gracefully
- Admin operations show error toasts

---

## 🐛 Debugging Tips

### API Errors

1. Check console in DevTools (Network tab)
2. Look for 401 (auth) or 403 (permission) errors
3. Verify token is being sent in headers
4. Check Firebase rules if using Firestore

### Frontend Errors

1. Open DevTools Console
2. Look for red errors with stack traces
3. Check Network tab for failed requests
4. Verify API URLs in api.js

### Backend Errors

1. Check server console for request logs
2. Enable verbose logging: `console.log(req.method, req.path)`
3. Test endpoints with curl before connecting frontend
4. Verify Firebase initialization

---

## 📋 Summary

**What's Done:**

- Complete frontend integration ready to use
- All UI components set up for real data
- Authentication flow implemented
- Error handling in place
- Seed data fallback configured

**What You Need to Do:**

- Build Express backend with provided examples
- Set up Firestore database
- Implement 11 API endpoints
- Test thoroughly
- Deploy when ready

**Documentation Provided:**

- INTEGRATION_GUIDE.md - How everything works
- CHANGES_REFERENCE.md - What was changed
- BACKEND_EXAMPLES.md - Express.js code
- This checklist - What to do next

**Time Estimate:**

- Backend setup: 2-4 hours
- Testing: 1-2 hours
- Deployment prep: 1 hour

You're ready to go! Start building the backend! 🚀
