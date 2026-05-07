import { useState } from "react";
import { T } from "../Admin/constants/theme";

function Notifications({
  notifications,
  setNotifications,
  setNotificationCount,
}) {
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
    setNotificationCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setNotificationCount(0);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: T.text }}>
          Notifications
        </h2>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            style={{
              background: T.orange,
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Mark All Read ({unreadCount})
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div
          className="text-center py-12 rounded-xl"
          style={{ background: T.surface, color: T.muted }}
        >
          <div className="text-4xl mb-4">🔔</div>
          <p className="text-lg font-semibold mb-2">No notifications</p>
          <p>You'll receive updates about your orders here!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.02]"
              style={{
                background: notification.read ? T.surface : `${T.orange}10`,
                border: `1px solid ${notification.read ? T.border : T.orange}30`,
                borderLeft: `4px solid ${notification.read ? T.border : T.orange}`,
              }}
              onClick={() => !notification.read && markAsRead(notification.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold mb-1" style={{ color: T.text }}>
                    {notification.title}
                  </h3>
                  <p style={{ color: T.muted, fontSize: "14px" }}>
                    {notification.message}
                  </p>
                  <p className="text-xs mt-2" style={{ color: T.muted }}>
                    {new Date(notification.createdAt).toLocaleString("en-NG", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {!notification.read && (
                  <div
                    className="w-3 h-3 rounded-full ml-3 mt-1"
                    style={{ background: T.orange }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;
