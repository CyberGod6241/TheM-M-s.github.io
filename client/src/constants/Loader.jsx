// ─── KumChop Loader — Framer Motion Edition ──────────────────────────────────
//
// Install:  npm install framer-motion
//
// Usage:
//   import Loader from "./components/Loader";
//
//   // Basic
//   {loading && <Loader />}
//
//   // With auto-dismiss after 3 s
//   <Loader onDone={() => setLoading(false)} duration={3000} />
//
//   // Pin a static message
//   <Loader message="Finding restaurants near you…" />
//
// Props:
//   message   string   – overrides the cycling messages
//   onDone    fn       – called when the progress bar completes
//   duration  number   – ms for the progress bar to fill (default 3000)

import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const C = {
  bg: "#0C0400",
  card: "#1C0900",
  orange: "#F97316",
  orangeD: "#EA580C",
  muted: "rgba(255,255,255,0.38)",
};

// ─── Copy ─────────────────────────────────────────────────────────────────────
const MESSAGES = [
  "Cooking something delicious…",
  "Preparing your meal…",
  "Getting your order ready…",
  "Heating up the kitchen…",
  "Almost on your plate…",
];

// ─── Shared spring presets ────────────────────────────────────────────────────
const SPRING = { type: "spring", stiffness: 340, damping: 28 };
const SPRING_SOFT = { type: "spring", stiffness: 180, damping: 22 };

// ─── Variants ─────────────────────────────────────────────────────────────────
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35 } },
  exit: { opacity: 0, transition: { duration: 0.3, ease: "easeIn" } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { ...SPRING_SOFT, staggerChildren: 0.09, delayChildren: 0.04 },
  },
  exit: {
    opacity: 0,
    y: -16,
    scale: 0.97,
    transition: { duration: 0.28, ease: "easeIn" },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: SPRING },
};

const logoVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { ...SPRING_SOFT, delay: 0.08 },
  },
};

const msgVariants = {
  initial: { opacity: 0, y: 7, filter: "blur(5px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.38, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -7,
    filter: "blur(5px)",
    transition: { duration: 0.22, ease: "easeIn" },
  },
};

const cornerVariants = {
  hidden: { opacity: 0, scale: 0.4 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: { ...SPRING, delay: 0.48 + i * 0.06 },
  }),
};

// ─── Corner accent (premium detail) ──────────────────────────────────────────
const CORNERS = [
  {
    top: 14,
    left: 14,
    borderTop: `1.5px solid rgba(249,115,22,0.5)`,
    borderLeft: `1.5px solid rgba(249,115,22,0.5)`,
  },
  {
    top: 14,
    right: 14,
    borderTop: `1.5px solid rgba(249,115,22,0.5)`,
    borderRight: `1.5px solid rgba(249,115,22,0.5)`,
  },
  {
    bottom: 14,
    left: 14,
    borderBottom: `1.5px solid rgba(249,115,22,0.5)`,
    borderLeft: `1.5px solid rgba(249,115,22,0.5)`,
  },
  {
    bottom: 14,
    right: 14,
    borderBottom: `1.5px solid rgba(249,115,22,0.5)`,
    borderRight: `1.5px solid rgba(249,115,22,0.5)`,
  },
];

// ─── Bokeh blob ───────────────────────────────────────────────────────────────
function Blob({ w, top, left, opacity, delay = 0 }) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.18, 1],
        opacity: [opacity, opacity * 1.6, opacity],
      }}
      transition={{
        duration: 5.5 + delay,
        ease: "easeInOut",
        repeat: Infinity,
        delay,
      }}
      style={{
        position: "absolute",
        width: w,
        height: w,
        top,
        left,
        transform: "translate(-50%,-50%)",
        background: C.orange,
        borderRadius: "50%",
        filter: "blur(82px)",
        pointerEvents: "none",
      }}
    />
  );
}

// ─── Orbiting ring ────────────────────────────────────────────────────────────
function Ring({ size, border, duration, ccw = false }) {
  return (
    <motion.div
      animate={{ rotate: ccw ? -360 : 360 }}
      transition={{ duration, ease: "linear", repeat: Infinity }}
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        border,
      }}
    />
  );
}

// ─── Steam wisp ───────────────────────────────────────────────────────────────
function Steam({ x, delay }) {
  return (
    <motion.div
      style={{ position: "absolute", bottom: 52, left: x, originX: "50%" }}
      animate={{ y: [0, -50], opacity: [0, 0.7, 0.3, 0], scaleX: [1, 1.35] }}
      transition={{
        duration: 2.6,
        delay,
        ease: "easeOut",
        repeat: Infinity,
        repeatDelay: 0.15,
      }}
    >
      <svg width="16" height="52" viewBox="0 0 16 52" fill="none">
        <path
          d="M8 50 C2 42 14 34 8 26 C2 18 14 10 8 2"
          stroke={C.orange}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.9"
        />
      </svg>
    </motion.div>
  );
}

// ─── Food bowl ────────────────────────────────────────────────────────────────
function Bowl() {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 3.2, ease: "easeInOut", repeat: Infinity }}
      style={{ position: "relative" }}
    >
      {/* Plate shadow */}
      <motion.div
        animate={{ scaleX: [1, 0.8, 1], opacity: [0.22, 0.1, 0.22] }}
        transition={{ duration: 3.2, ease: "easeInOut", repeat: Infinity }}
        style={{
          position: "absolute",
          bottom: -6,
          left: "50%",
          transform: "translateX(-50%)",
          width: 84,
          height: 13,
          background: C.orange,
          borderRadius: "50%",
          filter: "blur(10px)",
        }}
      />
      <svg width="96" height="70" viewBox="0 0 96 70" fill="none">
        {/* Bowl body */}
        <path
          d="M6 28 Q6 62 48 62 Q90 62 90 28 Z"
          fill={C.card}
          stroke={C.orange}
          strokeWidth="1.5"
        />
        {/* Food */}
        <path
          d="M12 28 Q12 54 48 54 Q84 54 84 28 Z"
          fill={C.orangeD}
          opacity="0.9"
        />
        {/* Sheen */}
        <path
          d="M18 31 Q24 23 38 27 Q44 29 41 35"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="62" cy="38" r="4" fill={C.orange} opacity="0.28" />
        {/* Rim */}
        <path
          d="M2 28 Q2 25.5 48 25.5 Q94 25.5 94 28"
          stroke={C.orange}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Base */}
        <rect
          x="32"
          y="60"
          width="32"
          height="5"
          rx="2.5"
          fill={C.orange}
          opacity="0.38"
        />
        {/* Chopsticks */}
        <line
          x1="56"
          y1="2"
          x2="68"
          y2="42"
          stroke={C.orange}
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.92"
        />
        <line
          x1="64"
          y1="0"
          x2="78"
          y2="40"
          stroke={C.orangeD}
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.85"
        />
      </svg>
    </motion.div>
  );
}

// ─── Bouncing dots ────────────────────────────────────────────────────────────
function Dots() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.18 } } }}
      style={{ display: "flex", gap: 7 }}
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          variants={{
            hidden: { y: 0, opacity: 0.28 },
            visible: {
              y: [0, -8, 0],
              opacity: [0.28, 1, 0.28],
              transition: {
                duration: 1.1,
                ease: "easeInOut",
                repeat: Infinity,
              },
            },
          }}
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: C.orange,
          }}
        />
      ))}
    </motion.div>
  );
}

// ─── Springy progress bar ─────────────────────────────────────────────────────
function ProgressBar({ duration }) {
  const raw = useMotionValue(0);
  const smooth = useSpring(raw, { stiffness: 55, damping: 18 });
  const width = useTransform(smooth, (v) => `${v.toFixed(1)}%`);

  useEffect(() => {
    const TICK = 60;
    const step = 100 / (duration / TICK);
    const timer = setInterval(() => {
      const next = Math.min(raw.get() + step, 100);
      raw.set(next);
      if (next >= 100) clearInterval(timer);
    }, TICK);
    return () => clearInterval(timer);
  }, [duration, raw]);

  return (
    <motion.div
      variants={childVariants}
      style={{
        width: 220,
        height: 3,
        borderRadius: 99,
        background: "rgba(255,255,255,0.07)",
        overflow: "hidden",
      }}
    >
      <motion.div
        style={{
          height: "100%",
          borderRadius: 99,
          width,
          background: `linear-gradient(90deg, ${C.orange}, ${C.orangeD})`,
          boxShadow: `0 0 10px ${C.orange}70`,
        }}
      />
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Loader({ message, onDone, duration = 3000 }) {
  const [msgIdx, setMsgIdx] = useState(0);
  const firedRef = useRef(false);

  // Cycle messages every 1.9 s
  useEffect(() => {
    if (message) return;
    const t = setInterval(
      () => setMsgIdx((i) => (i + 1) % MESSAGES.length),
      1900,
    );
    return () => clearInterval(t);
  }, [message]);

  // Auto-dismiss
  useEffect(() => {
    if (!onDone) return;
    const t = setTimeout(() => {
      if (!firedRef.current) {
        firedRef.current = true;
        onDone();
      }
    }, duration + 320);
    return () => clearTimeout(t);
  }, [onDone, duration]);

  return (
    <AnimatePresence>
      <motion.div
        key="kc-loader"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `radial-gradient(ellipse at 50% 35%, #2a0c00 0%, ${C.bg} 68%)`,
          fontFamily: "'DM Sans', system-ui, sans-serif",
        }}
      >
        {/* Bokeh */}
        <Blob w={300} top="8%" left="80%" opacity={0.11} delay={0} />
        <Blob w={220} top="76%" left="7%" opacity={0.08} delay={1.8} />
        <Blob w={140} top="45%" left="93%" opacity={0.06} delay={3.2} />

        {/* Orbit rings */}
        <Ring
          size={216}
          border={`1.5px solid rgba(249,115,22,0.12)`}
          duration={14}
        />
        <Ring size={216} border={`1.5px solid ${C.orange}`} duration={14} />
        {/* ^ one solid orange segment visible because only 1 border side shows through the transparent rest */}
        <Ring
          size={176}
          border={`1px dashed rgba(249,115,22,0.11)`}
          duration={22}
          ccw
        />

        {/* Card */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 26,
            padding: "44px 52px",
            borderRadius: 28,
            background: "rgba(18,6,0,0.75)",
            border: "1px solid rgba(249,115,22,0.18)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow:
              "0 28px 72px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(249,115,22,0.05)",
            minWidth: 300,
          }}
        >
          {/* Bowl + steam */}
          <motion.div
            variants={childVariants}
            style={{ position: "relative", width: 120, height: 110 }}
          >
            <Steam x={12} delay={0} />
            <Steam x={40} delay={0.78} />
            <Steam x={68} delay={1.52} />
            <Bowl />
          </motion.div>

          {/* Logo */}
          <motion.div
            variants={logoVariants}
            style={{ textAlign: "center", marginTop: -6 }}
          >
            <div
              style={{
                fontFamily: "'Georgia','Times New Roman',serif",
                fontSize: "clamp(2rem,5vw,2.45rem)",
                fontWeight: 900,
                color: C.orange,
                letterSpacing: "-0.025em",
                lineHeight: 1,
                textShadow: `0 0 48px rgba(249,115,22,0.45)`,
              }}
            >
              KumChop
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.55 }}
              style={{
                fontSize: "0.62rem",
                fontStyle: "italic",
                color: "#f9a96a",
                marginTop: 4,
                letterSpacing: "0.05em",
              }}
            >
              Every Taste feels Good.
            </motion.p>
          </motion.div>

          {/* Gradient divider */}
          <motion.div
            variants={childVariants}
            style={{
              width: 130,
              height: 1,
              background:
                "linear-gradient(90deg,transparent,rgba(249,115,22,0.45),transparent)",
            }}
          />

          {/* Message + dots */}
          <motion.div
            variants={childVariants}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
              minHeight: 54,
            }}
          >
            <div style={{ height: 20, display: "flex", alignItems: "center" }}>
              <AnimatePresence mode="wait">
                <motion.p
                  key={message ?? MESSAGES[msgIdx]}
                  variants={msgVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  style={{
                    fontSize: "0.74rem",
                    color: C.muted,
                    letterSpacing: "0.025em",
                    textAlign: "center",
                    margin: 0,
                  }}
                >
                  {message ?? MESSAGES[msgIdx]}
                </motion.p>
              </AnimatePresence>
            </div>
            <Dots />
          </motion.div>

          {/* Progress bar */}
          {onDone && <ProgressBar duration={duration} />}

          {/* Corner accents */}
          {CORNERS.map((style, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cornerVariants}
              initial="hidden"
              animate="visible"
              style={{ position: "absolute", width: 14, height: 14, ...style }}
            />
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
