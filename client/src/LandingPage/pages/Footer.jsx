function Footer({ T }) {
  return (
    <footer
      className="py-10 px-6 text-center"
      style={{ background: T?.brown900, borderTop: `1px solid ${T?.orange}20` }}
    >
      <div
        className="text-2xl font-black mb-1"
        style={{ color: T?.orange, fontFamily: "'Georgia', serif" }}
      >
        Kumchop
      </div>
      <p className="text-white/30 text-xs italic mb-6">
        Every Taste feels Good.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
        {["08026875555", "0803 427 6312"].map((num) => (
          <a
            key={num}
            href={`tel:${num.replace(/\s/g, "")}`}
            className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-105"
            style={{
              background: `${T?.orange}15`,
              color: T?.orange,
              border: `1px solid ${T?.orange}30`,
            }}
          >
            📞 {num}
          </a>
        ))}
      </div>

      <p className="text-white/20 text-xs">
        © {new Date().getFullYear()} Kumchop. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
