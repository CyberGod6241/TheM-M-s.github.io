function Banner({ C }) {
  return (
    <div
      className="py-5 text-center text-white font-black uppercase tracking-widest text-sm sm:text-base"
      style={{
        background: `linear-gradient(90deg, ${C.brown900}, ${C.orangeD}, ${C.brown900})`,
      }}
    >
      🎊 Kumchop is Now Open on Sundays! 🎊
    </div>
  );
}

export default Banner;
