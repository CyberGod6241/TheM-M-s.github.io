import LandingPage from "./Dashboard/LandingPage";
import Customer from "./Dashboard/Customer";
import OrderSection from "./Dashboard/OrderSection";
import ViewOrder from "./Dashboard/ViewOrder";
import Admin from "./Dashboard/Admin";
import Login from "./Customer/pages/Login";
import SignUp from "./Customer/pages/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";
import Loader from "./constants/Loader";
import { T } from "./constants/theme";
import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

import { auth } from "./authentication/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { syncUser, getMenuItems, placeOrder, getUserRole } from "./utils/api";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // ── State for Customer Dashboard ─────────────────────────────────────────
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState({ msg: "", visible: false });
  const [successOrder, setSuccessOrder] = useState(null);
  const [menuItems, setMenuItems] = useState([]);

  // ── Auth for Customers/Admin ──────────────────────────────────────────────────────────────────
  const [authed, setAuthed] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState("customer");

  const showToast = (msg) => {
    setToast({ msg, visible: true });
    setTimeout(() => setToast({ msg: "", visible: false }), 2600);
  };

  const handleAdd = (item, qty) => {
    setCartItems((prev) => {
      const idx = prev.findIndex((i) => i.id === item.id);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          qty: updated[idx].qty + qty,
          price: (updated[idx].qty + qty) * item.unitPrice,
        };
        return updated;
      }
      return [...prev, { ...item, qty, price: qty * item.unitPrice }];
    });
    showToast(`✅ ${item.name} × ${qty} added to cart!`);
  };

  const handleRemove = (i) => {
    setCartItems((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleUpdateQty = (i, newQty) => {
    if (newQty < 1) return handleRemove(i);
    setCartItems((prev) =>
      prev.map((it, idx) =>
        idx === i ? { ...it, qty: newQty, price: newQty * it.unitPrice } : it,
      ),
    );
  };

  const handleCheckout = () => {
    setCartOpen(false);
    document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
  };

  const handlePlaceOrder = async (form) => {
    try {
      const items = cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.qty,
        unitPrice: item.unitPrice,
        subtotal: item.price,
      }));
      const total = cartItems.reduce((s, i) => s + i.price, 0);

      // Call new placeOrder API with Firebase ID token
      const orderResponse = await placeOrder({
        items,
        total,
        orderType: form.deliveryType === "delivery" ? "delivery" : "pickup",
        deliveryAddress: form.deliveryType === "delivery" ? form.address : null,
        phone: form.phone,
        note: form.note || null,
      });

      setSuccessOrder({
        ...form,
        items: cartItems,
        total,
        orderId: orderResponse.id || orderResponse.orderId,
      });
      setCartItems([]);
      showToast("✅ Order placed successfully!");
    } catch (error) {
      console.error("Failed to place order:", error);
      showToast("❌ Failed to place order. Please try again.");
    }
  };

  // ── Persist auth state across page refreshes ──────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setAuthed(true);

        // Fetch user role from backend
        try {
          const role = await getUserRole();
          setUserRole(role || "customer");
          localStorage.setItem("userRole", role || "customer");
        } catch (error) {
          console.error("Failed to fetch user role:", error);
          const cachedRole = localStorage.getItem("userRole") || "customer";
          setUserRole(cachedRole);
        }
      } else {
        setUser(null);
        setAuthed(false);
        setUserRole("customer");
        localStorage.removeItem("userRole");
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ── Load menu items from backend API ────────────────────────────────
  useEffect(() => {
    const loadMenu = async () => {
      try {
        const response = await getMenuItems();
        // Handle both array and object response formats
        const menuData = Array.isArray(response)
          ? response
          : response.menu || response.data || [];
        setMenuItems(menuData.length > 0 ? menuData : []);
      } catch (error) {
        console.error("Failed to load menu from API:", error);
        // No fallback to seed data - show empty menu
        setMenuItems([]);
      }
    };
    loadMenu();
  }, []);

  // ── Auto-redirect authenticated users from landing page ────────────────────────────
  useEffect(() => {
    if (authed && !authLoading && location.pathname === "/") {
      const cachedRole = localStorage.getItem("userRole") || userRole;
      navigate(cachedRole === "admin" ? "/admin" : "/customer");
    }
  }, [authed, authLoading, userRole, location.pathname, navigate]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (!firstName.trim() || !lastName.trim()) {
        setError("First name and last name are required");
        setLoading(false);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const newUser = userCredential.user;
      setUser(newUser);
      setAuthed(true);
      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
      console.log("Signed up:", newUser);

      // Sync user to backend with profile info
      await syncUser();

      // Fetch user role and navigate accordingly
      try {
        const role = await getUserRole();
        setUserRole(role || "customer");
        localStorage.setItem("userRole", role || "customer");
        navigate(role === "admin" ? "/admin" : "/customer");
      } catch (error) {
        console.error("Failed to fetch role after signup:", error);
        navigate("/customer");
      }
    } catch (error) {
      setError("Failed to sign up: " + error.message);
      console.error("Error code:", error.code, "Message:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const newUser = userCredential.user;
      setUser(newUser);
      setAuthed(true);
      setEmail("");
      setPassword("");
      console.log("Logged in:", newUser);

      // Sync user to backend
      await syncUser();

      // Fetch user role and navigate accordingly
      try {
        const role = await getUserRole();
        setUserRole(role || "customer");
        localStorage.setItem("userRole", role || "customer");
        navigate(role === "admin" ? "/admin" : "/customer");
      } catch (error) {
        console.error("Failed to fetch role after login:", error);
        navigate("/customer");
      }
    } catch (error) {
      setError("Invalid email or password");
      console.error("Error code:", error.code, "Message:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setAuthed(false);
      setEmail("");
      setPassword("");
      setError("");
      navigate("/");
      console.log("Logged out successfully");
    } catch (error) {
      setError("Failed to log out");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSignUp(e);
  };

  const handleKeyDownLogin = (e) => {
    if (e.key === "Enter") handleLogin(e);
  };

  // useEffect(
  //   () => (authed && !authLoading ? navigate("/login") : null),
  //   [authed, authLoading, navigate],
  // );

  return (
    <Routes>
      <Route
        path="/"
        element={
          <LandingPage T={T} authed={authed} authLoading={authLoading} />
        }
      />
      <Route
        path="/customer"
        element={
          <Customer
            T={T}
            menuItems={menuItems}
            cartItems={cartItems}
            setCartItems={setCartItems}
            cartOpen={cartOpen}
            setCartOpen={setCartOpen}
            toast={toast}
            setToast={setToast}
            successOrder={successOrder}
            setSuccessOrder={setSuccessOrder}
            handleAdd={handleAdd}
            handleRemove={handleRemove}
            handleUpdateQty={handleUpdateQty}
            handleCheckout={handleCheckout}
            handlePlaceOrder={handlePlaceOrder}
            authed={authed}
            user={user}
            handleLogout={handleLogout}
          />
        }
      />
      <Route
        path="/order"
        element={
          <OrderSection
            T={T}
            cartItems={cartItems}
            onPlaceOrder={handlePlaceOrder}
            successOrder={successOrder}
            setSuccessOrder={setSuccessOrder}
          />
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute
            userRole={userRole}
            authed={authed}
            isLoading={authLoading}
          >
            <Admin menuItems={menuItems} setMenuItems={setMenuItems} T={T} />
          </ProtectedRoute>
        }
      />
      <Route path="/view-order" element={<ViewOrder T={T} />} />
      <Route
        path="/Login"
        element={
          <Login
            T={T}
            handleKeyDown={handleKeyDownLogin}
            setPassword={setPassword}
            setEmail={setEmail}
            error={error}
            loading={loading}
            password={password}
            email={email}
            setError={setError}
            setLoading={setLoading}
            handleLogin={handleLogin}
          />
        }
      />
      <Route
        path="/SignUp"
        element={
          <SignUp
            T={T}
            handleKeyDown={handleKeyDown}
            setPassword={setPassword}
            setEmail={setEmail}
            error={error}
            loading={loading}
            password={password}
            email={email}
            setError={setError}
            setLoading={setLoading}
            handleSignUp={handleSignUp}
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
          />
        }
      />
    </Routes>
  );
}

export default App;
