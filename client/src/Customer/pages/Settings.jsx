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
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2
          className="text-2xl font-black text-white"
          style={{ fontFamily: "'Georgia',serif" }}
        >
          Settings
        </h2>
        <p className="text-sm" style={{ color: T.muted }}>
          Manage your profile and account
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b" style={{ borderColor: T.border }}>
        <button
          onClick={() => setActiveTab("profile")}
          className="px-4 py-2 font-semibold text-sm transition-colors"
          style={{
            color: activeTab === "profile" ? T.orange : T.muted,
            borderBottom:
              activeTab === "profile" ? `2px solid ${T.orange}` : "none",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab("password")}
          className="px-4 py-2 font-semibold text-sm transition-colors"
          style={{
            color: activeTab === "password" ? T.orange : T.muted,
            borderBottom:
              activeTab === "password" ? `2px solid ${T.orange}` : "none",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          Password
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          {/* Avatar Section */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
            }}
          >
            <h3 className="text-lg font-bold text-white mb-4">Avatar</h3>
            <div className="flex items-center gap-6">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-5xl cursor-pointer transition-transform hover:scale-110"
                style={{
                  background: `linear-gradient(135deg,${T.orange},${T.orangeD})`,
                }}
                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
              >
                {avatar}
              </div>

              {showAvatarPicker && (
                <div className="flex-1">
                  <p className="text-sm mb-3" style={{ color: T.muted }}>
                    Choose an avatar:
                  </p>
                  <div className="grid grid-cols-6 gap-2">
                    {AVATARS.map((a) => (
                      <button
                        key={a}
                        onClick={() => handleSelectAvatar(a)}
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl transition-all hover:scale-110"
                        style={{
                          background:
                            avatar === a ? `${T.orange}30` : T.surface,
                          border: `2px solid ${avatar === a ? T.orange : T.border}`,
                          cursor: "pointer",
                        }}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs mt-3" style={{ color: T.muted }}>
                    📸 Uploading picture coming soon
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Name Section */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Personal Info</h3>
              {!isEditing && (
                <Btn
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  style={{ padding: "8px 16px" }}
                >
                  Edit
                </Btn>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter first name"
                  />
                  <Input
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter last name"
                  />
                </div>

                <Input
                  label="Email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  placeholder="Email"
                />

                <div className="flex gap-3">
                  <Btn
                    onClick={handleSaveProfile}
                    disabled={loading}
                    style={{ flex: 1 }}
                  >
                    {loading ? "Saving…" : "Save Changes"}
                  </Btn>
                  <Btn variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Btn>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <p className="text-xs" style={{ color: T.muted }}>
                    First Name
                  </p>
                  <p className="text-white font-semibold">{firstName}</p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: T.muted }}>
                    Last Name
                  </p>
                  <p className="text-white font-semibold">{lastName}</p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: T.muted }}>
                    Email
                  </p>
                  <p className="text-white font-semibold">{user?.email}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Password Tab */}
      {activeTab === "password" && (
        <div
          className="rounded-2xl p-6"
          style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
          }}
        >
          <h3 className="text-lg font-bold text-white mb-6">Change Password</h3>

          <div className="space-y-4 max-w-md">
            <Input
              label="Old Password"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter current password"
            />

            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password (min 6 characters)"
            />

            <Input
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />

            {passwordError && (
              <p
                className="text-xs px-3 py-2 rounded-lg"
                style={{ color: T.red, background: "rgba(239,68,68,.1)" }}
              >
                {passwordError}
              </p>
            )}

            <Btn
              onClick={handleChangePassword}
              disabled={loading}
              style={{ width: "100%" }}
            >
              {loading ? "Changing…" : "Change Password"}
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}
