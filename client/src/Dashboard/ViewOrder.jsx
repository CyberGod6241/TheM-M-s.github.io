function ViewOrder({ orders, T }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return T.orange;
      case "Confirmed":
        return "#10b981";
      case "Preparing":
        return "#3b82f6";
      case "Ready":
        return "#8b5cf6";
      case "Delivered":
        return "#059669";
      case "Cancelled":
        return T.red;
      default:
        return T.muted;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: T.text }}>
          My Orders
        </h2>
        <div className="text-sm" style={{ color: T.muted }}>
          {orders.length} order{orders.length !== 1 ? "s" : ""}
        </div>
      </div>

      {orders.length === 0 ? (
        <div
          className="text-center py-12 rounded-xl"
          style={{ background: T.surface, color: T.muted }}
        >
          <div className="text-4xl mb-4">🧾</div>
          <p className="text-lg font-semibold mb-2">No orders yet</p>
          <p>Place your first order to see it here!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl p-6"
              style={{ background: T.surface, border: `1px solid ${T.border}` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: T.text }}
                  >
                    Order #{order.id.slice(-8)}
                  </h3>
                  <p className="text-sm" style={{ color: T.muted }}>
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <div
                    className="px-3 py-1 rounded-full text-sm font-semibold"
                    style={{
                      background: `${getStatusColor(order.status)}20`,
                      color: getStatusColor(order.status),
                    }}
                  >
                    {order.status}
                  </div>
                  <p
                    className="text-sm font-bold mt-1"
                    style={{ color: T.text }}
                  >
                    ₦{order.totalAmount?.toLocaleString() || "0"}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <h4 className="font-semibold" style={{ color: T.text }}>
                  Items:
                </h4>
                {order.cartItems?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center py-2 px-3 rounded"
                    style={{ background: T.bg }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{item.emoji || "🍽️"}</span>
                      <div>
                        <p className="font-medium" style={{ color: T.text }}>
                          {item.name}
                        </p>
                        <p className="text-sm" style={{ color: T.muted }}>
                          Qty: {item.quantity} × ₦{item.unitPrice}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold" style={{ color: T.text }}>
                      ₦{item.subtotal?.toLocaleString() || "0"}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold" style={{ color: T.text }}>
                    Delivery:
                  </span>{" "}
                  <span style={{ color: T.muted }}>
                    {order.deliveryType === "delivery" ? "Delivery" : "Pickup"}
                  </span>
                </div>
                <div>
                  <span className="font-semibold" style={{ color: T.text }}>
                    Phone:
                  </span>{" "}
                  <span style={{ color: T.muted }}>{order.phone}</span>
                </div>
                {order.address && (
                  <div className="col-span-2">
                    <span className="font-semibold" style={{ color: T.text }}>
                      Address:
                    </span>{" "}
                    <span style={{ color: T.muted }}>{order.address}</span>
                  </div>
                )}
                {order.note && (
                  <div className="col-span-2">
                    <span className="font-semibold" style={{ color: T.text }}>
                      Note:
                    </span>{" "}
                    <span style={{ color: T.muted }}>{order.note}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewOrder;
