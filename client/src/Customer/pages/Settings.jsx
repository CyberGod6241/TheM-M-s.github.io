import { useState } from "react";
import { Btn, Input } from "../../Admin/components/ui";
import { updateUserProfile, changePassword } from "../../utils/api";

const AVATARS = [
  "👨",
  "👩",
  "👨‍🍳",
  "👩‍🍳",
  "🧑",
  "👨‍💼",
  "👩‍💼",
  "😊",
  "😌",
  "🥸",
  "👴",
  "👵",
];

export default function CustomerSettings({
  user,
  onUpdateProfile,
  showToast,
  T,
  onLogout,
}) {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  // Profile form state
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [avatar, setAvatar] = useState(user?.avatar || "👨");

  // Password form state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // ── Profile handlers ──────────────────────────────────────────────────
  const handleSaveProfile = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      showToast("First name and last name are required", "error");
      return;
    }

    setLoading(true);
    try {
      await updateUserProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        avatar,
      });
      onUpdateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        avatar,
      });
      showToast("✅ Profile updated successfully!", "success");
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      showToast("❌ Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAvatar = (selectedAvatar) => {
    setAvatar(selectedAvatar);
    setShowAvatarPicker(false);
  };

  // ── Password handlers ─────────────────────────────────────────────────
  const handleChangePassword = async () => {
    setPasswordError("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (oldPassword === newPassword) {
      setPasswordError("New password must be different from old password");
      return;
    }

    setLoading(true);
    try {
      await changePassword(oldPassword, newPassword);
      showToast("✅ Password changed successfully!", "success");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Failed to change password:", error);
      setPasswordError(
        error.message || "Failed to change password. Check your old password.",
      );
      showToast("❌ Failed to change password", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-6xl">
      {/* Header */}
      <div>
        <h1
          className="text-3xl font-black text-white mb-2"
          style={{ fontFamily: "'Georgia',serif" }}
        >
          Settings
        </h1>
        <p className="text-sm" style={{ color: T.muted }}>
          Manage your profile and security
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Avatar */}
        <div
          className="lg:col-span-1 rounded-3xl p-8"
          style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
          }}
        >
          <div className="text-center">
            {/* Large Avatar Display */}
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center text-7xl mx-auto mb-6 cursor-pointer transition-transform hover:scale-105"
              style={{
                background: `linear-gradient(135deg,${T.orange},${T.orangeD})`,
              }}
              onClick={() => setShowAvatarPicker(!showAvatarPicker)}
            >
              {avatar}
            </div>

            <p
              className="text-sm font-semibold mb-6"
              style={{ color: T.orange }}
            >
              Update Avatar
            </p>

            {/* Avatar Grid */}
            <div className="grid grid-cols-3 gap-3">
              {AVATARS.map((a) => (
                <button
                  key={a}
                  onClick={() => handleSelectAvatar(a)}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all"
                  style={{
                    background: avatar === a ? `${T.orange}30` : T.surface,
                    border: `2px solid ${avatar === a ? T.orange : T.border}`,
                    cursor: "pointer",
                  }}
                >
                  {a}
                </button>
              ))}
            </div>

            <p className="text-xs mt-6" style={{ color: T.muted }}>
              📸 Uploading picture coming soon
            </p>
          </div>
        </div>

        {/* Right Column - Profile Settings */}
        <div
          className="lg:col-span-2 rounded-3xl p-8"
          style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
          }}
        >
          <h3
            className="text-xl font-black text-white mb-6"
            style={{ fontFamily: "'Georgia',serif" }}
          >
            Profile Settings
          </h3>

          <div className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-white block mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter first name"
                  className="w-full px-4 py-2 rounded-xl text-white text-sm"
                  style={{
                    background: `${T.orange}15`,
                    border: `1px solid ${T.orange}30`,
                    color: "#fff",
                  }}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-white block mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter last name"
                  className="w-full px-4 py-2 rounded-xl text-white text-sm"
                  style={{
                    background: `${T.orange}15`,
                    border: `1px solid ${T.orange}30`,
                    color: "#fff",
                  }}
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="text-xs font-semibold text-white block mb-2">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                placeholder="Email"
                className="w-full px-4 py-2 rounded-xl text-sm"
                style={{
                  background: `${T.orange}10`,
                  border: `1px solid ${T.border}`,
                  color: T.muted,
                }}
              />
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveProfile}
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white transition-all mt-6"
              style={{
                background: loading
                  ? `${T.orange}50`
                  : `linear-gradient(135deg,${T.orange},${T.orangeD})`,
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      {/* Change Password Section */}
      <div
        className="rounded-3xl p-8"
        style={{
          background: T.surface,
          border: `1px solid ${T.border}`,
        }}
      >
        <h3
          className="text-xl font-black text-white mb-6"
          style={{ fontFamily: "'Georgia',serif" }}
        >
          Change Password
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <label className="text-xs font-semibold text-white block mb-2">
              Old Password
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full px-4 py-2 rounded-xl text-white text-sm"
              style={{
                background: `${T.orange}15`,
                border: `1px solid ${T.orange}30`,
                color: "#fff",
              }}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-white block mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min. 8 characters"
              className="w-full px-4 py-2 rounded-xl text-white text-sm"
              style={{
                background: `${T.orange}15`,
                border: `1px solid ${T.orange}30`,
                color: "#fff",
              }}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-white block mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Min. 8 characters"
              className="w-full px-4 py-2 rounded-xl text-white text-sm"
              style={{
                background: `${T.orange}15`,
                border: `1px solid ${T.orange}30`,
                color: "#fff",
              }}
            />
          </div>
        </div>

        {passwordError && (
          <p
            className="text-xs px-4 py-3 rounded-xl mt-6"
            style={{ color: T.red, background: "rgba(239,68,68,.1)" }}
          >
            {passwordError}
          </p>
        )}

        <button
          onClick={handleChangePassword}
          disabled={loading}
          className="w-full py-3 rounded-xl font-bold text-white transition-all mt-6"
          style={{
            background: loading
              ? `${T.orange}50`
              : `linear-gradient(135deg,${T.orange},${T.orangeD})`,
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Changing..." : "Change Password"}
        </button>
      </div>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="w-full py-3 rounded-xl font-bold transition-all"
        style={{
          background: `${T.red}20`,
          color: T.red,
          border: `1px solid ${T.red}40`,
          cursor: "pointer",
        }}
      >
        Log Out
      </button>
    </div>
  );
}
