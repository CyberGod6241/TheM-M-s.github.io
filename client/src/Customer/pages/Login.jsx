// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────

import { Input, Btn } from "../../Admin/components/ui";
import { T } from "../../Admin/constants/theme";
import { Link } from "react-router-dom";

export default function Login({
  setEmail,
  setPassword,
  loading,
  error,
  email,
  password,
  handleKeyDown,
  handleLogin,
}) {
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
            User Dashboard
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{ background: T.card, border: `1px solid ${T.border}` }}
        >
          <h2 className="text-lg font-bold text-white mb-6">Login</h2>

          <div className="space-y-4 mb-6">
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Input
              label="Password"
              type="password"
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

          <Btn onClick={handleLogin} style={{ width: "100%" }}>
            {loading ? "Logging in…" : "Login →"}
          </Btn>

          <p className="text-xs text-center mt-4" style={{ color: T.muted }}>
            Don't have an account?{" "}
            <Link to="/SignUp" style={{ color: T.orange }}>
              <button style={{ color: T.orange }}>Sign up here</button>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
