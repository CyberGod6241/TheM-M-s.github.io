# Migration from LocalStorage to Firebase Database

## Overview
This guide explains how to migrate your food delivery app from using browser localStorage to Firebase Realtime Database for persistent data storage.

## Changes Made

### 1. **Updated Firebase Configuration** ([client/src/authentication/firebase.js](client/src/authentication/firebase.js))
- Added Firebase Realtime Database import: `getDatabase`
- Added `databaseURL` to firebase config
- Exported `db` instance for use throughout the app

### 2. **Created Database Service** ([client/src/utils/databaseService.js](client/src/utils/databaseService.js))
New utility module with the following functions:

#### User Role Management
- `saveUserRole(userId, role)` - Save user role to Firebase
- `getUserRoleFromDB(userId)` - Retrieve user role from Firebase
- `onUserRoleChange(userId, callback)` - Listen to real-time role changes

#### User Data Management
- `saveUserData(userId, userData)` - Save user profile data
- `getUserData(userId)` - Get user profile data
- `deleteUserData(userId)` - Delete user data

#### User Preferences
- `saveUserPreferences(userId, preferences)` - Save user preferences
- `getUserPreferences(userId)` - Get user preferences

#### Order Management
- `saveOrder(orderId, orderData)` - Save order data
- `getUserOrders(userId)` - Get all orders for a user
- `onUserOrdersChange(userId, callback)` - Listen to real-time order changes

#### App Settings
- `saveAppSettings(settings)` - Save app-wide settings
- `getAppSettings()` - Get app settings
- `onAppSettingsChange(callback)` - Listen to real-time settings changes

### 3. **Updated App.jsx** ([client/src/App.jsx](client/src/App.jsx))
Replaced all localStorage calls with Firebase database operations:

- Removed: `localStorage.setItem("userRole", ...)`
- Removed: `localStorage.getItem("userRole")`
- Removed: `localStorage.removeItem("userRole")`

Added imports and implemented:
```javascript
import {
  saveUserRole,
  getUserRoleFromDB,
  onUserRoleChange,
} from "./utils/databaseService";
```

## Database Structure

```
Firebase Realtime Database
├── users/
│   ├── {userId}/
│   │   ├── role (string: "admin" or "customer")
│   │   ├── preferences (object)
│   │   │   ├── theme
│   │   │   ├── notifications
│   │   │   └── ...
│   │   └── (other user data)
├── userOrders/
│   ├── {userId}/
│   │   ├── {orderId}/
│   │   │   ├── items (array)
│   │   │   ├── total (number)
│   │   │   ├── status (string)
│   │   │   └── timestamp (number)
├── orders/
│   ├── {orderId}/
│   │   ├── userId (string)
│   │   ├── items (array)
│   │   ├── total (number)
│   │   └── ...
└── appSettings/
    ├── maintenanceMode (boolean)
    ├── allowNewOrders (boolean)
    └── ...
```

## Firebase Rules (Recommended)

Add these security rules to your Firebase project:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "userOrders": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "orders": {
      "$orderId": {
        ".read": "root.child('users').child(auth.uid).child('role').val() === 'admin'",
        ".write": "false"
      }
    },
    "appSettings": {
      ".read": true,
      ".write": "root.child('users').child(auth.uid).child('role').val() === 'admin'"
    }
  }
}
```

## Implementation Guide

### 1. **For Storing User Role**

```javascript
import { saveUserRole, getUserRoleFromDB } from "./utils/databaseService";

// Save role
await saveUserRole(user.uid, "admin");

// Get role
const role = await getUserRoleFromDB(user.uid);

// Listen for changes
const unsubscribe = onUserRoleChange(user.uid, (role) => {
  console.log("Role changed:", role);
});
```

### 2. **For Storing User Preferences**

```javascript
import { saveUserPreferences, getUserPreferences } from "./utils/databaseService";

// Save preferences
await saveUserPreferences(user.uid, {
  theme: "dark",
  notifications: true,
  language: "en"
});

// Get preferences
const prefs = await getUserPreferences(user.uid);
```

### 3. **For Storing Orders**

```javascript
import { saveOrder, getUserOrders, onUserOrdersChange } from "./utils/databaseService";

// Save order
await saveOrder(orderId, {
  userId: user.uid,
  items: [...],
  total: 500,
  status: "pending",
  timestamp: Date.now()
});

// Get user orders
const orders = await getUserOrders(user.uid);

// Listen for order changes
const unsubscribe = onUserOrdersChange(user.uid, (orders) => {
  console.log("Orders updated:", orders);
});
```

## Migration Checklist

- [x] Updated Firebase configuration with database URL
- [x] Created comprehensive database service utility
- [x] Updated App.jsx to use Firebase database for user roles
- [ ] Update Admin dashboard to use database service for orders
- [ ] Update Customer pages to use database service
- [ ] Set up Firebase security rules
- [ ] Test all authentication flows
- [ ] Test order creation and retrieval
- [ ] Test real-time updates
- [ ] Clear browser storage and test app functionality

## Next Steps

1. **Install Firebase Realtime Database** in your Firebase project console (if not already enabled)
2. **Update Firebase Rules** with the recommended security rules
3. **Test the implementation** by running the app
4. **Update other components** to use the database service for additional data
5. **Monitor Firebase usage** and optimize as needed

## Advantages of Firebase Realtime Database

✅ Real-time data synchronization
✅ Automatic persistence
✅ Works offline with caching
✅ Built-in authentication integration
✅ Scalable and reliable
✅ Security rules for access control
✅ Real-time listeners for live updates
✅ No need for manual sync logic

## Troubleshooting

**Issue**: "databaseURL is not defined"
- **Solution**: Make sure your Firebase config includes the `databaseURL` property

**Issue**: "Permission denied" errors
- **Solution**: Check your Firebase security rules and ensure the user is authenticated

**Issue**: Data not persisting
- **Solution**: Ensure Firebase Realtime Database is enabled in your Firebase console

**Issue**: Real-time updates not working
- **Solution**: Verify that the listener unsubscribe function is being called properly during cleanup
