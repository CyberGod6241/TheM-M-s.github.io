// Database Service - Firebase Realtime Database utilities
// Replaces localStorage with Firebase for persistent data storage

import { db, auth } from "../authentication/firebase";
import {
  ref,
  set,
  get,
  update,
  remove,
  onValue,
  off,
} from "firebase/database";

/**
 * Save user role to Firebase Realtime Database
 * @param {string} userId - The user's UID
 * @param {string} role - The user's role (admin or customer)
 */
export const saveUserRole = async (userId, role) => {
  try {
    const userRef = ref(db, `users/${userId}/role`);
    await set(userRef, role);
    console.log("User role saved to Firebase:", role);
  } catch (error) {
    console.error("Error saving user role to Firebase:", error);
    throw error;
  }
};

/**
 * Get user role from Firebase Realtime Database
 * @param {string} userId - The user's UID
 * @returns {Promise<string>} The user's role
 */
export const getUserRoleFromDB = async (userId) => {
  try {
    const userRef = ref(db, `users/${userId}/role`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (error) {
    console.error("Error fetching user role from Firebase:", error);
    throw error;
  }
};

/**
 * Listen to user role changes in real-time
 * @param {string} userId - The user's UID
 * @param {function} callback - Function to call when role changes
 * @returns {function} Unsubscribe function
 */
export const onUserRoleChange = (userId, callback) => {
  try {
    const userRef = ref(db, `users/${userId}/role`);
    const unsubscribe = onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val());
      } else {
        callback(null);
      }
    });
    return unsubscribe;
  } catch (error) {
    console.error("Error setting up role listener:", error);
    throw error;
  }
};

/**
 * Save user preferences to Firebase
 * @param {string} userId - The user's UID
 * @param {object} preferences - User preferences object
 */
export const saveUserPreferences = async (userId, preferences) => {
  try {
    const prefsRef = ref(db, `users/${userId}/preferences`);
    await set(prefsRef, preferences);
    console.log("User preferences saved to Firebase");
  } catch (error) {
    console.error("Error saving user preferences:", error);
    throw error;
  }
};

/**
 * Get user preferences from Firebase
 * @param {string} userId - The user's UID
 * @returns {Promise<object>} User preferences
 */
export const getUserPreferences = async (userId) => {
  try {
    const prefsRef = ref(db, `users/${userId}/preferences`);
    const snapshot = await get(prefsRef);
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    throw error;
  }
};

/**
 * Save user data to Firebase
 * @param {string} userId - The user's UID
 * @param {object} userData - User data object
 */
export const saveUserData = async (userId, userData) => {
  try {
    const userRef = ref(db, `users/${userId}`);
    await update(userRef, userData);
    console.log("User data saved to Firebase");
  } catch (error) {
    console.error("Error saving user data:", error);
    throw error;
  }
};

/**
 * Get user data from Firebase
 * @param {string} userId - The user's UID
 * @returns {Promise<object>} User data
 */
export const getUserData = async (userId) => {
  try {
    const userRef = ref(db, `users/${userId}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

/**
 * Delete user data from Firebase
 * @param {string} userId - The user's UID
 */
export const deleteUserData = async (userId) => {
  try {
    const userRef = ref(db, `users/${userId}`);
    await remove(userRef);
    console.log("User data deleted from Firebase");
  } catch (error) {
    console.error("Error deleting user data:", error);
    throw error;
  }
};

/**
 * Save order data to Firebase
 * @param {string} orderId - The order's ID
 * @param {object} orderData - Order data object
 */
export const saveOrder = async (orderId, orderData) => {
  try {
    const orderRef = ref(db, `orders/${orderId}`);
    await set(orderRef, orderData);
    console.log("Order saved to Firebase");
  } catch (error) {
    console.error("Error saving order:", error);
    throw error;
  }
};

/**
 * Get all orders for a user from Firebase
 * @param {string} userId - The user's UID
 * @returns {Promise<array>} Array of orders
 */
export const getUserOrders = async (userId) => {
  try {
    const ordersRef = ref(db, `userOrders/${userId}`);
    const snapshot = await get(ordersRef);
    if (snapshot.exists()) {
      const ordersObj = snapshot.val();
      return Object.keys(ordersObj).map((key) => ({
        id: key,
        ...ordersObj[key],
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
};

/**
 * Listen to user orders in real-time
 * @param {string} userId - The user's UID
 * @param {function} callback - Function to call when orders change
 * @returns {function} Unsubscribe function
 */
export const onUserOrdersChange = (userId, callback) => {
  try {
    const ordersRef = ref(db, `userOrders/${userId}`);
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      if (snapshot.exists()) {
        const ordersObj = snapshot.val();
        const orders = Object.keys(ordersObj).map((key) => ({
          id: key,
          ...ordersObj[key],
        }));
        callback(orders);
      } else {
        callback([]);
      }
    });
    return unsubscribe;
  } catch (error) {
    console.error("Error setting up orders listener:", error);
    throw error;
  }
};

/**
 * Save app settings to Firebase
 * @param {object} settings - Settings object
 */
export const saveAppSettings = async (settings) => {
  try {
    const settingsRef = ref(db, "appSettings");
    await set(settingsRef, settings);
    console.log("App settings saved to Firebase");
  } catch (error) {
    console.error("Error saving app settings:", error);
    throw error;
  }
};

/**
 * Get app settings from Firebase
 * @returns {Promise<object>} App settings
 */
export const getAppSettings = async () => {
  try {
    const settingsRef = ref(db, "appSettings");
    const snapshot = await get(settingsRef);
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (error) {
    console.error("Error fetching app settings:", error);
    throw error;
  }
};

/**
 * Listen to app settings changes in real-time
 * @param {function} callback - Function to call when settings change
 * @returns {function} Unsubscribe function
 */
export const onAppSettingsChange = (callback) => {
  try {
    const settingsRef = ref(db, "appSettings");
    const unsubscribe = onValue(settingsRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val());
      } else {
        callback(null);
      }
    });
    return unsubscribe;
  } catch (error) {
    console.error("Error setting up settings listener:", error);
    throw error;
  }
};
