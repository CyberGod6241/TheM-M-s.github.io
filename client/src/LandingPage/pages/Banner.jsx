function Banner({ T }) {
  return (
    <div
      className="py-5 text-center text-white font-black uppercase tracking-widest text-sm sm:text-base"
      style={{
        background: `linear-gradient(90deg, ${T?.brown900}, ${T?.orangeD}, ${T?.brown900})`,
      }}
    >
      🎊 Kumchop is Now Open on Sundays! 🎊
    </div>
  );
}

export default Banner;
