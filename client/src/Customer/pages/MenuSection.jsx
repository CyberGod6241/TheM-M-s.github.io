import { useState, useEffect, useRef } from "react";

function MenuSection({ onAdd, T, MENU, CATEGORIES, fmt, MenuCard }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [visibleIds, setVisibleIds] = useState(new Set());
  const cardRefs = useRef({});

  const filtered =
    activeCategory === "All"
      ? MENU
      : MENU.filter((m) => m.category === activeCategory);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisibleIds(
              (prev) => new Set([...prev, parseInt(e.target.dataset.id)]),
            );
          }
        });
      },
      { threshold: 0.1 },
    );
    Object.values(cardRefs.current).forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, [filtered]);

  return (
    <section
      id="menu"
      className="py-24 px-4"
      style={{
        background: `linear-gradient(180deg,${T.brown900} 0%,#1a0800 100%)`,
      }}
    >
      <div className="text-center mb-12">
        <span
          className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
          style={{
            background: `${T.orange}18`,
            border: `1px solid ${T.orange}35`,
            color: T.orange,
          }}
        >
          What We Serve
        </span>
        <h2
          className="font-black text-white mb-3"
          style={{
            fontFamily: "'Georgia',serif",
            fontSize: "clamp(2rem,5vw,3.2rem)",
          }}
        >
          Our Menu
        </h2>
        <p
          className="text-sm max-w-md mx-auto"
          style={{ color: "rgba(255,255,255,.4)" }}
        >
          Use + / − to set your quantity. Price updates automatically.
        </p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105"
            style={{
              background:
                activeCategory === cat
                  ? `linear-gradient(135deg,${T.orange},${T.orangeD})`
                  : `${T.orange}14`,
              color: activeCategory === cat ? "#fff" : T.orange,
              border: `1px solid ${activeCategory === cat ? "transparent" : `${T.orange}30`}`,
              cursor: "pointer",
              boxShadow:
                activeCategory === cat ? `0 4px 16px ${T.orange}40` : "none",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((item, idx) => (
          <div
            key={item.id}
            data-id={item.id}
            ref={(el) => (cardRefs.current[item.id] = el)}
            style={{ transitionDelay: `${(idx % 4) * 80}ms` }}
          >
            <MenuCard
              item={item}
              onAdd={onAdd}
              visible={visibleIds.has(item.id)}
              T={T}
              fmt={fmt}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default MenuSection;
