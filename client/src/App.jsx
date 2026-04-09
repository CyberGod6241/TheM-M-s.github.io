import LandingPage from "./Dashboard/LandingPage";
import Customer from "./Dashboard/Customer";
import OrderSection from "./Dashboard/OrderSection";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";

const C = {
  brown900: "#1E0A00",
  brown800: "#3B1400",
  brown700: "#5C2200",
  brown600: "#7B3410",
  orange: "#F97316",
  orangeD: "#EA580C",
  orangeL: "#FED7AA",
  cream: "#FFF8F2",
};

// ─── THEME TOKENS ────────────────────────────────────────────────────────────
const T = {
  brown900: "#1E0A00",
  brown800: "#3B1400",
  brown700: "#5C2200",
  brown600: "#7B3410",
  orange: "#F97316",
  orangeD: "#EA580C",
  orangeL: "#FED7AA",
  cream: "#FFF8F2",
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmt = (n) => `₦${n.toLocaleString("en-NG")}`;

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState({ msg: "", visible: false });
  const [successOrder, setSuccessOrder] = useState(null);

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
  return (
    <Routes>
      <Route path="/" element={<LandingPage Color={C} />} />
      <Route
        path="/customer"
        element={
          <Customer
            Color={C}
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
            T={T}
            fmt={fmt}
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
            T={T}
            fmt={fmt}
          />
        }
      />
    </Routes>
  );
}

export default App;
