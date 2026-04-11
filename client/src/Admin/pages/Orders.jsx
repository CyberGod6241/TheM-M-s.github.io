// ─── ORDERS PAGE ─────────────────────────────────────────────────────────────

import { useState } from "react";
import { T } from "../constants/theme";
import { STATUSES } from "../constants/data";
import { fmt, fmtDt, statusColor } from "../utils/helpers";
import { Badge, Btn } from "../components/ui";

// ── Order detail modal ────────────────────────────────────────────────────────
function OrderModal({ order, onClose, onUpdateStatus }) {
  const [current, setCurrent] = useState(order);

  const handleStatus = (newStatus) => {
    onUpdateStatus(current.id, newStatus);
    setCurrent((prev) => ({ ...prev, status: newStatus }));
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50"
        style={{ background: "rgba(0,0,0,.7)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-lg rounded-3xl overflow-hidden flex flex-col"
          style={{
            background: T.surface,
            border:     `1px solid ${T.borderHi}`,
            maxHeight:  "90vh",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: `1px solid ${T.border}` }}
          >
            <div>
              <h3
                className="font-black text-white text-lg"
                style={{ fontFamily: "'Georgia',serif" }}
              >
                {current.id}
              </h3>
              <p className="text-xs" style={{ color: T.muted }}>
                {fmtDt(current.time)}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background:   `${T.orange}18`,
                border:       "none",
                color:        T.orange,
                width:        32,
                height:       32,
                borderRadius: "50%",
                cursor:       "pointer",
                fontSize:     16,
              }}
            >
              ✕
            </button>
          </div>

          {/* Scrollable body */}
          <div className="overflow-y-auto flex-1 p-6 space-y-5">
            {/* Customer info grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { l: "Customer", v: current.customer },
                { l: "Phone",    v: current.phone    },
                { l: "Type",     v: current.type     },
                { l: "Note",     v: current.note || "—" },
              ].map((r) => (
                <div
                  key={r.l}
                  className="p-3 rounded-xl"
                  style={{ background: "rgba(255,255,255,.03)" }}
                >
                  <p className="text-xs" style={{ color: T.muted }}>{r.l}</p>
                  <p className="text-sm font-semibold text-white mt-0.5">{r.v}</p>
                </div>
              ))}
            </div>

            {current.type === "Delivery" && (
              <div
                className="p-3 rounded-xl"
                style={{ background: "rgba(255,255,255,.03)" }}
              >
                <p className="text-xs" style={{ color: T.muted }}>Address</p>
                <p className="text-sm text-white mt-0.5">{current.address}</p>
              </div>
            )}

            {/* Items list */}
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: T.muted }}
              >
                Order Items
              </p>
              <div className="space-y-2">
                {current.items.map((it, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: "rgba(255,255,255,.03)" }}
                  >
                    <span className="text-xl">{it.emoji}</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">{it.name}</p>
                      <p className="text-xs" style={{ color: T.muted }}>
                        {fmt(it.unitPrice)} × {it.qty} {it.unitLabel}s
                      </p>
                    </div>
                    <p className="font-bold text-sm" style={{ color: T.orange }}>
                      {fmt(it.price)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div
                className="flex justify-between items-center mt-3 pt-3"
                style={{ borderTop: `1px solid ${T.border}` }}
              >
                <span className="font-bold text-white">Total</span>
                <span
                  className="font-black text-lg"
                  style={{ color: T.orange, fontFamily: "'Georgia',serif" }}
                >
                  {fmt(current.total)}
                </span>
              </div>
            </div>

            {/* Status updater */}
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: T.muted }}
              >
                Update Status
              </p>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map((s) => {
                  const c      = statusColor(s);
                  const active = current.status === s;
                  return (
                    <button
                      key={s}
                      onClick={() => handleStatus(s)}
                      className="px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-150 hover:scale-105"
                      style={{
                        background: active ? c.text : c.bg,
                        color:      active ? "#fff" : c.text,
                        border:     `1px solid ${c.text}40`,
                        cursor:     "pointer",
                      }}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Orders page ───────────────────────────────────────────────────────────────
export default function Orders({ orders, onUpdateStatus }) {
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter,   setTypeFilter]   = useState("All");
  const [selected,     setSelected]     = useState(null);
  const [page,         setPage]         = useState(0);

  const PER_PAGE = 8;

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search);
    const matchStatus = statusFilter === "All" || o.status === statusFilter;
    const matchType   = typeFilter   === "All" || o.type   === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const pages = Math.ceil(filtered.length / PER_PAGE);
  const shown = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2
          className="text-2xl font-black text-white"
          style={{ fontFamily: "'Georgia',serif" }}
        >
          Orders
        </h2>
        <p className="text-sm" style={{ color: T.muted }}>
          {filtered.length} orders found
        </p>
      </div>

      {/* Search + dropdowns */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search by order ID, name or phone…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          className="flex-1 min-w-48 px-4 py-2.5 rounded-xl text-sm outline-none"
          style={{ background: T.card, border: `1px solid ${T.border}`, color: T.text, fontFamily: "inherit" }}
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
          className="px-3 py-2.5 rounded-xl text-sm outline-none"
          style={{ background: T.card, border: `1px solid ${T.border}`, color: T.text }}
        >
          <option value="All">All Statuses</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(0); }}
          className="px-3 py-2.5 rounded-xl text-sm outline-none"
          style={{ background: T.card, border: `1px solid ${T.border}`, color: T.text }}
        >
          <option value="All">All Types</option>
          <option>Delivery</option>
          <option>Pickup</option>
        </select>
      </div>

      {/* Status pill quick-filters */}
      <div className="flex flex-wrap gap-2">
        {["All", ...STATUSES].map((s) => {
          const c      = s === "All" ? { text: T.orange } : statusColor(s);
          const active = statusFilter === s;
          return (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(0); }}
              className="px-3 py-1 rounded-full text-xs font-semibold transition-all duration-150"
              style={{
                background: active ? c.text : "rgba(255,255,255,.05)",
                color:      active ? "#fff" : c.text,
                border:     `1px solid ${active ? "transparent" : c.text + "40"}`,
                cursor:     "pointer",
              }}
            >
              {s}
              {s !== "All" && (
                <span className="ml-1 opacity-70">
                  ({orders.filter((o) => o.status === s).length})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Order cards */}
      <div className="space-y-3">
        {shown.length === 0 && (
          <div
            className="text-center py-16 rounded-2xl"
            style={{ background: T.card, border: `1px solid ${T.border}` }}
          >
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-sm" style={{ color: T.muted }}>
              No orders match your filters.
            </p>
          </div>
        )}

        {shown.map((o) => (
          <div
            key={o.id}
            onClick={() => setSelected(o)}
            className="rounded-2xl p-4 cursor-pointer transition-all duration-200"
            style={{ background: T.card, border: `1px solid ${T.border}` }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = T.orange + "50";
              e.currentTarget.style.background  = "rgba(249,115,22,.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = T.border;
              e.currentTarget.style.background  = T.card;
            }}
          >
            {/* Top row: avatar + name + status badge */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-black text-base shrink-0"
                  style={{ background: `${T.orange}20`, color: T.orange }}
                >
                  {o.customer[0]}
                </div>
                <div>
                  <p className="font-bold text-white text-sm leading-tight">
                    {o.customer}
                  </p>
                  <p className="text-xs" style={{ color: T.muted }}>{o.phone}</p>
                </div>
              </div>
              <Badge label={o.status} />
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span
                className="font-mono text-xs font-bold px-2 py-1 rounded-lg"
                style={{ background: `${T.orange}15`, color: T.orange }}
              >
                {o.id}
              </span>
              <span
                className="text-xs px-2 py-1 rounded-lg"
                style={{
                  background: o.type === "Delivery" ? "rgba(59,130,246,.12)" : "rgba(168,85,247,.12)",
                  color:      o.type === "Delivery" ? T.blue : "#a855f7",
                }}
              >
                {o.type === "Delivery" ? "🛵" : "🏪"} {o.type}
              </span>
              <span className="text-xs" style={{ color: T.muted }}>
                {o.items.length} item{o.items.length !== 1 ? "s" : ""}
              </span>
              <span className="text-xs" style={{ color: T.muted }}>
                🕐 {fmtDt(o.time)}
              </span>
            </div>

            {/* Item chips preview */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {o.items.slice(0, 4).map((it, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(255,255,255,.06)", color: "rgba(255,255,255,.6)" }}
                >
                  {it.emoji} {it.name} ×{it.qty}
                </span>
              ))}
              {o.items.length > 4 && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(255,255,255,.06)", color: T.muted }}
                >
                  +{o.items.length - 4} more
                </span>
              )}
            </div>

            {/* Bottom row: total + action buttons */}
            <div
              className="flex items-center justify-between pt-3"
              style={{ borderTop: `1px solid rgba(255,255,255,.06)` }}
            >
              <div>
                <p className="text-xs" style={{ color: T.muted }}>Order Total</p>
                <p
                  className="font-black text-lg leading-tight"
                  style={{ color: T.orange, fontFamily: "'Georgia',serif" }}
                >
                  {fmt(o.total)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* One-click status advance */}
                {o.status !== "Delivered" && o.status !== "Cancelled" && (() => {
                  const nextIdx = STATUSES.indexOf(o.status) + 1;
                  const next    = STATUSES[nextIdx];
                  if (!next || next === "Cancelled") return null;
                  const nc = statusColor(next);
                  return (
                    <button
                      onClick={(e) => { e.stopPropagation(); onUpdateStatus(o.id, next); }}
                      className="px-3 py-2 rounded-xl text-xs font-bold transition-all duration-150 hover:scale-105"
                      style={{
                        background: nc.bg,
                        color:      nc.text,
                        border:     `1px solid ${nc.text}40`,
                        cursor:     "pointer",
                      }}
                    >
                      → {next}
                    </button>
                  );
                })()}

                {/* View details — always visible */}
                <button
                  onClick={(e) => { e.stopPropagation(); setSelected(o); }}
                  className="px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg,${T.orange},${T.orangeD})`,
                    color:      "#fff",
                    border:     "none",
                    cursor:     "pointer",
                    boxShadow:  `0 2px 12px ${T.orange}40`,
                  }}
                >
                  View Details →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between px-2">
          <span className="text-xs" style={{ color: T.muted }}>
            Page {page + 1} of {pages} · {filtered.length} orders
          </span>
          <div className="flex gap-2">
            <Btn small variant="outline" onClick={() => setPage((p) => Math.max(0, p - 1))}         disabled={page === 0}>         ← Prev</Btn>
            <Btn small variant="outline" onClick={() => setPage((p) => Math.min(pages - 1, p + 1))} disabled={page === pages - 1}> Next →</Btn>
          </div>
        </div>
      )}

      {/* Order detail modal */}
      {selected && (
        <OrderModal
          order={selected}
          onClose={() => setSelected(null)}
          onUpdateStatus={onUpdateStatus}
        />
      )}
    </div>
  );
}
