// ─── PRIMITIVE UI COMPONENTS ─────────────────────────────────────────────────
// Small, reusable building-blocks shared across every page of the admin.

import { T } from "../../constants/theme";
import { statusColor } from "../../utils/helpers";

// ── Status badge ──────────────────────────────────────────────────────────────
export const Badge = ({ label }) => {
  const c = statusColor(label);
  return (
    <span
      className="px-2.5 py-1 rounded-full text-xs font-bold"
      style={{ background: c.bg, color: c.text }}
    >
      {label}
    </span>
  );
};

// ── KPI stat card ─────────────────────────────────────────────────────────────
export const StatCard = ({ icon, label, value, sub, color = T.orange, trend }) => (
  <div
    className="rounded-2xl p-5 flex flex-col gap-3"
    style={{ background: T.card, border: `1px solid ${T.border}` }}
  >
    <div className="flex items-center justify-between">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
        style={{ background: `${color}18`, border: `1px solid ${color}30` }}
      >
        {icon}
      </div>
      {trend !== undefined && (
        <span
          className="text-xs font-semibold px-2 py-1 rounded-full"
          style={{
            background: trend >= 0 ? "rgba(34,197,94,.15)" : "rgba(239,68,68,.15)",
            color:      trend >= 0 ? T.green : T.red,
          }}
        >
          {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
        </span>
      )}
    </div>
    <div>
      <p className="text-2xl font-black text-white" style={{ fontFamily: "'Georgia',serif" }}>
        {value}
      </p>
      <p className="text-xs mt-0.5" style={{ color: T.muted }}>{label}</p>
      {sub && <p className="text-xs mt-1" style={{ color }}>{sub}</p>}
    </div>
  </div>
);

// ── Labelled text input ───────────────────────────────────────────────────────
export const Input = ({ label, ...props }) => (
  <div>
    {label && (
      <label
        className="block text-xs font-semibold uppercase tracking-widest mb-1.5"
        style={{ color: T.muted }}
      >
        {label}
      </label>
    )}
    <input
      {...props}
      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
      style={{
        background:  "rgba(59,20,0,.7)",
        border:      `1px solid ${T.border}`,
        color:       T.text,
        fontFamily:  "inherit",
      }}
      onFocus={(e) => (e.target.style.borderColor = T.orange)}
      onBlur={(e)  => (e.target.style.borderColor = T.border)}
    />
  </div>
);

// ── Labelled select ───────────────────────────────────────────────────────────
export const Select = ({ label, children, ...props }) => (
  <div>
    {label && (
      <label
        className="block text-xs font-semibold uppercase tracking-widest mb-1.5"
        style={{ color: T.muted }}
      >
        {label}
      </label>
    )}
    <select
      {...props}
      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
      style={{
        background: "rgba(59,20,0,.9)",
        border:     `1px solid ${T.border}`,
        color:      T.text,
        fontFamily: "inherit",
      }}
    >
      {children}
    </select>
  </div>
);

// ── Multi-variant button ──────────────────────────────────────────────────────
export const Btn = ({ children, variant = "primary", small, ...props }) => {
  const styles = {
    primary: {
      background: `linear-gradient(135deg,${T.orange},${T.orangeD})`,
      color:      "#fff",
      border:     "none",
      cursor:     "pointer",
      boxShadow:  `0 4px 16px ${T.orange}40`,
    },
    ghost: {
      background: `${T.orange}14`,
      color:      T.orange,
      border:     `1px solid ${T.border}`,
      cursor:     "pointer",
    },
    danger: {
      background: "rgba(239,68,68,.15)",
      color:      "#ef4444",
      border:     "1px solid rgba(239,68,68,.3)",
      cursor:     "pointer",
    },
    outline: {
      background: "transparent",
      color:      T.muted,
      border:     `1px solid ${T.border}`,
      cursor:     "pointer",
    },
  };

  return (
    <button
      {...props}
      className={`${small ? "px-3 py-1.5 text-xs" : "px-5 py-2.5 text-sm"} rounded-xl font-bold transition-all duration-200 hover:scale-[1.03] active:scale-[.97]`}
      style={styles[variant] ?? styles.outline}
    >
      {children}
    </button>
  );
};

// ── Mini bar chart ────────────────────────────────────────────────────────────
export const MiniBar = ({ data, color = T.orange }) => {
  const max = Math.max(...data.map((d) => d.v));
  return (
    <div className="flex items-end gap-1.5 h-16">
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <div
            className="w-full rounded-t-md transition-all duration-700"
            style={{
              height:     `${(d.v / max) * 52}px`,
              background: `linear-gradient(180deg,${color},${color}88)`,
              minHeight:  4,
            }}
          />
          <span className="text-[9px]" style={{ color: T.muted }}>{d.l}</span>
        </div>
      ))}
    </div>
  );
};

// ── Toast notification ────────────────────────────────────────────────────────
export const Toast = ({ msg, type, visible }) => {
  const colors = { success: T.green, error: T.red, info: T.orange };
  const bg     = colors[type] ?? T.orange;
  return (
    <div
      className="fixed top-6 right-6 z-[200] pointer-events-none transition-all duration-400"
      style={{
        transform:  visible ? "translateY(0)" : "translateY(-80px)",
        opacity:    visible ? 1 : 0,
        background: bg,
        color:      "#fff",
        padding:    "12px 20px",
        borderRadius: 14,
        fontWeight: 600,
        fontSize:   ".85rem",
        boxShadow:  `0 8px 32px ${bg}60`,
      }}
    >
      {msg}
    </div>
  );
};
