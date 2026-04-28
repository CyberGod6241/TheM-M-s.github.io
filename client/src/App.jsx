import LandingPage from "./Dashboard/LandingPage";
import Customer from "./Dashboard/Customer";
import OrderSection from "./Dashboard/OrderSection";
import ViewOrder from "./Dashboard/ViewOrder";
import Admin from "./Dashboard/Admin";
import Login from "./Customer/pages/Login";
import SignUp from "./Customer/pages/SignUp";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { SEED_MENU } from "./Admin/constants/data";

import { auth } from "./authentication/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";

function App() {
  // ── State for Customer Dashboard ─────────────────────────────────────────
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState({ msg: "", visible: false });
  const [successOrder, setSuccessOrder] = useState(null);
  const [menuItems, setMenuItems] = useState(SEED_MENU);

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

  const handlePlaceOrder = (form) => {
    const total = cartItems.reduce((s, i) => s + i.price, 0);
    setSuccessOrder({ ...form, items: cartItems, total });
    setCartItems([]);
  };

  // ── Auth for Customers ──────────────────────────────────────────────────────────────────
  const [authed, setAuthed] = useState(false);

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const handleSignUp =
    // Implement sign-up logic here (e.g., using Firebase Authentication)
    async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        const user = userCredential.user;
        setUser(user);
        setAuthed(true);
        console.log("Signed up:", user);
      } catch (error) {
        setError("Failed to sign up");
        console.error("Error code:", error.code, "Message:", error.message);
      } finally {
        setLoading(false);
      }
    };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      setUser(user);
      setAuthed(true);
      console.log("Logged in:", user);
    } catch (error) {
      setError("Invalid email or password");
      console.error("Error code:", error.code, "Message:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSignUp();
  };

  const handleKeyDownLogin = (e) => {
    if (e.key === "Enter") handleLogin();
  };
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/customer"
        element={
          <Customer
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
          />
        }
      />
      <Route
        path="/order"
        element={
          <OrderSection
            cartItems={cartItems}
            onPlaceOrder={handlePlaceOrder}
            successOrder={successOrder}
            setSuccessOrder={setSuccessOrder}
          />
        }
      />
      <Route
        path="/admin"
        element={<Admin menuItems={menuItems} setMenuItems={setMenuItems} />}
      />
      <Route path="/view-order" element={<ViewOrder />} />
      <Route
        path="/Login"
        element={
          <Login
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
          />
        }
      />
    </Routes>
  );
}

export default App;
