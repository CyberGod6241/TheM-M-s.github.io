import Bokeh from "../Component/Bokeh";
function Hero({ T }) {
  const stats = [
    { val: "12+", label: "Menu Items" },
    { val: "500+", label: "Happy Customers" },
    { val: "30min", label: "Avg. Delivery" },
    { val: "5★", label: "Rating" },
  ];
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-28 pb-20 overflow-hidden gap-6"
      style={{
        background: `linear-gradient(155deg,${T.brown900} 0%,${T.brown800} 50%,${T.brown600} 100%)`,
      }}
    >
      <Bokeh T={T} />

      {/* Promo ribbon */}
      <div
        className="relative z-10 flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-8"
        style={{
          background: `${T.orange}18`,
          border: `1px solid ${T.orange}50`,
          color: T.orange,
        }}
      >
        <span className="animate-pulse">●</span> Now Open on Sundays · Grand
        Opening Promo
      </div>

      {/* Headline */}
      <div className="relative z-10 mb-6">
        <h1
          className="font-black leading-none mb-3"
          style={{
            fontFamily: "'Georgia',serif",
            fontSize: "clamp(3.5rem,14vw,9rem)",
            color: T.orange,
            textShadow: `0 0 100px ${T.orange}55`,
          }}
        >
          Kumchop
        </h1>
        <p
          className="text-white font-light tracking-wide"
          style={{ fontSize: "clamp(1.1rem,3vw,1.6rem)", opacity: 0.8 }}
        >
          Every Taste Feels Good.
        </p>
      </div>

      <p
        className="relative z-10 max-w-lg text-sm leading-relaxed mb-10"
        style={{ color: "rgba(255,255,255,.55)" }}
      >
        Authentic Nigerian cuisine crafted with love, fresh ingredients, and
        time-honoured recipes — delivered hot to your door or ready for pickup.
      </p>

      {/* CTAs */}
      <div className="relative z-10 flex flex-wrap gap-4 justify-center mb-16">
        <a
          href="#menu"
          className="px-8 py-4 rounded-full font-bold text-base text-white transition-all duration-200 hover:scale-105"
          style={{
            background: `linear-gradient(135deg,${T.orange},${T.orangeD})`,
            boxShadow: `0 8px 40px ${T.orange}50`,
          }}
        >
          🍛 Browse Menu
        </a>
        <a
          href="#order"
          className="px-8 py-4 rounded-full font-semibold text-base transition-all duration-200 hover:scale-105"
          style={{ border: `2px solid ${T.orange}`, color: T.orange }}
        >
          📲 Place Order
        </a>
      </div>

      {/* Stats bar */}
      <div
        className="relative z-10 flex flex-wrap justify-center gap-px rounded-2xl overflow-hidden border"
        style={{
          border: `1px solid ${T.orange}20`,
          background: `${T.brown700}30`,
          backdropFilter: "blur(12px)",
        }}
      >
        {stats.map((s, i) => (
          <div
            key={i}
            className="px-8 py-5 text-center"
            style={{
              borderRight:
                i < stats.length - 1 ? `1px solid ${T.orange}15` : "none",
            }}
          >
            <div
              className="text-2xl font-black"
              style={{ color: T.orange, fontFamily: "'Georgia',serif" }}
            >
              {s.val}
            </div>
            <div
              className="text-xs mt-1"
              style={{ color: "rgba(255,255,255,.4)" }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Scroll hint */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce"
        style={{
          color: "rgba(255,255,255,.2)",
          fontSize: ".7rem",
          letterSpacing: ".2em",
        }}
      >
        SCROLL
      </div>
    </section>
  );
}

export default Hero;
