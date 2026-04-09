import Bokeh from "./Bokeh";

function OrderCTA({ C }) {
  return (
    <section
      className="py-20 px-6 text-center relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${C.brown700} 0%, ${C.brown900} 100%)`,
      }}
    >
      <Bokeh />
      <div className="relative z-10 max-w-xl mx-auto">
        <h2
          className="text-3xl sm:text-4xl font-black text-white mb-3"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          Ready to Order?
        </h2>
        <p className="text-white/50 mb-8 text-sm">
          Call us or click the link below — we deliver happiness.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="tel:08026875555"
            className="px-8 py-4 rounded-full font-bold text-white text-base transition-all hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${C.orange}, ${C.orangeD})`,
              boxShadow: `0 8px 40px ${C.orange}40`,
            }}
          >
            📞 08026875555
          </a>
          <a
            href="tel:08034276312"
            className="px-8 py-4 rounded-full font-semibold text-base transition-all hover:scale-105"
            style={{ border: `2px solid ${C.orange}`, color: C.orange }}
          >
            📞 0803 427 6312
          </a>
        </div>
      </div>
    </section>
  );
}

export default OrderCTA;
