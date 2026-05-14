const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
require("dotenv").config();

const useEmulator = Boolean(process.env.FIRESTORE_EMULATOR_HOST);
const projectId = process.env.FIREBASE_PROJECT_ID || "food-restaurant-f298d";

let db;
let auth;
let useMock = false;

const createMockDb = () => {
  const collections = new Map();
  let idCounter = 1;

  const nextId = () => `${Date.now()}-${idCounter++}`;
  const buildDoc = (id, data) => ({
    id,
    exists: data !== undefined,
    data: () => data,
  });
  const makeSnapshot = (docs) => ({ docs });

  const createCollection = (name) => {
    if (!collections.has(name)) collections.set(name, new Map());
    const store = collections.get(name);

    const queryFromEntries = (entries) => ({
      orderBy: (field, dir = "asc") => {
        const sorted = [...entries].sort(([_, a], [__, b]) => {
          const aVal = a[field];
          const bVal = b[field];
          if (aVal === bVal) return 0;
          if (aVal === undefined || aVal === null) return 1;
          if (bVal === undefined || bVal === null) return -1;
          return dir === "desc" ? (aVal < bVal ? 1 : -1) : aVal > bVal ? 1 : -1;
        });
        return {
          get: async () =>
            makeSnapshot(sorted.map(([id, data]) => buildDoc(id, data))),
        };
      },
      get: async () =>
        makeSnapshot([...entries].map(([id, data]) => buildDoc(id, data))),
    });

    return {
      doc: (id) => ({
        get: async () => buildDoc(id, store.get(id)),
        set: async (data, options = {}) => {
          const existing = store.get(id) || {};
          const next = options.merge ? { ...existing, ...data } : { ...data };
          store.set(id, next);
        },
        update: async (data) => {
          if (!store.has(id)) throw new Error("Document does not exist");
          store.set(id, { ...store.get(id), ...data });
        },
        delete: async () => store.delete(id),
      }),
      add: async (data) => {
        const id = nextId();
        store.set(id, { ...data });
        return { id };
      },
      get: async () =>
        makeSnapshot(
          [...store.entries()].map(([id, data]) => buildDoc(id, data)),
        ),
      where: (field, op, value) => {
        const entries = [...store.entries()].filter(([_, data]) => {
          if (op === "==") return data[field] === value;
          return false;
        });
        return queryFromEntries(entries);
      },
      orderBy: (field, dir = "asc") => {
        const entries = [...store.entries()];
        return queryFromEntries(entries).orderBy(field, dir);
      },
    };
  };

  return { collection: createCollection };
};

const serverTimestamp = () =>
  useMock
    ? new Date().toISOString()
    : admin.firestore.FieldValue.serverTimestamp();

const getMockUserFromToken = (token) => {
  if (token === "admin-token") return { uid: "admin", admin: true };
  if (token === "customer-token") return { uid: "customer", admin: false };
  if (token === "user-token") return { uid: "user", admin: false };
  throw new Error("Invalid mock token");
};

const useMockBackend = process.env.USE_MOCK_BACKEND === "true";

const startFirestore = () => {
  if (useMockBackend) {
    useMock = true;
    db = createMockDb();
    auth = { verifyIdToken: async (token) => getMockUserFromToken(token) };
    console.log("Using mock backend mode for local testing.");
    return;
  }

  try {
    if (useEmulator) {
      admin.initializeApp({ projectId });
      db = admin.firestore();
      auth = admin.auth();
      console.log(
        "Starting Firestore emulator mode using projectId:",
        projectId,
      );
    } else {
      const serviceAccount = require("./serviceAccountKey.json");
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      db = admin.firestore();
      auth = admin.auth();
      console.log("Starting Firestore with service account credentials.");
    }
  } catch (error) {
    console.warn(
      "Firestore initialization failed, using mock backend for local testing:",
      error.message,
    );
    useMock = true;
    db = createMockDb();
    auth = { verifyIdToken: async (token) => getMockUserFromToken(token) };
  }
};

startFirestore();

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Missing or invalid Authorization header" });
  }

  const token = authHeader.split("Bearer ")[1];
  try {
    req.user = await auth.verifyIdToken(token);
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ error: "Invalid auth token" });
  }
};

const getUserDoc = async (uid) => {
  const userSnapshot = await db.collection("users").doc(uid).get();
  return userSnapshot.exists
    ? { id: userSnapshot.id, ...userSnapshot.data() }
    : null;
};

const verifyAdmin = async (req, res, next) => {
  try {
    if (req.user.admin === true) {
      return next();
    }

    const userDoc = await getUserDoc(req.user.uid);
    if (userDoc?.role === "admin") {
      return next();
    }

    return res.status(403).json({ error: "Admin access required" });
  } catch (error) {
    console.error("Admin verification failed:", error);
    return res.status(403).json({ error: "Not authorized" });
  }
};

// MENU ENDPOINTS
app.get("/api/menu", async (req, res) => {
  try {
    const snapshot = await db
      .collection("menuItems")
      .orderBy("createdAt", "desc")
      .get();
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(items);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/menu", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const {
      name,
      emoji,
      category,
      unitPrice,
      unitLabel,
      img,
      desc,
      available,
    } = req.body;
    if (!name || !category || typeof unitPrice !== "number") {
      return res
        .status(400)
        .json({ error: "Missing required menu item fields" });
    }

    const docRef = await db.collection("menuItems").add({
      name,
      emoji: emoji || "🍽",
      category,
      unitPrice,
      unitLabel: unitLabel || "portion",
      img: img || "",
      desc: desc || "",
      available: typeof available === "boolean" ? available : true,
      createdAt: serverTimestamp(),
      createdBy: req.user.uid,
    });

    res.json({ id: docRef.id, message: "Menu item created successfully" });
  } catch (error) {
    console.error("Error creating menu item:", error);
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/menu/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updatedAt: serverTimestamp(),
      updatedBy: req.user.uid,
    };
    await db.collection("menuItems").doc(id).update(updateData);
    res.json({ id, message: "Menu item updated successfully" });
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/menu/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("menuItems").doc(id).delete();
    res.json({ id, message: "Menu item deleted successfully" });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({ error: error.message });
  }
});

// ORDER ENDPOINTS
app.get("/api/orders", verifyToken, async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return verifyAdmin(req, res, async () => {
        const snapshot = await db
          .collection("orders")
          .orderBy("createdAt", "desc")
          .get();
        const orders = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        res.json(orders);
      });
    }

    if (userId !== req.user.uid && req.user.admin !== true) {
      const userDoc = await getUserDoc(req.user.uid);
      if (userDoc?.role !== "admin") {
        return res.status(403).json({ error: "Unauthorized" });
      }
    }

    const snapshot = await db
      .collection("orders")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/orders", verifyToken, async (req, res) => {
  try {
    const {
      cartItems,
      totalAmount,
      deliveryType,
      address,
      phone,
      note,
      userId,
    } = req.body;

    if (
      !Array.isArray(cartItems) ||
      typeof totalAmount !== "number" ||
      !phone
    ) {
      return res.status(400).json({ error: "Missing required order fields" });
    }

    const orderUserId = userId || req.user.uid;
    const docRef = await db.collection("orders").add({
      userId: orderUserId,
      cartItems,
      totalAmount,
      deliveryType: deliveryType || "pickup",
      address: address || null,
      phone,
      note: note || null,
      status: "Pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    res.json({ id: docRef.id, message: "Order placed successfully" });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: error.message });
  }
});

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
        updatedAt: serverTimestamp(),
      });

      res.json({ id, message: "Order status updated successfully" });
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ error: error.message });
    }
  },
);

app.delete("/api/orders/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("orders").doc(id).delete();
    res.json({ id, message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: error.message });
  }
});

// USER ENDPOINTS
app.get("/api/users/:userId/role", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    if (userId !== req.user.uid && req.user.admin !== true) {
      const requestingUser = await getUserDoc(req.user.uid);
      if (requestingUser?.role !== "admin") {
        return res.status(403).json({ error: "Unauthorized" });
      }
    }

    const userDoc = await getUserDoc(userId);
    const role = userDoc?.role || "customer";
    res.json({ userId, role });
  } catch (error) {
    console.error("Error fetching user role:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/users/sync", verifyToken, async (req, res) => {
  try {
    const { uid, email, displayName, role } = req.body;
    const userId = uid || req.user.uid;
    if (!userId || !email) {
      return res.status(400).json({ error: "Missing required user fields" });
    }

    const userRef = db.collection("users").doc(userId);
    const existing = await userRef.get();

    const userData = {
      email,
      displayName: displayName || req.user.name || null,
      role: role || existing.data()?.role || "customer",
      updatedAt: serverTimestamp(),
    };

    if (!existing.exists) {
      userData.createdAt = serverTimestamp();
    }

    await userRef.set(userData, { merge: true });
    res.json({
      id: userId,
      message: "User synced successfully",
      data: userData,
    });
  } catch (error) {
    console.error("Error syncing user:", error);
    res.status(500).json({ error: error.message });
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// NOTIFICATIONS
// ──────────────────────────────────────────────────────────────────────────────

app.get("/api/notifications", verifyToken, async (req, res) => {
  try {
    const userId = req.query.userId || req.user.uid;
    const notificationsRef = db.collection("notifications");
    const snapshot = await notificationsRef
      .where("userId", "in", [userId, "all"]) // Get user-specific and broadcast notifications
      .orderBy("createdAt", "desc")
      .limit(50)
      .get();

    const notifications = [];
    snapshot.forEach((doc) => {
      notifications.push({ id: doc.id, ...doc.data() });
    });

    res.json({ data: notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/notifications/:id/read", verifyToken, async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user.uid;

    const notificationRef = db.collection("notifications").doc(notificationId);
    const notification = await notificationRef.get();

    if (!notification.exists) {
      return res.status(404).json({ error: "Notification not found" });
    }

    const data = notification.data();
    if (data.userId !== userId && data.userId !== "all") {
      return res.status(403).json({ error: "Access denied" });
    }

    await notificationRef.update({
      read: true,
      readAt: serverTimestamp(),
    });

    res.json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post(
  "/api/notifications/send-all",
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    try {
      const { title, message } = req.body;
      if (!title || !message) {
        return res
          .status(400)
          .json({ error: "Title and message are required" });
      }

      const notificationData = {
        userId: "all",
        title,
        message,
        read: false,
        createdAt: serverTimestamp(),
        sentBy: req.user.uid,
      };

      const docRef = await db.collection("notifications").add(notificationData);

      res.json({
        id: docRef.id,
        message: "Notification sent to all users",
        data: { id: docRef.id, ...notificationData },
      });
    } catch (error) {
      console.error("Error sending notification:", error);
      res.status(500).json({ error: error.message });
    }
  },
);

// ── USER PROFILE ENDPOINTS ─────────────────────────────────────────────────
app.put("/api/users/profile", verifyToken, async (req, res) => {
  try {
    const { firstName, lastName, avatar } = req.body;

    if (!firstName || !lastName) {
      return res
        .status(400)
        .json({ error: "First name and last name are required" });
    }

    const updateData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      avatar: avatar || "👨",
      updatedAt: serverTimestamp(),
    };

    await db.collection("users").doc(req.user.uid).update(updateData);

    res.json({
      message: "Profile updated successfully",
      data: updateData,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: error.message });
  }
});

// ── CHANGE PASSWORD ENDPOINT ───────────────────────────────────────────────
app.put("/api/users/change-password", verifyToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Old password and new password are required" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ error: "New password must be at least 6 characters" });
    }

    // In a real Firebase setup, you would use Firebase Admin SDK to update password
    // For now, we'll use the Firebase Client SDK approach via error handling
    // The actual password change should happen on the client side with Firebase
    // then verified here, or implement custom auth logic

    // Placeholder response - actual implementation depends on your auth setup
    res.json({
      message: "Password change request received. Update on client side.",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ error: error.message });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
