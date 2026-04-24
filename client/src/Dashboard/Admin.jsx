// ─── APP ROOT ────────────────────────────────────────────────────────────────
// Wires together all pages, the sidebar, global state, and the toast system.

import { useState, useRef } from "react";

import { T } from "../Admin/constants/theme";
import { SEED_ORDERS } from "../Admin/constants/data";

import Sidebar from "../Admin/components/layouts/Sidebar";
import { Toast } from "../Admin/components/ui";

import Login from "../Admin/pages/Login";
import Dashboard from "../Admin/pages/Dashboard";
import Orders from "../Admin/pages/Orders";
import MenuManager from "../Admin/pages/MenuManager";
import Analytics from "../Admin/pages/Analytics";
import Settings from "../Admin/pages/Settings";

function Admin({ menuItems, setMenuItems }) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const [authed, setAuthed] = useState(false);

  // ── Navigation ────────────────────────────────────────────────────────────
  const [view, setView] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  // ── Global data ───────────────────────────────────────────────────────────
  const [orders, setOrders] = useState(SEED_ORDERS);

  // ── Toast system ──────────────────────────────────────────────────────────
  const [toast, setToast] = useState({ msg: "", type: "info", visible: false });
  const toastTimer = useRef(null);

  const showToast = (msg, type = "info") => {
    clearTimeout(toastTimer.current);
    setToast({ msg, type, visible: true });
    toastTimer.current = setTimeout(
      () => setToast((t) => ({ ...t, visible: false })),
      2800,
    );
  };

  // ── Order status handler ──────────────────────────────────────────────────
  // Replace the setOrders call with your API call in production:
  //   await fetch(`/api/orders/${id}/status`, { method:"PATCH", body:... })
  const updateOrderStatus = (id, status) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    showToast(`Order ${id} → ${status}`, "success");
  };

  const pendingCount = orders.filter((o) => o.status === "Pending").length;

  // ── Guard: show login if not authenticated ─────────────────────────────
  if (!authed) return <Login onLogin={() => setAuthed(true)} />;

  // ── Main layout ───────────────────────────────────────────────────────────
  return (
    <div
      className="flex min-h-screen"
      style={{
        background: T.bg,
        fontFamily: "'DM Sans',system-ui,sans-serif",
        color: T.text,
      }}
    >
      {/* Sidebar */}
      <Sidebar
        active={view}
        setActive={setView}
        pendingCount={pendingCount}
        onLogout={() => setAuthed(false)}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
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
          <div className="flex items-center gap-3">
            <h1 className="font-semibold text-white capitalize">{view}</h1>
            {pendingCount > 0 && (
              <span
                className="px-2 py-0.5 rounded-full text-xs font-bold animate-pulse"
                style={{ background: `${T.orange}20`, color: T.orange }}
              >
                {pendingCount} pending
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
            {/* Admin avatar */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm"
              style={{
                background: `linear-gradient(135deg,${T.orange},${T.orangeD})`,
              }}
            >
              A
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="p-6">
          {view === "dashboard" && (
            <Dashboard orders={orders} menuItems={menuItems} />
          )}
          {view === "orders" && (
            <Orders orders={orders} onUpdateStatus={updateOrderStatus} />
          )}
          {view === "menu" && (
            <MenuManager
              items={menuItems}
              onSave={setMenuItems}
              showToast={showToast}
            />
          )}
          {view === "analytics" && <Analytics orders={orders} />}
          {view === "settings" && <Settings showToast={showToast} />}
        </div>
      </main>

      {/* Global toast */}
      <Toast msg={toast.msg} type={toast.type} visible={toast.visible} />
    </div>
  );
}

export default Admin;
