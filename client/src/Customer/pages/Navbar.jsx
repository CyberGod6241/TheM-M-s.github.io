import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Navbar({ cartCount, onCartClick, T, user, handleLogout }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { label: "Home", href: "#home" },
    { label: "Menu", href: "#menu" },
    { label: "Order", href: "#order" },
    { label: "Contact", href: "#contact" },
  ];

  const UserName = user?.email?.split("@")[0] || "User";

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? `${T.brown900}f2` : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? `1px solid ${T.orange}25` : "none",
      }}
    >
      <div className="max-w-[95rem] mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex flex-col leading-none">
          <span
            className="text-2xl font-black"
            style={{ color: T.orange, fontFamily: "'Georgia',serif" }}
          >
            Kumchop
          </span>
          <span className="text-[10px] italic" style={{ color: "#f9a96a" }}>
            Every Taste feels Good.
          </span>
        </div>

        {/* Desktop links */}
        <ul className="hidden md:flex gap-8 list-none m-0 p-0">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="text-sm font-medium transition-colors duration-200"
                style={{
                  color: "rgba(255,255,255,.65)",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => (e.target.style.color = T.orange)}
                onMouseLeave={(e) =>
                  (e.target.style.color = "rgba(255,255,255,.65)")
                }
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {user && (
            <span
              className="hidden md:inline-block text-xs px-3 py-1 rounded-full"
              style={{ background: `${T.orange}20`, color: T.orange }}
            >
              {UserName}
            </span>
          )}
          <button
            onClick={onCartClick}
            className="relative flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 hover:scale-105"
            style={{
              background: `${T.orange}20`,
              border: `1px solid ${T.orange}40`,
              color: T.orange,
            }}
          >
            🛒 Cart
            {cartCount > 0 && (
              <span
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: T.orange, color: "#fff" }}
              >
                {cartCount}
              </span>
            )}
          </button>
          <Link
            to="/view-order"
            className="hidden md:inline-flex px-5 py-2.5 rounded-full font-bold text-sm text-white transition-all duration-200 hover:scale-105"
            style={{
              background: `linear-gradient(135deg,${T.orange},${T.orangeD})`,
              boxShadow: `0 4px 20px ${T.orange}50`,
            }}
          >
            View Order
          </Link>
          {handleLogout && (
            <button
              onClick={handleLogout}
              className="hidden md:inline-flex px-4 py-2.5 rounded-full font-semibold text-sm transition-all duration-200"
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.4)",
                color: "#ef4444",
              }}
            >
              Logout
            </button>
          )}
          {/* Hamburger */}
          <button
            className="md:hidden text-xl"
            style={{
              color: T.orange,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden px-6 pb-4 flex flex-col gap-3"
          style={{
            background: `${T.brown900}f8`,
            borderTop: `1px solid ${T.orange}20`,
          }}
        >
          {user && (
            <span
              className="py-2 text-xs px-3 rounded-full"
              style={{ background: `${T.orange}20`, color: T.orange }}
            >
              {user.email}
            </span>
          )}
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="py-2 text-base font-medium"
              style={{ color: "rgba(255,255,255,.8)", textDecoration: "none" }}
            >
              {l.label}
            </a>
          ))}
          {handleLogout && (
            <button
              onClick={() => {
                handleLogout();
                setMobileOpen(false);
              }}
              className="py-2 px-3 rounded-full font-semibold text-sm mt-2 transition-all duration-200"
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.4)",
                color: "#ef4444",
              }}
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
