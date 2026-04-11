// ─── SIDEBAR ─────────────────────────────────────────────────────────────────

import { T } from "../../constants/theme";

const NAV = [
  { id: "dashboard", icon: "⊞",  label: "Dashboard"  },
  { id: "orders",    icon: "🧾", label: "Orders"      },
  { id: "menu",      icon: "🍽️", label: "Menu"        },
  { id: "analytics", icon: "📊", label: "Analytics"   },
  { id: "settings",  icon: "⚙️", label: "Settings"    },
];

export default function Sidebar({
  active,
  setActive,
  pendingCount,
  onLogout,
  collapsed,
  setCollapsed,
}) {
  return (
    <aside
      className="flex flex-col shrink-0 transition-all duration-300"
      style={{
        width:       collapsed ? 68 : 220,
        background:  T.surface,
        borderRight: `1px solid ${T.border}`,
        height:      "100vh",
        position:    "sticky",
        top:         0,
      }}
    >
      {/* ── Logo ── */}
      <div
        className="flex items-center gap-3 px-4 py-5"
        style={{ borderBottom: `1px solid ${T.border}` }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-black text-white"
          style={{
            background: `linear-gradient(135deg,${T.orange},${T.orangeD})`,
            fontSize:   "1rem",
          }}
        >
          K
        </div>

        {!collapsed && (
          <div className="leading-none">
            <p
              className="font-black text-base"
              style={{ color: T.orange, fontFamily: "'Georgia',serif" }}
            >
              Kumchop
            </p>
            <p className="text-[9px] italic" style={{ color: "#f9a96a" }}>
              Admin
            </p>
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="ml-auto text-xs transition-colors"
          style={{ background: "none", border: "none", color: T.muted, cursor: "pointer" }}
        >
          {collapsed ? "›" : "‹"}
        </button>
      </div>

      {/* ── Nav links ── */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {NAV.map((n) => {
          const isActive = active === n.id;
          return (
            <button
              key={n.id}
              onClick={() => setActive(n.id)}
              className="w-full flex items-center gap-3 rounded-xl transition-all duration-150 relative"
              style={{
                padding:        collapsed ? "10px 0" : "10px 12px",
                justifyContent: collapsed ? "center" : "flex-start",
                background:     isActive ? `${T.orange}18` : "transparent",
                border:         `1px solid ${isActive ? T.orange + "35" : "transparent"}`,
                color:          isActive ? T.orange : T.muted,
                cursor:         "pointer",
              }}
            >
              <span className="text-base">{n.icon}</span>
              {!collapsed && (
                <span className="text-sm font-semibold">{n.label}</span>
              )}

              {/* Pending orders badge on the Orders nav item */}
              {n.id === "orders" && pendingCount > 0 && (
                <span
                  className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
                  style={{ background: T.orange, color: "#fff" }}
                >
                  {pendingCount > 9 ? "9+" : pendingCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Logout ── */}
      <div className="p-3" style={{ borderTop: `1px solid ${T.border}` }}>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 rounded-xl transition-all duration-150"
          style={{
            padding:        collapsed ? "10px 0" : "10px 12px",
            justifyContent: collapsed ? "center" : "flex-start",
            background:     "none",
            border:         "none",
            color:          T.muted,
            cursor:         "pointer",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = T.red)}
          onMouseLeave={(e) => (e.currentTarget.style.color = T.muted)}
        >
          <span>🚪</span>
          {!collapsed && <span className="text-sm font-semibold">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
