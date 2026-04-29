// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────

import { useState } from "react";
import { T } from "../constants/theme";
import { Input, Btn } from "../components/ui";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setError("");
    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }
    setLoading(true);
    // Simulated auth — swap this setTimeout for a real API call.
    setTimeout(() => {
      if (username === "admin" && password === "kumchop2025") {
        onLogin();
      } else {
        setError("Invalid username or password.");
        setLoading(false);
      }
    }, 900);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: `linear-gradient(155deg,${T.bg} 0%,#2d0d00 100%)` }}
    >
      {/* Bokeh glow blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {[
          { w: 280, top: "15%", left: "80%", opacity: 0.12 },
          { w: 200, top: "70%", left: "5%", opacity: 0.08 },
        ].map((b, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: b.w,
              height: b.w,
              top: b.top,
              left: b.left,
              transform: "translate(-50%,-50%)",
              background: T.orange,
              opacity: b.opacity,
              filter: "blur(72px)",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-8">
          <h1
            className="text-5xl font-black mb-1"
            style={{
              color: T.orange,
              fontFamily: "'Georgia',serif",
              textShadow: `0 0 60px ${T.orange}50`,
            }}
          >
            Kumchop
          </h1>
          <p className="text-xs italic" style={{ color: "#f9a96a" }}>
            Admin Dashboard
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{ background: T.card, border: `1px solid ${T.border}` }}
        >
          <h2 className="text-lg font-bold text-white mb-6">Sign In</h2>

          <div className="space-y-4 mb-6">
            <Input
              label="Username"
              type="text"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {error && (
            <p
              className="text-xs mb-4 px-3 py-2 rounded-lg"
              style={{ color: T.red, background: "rgba(239,68,68,.1)" }}
            >
              {error}
            </p>
          )}

          <Btn onClick={handleSubmit} style={{ width: "100%" }}>
            {loading ? "Signing in…" : "Sign In →"}
          </Btn>

          <p className="text-xs text-center mt-4" style={{ color: T.muted }}>
            Demo:
            <span style={{ color: T.orange }}>admin</span>
            <span style={{ color: T.orange }}>kumchop2025</span>
          </p>
        </div>
      </div>
    </div>
  );
}
