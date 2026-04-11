import { useState } from "react";
function MenuCard({ item, onAdd, visible, T, fmt }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAdd(item, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col transition-all duration-500"
      style={{
        background: `rgba(92,34,0,0.42)`,
        border: `1px solid ${T.orange}20`,
        backdropFilter: "blur(10px)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: "opacity .6s ease, transform .6s ease, box-shadow .3s",
        boxShadow: "0 4px 24px rgba(0,0,0,.35)",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = `0 20px 60px rgba(0,0,0,.6), 0 0 0 1px ${T.orange}35`)
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,.35)")
      }
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: 200 }}>
        <img
          src={item.img}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500"
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.07)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          onError={(e) =>
            (e.target.src =
              "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600")
          }
        />
        {item.badge && (
          <span
            className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold"
            style={{
              background: `${T.orange}`,
              color: "#fff",
              boxShadow: `0 2px 10px ${T.orange}60`,
            }}
          >
            {item.badge}
          </span>
        )}
        <div
          className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center text-xl"
          style={{ background: "rgba(0,0,0,.5)", backdropFilter: "blur(8px)" }}
        >
          {item.emoji}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3
            className="font-bold text-base text-white leading-snug"
            style={{ fontFamily: "'Georgia',serif" }}
          >
            {item.name}
          </h3>
          <span
            className="text-xs px-2 py-0.5 rounded-full shrink-0"
            style={{
              background: `${T.orange}18`,
              color: T.orange,
              border: `1px solid ${T.orange}30`,
            }}
          >
            {item.category}
          </span>
        </div>
        <p
          className="text-xs leading-relaxed mb-4 flex-1"
          style={{ color: "rgba(255,255,255,.5)" }}
        >
          {item.desc}
        </p>

        {/* Unit price info */}
        <div
          className="text-xs mb-3"
          style={{ color: "rgba(255,255,255,.35)" }}
        >
          {fmt(item.unitPrice)} / {item.unitLabel}
        </div>

        {/* Quantity stepper + price */}
        <div className="flex items-center justify-between mb-4">
          <div
            className="flex items-center gap-0 rounded-xl overflow-hidden"
            style={{ border: `1px solid ${T.orange}35` }}
          >
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-10 h-10 text-lg font-bold transition-colors duration-150 flex items-center justify-center"
              style={{
                background: qty === 1 ? "rgba(92,34,0,.5)" : `${T.orange}25`,
                color: qty === 1 ? "rgba(255,255,255,.3)" : T.orange,
                border: "none",
                cursor: qty === 1 ? "not-allowed" : "pointer",
              }}
            >
              −
            </button>
            <div
              className="w-12 h-10 flex items-center justify-center font-bold text-white text-base"
              style={{
                background: "rgba(59,20,0,.6)",
                borderLeft: `1px solid ${T.orange}25`,
                borderRight: `1px solid ${T.orange}25`,
              }}
            >
              {qty}
            </div>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="w-10 h-10 text-lg font-bold transition-colors duration-150 flex items-center justify-center"
              style={{
                background: `${T.orange}25`,
                color: T.orange,
                border: "none",
                cursor: "pointer",
              }}
            >
              +
            </button>
          </div>
          <div
            className="font-black text-lg"
            style={{ color: T.orange, fontFamily: "'Georgia',serif" }}
          >
            {fmt(qty * item.unitPrice)}
          </div>
        </div>

        {/* Qty label */}
        <div
          className="text-center text-xs mb-3"
          style={{ color: "rgba(255,255,255,.3)" }}
        >
          {qty} {qty === 1 ? item.unitLabel : item.unitLabel + "s"}
        </div>

        {/* Add button */}
        <button
          onClick={handleAdd}
          className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all duration-200"
          style={{
            background: added
              ? "#16a34a"
              : `linear-gradient(135deg,${T.orange},${T.orangeD})`,
            boxShadow: added
              ? "0 4px 20px #16a34a60"
              : `0 4px 20px ${T.orange}40`,
            transform: added ? "scale(.97)" : "scale(1)",
            border: "none",
            cursor: "pointer",
          }}
        >
          {added ? "✓ Added!" : "Add to Order"}
        </button>
      </div>
    </div>
  );
}

export default MenuCard;
