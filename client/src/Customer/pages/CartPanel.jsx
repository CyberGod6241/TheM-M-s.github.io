import { Link } from "react-router-dom";
function CartPanel({
  items,
  onRemove,
  onUpdateQty,
  onClose,
  onCheckout,
  T,
  fmt,
}) {
  const total = items.reduce((s, i) => s + i.price, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50"
        style={{ background: "rgba(0,0,0,.6)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed top-0 right-0 h-full z-50 flex flex-col"
        style={{
          width: "min(420px,100vw)",
          background: T.brown800,
          borderLeft: `1px solid ${T.orange}20`,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: `1px solid ${T.orange}15` }}
        >
          <div>
            <h2
              className="font-black text-xl text-white"
              style={{ fontFamily: "'Georgia',serif" }}
            >
              Your Order
            </h2>
            <p className="text-xs" style={{ color: "rgba(255,255,255,.4)" }}>
              {items.length} item{items.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
            style={{
              background: `${T.orange}18`,
              color: T.orange,
              border: "none",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🛒</div>
              <p className="text-sm" style={{ color: "rgba(255,255,255,.35)" }}>
                Your cart is empty.
                <br />
                Browse the menu and add items!
              </p>
            </div>
          ) : (
            items.map((item, i) => (
              <div
                key={`${item.id}-${i}`}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{
                  background: `rgba(92,34,0,.5)`,
                  border: `1px solid ${T.orange}15`,
                }}
              >
                <div className="text-2xl">{item.emoji}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-white truncate">
                    {item.name}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "rgba(255,255,255,.4)" }}
                  >
                    {fmt(item.unitPrice)} × {item.qty}
                  </p>
                </div>
                {/* Mini stepper */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onUpdateQty(i, item.qty - 1)}
                    className="w-7 h-7 rounded-lg text-sm font-bold flex items-center justify-center"
                    style={{
                      background: `${T.orange}25`,
                      color: T.orange,
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm font-bold text-white">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => onUpdateQty(i, item.qty + 1)}
                    className="w-7 h-7 rounded-lg text-sm font-bold flex items-center justify-center"
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
                  className="font-bold text-sm shrink-0"
                  style={{ color: T.orange }}
                >
                  {fmt(item.price)}
                </div>
                <button
                  onClick={() => onRemove(i)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs"
                  style={{
                    background: "rgba(239,68,68,.15)",
                    color: "#f87171",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div
            className="px-6 py-5"
            style={{ borderTop: `1px solid ${T.orange}15` }}
          >
            <div className="flex justify-between items-center mb-4">
              <span
                className="text-sm"
                style={{ color: "rgba(255,255,255,.5)" }}
              >
                Subtotal
              </span>
              <span
                className="font-black text-xl"
                style={{ color: T.orange, fontFamily: "'Georgia',serif" }}
              >
                {fmt(total)}
              </span>
            </div>
            <Link to="/order">
              <button
                onClick={onCheckout}
                className="w-full py-4 rounded-xl font-bold text-white text-base transition-all duration-200 hover:scale-[1.02]"
                style={{
                  background: `linear-gradient(135deg,${T.orange},${T.orangeD})`,
                  boxShadow: `0 8px 32px ${T.orange}50`,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Proceed to Checkout →
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
export default CartPanel;
