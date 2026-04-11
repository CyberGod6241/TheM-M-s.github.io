// Floating bokeh circles for ambiance
function Bokeh() {
  const circles = [
    { size: 260, top: "5%", left: "75%", opacity: 0.18 },
    { size: 180, top: "60%", left: "5%", opacity: 0.12 },
    { size: 120, top: "40%", left: "90%", opacity: 0.1 },
    { size: 90, top: "80%", left: "50%", opacity: 0.08 },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {circles.map((c, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: c.size,
            height: c.size,
            top: c.top,
            left: c.left,
            transform: "translate(-50%, -50%)",
            // background: C.orange,
            opacity: c.opacity,
            filter: "blur(60px)",
          }}
        />
      ))}
    </div>
  );
}
export default Bokeh;
