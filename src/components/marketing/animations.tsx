"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";

// ── useReveal: fires once when element enters viewport ────────────
export function useReveal(threshold = 0.15): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visible, threshold]);

  return [ref, visible];
}

// ── Reveal: fade + rise when scrolled into view ───────────────────
interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  style?: CSSProperties;
  className?: string;
  as?: ElementType;
}

export function Reveal({
  children,
  delay = 0,
  y = 18,
  duration = 0.9,
  style,
  className,
  as: As = "div",
  ...rest
}: RevealProps) {
  const [ref, visible] = useReveal();
  return (
    <As
      ref={ref}
      className={className}
      {...rest}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : `translateY(${y}px)`,
        transition: `opacity ${duration}s cubic-bezier(.16,.84,.36,1) ${delay}s, transform ${duration}s cubic-bezier(.16,.84,.36,1) ${delay}s`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </As>
  );
}

// ── MountReveal: fade + rise on mount (no scroll needed) ──────────
export function MountReveal({
  children,
  delay = 0,
  y = 18,
  duration = 0.9,
  style,
  className,
  as: As = "div",
  ...rest
}: RevealProps) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 20);
    return () => clearTimeout(t);
  }, []);
  return (
    <As
      className={className}
      {...rest}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : `translateY(${y}px)`,
        transition: `opacity ${duration}s cubic-bezier(.16,.84,.36,1) ${delay}s, transform ${duration}s cubic-bezier(.16,.84,.36,1) ${delay}s`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </As>
  );
}

// ── CountUp: tweens 0 → `to` with ease-out-cubic once visible ────
interface CountUpProps {
  to: number;
  duration?: number;
  format?: (n: number) => string;
}

export function CountUp({ to, duration = 1700, format }: CountUpProps) {
  const [ref, visible] = useReveal(0.3);
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const start = performance.now();
    let raf: number;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(eased * to);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [visible, to, duration]);

  return <span ref={ref as unknown as React.RefObject<HTMLSpanElement>}>{format ? format(n) : Math.round(n)}</span>;
}

// ── PulseDot: glowing dot with breathing ring ─────────────────────
interface PulseDotProps {
  size?: number;
  color?: string;
  style?: CSSProperties;
}

export function PulseDot({ size = 6, color = "#7c6aef", style }: PulseDotProps) {
  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        width: size,
        height: size,
        flexShrink: 0,
        ...style,
      }}
    >
      <span
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 999,
          background: color,
          boxShadow: `0 0 ${size * 2}px ${color}`,
          animation: "ironiq-pulse-dot 1.6s ease-in-out infinite",
        }}
      />
      <span
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 999,
          background: color,
          opacity: 0.6,
          animation: "ironiq-pulse-ring 1.6s ease-out infinite",
        }}
      />
    </span>
  );
}

// ── MarqueeStrip: horizontally scrolling live feature ticker ──────
const TICKER_ITEMS = [
  { live: true,  label: "Live" },
  { label: "RPE auto-adjust" },
  { label: "Tempo deload" },
  { label: "Recovery-aware loading" },
  { label: "Fatigue trend" },
  { label: "Plate calculator" },
  { live: true,  label: "Form coach (beta)" },
  { label: "Block periodization" },
  { label: "1RM estimator" },
  { label: "Auto-progression" },
];

export function MarqueeStrip() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div
      style={{
        borderBottom: "1px solid rgba(217,207,237,0.06)",
        background: "rgba(217,207,237,0.015)",
        overflow: "hidden",
        maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
        WebkitMaskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          whiteSpace: "nowrap",
          padding: "18px 0",
          animation: "ironiq-marquee 48s linear infinite",
        }}
      >
        {items.map((item, i) => (
          <span
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              fontFamily: "ui-monospace, 'SF Mono', monospace",
              fontSize: 11,
              color: item.live ? "#a99afb" : "#7a7585",
              textTransform: "uppercase",
              letterSpacing: "0.16em",
              paddingRight: 48,
            }}
          >
            {item.live && (
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 999,
                  background: "#a99afb",
                  boxShadow: "0 0 10px #a99afb",
                  animation: "ironiq-pulse-dot 1.4s ease-in-out infinite",
                  flexShrink: 0,
                }}
              />
            )}
            {item.label}
            <span style={{ color: "#3a3548", marginLeft: 48 }}>/</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ── AnimatedLineChart: stroke-draws on scroll reveal ─────────────
interface AnimatedLineChartProps {
  data: number[];
  width?: number;
  height?: number;
  padX?: number;
  padY?: number;
}

export function AnimatedLineChart({
  data,
  width: W = 480,
  height: H = 320,
  padX = 20,
  padY = 28,
}: AnimatedLineChartProps) {
  const [ref, visible] = useReveal(0.25);
  const max = Math.max(...data);
  const min = Math.min(...data);

  const pts = data.map((v, i) => ({
    x: padX + (i * (W - padX * 2)) / (data.length - 1),
    y: padY + ((max - v) * (H - padY * 2)) / (max - min),
  }));

  const pathD = pts.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");
  const areaD = `${pathD} L ${pts[pts.length - 1].x} ${H - padY} L ${pts[0].x} ${H - padY} Z`;
  const len = data.length * (W / data.length) * 1.4;
  const last = pts[pts.length - 1];
  const prIndexes = [5, 9, 11].filter((i) => i < pts.length);

  return (
    <svg
      ref={ref as unknown as React.RefObject<SVGSVGElement>}
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: "100%", height: "auto", display: "block", marginTop: 12 }}
    >
      <defs>
        <linearGradient id="alc-grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#7c6aef" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#7c6aef" stopOpacity="0" />
        </linearGradient>
      </defs>

      {[0.25, 0.5, 0.75].map((f) => (
        <line
          key={f}
          x1={padX}
          x2={W - padX}
          y1={padY + f * (H - padY * 2)}
          y2={padY + f * (H - padY * 2)}
          stroke="rgba(217,207,237,0.05)"
          strokeDasharray="2 4"
        />
      ))}

      <path
        d={areaD}
        fill="url(#alc-grad)"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 1.2s ease 0.6s",
        }}
      />

      <path
        d={pathD}
        fill="none"
        stroke="#7c6aef"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: len,
          strokeDashoffset: visible ? 0 : len,
          transition: "stroke-dashoffset 2s cubic-bezier(.16,.84,.36,1)",
        }}
      />

      {/* Breathing dot at last point */}
      <g style={{ opacity: visible ? 1 : 0, transition: "opacity .4s ease 1.8s" }}>
        <circle cx={last.x} cy={last.y} r="14" fill="#7c6aef" opacity="0.18">
          <animate attributeName="r" values="10;18;10" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.28;0.08;0.28" dur="2.4s" repeatCount="indefinite" />
        </circle>
        <circle cx={last.x} cy={last.y} r="5" fill="#7c6aef" stroke="#fafafa" strokeWidth="2" />
      </g>

      {/* PR dots */}
      {prIndexes.map((idx) => (
        <circle
          key={idx}
          cx={pts[idx].x}
          cy={pts[idx].y}
          r="3"
          fill="#fb7185"
          style={{
            opacity: visible ? 1 : 0,
            transition: `opacity .4s ease ${1.2 + prIndexes.indexOf(idx) * 0.2}s`,
          }}
        />
      ))}
    </svg>
  );
}
