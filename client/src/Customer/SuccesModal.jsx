function SuccessModal({ order, onClose, T, fmt }) {
  if (!order) return null;
  return (
    <>
      <div
        className="fixed inset-0 z-50"
        style={{ background: "rgba(0,0,0,.7)", backdropFilter: "blur(6px)" }}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        <div
          className="w-full max-w-md rounded-3xl p-8 text-center"
          style={{ background: T.brown800, border: `1px solid ${T.orange}30` }}
        >
          <div className="text-6xl mb-4">🎉</div>
          <h2
            className="font-black text-2xl text-white mb-2"
            style={{ fontFamily: "'Georgia',serif" }}
          >
            Order Placed!
          </h2>
          <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,.5)" }}>
            Thank you, <strong style={{ color: T.orange }}>{order.name}</strong>
            ! We'll call you shortly on{" "}
            <strong style={{ color: T.orange }}>{order.phone}</strong>.
          </p>
          <div
            className="rounded-xl p-4 mb-6 text-left"
            style={{
              background: `${T.orange}12`,
              border: `1px solid ${T.orange}25`,
            }}
          >
            <p className="text-sm font-bold mb-2" style={{ color: T.orange }}>
              Order Details
            </p>
            {order.items.map((it, i) => (
              <p
                key={i}
                className="text-xs"
                style={{ color: "rgba(255,255,255,.6)" }}
              >
                {it.emoji} {it.name} × {it.qty} — {fmt(it.price)}
              </p>
            ))}
            <p
              className="text-sm font-bold mt-3 pt-3"
              style={{ color: T.orange, borderTop: `1px solid ${T.orange}20` }}
            >
              Total: {fmt(order.total)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl font-bold text-white"
            style={{
              background: `linear-gradient(135deg,${T.orange},${T.orangeD})`,
              border: "none",
              cursor: "pointer",
            }}
          >
            Continue Browsing
          </button>
        </div>
      </div>
    </>
  );
}

export default SuccessModal;
