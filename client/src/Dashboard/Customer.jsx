import { useState, useEffect } from "react";
import CustomerSidebar from "../Customer/components/layouts/CustomerSidebar";
import { Toast } from "../Admin/components/ui";
import Loader from "../constants/Loader";
import Hero from "../Customer/pages/Hero";
import MenuSection from "../Customer/pages/MenuSection";
import OrderSection from "./OrderSection";
import ViewOrder from "./ViewOrder";
import Notifications from "./Notifications";
import CartPanel from "../Customer/pages/CartPanel";
import SuccessModal from "../Customer/pages/SuccesModal";
import MenuCard from "../Customer/pages/MenuCard";
import SignUp from "../Customer/pages/SignUp";
import Settings from "../Customer/pages/Settings";

import { T } from "../constants/theme";
import { fmt } from "../Customer/utils/helpers";
import { getUserOrders, getNotifications } from "../utils/api";

// ─── TOAST ───────────────────────────────────────────────────────────────────
function ToastComponent({ msg, visible, T }) {
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
  setToast,
  authed,
  user,
  handleLogout,
  T,
}) {
  const [view, setView] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [userOrders, setUserOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  // const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState({
    firstName: user?.displayName?.split(" ").filter(Boolean)?.[0] || "",
    lastName: user?.displayName?.split(" ").filter(Boolean)?.[1] || "",
    avatar: user?.avatar || "👨",
  });

  const showToast = (msg, type = "info") => {
    setToast({ msg, visible: true, type });
    setTimeout(() => setToast({ msg: "", visible: false }), 2600);
  };

  const handleUpdateProfile = (updatedProfile) => {
    setUserProfile(updatedProfile);
  };

  // Update profile whenever user changes (e.g., after signup or login)
  // useEffect(() => {
  //   if (user?.displayName) {
  //     const nameParts = user.displayName.split(" ").filter(Boolean);
  //     setUserProfile({
  //       firstName: nameParts[0] || "",
  //       lastName: nameParts[1] || "",
  //       avatar: user?.avatar || "👨",
  //     });
  //   }
  // }, [user?.displayName, user?.avatar]);

  // Load user orders
  useEffect(() => {
    const loadUserOrders = async () => {
      try {
        const orders = await getUserOrders();
        setUserOrders(Array.isArray(orders) ? orders : []);
      } catch (error) {
        console.error("Failed to load user orders:", error);
        setUserOrders([]);
      }
    };
    loadUserOrders();
  }, []);

  // Load notifications
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const notifs = await getNotifications();
        setNotifications(Array.isArray(notifs) ? notifs : []);
        setNotificationCount(notifs.filter((n) => !n.read).length);
      } catch (error) {
        console.error("Failed to load notifications:", error);
        setNotifications([]);
        setNotificationCount(0);
      }
    };
    loadNotifications();
  }, []);

  // ── Guard: show login if not authenticated ─────────────────────────────
  if (!authed) return <SignUp />;

  const MENU = (menuItems || []).filter((item) => item.available);
  const CATEGORIES = [
    "All",
    ...Array.from(new Set(MENU.map((m) => m.category))),
  ];

  // ── Main layout ───────────────────────────────────────────────────────────
  return (
    <>
      {/* {loading && <Loader />} */}
      <div
        className="flex min-h-screen"
        style={{
          background: T.bg,
          fontFamily: "'DM Sans',system-ui,sans-serif",
          color: T.text,
        }}
      >
        {/* Sidebar */}
        <CustomerSidebar
          active={view}
          setActive={setView}
          onLogout={handleLogout}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          notificationCount={notificationCount}
          T={T}
        />

        {/* Main content area */}
        <main className="flex-1 overflow-auto">
          {/* Top bar */}
          <div
            className="sticky top-0 z-30 flex items-center justify-between px-6 py-4"
            style={{
              background: `${T.bg}ee`,
              backdropFilter: "blur(12px)",
              borderBottom: `1px solid ${T.border}`,
            }}
          >
            <div className="flex flex-col gap-1">
              <h1 className="font-semibold text-white capitalize">{view}</h1>
              {view === "dashboard" && userProfile.firstName && (
                <span style={{ color: T.muted }} className="text-sm">
                  Welcome, {userProfile.firstName}! 👋
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="text-xs" style={{ color: T.muted }}>
                {new Date().toLocaleDateString("en-NG", {
                  weekday: "short",
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </div>
              {/* Cart icon */}
              <button
                onClick={() => setCartOpen(!cartOpen)}
                className="relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 hover:scale-110"
                style={{
                  border: "none",
                  cursor: "pointer",
                }}
                title="View cart"
              >
                <span className="text-lg">🛒</span>
                {cartItems.length > 0 && (
                  <span
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{
                      background: `linear-gradient(135deg,${T.orangeD},${T.orange})`,
                      boxShadow: `0 2px 8px ${T.orange}60`,
                    }}
                  >
                    {cartItems.reduce((s, i) => s + i.qty, 0)}
                  </span>
                )}
              </button>
              {/* User avatar */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm"
                style={{
                  background: `linear-gradient(135deg,${T.orange},${T.orangeD})`,
                }}
              >
                {userProfile.avatar ||
                  user?.displayName?.[0] ||
                  user?.email?.[0] ||
                  "U"}
              </div>
            </div>
          </div>

          {/* Page content */}
          <div className="p-6">
            {view === "dashboard" && (
              <div>
                {/* <Hero T={T} /> */}
                <MenuSection
                  onAdd={handleAdd}
                  T={T}
                  MENU={MENU}
                  CATEGORIES={CATEGORIES}
                  fmt={fmt}
                  MenuCard={MenuCard}
                />
              </div>
            )}
            {view === "orders" && <ViewOrder orders={userOrders} T={T} />}
            {view === "notifications" && (
              <Notifications
                notifications={notifications}
                setNotifications={setNotifications}
                setNotificationCount={setNotificationCount}
                T={T}
              />
            )}
            {view === "settings" && (
              <Settings
                user={user}
                onUpdateProfile={handleUpdateProfile}
                showToast={showToast}
                T={T}
                onLogout={handleLogout}
              />
            )}
          </div>
        </main>

        {/* Cart Panel */}
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

        {/* Success Modal */}
        <SuccessModal T={T} />

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

        <ToastComponent msg={toast.msg} visible={toast.visible} T={T} />
      </div>
    </>
  );
}

export default Customer;
