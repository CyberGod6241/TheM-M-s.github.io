import Bokeh from "./Bokeh";

function Hero({ C }) {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-12 overflow-hidden"
      style={{
        background: `linear-gradient(160deg, ${C.brown900} 0%, ${C.brown800} 50%, ${C.brown700} 100%)`,
      }}
    >
      <Bokeh />

      {/* Promo badge */}
      <div
        className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 animate-pulse"
        style={{
          background: `${C.orange}22`,
          border: `1px solid ${C.orange}55`,
          color: C.orange,
        }}
      >
        🎉 Grand Opening Promo — Ending Soon
      </div>

      {/* Main headline */}
      <div className="relative z-10">
        <p className="text-white/60 text-lg mb-1 tracking-wide">Get</p>
        <h1
          className="font-black leading-none mb-2"
          style={{
            fontSize: "clamp(4rem, 18vw, 10rem)",
            color: C.orange,
            textShadow: `0 0 80px ${C.orange}60`,
            fontFamily: "'Georgia', serif",
          }}
        >
          10% OFF
        </h1>
        <h2
          className="font-black uppercase tracking-tight text-white"
          style={{
            fontSize: "clamp(1.8rem, 8vw, 5rem)",
            letterSpacing: "-0.03em",
          }}
        >
          Everything
        </h2>
      </div>

      {/* Food images strip */}
      <div className="relative z-10 flex gap-4 mt-12 mb-10 justify-center flex-wrap">
        {[
          { emoji: "🍛", label: "Jollof Rice", bg: "#8B1A00" },
          { emoji: "🍲", label: "Pounded Yam", bg: "#6B2800" },
          { emoji: "🍝", label: "Stir Spag", bg: "#7A2200" },
          { emoji: "🥧", label: "Chicken Pie", bg: "#5C3A00" },
        ].map((food, i) => (
          <div
            key={i}
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center text-4xl sm:text-5xl shadow-xl border-4 transition-transform duration-300 hover:scale-110 hover:-translate-y-2"
            style={{ background: food.bg, borderColor: C.orange + "55" }}
            title={food.label}
          >
            {food.emoji}
            <span className="text-[9px] text-white/70 font-medium mt-2.5">
              {food.label}
            </span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="relative z-10 flex flex-col sm:flex-row gap-4 items-center">
        <a
          href="tel:08026875555"
          className="px-8 py-4 rounded-full text-base font-bold text-white transition-all duration-200 hover:scale-105 hover:shadow-2xl"
          style={{
            background: `linear-gradient(135deg, ${C.orange}, ${C.orangeD})`,
            boxShadow: `0 8px 40px ${C.orange}50`,
          }}
        >
          Order Now
        </a>
        <a
          href="#menu"
          className="px-8 py-4 rounded-full text-base font-semibold transition-all duration-200 hover:scale-105"
          style={{ border: `2px solid ${C.orange}`, color: C.orange }}
        >
          View Full Menu
        </a>
      </div>
    </section>
  );
}

export default Hero;
