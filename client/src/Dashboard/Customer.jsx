import { useState } from "react";
import Navbar from "../Customer/Navbar";
import Hero from "../Customer/Hero";
import MenuSection from "../Customer/MenuSection";
import OrderSection from "../Customer/Order";
import Contact from "../Customer/Contact";
import Footer from "../Customer/Footer";
import CartPanel from "../Customer/CartPanel";
import SuccessModal from "../Customer/SuccesModal";
import MenuCard from "../Customer/MenuCard";
import data from "../assets/data.json";

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

const MENU = data.map((m, i) => ({ id: i, ...m }));

const CATEGORIES = ["All", ...Array.from(new Set(MENU.map((m) => m.category)))];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmt = (n) => `₦${n.toLocaleString("en-NG")}`;

// ─── BOKEH ───────────────────────────────────────────────────────────────────

// ─── TOAST ───────────────────────────────────────────────────────────────────
function Toast({ msg, visible }) {
  return (
    <div
      className="fixed bottom-6 right-6 z-50 transition-all duration-500"
      style={{
        background: `linear-gradient(135deg,${T.orange},${T.orangeD})`,
        color: "#fff",
        padding: "14px 22px",
        borderRadius: 16,
        fontWeight: 600,
        fontSize: ".9rem",
        boxShadow: `0 12px 40px ${T.orange}60`,
        transform: visible ? "translateY(0)" : "translateY(90px)",
        opacity: visible ? 1 : 0,
      }}
    >
      {msg}
    </div>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

// ─── MENU CARD ───────────────────────────────────────────────────────────────

// ─── CART SLIDE-OVER ─────────────────────────────────────────────────────────

// ─── ORDER FORM ───────────────────────────────────────────────────────────────

// ─── CONTACT ─────────────────────────────────────────────────────────────────

// ─── FOOTER ──────────────────────────────────────────────────────────────────

// ─── MENU SECTION ────────────────────────────────────────────────────────────

// ─── SUCCESS MODAL ────────────────────────────────────────────────────────────

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
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
    <div
      style={{
        background: T.brown900,
        minHeight: "100vh",
        fontFamily: "'DM Sans',system-ui,sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #1E0A00; }
        ::-webkit-scrollbar-thumb { background: #F97316; border-radius: 3px; }
        a { text-decoration: none; }
      `}</style>

      <Navbar
        cartCount={cartItems.reduce((s, i) => s + i.qty, 0)}
        onCartClick={() => setCartOpen(true)}
        T={T}
      />
      <Hero T={T} />
      <MenuSection
        onAdd={handleAdd}
        T={T}
        MENU={MENU}
        CATEGORIES={CATEGORIES}
        fmt={fmt}
        MenuCard={MenuCard}
      />
      <OrderSection
        cartItems={cartItems}
        onPlaceOrder={handlePlaceOrder}
        T={T}
        fmt={fmt}
      />
      <Contact T={T} />
      <Footer T={T} />

      {cartOpen && (
        <CartPanel
          items={cartItems}
          onRemove={handleRemove}
          onUpdateQty={handleUpdateQty}
          onClose={() => setCartOpen(false)}
          onCheckout={handleCheckout}
          T={T}
          fmt={fmt}
        />
      )}

      <Toast msg={toast.msg} visible={toast.visible} />
      <SuccessModal
        order={successOrder}
        onClose={() => setSuccessOrder(null)}
        T={T}
      />

      {/* Floating cart FAB (mobile) */}
      {cartItems.length > 0 && !cartOpen && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-6 left-6 z-40 flex items-center gap-2 px-5 py-3 rounded-full font-bold text-white text-sm shadow-2xl transition-all duration-200 hover:scale-105 md:hidden"
          style={{
            background: `linear-gradient(135deg,${T.orange},${T.orangeD})`,
            boxShadow: `0 8px 28px ${T.orange}55`,
            border: "none",
            cursor: "pointer",
          }}
        >
          🛒 {cartItems.reduce((s, i) => s + i.qty, 0)} items ·{" "}
          {fmt(cartItems.reduce((s, i) => s + i.price, 0))}
        </button>
      )}
    </div>
  );
}
