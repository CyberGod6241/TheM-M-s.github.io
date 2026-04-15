import LandingPage from "./Dashboard/LandingPage";
import Customer from "./Dashboard/Customer";
import OrderSection from "./Dashboard/OrderSection";
import ViewOrder from "./Dashboard/ViewOrder";
import Admin from "./Dashboard/Admin";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";

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
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/customer"
        element={
          <Customer
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
      <Route path="/admin" element={<Admin />} />
      <Route path="/view-order" element={<ViewOrder />} />
    </Routes>
  );
}

export default App;
