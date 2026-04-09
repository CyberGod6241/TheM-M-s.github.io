function Contact({ T }) {
  const info = [
    {
      icon: "📞",
      label: "Call Us",
      val: "08026875555 / 0803 427 6312",
      href: "tel:08026875555",
    },
    {
      icon: "📧",
      label: "Email",
      val: "hello@kumchop.com",
      href: "mailto:hello@kumchop.com",
    },
    {
      icon: "📍",
      label: "Location",
      val: "Ibadan, Oyo State, Nigeria",
      href: "#",
    },
    { icon: "⏰", label: "Hours", val: "Mon–Sun · 8am – 10pm", href: "#" },
  ];
  return (
    <section
      id="contact"
      className="py-20 px-4 relative overflow-hidden"
      style={{
        background: `${T.brown900}`,
        borderTop: `1px solid ${T.orange}12`,
      }}
    >
      <div className="max-w-5xl mx-auto text-center">
        <span
          className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
          style={{
            background: `${T.orange}18`,
            border: `1px solid ${T.orange}35`,
            color: T.orange,
          }}
        >
          Find Us
        </span>
        <h2
          className="font-black text-white mb-12"
          style={{
            fontFamily: "'Georgia',serif",
            fontSize: "clamp(2rem,4vw,2.8rem)",
          }}
        >
          Get in Touch
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {info.map((c, i) => (
            <a
              key={i}
              href={c.href}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 no-underline"
              style={{
                background: `rgba(92,34,0,.4)`,
                border: `1px solid ${T.orange}18`,
              }}
            >
              <div className="text-3xl">{c.icon}</div>
              <div
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: T.orange }}
              >
                {c.label}
              </div>
              <div
                className="text-sm text-center"
                style={{ color: "rgba(255,255,255,.65)" }}
              >
                {c.val}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Contact;
