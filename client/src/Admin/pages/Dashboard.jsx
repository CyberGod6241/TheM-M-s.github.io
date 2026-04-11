// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────

import { T } from "../constants/theme";
import { STATUSES } from "../constants/data";
import { fmt, fmtDt, statusColor } from "../utils/helpers";
import { StatCard, MiniBar, Badge } from "../components/ui";

// Fixed weekly revenue data — replace with a real API call in production.
const WEEK_DATA = [
  { l: "Mon", v: 42000  },
  { l: "Tue", v: 67000  },
  { l: "Wed", v: 55000  },
  { l: "Thu", v: 89000  },
  { l: "Fri", v: 120000 },
  { l: "Sat", v: 145000 },
  { l: "Sun", v: 98000  },
];

export default function Dashboard({ orders, menuItems }) {
  const delivered = orders.filter((o) => o.status === "Delivered");
  const pending   = orders.filter((o) => o.status === "Pending");
  const revenue   = delivered.reduce((s, o) => s + o.total, 0);
  const customers = new Set(orders.map((o) => o.phone)).size;

  const topItems = [...menuItems]
    .sort((a, b) => b.unitPrice - a.unitPrice)
    .slice(0, 5);

  const statusBreakdown = STATUSES.map((s) => ({
    s,
    count: orders.filter((o) => o.status === s).length,
  })).filter((x) => x.count > 0);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h2
          className="text-2xl font-black text-white mb-1"
          style={{ fontFamily: "'Georgia',serif" }}
        >
          Dashboard
        </h2>
        <p className="text-sm" style={{ color: T.muted }}>
          Welcome back, Admin. Here's what's happening today.
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="₦"  label="Total Revenue"     value={fmt(revenue)}      sub="From delivered orders"        trend={12}                   />
        <StatCard icon="🧾" label="Total Orders"      value={orders.length}     sub={`${pending.length} pending`}  trend={8}  color={T.blue}    />
        <StatCard icon="✅" label="Delivered"         value={delivered.length}  sub="Completed successfully"       trend={5}  color={T.green}   />
        <StatCard icon="👥" label="Unique Customers"  value={customers}         sub="All time"                     trend={-2} color="#a855f7"   />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weekly revenue bar chart */}
        <div
          className="lg:col-span-2 rounded-2xl p-6"
          style={{ background: T.card, border: `1px solid ${T.border}` }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-white text-sm">Weekly Revenue</h3>
              <p className="text-xs" style={{ color: T.muted }}>
                This week's performance
              </p>
            </div>
            <span
              className="text-xs px-3 py-1 rounded-full font-semibold"
              style={{ background: `${T.orange}18`, color: T.orange }}
            >
              {fmt(WEEK_DATA.reduce((s, d) => s + d.v, 0))}
            </span>
          </div>
          <MiniBar data={WEEK_DATA} />
        </div>

        {/* Order status breakdown */}
        <div
          className="rounded-2xl p-6"
          style={{ background: T.card, border: `1px solid ${T.border}` }}
        >
          <h3 className="font-bold text-white text-sm mb-4">Order Status</h3>
          <div className="space-y-3">
            {statusBreakdown.map(({ s, count }) => {
              const pct = Math.round((count / orders.length) * 100);
              const c   = statusColor(s);
              return (
                <div key={s}>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: c.text }}>{s}</span>
                    <span style={{ color: T.muted }}>{count}</span>
                  </div>
                  <div
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{ background: "rgba(255,255,255,.08)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: c.text }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent orders */}
        <div
          className="rounded-2xl p-6"
          style={{ background: T.card, border: `1px solid ${T.border}` }}
        >
          <h3 className="font-bold text-white text-sm mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {orders.slice(0, 5).map((o) => (
              <div
                key={o.id}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: "rgba(255,255,255,.03)" }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ background: `${T.orange}20`, color: T.orange }}
                >
                  {o.customer[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {o.customer}
                  </p>
                  <p className="text-xs" style={{ color: T.muted }}>
                    {o.id} · {fmtDt(o.time)}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold mb-1" style={{ color: T.orange }}>
                    {fmt(o.total)}
                  </p>
                  <Badge label={o.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top menu items */}
        <div
          className="rounded-2xl p-6"
          style={{ background: T.card, border: `1px solid ${T.border}` }}
        >
          <h3 className="font-bold text-white text-sm mb-4">Top Menu Items</h3>
          <div className="space-y-3">
            {topItems.map((item, i) => (
              <div key={item.id} className="flex items-center gap-3">
                <span
                  className="text-xs font-bold w-5 text-center"
                  style={{ color: i === 0 ? T.orange : T.muted }}
                >
                  {i + 1}
                </span>
                <span className="text-lg">{item.emoji}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{item.name}</p>
                  <p className="text-xs" style={{ color: T.muted }}>
                    {fmt(item.unitPrice)} / {item.unitLabel}
                  </p>
                </div>
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: item.available ? T.green : T.red }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
