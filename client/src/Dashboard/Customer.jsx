import Navbar from "../Customer/pages/Navbar";
import Hero from "../Customer/pages/Hero";
import MenuSection from "../Customer/pages/MenuSection";
import OrderSection from "./OrderSection";
import Contact from "../Customer/pages/Contact";
import Footer from "../Customer/pages/Footer";
import CartPanel from "../Customer/pages/CartPanel";
import SuccessModal from "../Customer/pages/SuccesModal";
import MenuCard from "../Customer/pages/MenuCard";
import SignUp from "../Customer/pages/SignUp";

import { T } from "../Customer/constant/theme";
import { fmt } from "../Customer/utils/helpers";

// ─── TOAST ───────────────────────────────────────────────────────────────────
function Toast({ msg, visible, T }) {
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

function Customer({
  menuItems,
  cartItems,
  handleAdd,
  handleRemove,
  handleUpdateQty,
  setCartOpen,
  cartOpen,
  handleCheckout,
  toast,
  authed,
  user,
  handleLogout,
}) {
  const MENU = (menuItems || []).filter((item) => item.available);
  const CATEGORIES = [
    "All",
    ...Array.from(new Set(MENU.map((m) => m.category))),
  ];
  console.log(MENU);

  // ── Guard: show login if not authenticated ─────────────────────────────
  if (!authed) return <SignUp />;

  return (
    <div
      style={{
        background: T.brown900,
        minHeight: "100vh",
        fontFamily: "'DM Sans',system-ui,sans-serif",
      }}
    >
      <Navbar
        cartCount={cartItems.reduce((s, i) => s + i.qty, 0)}
        onCartClick={() => setCartOpen(true)}
        T={T}
        user={user}
        handleLogout={handleLogout}
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

      <Toast msg={toast.msg} visible={toast.visible} T={T} />

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

export default Customer;
