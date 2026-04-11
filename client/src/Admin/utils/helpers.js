// ─── SHARED UTILITY FUNCTIONS ────────────────────────────────────────────────

import { T } from "../constants/theme";

/** Format a number as Nigerian Naira  e.g.  2500 → "₦2,500" */
export const fmt = (n) => `₦${Number(n).toLocaleString("en-NG")}`;

/** Format an ISO date string as a short human-readable label */
export const fmtDt = (iso) => {
  const d = new Date(iso);
  return d.toLocaleString("en-NG", {
    day:    "2-digit",
    month:  "short",
    hour:   "2-digit",
    minute: "2-digit",
  });
};

/**
 * Returns background + text colour for a given order status.
 * Falls back to a neutral pair if status is unrecognised.
 */
export const statusColor = (s) =>
  ({
    Pending:            { bg: "rgba(234,179,8,.15)",  text: "#eab308" },
    Confirmed:          { bg: "rgba(59,130,246,.15)", text: "#3b82f6" },
    Preparing:          { bg: "rgba(249,115,22,.15)", text: "#f97316" },
    "Out for Delivery": { bg: "rgba(168,85,247,.15)", text: "#a855f7" },
    Delivered:          { bg: "rgba(34,197,94,.15)",  text: "#22c55e" },
    Cancelled:          { bg: "rgba(239,68,68,.15)",  text: "#ef4444" },
  }[s] ?? { bg: "rgba(255,255,255,.1)", text: "#fff" });
