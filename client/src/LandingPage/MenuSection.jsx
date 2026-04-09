function MenuSection({ C, menuData }) {
  return (
    <section
      id="menu"
      className="py-20 px-4 sm:px-8"
      style={{
        background: `linear-gradient(180deg, ${C.brown900} 0%, #1a0800 100%)`,
      }}
    >
      {/* Section heading */}
      <div className="text-center mb-14">
        <span
          className="inline-block px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
          style={{
            background: `${C.orange}20`,
            color: C.orange,
            border: `1px solid ${C.orange}40`,
          }}
        >
          What We Serve
        </span>
        <h2
          className="text-4xl sm:text-5xl font-black text-white"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          Our Menu
        </h2>
        <p className="mt-3 text-white/50 max-w-md mx-auto text-sm">
          Fresh, flavourful meals made with love — dine in or takeaway.
        </p>
      </div>

      {/* Menu grid */}
      <div className="max-w-5xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {menuData.map((cat) => (
          <div
            key={cat.category}
            className="rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            style={{
              background: `${C.brown800}80`,
              border: `1px solid ${C.orange}20`,
              backdropFilter: "blur(8px)",
            }}
          >
            <h3
              className="text-base font-bold mb-4 pb-3"
              style={{
                color: C.orange,
                borderBottom: `1px solid ${C.orange}25`,
              }}
            >
              {cat.category}
            </h3>
            <ul className="space-y-1.5">
              {cat.items.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-white/80"
                >
                  <span style={{ color: C.orange, fontSize: "10px" }}>◆</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export default MenuSection;
