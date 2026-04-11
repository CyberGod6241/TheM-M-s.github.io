// ─── ANALYTICS PAGE ──────────────────────────────────────────────────────────

import { T } from "../constants/theme";
import { STATUSES } from "../constants/data";
import { fmt, statusColor } from "../utils/helpers";
import { StatCard, MiniBar } from "../components/ui";

// Build last-7-days labels + simulated revenue values.
// In production, replace these with real API data.
function buildDailyRevenue() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86_400_000);
    return {
      l: d.toLocaleDateString("en", { weekday: "short" }),
      v: 30_000 + Math.round(Math.random() * 100_000),
    };
  });
}

export default function Analytics({ orders }) {
  const delivered = orders.filter((o) => o.status === "Delivered");
  const cancelled = orders.filter((o) => o.status === "Cancelled");
  const revenue   = delivered.reduce((s, o) => s + o.total, 0);
  const avgOrder  = delivered.length ? Math.round(revenue / delivered.length) : 0;

  const fulfilmentRate  = Math.round((delivered.length / orders.length) * 100);
  const cancellationRate= Math.round((cancelled.length / orders.length) * 100);

  // Category popularity
  const byCat = {};
  orders.forEach((o) =>
    o.items.forEach((it) => {
      byCat[it.category] = (byCat[it.category] || 0) + it.qty;
    })
  );
  const catData = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
  const catMax  = catData[0]?.[1] || 1;

  // Status breakdown
  const byStatus = STATUSES.map((s) => ({
    s,
    n: orders.filter((o) => o.status === s).length,
  })).filter((x) => x.n > 0);

  // Top customers by spend
  const topCustomers = [...new Set(orders.map((o) => o.phone))]
    .slice(0, 5)
    .map((ph) => {
      const cOrders = orders.filter((o) => o.phone === ph);
      return {
        name:  cOrders[0].customer,
        count: cOrders.length,
        total: cOrders.reduce((s, o) => s + o.total, 0),
      };
    })
    .sort((a, b) => b.total - a.total);

  const dailyRev = buildDailyRevenue();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2
          className="text-2xl font-black text-white mb-1"
          style={{ fontFamily: "'Georgia',serif" }}
        >
          Analytics
        </h2>
        <p className="text-sm" style={{ color: T.muted }}>
          Performance overview and insights.
        </p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="💰" label="Total Revenue"     value={fmt(revenue)}         color={T.orange}  trend={14} />
        <StatCard icon="🧾" label="Avg Order Value"   value={fmt(avgOrder)}        color={T.blue}    trend={5}  />
        <StatCard icon="✅" label="Fulfilment Rate"   value={`${fulfilmentRate}%`} color={T.green}   trend={3}  />
        <StatCard icon="❌" label="Cancellation Rate" value={`${cancellationRate}%`} color={T.red}   trend={-2} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Daily revenue */}
        <div
          className="rounded-2xl p-6"
          style={{ background: T.card, border: `1px solid ${T.border}` }}
        >
          <h3 className="font-bold text-white text-sm mb-1">
            Daily Revenue (Last 7 Days)
          </h3>
          <p className="text-xs mb-4" style={{ color: T.muted }}>
            Total: {fmt(dailyRev.reduce((s, d) => s + d.v, 0))}
          </p>
          <MiniBar data={dailyRev} />
        </div>

        {/* Category popularity */}
        <div
          className="rounded-2xl p-6"
          style={{ background: T.card, border: `1px solid ${T.border}` }}
        >
          <h3 className="font-bold text-white text-sm mb-4">
            Category Popularity
          </h3>
          <div className="space-y-3">
            {catData.map(([cat, n]) => (
              <div key={cat}>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: T.text }}>{cat}</span>
                  <span style={{ color: T.muted }}>{n} units</span>
                </div>
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,.06)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width:      `${(n / catMax) * 100}%`,
                      background: `linear-gradient(90deg,${T.orange},${T.orangeD})`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Status breakdown */}
        <div
          className="rounded-2xl p-6"
          style={{ background: T.card, border: `1px solid ${T.border}` }}
        >
          <h3 className="font-bold text-white text-sm mb-4">
            Order Status Breakdown
          </h3>
          <div className="space-y-3">
            {byStatus.map(({ s, n }) => {
              const c   = statusColor(s);
              const pct = Math.round((n / orders.length) * 100);
              return (
                <div key={s} className="flex items-center gap-3">
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: c.text }}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: T.text }}>{s}</span>
                      <span style={{ color: T.muted }}>
                        {n} ({pct}%)
                      </span>
                    </div>
                    <div
                      className="h-1.5 rounded-full overflow-hidden"
                      style={{ background: "rgba(255,255,255,.06)" }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: c.text }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top customers */}
        <div
          className="rounded-2xl p-6"
          style={{ background: T.card, border: `1px solid ${T.border}` }}
        >
          <h3 className="font-bold text-white text-sm mb-4">Top Customers</h3>
          <div className="space-y-3">
            {topCustomers.map((c, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{
                    background: i === 0 ? T.orange : `${T.orange}20`,
                    color:      i === 0 ? "#fff"   : T.orange,
                  }}
                >
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{c.name}</p>
                  <p className="text-xs" style={{ color: T.muted }}>
                    {c.count} orders
                  </p>
                </div>
                <p
                  className="font-bold text-sm"
                  style={{ color: T.orange }}
                >
                  {fmt(c.total)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
