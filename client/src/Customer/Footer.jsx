function Footer({ T }) {
  return (
    <footer
      className="py-10 px-6 text-center"
      style={{ background: T.brown900, borderTop: `1px solid ${T.orange}15` }}
    >
      <div
        className="font-black text-2xl mb-1"
        style={{ color: T.orange, fontFamily: "'Georgia',serif" }}
      >
        Kumchop
      </div>
      <p className="text-xs italic mb-6" style={{ color: "#f9a96a" }}>
        Every Taste feels Good.
      </p>
      <p className="text-xs" style={{ color: "rgba(255,255,255,.2)" }}>
        © {new Date().getFullYear()} Kumchop. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
