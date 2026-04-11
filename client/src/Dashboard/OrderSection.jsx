import { useState } from "react";
import Bokeh from "../Customer/pages/Bokeh";
import SuccessModal from "../Customer/pages/SuccesModal";
import { T } from "../Customer/constant/theme";
import { fmt } from "../Customer/utils/helpers";

function OrderSection({
  cartItems,
  onPlaceOrder,
  successOrder,
  setSuccessOrder,
}) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
  });
  const [deliveryType, setDeliveryType] = useState("delivery");
  const [errors, setErrors] = useState({});
  const total = cartItems.reduce((s, i) => s + i.price, 0);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (deliveryType === "delivery" && !form.address.trim())
      e.address = "Address is required for delivery";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (cartItems.length === 0)
      return alert("⚠️ Please add items to your order first!");
    if (!validate()) return;
    onPlaceOrder({ ...form, deliveryType });
  };

  return (
    <section
      id="order"
      className="py-24 px-4 relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg,#1a0800 0%,${T.brown900} 100%)`,
      }}
    >
      <Bokeh count={2} />
      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
            style={{
              background: `${T.orange}18`,
              border: `1px solid ${T.orange}35`,
              color: T.orange,
            }}
          >
            Checkout
          </span>
          <h2
            className="font-black text-white mb-3"
            style={{
              fontFamily: "'Georgia',serif",
              fontSize: "clamp(2rem,5vw,3rem)",
            }}
          >
            Complete Your Order
          </h2>
        </div>

        {/* Order summary */}
        <div
          className="rounded-2xl p-6 mb-6"
          style={{
            background: `rgba(92,34,0,.4)`,
            border: `1px solid ${T.orange}20`,
          }}
        >
          <h3
            className="font-bold text-base mb-4"
            style={{ color: T.orange, fontFamily: "'Georgia',serif" }}
          >
            📋 Order Summary
          </h3>
          {cartItems.length === 0 ? (
            <p
              className="text-sm text-center py-6"
              style={{ color: "rgba(255,255,255,.3)" }}
            >
              No items yet.{" "}
              <a href="#menu" style={{ color: T.orange }}>
                Browse the menu →
              </a>
            </p>
          ) : (
            <>
              <div className="space-y-2 mb-4">
                {cartItems.map((it, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span style={{ color: "rgba(255,255,255,.7)" }}>
                      {it.emoji} {it.name} × {it.qty} {it.unitLabel}
                      {it.qty > 1 ? "s" : ""}
                    </span>
                    <span style={{ color: T.orange }} className="font-semibold">
                      {fmt(it.price)}
                    </span>
                  </div>
                ))}
              </div>
              <div
                className="flex justify-between font-black text-base pt-3"
                style={{ borderTop: `1px solid ${T.orange}20` }}
              >
                <span className="text-white">Total</span>
                <span
                  style={{ color: T.orange, fontFamily: "'Georgia',serif" }}
                >
                  {fmt(total)}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Delivery toggle */}
        <div
          className="flex rounded-xl p-1 mb-6"
          style={{
            background: `rgba(92,34,0,.5)`,
            border: `1px solid ${T.orange}20`,
          }}
        >
          {["delivery", "pickup"].map((type) => (
            <button
              key={type}
              onClick={() => setDeliveryType(type)}
              className="flex-1 py-3 rounded-lg text-sm font-bold capitalize transition-all duration-200"
              style={{
                background:
                  deliveryType === type
                    ? `linear-gradient(135deg,${T.orange},${T.orangeD})`
                    : "transparent",
                color: deliveryType === type ? "#fff" : "rgba(255,255,255,.4)",
                border: "none",
                cursor: "pointer",
              }}
            >
              {type === "delivery" ? "🛵 Delivery" : "🏪 Pick Up"}
            </button>
          ))}
        </div>

        {/* Form */}
        <div
          className="rounded-2xl p-6 space-y-5"
          style={{
            background: `rgba(92,34,0,.4)`,
            border: `1px solid ${T.orange}20`,
          }}
        >
          <h3
            className="font-bold text-base"
            style={{ color: T.orange, fontFamily: "'Georgia',serif" }}
          >
            👤 Your Details
          </h3>

          {[
            {
              key: "name",
              label: "Full Name",
              type: "text",
              placeholder: "e.g. Amara Obi",
            },
            {
              key: "phone",
              label: "Phone Number",
              type: "tel",
              placeholder: "e.g. 08012345678",
            },
          ].map((f) => (
            <div key={f.key}>
              <label
                className="block text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: "rgba(255,255,255,.45)" }}
              >
                {f.label}
              </label>
              <input
                type={f.type}
                placeholder={f.placeholder}
                value={form[f.key]}
                onChange={(e) =>
                  setForm((p) => ({ ...p, [f.key]: e.target.value }))
                }
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all duration-200"
                style={{
                  background: "rgba(59,20,0,.7)",
                  border: `1px solid ${errors[f.key] ? "#f87171" : `${T.orange}28`}`,
                  fontFamily: "inherit",
                }}
                onFocus={(e) => (e.target.style.borderColor = T.orange)}
                onBlur={(e) =>
                  (e.target.style.borderColor = errors[f.key]
                    ? "#f87171"
                    : `${T.orange}28`)
                }
              />
              {errors[f.key] && (
                <p className="text-xs mt-1" style={{ color: "#f87171" }}>
                  {errors[f.key]}
                </p>
              )}
            </div>
          ))}
          <SuccessModal
            order={successOrder}
            onClose={() => setSuccessOrder(null)}
            T={T}
            fmt={fmt}
          />

          {deliveryType === "delivery" && (
            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: "rgba(255,255,255,.45)" }}
              >
                Delivery Address
              </label>
              <textarea
                placeholder="Street, area, city…"
                value={form.address}
                onChange={(e) =>
                  setForm((p) => ({ ...p, address: e.target.value }))
                }
                rows={3}
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/20 outline-none resize-none transition-all duration-200"
                style={{
                  background: "rgba(59,20,0,.7)",
                  border: `1px solid ${errors.address ? "#f87171" : `${T.orange}28`}`,
                  fontFamily: "inherit",
                }}
                onFocus={(e) => (e.target.style.borderColor = T.orange)}
                onBlur={(e) =>
                  (e.target.style.borderColor = errors.address
                    ? "#f87171"
                    : `${T.orange}28`)
                }
              />
              {errors.address && (
                <p className="text-xs mt-1" style={{ color: "#f87171" }}>
                  {errors.address}
                </p>
              )}
            </div>
          )}

          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: "rgba(255,255,255,.45)" }}
            >
              Special Instructions{" "}
              <span style={{ color: "rgba(255,255,255,.25)" }}>(optional)</span>
            </label>
            <textarea
              placeholder="Any allergies, special requests…"
              value={form.note}
              onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
              rows={2}
              className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/20 outline-none resize-none"
              style={{
                background: "rgba(59,20,0,.7)",
                border: `1px solid ${T.orange}20`,
                fontFamily: "inherit",
              }}
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-4 rounded-xl font-bold text-white text-base transition-all duration-200 hover:scale-[1.02]"
            style={{
              background: `linear-gradient(135deg,${T.orange},${T.orangeD})`,
              boxShadow: `0 8px 32px ${T.orange}50`,
              border: "none",
              cursor: "pointer",
            }}
          >
            🚀 Place Order · {fmt(total)}
          </button>
        </div>
      </div>
    </section>
  );
}
export default OrderSection;
