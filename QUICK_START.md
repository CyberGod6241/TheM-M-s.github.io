# Quick Start: Firebase Database Integration

## Installation & Setup (5 minutes)

### Step 1: Enable Firebase Realtime Database
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **food-restaurant-f298d**
3. Go to **Realtime Database**
4. Click **Create Database**
5. Choose **Start in test mode**
6. Select region (preferably closest to users)
7. Click **Enable**

### Step 2: Update Security Rules
In Firebase Console → Realtime Database → Rules, replace all content with:

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

Click **Publish** to apply rules.

### Step 3: Test in Your App
```bash
cd client
npm install
npm run dev
```

## Usage Examples

### Save User Role
```javascript
import { saveUserRole } from "./utils/databaseService";

// After user login
await saveUserRole(currentUser.uid, "admin");
```

### Get User Role
```javascript
import { getUserRoleFromDB } from "./utils/databaseService";

const role = await getUserRoleFromDB(currentUser.uid);
console.log(`User is: ${role}`);
```

### Listen to Role Changes (Real-time)
```javascript
import { onUserRoleChange } from "./utils/databaseService";

useEffect(() => {
  if (!user) return;
  
  const unsubscribe = onUserRoleChange(user.uid, (role) => {
    console.log("Role updated:", role);
    setUserRole(role);
  });
  
  return unsubscribe; // Cleanup
}, [user]);
```

### Save User Preferences
```javascript
import { saveUserPreferences } from "./utils/databaseService";

await saveUserPreferences(user.uid, {
  theme: "dark",
  notifications: true,
  language: "en"
});
```

### Get User Preferences
```javascript
import { getUserPreferences } from "./utils/databaseService";

const prefs = await getUserPreferences(user.uid);
console.log(`Theme: ${prefs.theme}`);
```

### Save an Order
```javascript
import { saveOrder } from "./utils/databaseService";
import { v4 as uuidv4 } from 'uuid';

const orderId = uuidv4();
await saveOrder(orderId, {
  userId: user.uid,
  items: [
    { id: "1", name: "Pizza", qty: 2, price: 500 }
  ],
  total: 500,
  status: "pending",
  deliveryType: "delivery",
  address: "123 Main St",
  timestamp: Date.now()
});
```

### Get User Orders
```javascript
import { getUserOrders } from "./utils/databaseService";

const orders = await getUserOrders(user.uid);
console.log(`Found ${orders.length} orders`);
orders.forEach(order => console.log(order));
```

### Listen to Order Updates (Real-time)
```javascript
import { onUserOrdersChange } from "./utils/databaseService";

useEffect(() => {
  if (!user) return;
  
  const unsubscribe = onUserOrdersChange(user.uid, (orders) => {
    console.log("Orders updated:", orders);
    setOrders(orders);
  });
  
  return unsubscribe;
}, [user]);
```

## Database Structure Reference

```
Firebase Realtime Database
│
├── users/
│   └── {userId}/
│       ├── role: "admin" | "customer"
│       ├── email: "user@example.com"
│       ├── firstName: "John"
│       ├── lastName: "Doe"
│       ├── preferences/
│       │   ├── theme: "dark"
│       │   └── notifications: true
│       └── timestamp: 1234567890
│
├── userOrders/
│   └── {userId}/
│       └── {orderId}/
│           ├── items: [...]
│           ├── total: 500
│           ├── status: "pending"
│           ├── deliveryType: "delivery"
│           ├── address: "123 Main St"
│           └── timestamp: 1234567890
│
├── orders/
│   └── {orderId}/
│       ├── userId: "uid123"
│       ├── items: [...]
│       ├── total: 500
│       ├── status: "pending"
│       └── timestamp: 1234567890
│
└── appSettings/
    ├── maintenanceMode: false
    ├── allowNewOrders: true
    └── lastUpdated: 1234567890
```

## Monitoring & Debugging

### View Data in Firebase Console
1. Go to Firebase Console
2. Select **Realtime Database**
3. Expand nodes to view data structure
4. Click on values to see details

### Check Logs in Browser Console
All database operations log to console:
```
✓ User role saved to Firebase: admin
✓ User preferences saved to Firebase
✓ Order saved to Firebase
```

### Verify Security Rules
Test rules in Firebase Console:
1. Go to **Realtime Database** → **Rules**
2. Click **Rules Playground**
3. Test read/write permissions

## Common Issues & Solutions

| Problem | Solution |
|---------|----------|
| "Cannot read properties of undefined (reading 'database')" | Add `databaseURL` to firebase config |
| "Permission denied" | Check security rules and user authentication |
| Data not appearing | Verify path structure matches security rules |
| Real-time updates not working | Ensure listener is not unsubscribed immediately |
| "Database reference error" | Check user is authenticated with Firebase Auth |

## Key Differences from LocalStorage

| Feature | LocalStorage | Firebase DB |
|---------|-------------|------------|
| **Capacity** | ~5-10MB | Unlimited |
| **Access** | Synchronous | Asynchronous |
| **Real-time Sync** | No | Yes |
| **Offline Support** | Basic | Automatic |
| **Security** | None | Built-in rules |
| **Scalability** | Single device | Multi-device/users |
| **Backup** | Manual | Automatic |

## Files Changed

✅ **[client/src/authentication/firebase.js](client/src/authentication/firebase.js)**
- Added Realtime Database support

✅ **[client/src/App.jsx](client/src/App.jsx)**
- Replaced all localStorage calls with Firebase functions

✅ **[client/src/utils/databaseService.js](client/src/utils/databaseService.js)** (NEW)
- Complete Firebase service with 20+ functions

## Support & Resources

- [Firebase Realtime Database Docs](https://firebase.google.com/docs/database)
- [Firebase Security Rules](https://firebase.google.com/docs/database/security)
- [Firebase Web SDK Reference](https://firebase.google.com/docs/reference/js/database)

## Next Steps

1. ✅ Enable Firebase Realtime Database
2. ✅ Update security rules
3. Test login/signup flow
4. Verify role persistence
5. Test order creation
6. Monitor Firebase usage
7. Deploy to production
