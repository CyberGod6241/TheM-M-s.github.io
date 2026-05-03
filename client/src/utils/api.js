import { auth } from "../authentication/firebase";

// ──────────────────────────────────────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────────────────────────────────────

const API_BASE = "http://localhost:3000/api";

const getCurrentUserId = () => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");
  return user.uid;
};

const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");
  return user.getIdToken();
};

// ──────────────────────────────────────────────────────────────────────────────
// MENU MANAGEMENT
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Fetch all menu items from the backend
 */
export const getMenuItems = async () => {
  try {
    const response = await fetch(`${API_BASE}/menu`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to fetch menu items");
    const data = await response.json();
    return data.data || data; // Handle different response formats
  } catch (error) {
    console.error("Error fetching menu:", error);
    throw error;
  }
};

/**
 * Create a new menu item (Admin only)
 */
export const createMenuItem = async (itemData) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE}/menu`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(itemData),
    });
    if (!response.ok) throw new Error("Failed to create menu item");
    return await response.json();
  } catch (error) {
    console.error("Error creating menu item:", error);
    throw error;
  }
};

/**
 * Update a menu item (Admin only)
 */
export const updateMenuItem = async (itemId, itemData) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE}/menu/${itemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(itemData),
    });
    if (!response.ok) throw new Error("Failed to update menu item");
    return await response.json();
  } catch (error) {
    console.error("Error updating menu item:", error);
    throw error;
  }
};

/**
 * Delete a menu item (Admin only)
 */
export const deleteMenuItem = async (itemId) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE}/menu/${itemId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to delete menu item");
    return await response.json();
  } catch (error) {
    console.error("Error deleting menu item:", error);
    throw error;
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// ORDER MANAGEMENT
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Get user's orders
 */
export const getUserOrders = async () => {
  try {
    const userId = getCurrentUserId();
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE}/orders?userId=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch user orders");
    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
};

/**
 * Get all orders (Admin only)
 */
export const getAllOrders = async () => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE}/orders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch orders");
    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error("Error fetching all orders:", error);
    throw error;
  }
};

/**
 * Create a new order with Firebase ID token
 */
export const placeOrder = async (orderData) => {
  try {
    const userId = getCurrentUserId();
    const token = await getAuthToken();

    const payload = {
      userId,
      cartItems: orderData.items,
      totalAmount: orderData.total,
      deliveryType: orderData.orderType,
      address: orderData.deliveryAddress,
      phone: orderData.phone,
      note: orderData.note,
    };

    const response = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("Failed to place order");
    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error("Error placing order:", error);
    throw error;
  }
};

/**
 * Update order status (Admin only)
 */
export const updateOrderStatus = async (orderId, status) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error("Failed to update order status");
    return await response.json();
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

/**
 * Delete an order (Admin only)
 */
export const deleteOrder = async (orderId) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE}/orders/${orderId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to delete order");
    return await response.json();
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// USER & AUTHENTICATION
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Get current user's role from backend
 */
export const getUserRole = async () => {
  try {
    const userId = getCurrentUserId();
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE}/users/${userId}/role`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch user role");
    const data = await response.json();
    return data.role || data.data?.role || "customer";
  } catch (error) {
    console.error("Error fetching user role:", error);
    return "customer";
  }
};

/**
 * Sync user with backend (create user record if doesn't exist)
 */
export const syncUser = async (userData) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE}/users/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error("Failed to sync user");
    return await response.json();
  } catch (error) {
    console.error("Error syncing user:", error);
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// LEGACY FUNCTIONS (for backward compatibility)
// ──────────────────────────────────────────────────────────────────────────────

export const createOrder = async (orderData) => {
  // Redirects to new placeOrder function
  return placeOrder(orderData);
};

export const createOrderItem = async () => {
  // Items are now included in placeOrder payload
  console.warn(
    "createOrderItem is deprecated. Items are handled in placeOrder.",
  );
};

export const getOrderItems = async () => {
  // This can be fetched as part of order details
  console.warn("getOrderItems: fetch as part of order details");
};
