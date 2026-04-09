import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Navbar({ C }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-3 flex items-center justify-between"
      style={{
        background: scrolled ? `${C.brown900}f5` : "transparent",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.orange}30` : "none",
      }}
    >
      {/* Logo */}
      <div className="flex flex-col leading-none">
        <span
          className="text-2xl font-black tracking-tight"
          style={{
            color: C.orange,
            fontFamily: "'Georgia', serif",
            letterSpacing: "-0.02em",
          }}
        >
          Kumchop
        </span>
        <span className="text-[10px] italic" style={{ color: "#f9a96a" }}>
          Every Taste feels Good.
        </span>
      </div>

      {/* CTA */}
      <Link to="/customer">
        <button
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105"
          style={{ background: C.orange, color: "white" }}
        >
          Order Now
        </button>
      </Link>
    </nav>
  );
}
export default Navbar;
