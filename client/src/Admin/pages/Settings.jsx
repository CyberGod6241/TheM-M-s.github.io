// ─── SETTINGS PAGE ───────────────────────────────────────────────────────────

import { useState } from "react";
import { T } from "../constants/theme";
import { Btn } from "../components/ui";

// ── Reusable field wrapper ────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div>
      <label
        className="block text-xs font-semibold uppercase tracking-widest mb-1.5"
        style={{ color: T.muted }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

// Inline style shared by all settings inputs
const INPUT_STYLE = {
  background:  "rgba(59,20,0,.7)",
  border:      `1px solid ${T.border}`,
  color:       T.text,
  fontFamily:  "inherit",
};

function SettingsInput(props) {
  return (
    <input
      {...props}
      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
      style={INPUT_STYLE}
    />
  );
}

// ── Toggle switch ─────────────────────────────────────────────────────────────
function Toggle({ value, onChange, label }) {
  return (
    <div
      className="flex items-center justify-between py-3"
      style={{ borderBottom: `1px solid ${T.border}` }}
    >
      <span className="text-sm text-white">{label}</span>
      <div
        className="relative w-11 h-6 rounded-full cursor-pointer transition-colors"
        style={{ background: value ? T.orange : "rgba(255,255,255,.12)" }}
        onClick={onChange}
      >
        <div
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200"
          style={{ left: value ? "calc(100% - 20px)" : 4 }}
        />
      </div>
    </div>
  );
}

// ── Section card wrapper ──────────────────────────────────────────────────────
function SettingsCard({ title, children }) {
  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: T.card, border: `1px solid ${T.border}` }}
    >
      <h3
        className="font-bold text-white text-sm mb-5 pb-3"
        style={{ borderBottom: `1px solid ${T.border}` }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

// ── Settings page ─────────────────────────────────────────────────────────────
export default function Settings({ showToast }) {
  const [form, setForm] = useState({
    restaurantName:  "Kumchop",
    tagline:         "Every Taste feels Good.",
    email:           "hello@kumchop.com",
    phone1:          "08026875555",
    phone2:          "0803 427 6312",
    address:         "Ibadan, Oyo State, Nigeria",
    openTime:        "08:00",
    closeTime:       "22:00",
    deliveryFee:     500,
    minOrder:        1000,
    acceptOrders:    true,
    openSunday:      true,
    notifyNewOrder:  true,
    notifyLowStock:  false,
  });

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));
  const tog = (key)      => setForm((p) => ({ ...p, [key]: !p[key] }));

  const handleSave = () => {
    // In production: POST/PUT form to your API here.
    showToast("✅ Settings saved!", "success");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Page header */}
      <div>
        <h2
          className="text-2xl font-black text-white mb-1"
          style={{ fontFamily: "'Georgia',serif" }}
        >
          Settings
        </h2>
        <p className="text-sm" style={{ color: T.muted }}>
          Manage your restaurant configuration.
        </p>
      </div>

      {/* ── Restaurant info ── */}
      <SettingsCard title="Restaurant Info">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Restaurant Name">
              <SettingsInput value={form.restaurantName} onChange={(e) => set("restaurantName", e.target.value)} />
            </Field>
            <Field label="Tagline">
              <SettingsInput value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
            </Field>
          </div>
          <Field label="Email">
            <SettingsInput type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Phone 1">
              <SettingsInput type="tel" value={form.phone1} onChange={(e) => set("phone1", e.target.value)} />
            </Field>
            <Field label="Phone 2">
              <SettingsInput type="tel" value={form.phone2} onChange={(e) => set("phone2", e.target.value)} />
            </Field>
          </div>
          <Field label="Address">
            <SettingsInput value={form.address} onChange={(e) => set("address", e.target.value)} />
          </Field>
        </div>
      </SettingsCard>

      {/* ── Hours & Ordering ── */}
      <SettingsCard title="Hours & Ordering">
        <div className="space-y-1">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Field label="Opening Time">
              <SettingsInput type="time" value={form.openTime} onChange={(e) => set("openTime", e.target.value)} />
            </Field>
            <Field label="Closing Time">
              <SettingsInput type="time" value={form.closeTime} onChange={(e) => set("closeTime", e.target.value)} />
            </Field>
            <Field label="Delivery Fee (₦)">
              <SettingsInput type="number" value={form.deliveryFee} onChange={(e) => set("deliveryFee", Number(e.target.value))} />
            </Field>
            <Field label="Min Order (₦)">
              <SettingsInput type="number" value={form.minOrder} onChange={(e) => set("minOrder", Number(e.target.value))} />
            </Field>
          </div>

          <Toggle value={form.acceptOrders}   onChange={() => tog("acceptOrders")}   label="Accept new orders"   />
          <Toggle value={form.openSunday}      onChange={() => tog("openSunday")}     label="Open on Sundays"     />
          <Toggle value={form.notifyNewOrder}  onChange={() => tog("notifyNewOrder")} label="Notify on new order" />
          <Toggle value={form.notifyLowStock}  onChange={() => tog("notifyLowStock")} label="Low stock alerts"    />
        </div>
      </SettingsCard>

      {/* ── Account & Security ── */}
      <SettingsCard title="Account & Security">
        <div className="space-y-4">
          <Field label="Current Password">
            <SettingsInput type="password" placeholder="••••••••" />
          </Field>
          <Field label="New Password">
            <SettingsInput type="password" placeholder="••••••••" />
          </Field>
          <Btn variant="ghost">Change Password</Btn>
        </div>
      </SettingsCard>

      <Btn onClick={handleSave}>💾 Save All Settings</Btn>
    </div>
  );
}
