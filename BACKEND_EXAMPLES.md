# Backend API Implementation Examples

## Express.js + Firebase Admin SDK Setup

### Installation

```bash
npm install express cors firebase-admin dotenv
```

### Basic Structure

```javascript
// server.js
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(require("./serviceAccountKey.json")),
});

const auth = admin.auth();
const db = admin.firestore(); // or your database

// Middleware to verify Firebase token
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Middleware to check admin role
const verifyAdmin = async (req, res, next) => {
  try {
    const customClaims = (await auth.getUser(req.user.uid)).customClaims;
    if (customClaims?.admin === true) {
      next();
    } else {
      res.status(403).json({ error: "Admin access required" });
    }
  } catch (error) {
    res.status(403).json({ error: "Not authorized" });
  }
};

// Routes

// ═══════════════════════════════════════════════════════════════
// MENU ENDPOINTS
// ═══════════════════════════════════════════════════════════════

// GET /api/menu - List all menu items (public)
app.get("/api/menu", async (req, res) => {
  try {
    const snapshot = await db.collection("menuItems").get();
    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/menu - Create menu item (admin only)
app.post("/api/menu", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { name, emoji, category, unitPrice, unitLabel, img, available } =
      req.body;

    if (!name || !category || !unitPrice) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const docRef = await db.collection("menuItems").add({
      name,
      emoji: emoji || "🍽",
      category,
      unitPrice,
      unitLabel: unitLabel || "portion",
      img: img || "",
      available: available !== false,
      createdAt: new Date(),
      createdBy: req.user.uid,
    });

    res.json({
      id: docRef.id,
      message: "Menu item created successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/menu/:id - Update menu item (admin only)
app.put("/api/menu/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db
      .collection("menuItems")
      .doc(id)
      .update({
        ...req.body,
        updatedAt: new Date(),
        updatedBy: req.user.uid,
      });

    res.json({ message: "Menu item updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/menu/:id - Delete menu item (admin only)
app.delete("/api/menu/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("menuItems").doc(id).delete();
    res.json({ message: "Menu item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// ORDER ENDPOINTS
// ═══════════════════════════════════════════════════════════════

// GET /api/orders - Get all orders (admin only)
app.get("/api/orders", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const snapshot = await db
      .collection("orders")
      .orderBy("createdAt", "desc")
      .get();

    const orders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/orders?userId={id} - Get user's orders
app.get("/api/orders/:userId?", verifyToken, async (req, res) => {
  try {
    const userId = req.query.userId || req.user.uid;

    // Allow users to see only their orders, admins can see all
    const customClaims = (await auth.getUser(req.user.uid)).customClaims;
    if (userId !== req.user.uid && customClaims?.admin !== true) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const snapshot = await db
      .collection("orders")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    const orders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/orders - Create order
app.post("/api/orders", verifyToken, async (req, res) => {
  try {
    const { cartItems, totalAmount, deliveryType, address, phone, note } =
      req.body;

    if (!cartItems || !totalAmount || !phone) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const orderId = await db
      .collection("orders")
      .add({
        userId: req.user.uid,
        cartItems,
        totalAmount,
        deliveryType: deliveryType || "pickup",
        address: address || null,
        phone,
        note: note || null,
        status: "Pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .then((ref) => ref.id);

    res.json({
      id: orderId,
      message: "Order placed successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/orders/:id/status - Update order status (admin only)
app.put(
  "/api/orders/:id/status",
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = [
        "Pending",
        "Confirmed",
        "Preparing",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      await db.collection("orders").doc(id).update({
        status,
        updatedAt: new Date(),
        updatedBy: req.user.uid,
      });

      res.json({ message: "Order status updated successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

// DELETE /api/orders/:id - Delete order (admin only)
app.delete("/api/orders/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("orders").doc(id).delete();
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// USER ENDPOINTS
// ═══════════════════════════════════════════════════════════════

// GET /api/users/:id/role - Get user role
app.get("/api/users/:id/role", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await auth.getUser(id);
    const role = user.customClaims?.admin ? "admin" : "customer";
    res.json({ role });
  } catch (error) {
    res.status(500).json({ role: "customer", error: error.message });
  }
});

// POST /api/users/sync - Sync user to backend
app.post("/api/users/sync", verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;

    // Create or update user record
    await db
      .collection("users")
      .doc(userId)
      .set(
        {
          uid: userId,
          email: req.user.email,
          displayName: req.body.displayName || "",
          phone: req.body.phone || "",
          lastLogin: new Date(),
          role: "customer", // Default role
        },
        { merge: true },
      );

    res.json({ message: "User synced successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Setting Admin Role

To make a user admin, use Firebase Console or run:

```javascript
// admin-setup.js
const admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.cert(require("./serviceAccountKey.json")),
});

async function setAdminRole(uid) {
  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    console.log(`User ${uid} set as admin`);
  } catch (error) {
    console.error(error);
  }
}

// Run with: node admin-setup.js
// Then set the UID in the code and execute
```

Or via Firebase Console:

1. Go to Authentication
2. Click on user
3. Scroll to "Custom Claims"
4. Add: `{ "admin": true }`

## Database Schema (Firestore)

### Collections

**menuItems**

```json
{
  "id": "auto-generated",
  "name": "Jollof Rice",
  "emoji": "🍛",
  "category": "Rice & Swallows",
  "unitPrice": 2500,
  "unitLabel": "plate",
  "img": "https://...",
  "available": true,
  "createdAt": timestamp,
  "createdBy": "uid"
}
```

**orders**

```json
{
  "id": "auto-generated",
  "userId": "firebase-uid",
  "cartItems": [
    {
      "id": 1,
      "name": "Jollof Rice",
      "quantity": 2,
      "unitPrice": 2500,
      "subtotal": 5000
    }
  ],
  "totalAmount": 5000,
  "deliveryType": "delivery",
  "address": "123 Main St",
  "phone": "08012345678",
  "note": "No spice",
  "status": "Pending",
  "createdAt": timestamp,
  "updatedAt": timestamp
}
```

**users**

```json
{
  "uid": "firebase-uid",
  "email": "user@example.com",
  "displayName": "John Doe",
  "phone": "08012345678",
  "lastLogin": timestamp,
  "role": "customer"
}
```

## Environment Variables (.env)

```
PORT=3000
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
NODE_ENV=development
```

## Testing with Postman

1. Get auth token from frontend console
2. Create request to `http://localhost:3000/api/menu`
3. Add header: `Authorization: Bearer {token}`
4. Send request

All operations will now use real backend data!
