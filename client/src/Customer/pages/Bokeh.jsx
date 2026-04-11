function Bokeh({ count = 4, T }) {
  const blobs = [
    { w: 300, h: 300, top: "8%", left: "80%", opacity: 0.13 },
    { w: 200, h: 200, top: "65%", left: "3%", opacity: 0.09 },
    { w: 140, h: 140, top: "45%", left: "92%", opacity: 0.07 },
    { w: 100, h: 100, top: "85%", left: "55%", opacity: 0.06 },
  ].slice(0, count);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {blobs.map((b, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: b.w,
            height: b.h,
            top: b.top,
            left: b.left,
            transform: "translate(-50%,-50%)",
            background: T?.orange,
            opacity: b.opacity,
            filter: "blur(72px)",
          }}
        />
      ))}
    </div>
  );
}
export default Bokeh;
