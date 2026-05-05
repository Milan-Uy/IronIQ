import Link from "next/link";
import { Zap } from "lucide-react";

// ── Logo mark ──────────────────────────────────────────────────
function LogoMark({ size = 26 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 7,
        background: "linear-gradient(140deg, #7c6aef 0%, #c084fc 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 0 24px rgba(124,106,239,0.5)",
        flexShrink: 0,
      }}
    >
      <Zap
        style={{ fill: "#fff", stroke: "none" }}
        width={Math.round(size * 0.54)}
        height={Math.round(size * 0.54)}
      />
    </div>
  );
}

// ── Hero phone mockup ──────────────────────────────────────────
function HeroProductVisual() {
  const exerciseRows = [
    { s: 1, w: "180", r: "10", e: "7",   done: true },
    { s: 2, w: "200", r: "8",  e: "8",   done: true },
    { s: 3, w: "200", r: "8",  e: "8.5", done: false, active: true },
  ];
  const upNext = [
    { n: "Romanian Deadlift", m: "Hamstrings", c: "#fb923c", s: "3 × 10" },
    { n: "Walking Lunge",     m: "Glutes",     c: "#fb7185", s: "3 × 12" },
    { n: "Leg Curl",          m: "Hamstrings", c: "#fb923c", s: "3 × 12–15" },
  ];

  return (
    <div className="relative flex items-center justify-center" style={{ height: 580 }}>
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          inset: -40,
          background: "radial-gradient(ellipse at center, rgba(124,106,239,0.25) 0%, transparent 60%)",
          filter: "blur(40px)",
        }}
      />

      {/* Phone shell */}
      <div
        style={{
          position: "relative",
          width: 300,
          height: 540,
          borderRadius: 44,
          padding: 4,
          background: "linear-gradient(160deg, rgba(124,106,239,0.6), rgba(60,55,80,0.4))",
          boxShadow: "0 60px 120px -30px rgba(124,106,239,0.5), 0 30px 60px -15px rgba(0,0,0,0.6)",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 40,
            overflow: "hidden",
            background: "#131321",
            padding: "20px 18px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            fontFamily: "var(--font-sans)",
          }}
        >
          {/* Status bar */}
          <div className="flex justify-between items-center px-2 font-mono text-[11px] text-white/40">
            <span>9:41</span>
            <span>● ● ●</span>
          </div>

          {/* Workout header */}
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#a99afb]">
              Today · Week 3 / 8
            </div>
            <div className="text-[18px] font-medium mt-0.5 text-white leading-tight tracking-tight">
              Leg Day<br />Hypertrophy
            </div>
            <div className="font-mono text-[12px] text-white/40 mt-0.5">00:24:18 elapsed</div>
          </div>

          {/* Active exercise card */}
          <div
            style={{
              background: "linear-gradient(135deg, rgba(124,106,239,0.15), rgba(124,106,239,0.05))",
              border: "1px solid rgba(124,106,239,0.3)",
              borderRadius: 14,
              padding: "14px 14px 12px",
            }}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="text-[14px] font-medium text-white">Hack Squat</div>
                <div className="font-mono text-[10px] text-white/40 mt-0.5 tracking-[0.04em]">
                  4 × 8–10 · 120s rest
                </div>
              </div>
              <span
                style={{
                  fontSize: 9,
                  padding: "3px 8px",
                  borderRadius: 999,
                  background: "rgba(251,146,60,0.18)",
                  color: "#fb923c",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontFamily: "var(--font-mono)",
                  whiteSpace: "nowrap",
                }}
              >
                Quads
              </span>
            </div>

            {/* Sets mini table */}
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "auto 1fr 1fr 1fr auto",
                gap: 8,
                alignItems: "center",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
              }}
            >
              {exerciseRows.map((row) => (
                <>
                  <span key={`s-${row.s}`} className="text-white/30">{row.s}</span>
                  <span key={`w-${row.s}`} style={{ color: row.active ? "#fafafa" : "rgba(255,255,255,0.5)" }}>{row.w} lb</span>
                  <span key={`r-${row.s}`} style={{ color: row.active ? "#fafafa" : "rgba(255,255,255,0.5)" }}>{row.r} rep</span>
                  <span key={`e-${row.s}`} style={{ color: row.active ? "#fafafa" : "rgba(255,255,255,0.5)" }}>RPE {row.e}</span>
                  <span
                    key={`c-${row.s}`}
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 4,
                      background: row.done ? "#7c6aef" : (row.active ? "rgba(124,106,239,0.2)" : "transparent"),
                      border: row.done ? "none" : "1px solid rgba(255,255,255,0.18)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: 9,
                    }}
                  >
                    {row.done ? "✓" : ""}
                  </span>
                </>
              ))}
            </div>
          </div>

          {/* Mini coach message */}
          <div
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 12,
              padding: "10px 12px",
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
            }}
          >
            <LogoMark size={22} />
            <div className="text-[12px] text-white/75 leading-relaxed">
              Last set was clean — push 205 on the next one.
            </div>
          </div>

          {/* Up next */}
          <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/30">Up next</div>
          {upNext.map((ex) => (
            <div
              key={ex.n}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 12px",
                borderRadius: 10,
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: ex.c, display: "inline-block" }} />
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}>{ex.n}</span>
              </div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{ex.s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Floating coach bubble — top-right */}
      <div
        style={{
          position: "absolute",
          top: 16,
          right: -8,
          zIndex: 5,
          background: "rgba(20,18,32,0.92)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(124,106,239,0.4)",
          borderRadius: 14,
          padding: "12px 14px",
          maxWidth: 220,
          boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background: "#7c6aef",
              boxShadow: "0 0 10px #7c6aef",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "#a99afb",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
            }}
          >
            Coach
          </span>
        </div>
        <div style={{ fontSize: 12.5, color: "#fafafa", lineHeight: 1.45 }}>
          HRV&apos;s down today — I&apos;m cutting your last lunge set. Don&apos;t worry, we&apos;ll make it up Sunday.
        </div>
      </div>

      {/* Floating PR badge — bottom-left */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: -16,
          zIndex: 5,
          background: "linear-gradient(135deg, #ef5050, #c084fc)",
          borderRadius: 14,
          padding: "10px 14px",
          boxShadow: "0 16px 36px -8px rgba(239,80,80,0.5)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div style={{ fontSize: 18 }}>🔥</div>
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              color: "rgba(255,255,255,0.85)",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
            }}
          >
            New PR
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>Squat · 315 lb</div>
        </div>
      </div>
    </div>
  );
}

// ── Coach moment card ──────────────────────────────────────────
function CoachCard({ time, type, quote }: { time: string; type: string; quote: string }) {
  const typeMap: Record<string, { l: string; c: string }> = {
    adjustment:  { l: "Adjustment",  c: "#a99afb" },
    cue:         { l: "Form cue",    c: "#fbbf24" },
    celebrate:   { l: "PR · win",    c: "#fb7185" },
    programming: { l: "Programming", c: "#34d399" },
  };
  const t = typeMap[type] ?? typeMap.cue;

  return (
    <div
      style={{
        background: "rgba(20,18,32,0.6)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(217,207,237,0.07)",
        borderRadius: 16,
        padding: 22,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        minHeight: 200,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: t.c, display: "inline-block" }} />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: t.c,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
            }}
          >
            {t.l}
          </span>
        </div>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "rgba(255,255,255,0.3)",
            letterSpacing: "0.06em",
          }}
        >
          {time}
        </span>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <LogoMark size={28} />
        <div style={{ fontSize: 14.5, color: "#e6e2ed", lineHeight: 1.5 }}>{quote}</div>
      </div>
    </div>
  );
}

// ── Data showcase: 12-week squat e1RM SVG chart ────────────────
function DataShowcase() {
  const data = [285, 290, 292, 295, 295, 300, 305, 305, 308, 312, 315, 318];
  const max = Math.max(...data);
  const min = Math.min(...data);
  const W = 480, H = 320, padX = 20, padY = 28;
  const pts = data.map((v, i) => ({
    x: padX + (i * (W - padX * 2)) / (data.length - 1),
    y: padY + ((max - v) * (H - padY * 2)) / (max - min),
  }));
  const linePath = pts.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");
  const areaPath = `${linePath} L ${pts[pts.length - 1].x} ${H - padY} L ${pts[0].x} ${H - padY} Z`;
  const prIdxs = [5, 9, 11];

  return (
    <div
      style={{
        position: "relative",
        borderRadius: 20,
        background: "linear-gradient(160deg, rgba(20,18,32,0.9), rgba(15,14,24,0.6))",
        border: "1px solid rgba(217,207,237,0.07)",
        padding: 28,
        boxShadow: "0 40px 80px -30px rgba(0,0,0,0.5)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "#a99afb",
              textTransform: "uppercase",
              letterSpacing: "0.16em",
            }}
          >
            e1RM · Back Squat
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 300,
              color: "#fafafa",
              letterSpacing: "-0.02em",
              fontFamily: "var(--font-mono)",
              marginTop: 4,
              fontFeatureSettings: "'tnum'",
            }}
          >
            318<span style={{ fontSize: 18, color: "rgba(255,255,255,0.4)", marginLeft: 6 }}>lb</span>
          </div>
        </div>
        <div
          style={{
            padding: "5px 10px",
            borderRadius: 999,
            background: "rgba(52,211,153,0.12)",
            color: "#34d399",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            fontWeight: 500,
          }}
        >
          ↑ +33 lb · 12wk
        </div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: "auto", display: "block", marginTop: 12 }}
      >
        <defs>
          <linearGradient id="ds-grad" x1="0" x2="0" y1="0" y2="1">
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
        <path d={areaPath} fill="url(#ds-grad)" />
        <path d={linePath} fill="none" stroke="#7c6aef" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, i) =>
          i === pts.length - 1 ? (
            <g key={`end-${i}`}>
              <circle cx={p.x} cy={p.y} r="14" fill="#7c6aef" opacity="0.18" />
              <circle cx={p.x} cy={p.y} r="5" fill="#7c6aef" stroke="#fafafa" strokeWidth="2" />
            </g>
          ) : null
        )}
        {prIdxs.map((i) => (
          <circle key={`pr-${i}`} cx={pts[i].x} cy={pts[i].y} r="3" fill="#fb7185" />
        ))}
      </svg>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0 4px",
          marginTop: 4,
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          color: "rgba(255,255,255,0.3)",
          letterSpacing: "0.08em",
        }}
      >
        {["W1", "W3", "W5", "W7", "W9", "W11"].map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>

      <div
        style={{
          marginTop: 20,
          paddingTop: 18,
          borderTop: "1px solid rgba(217,207,237,0.06)",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
        }}
      >
        {[
          { l: "Volume / wk", v: "28.6k", d: "lb" },
          { l: "PRs · 8wk",   v: "12",    d: "lifts" },
          { l: "Recovery",    v: "86",     d: "/100" },
        ].map((s) => (
          <div key={s.l}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                color: "rgba(255,255,255,0.3)",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
              }}
            >
              {s.l}
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 22,
                fontWeight: 400,
                color: "#fafafa",
                letterSpacing: "-0.02em",
                marginTop: 2,
                fontFeatureSettings: "'tnum'",
              }}
            >
              {s.v}
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginLeft: 4 }}>{s.d}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main landing page ──────────────────────────────────────────
export default function LandingPage() {
  const coachMoments = [
    { time: "Mon · 06:42", type: "adjustment", quote: "Last bench session was a grinder — RPE 9.5 on your top set. I'm trimming today's volume by 20% and sliding heavy day to Thursday." },
    { time: "Wed · 17:15", type: "cue",        quote: "On RDLs, push your hips back like you're closing a car door with no hands. Bar should drag your shins." },
    { time: "Fri · 21:08", type: "celebrate",  quote: "That's a 5-pound squat PR — third one this block. You've added 30 lb to your top set since February. Keep it locked in." },
    { time: "Sat · 09:00", type: "adjustment", quote: "Sleep was light (5h 12m) and HRV is down 14%. Today's session is now movement quality only. Heavy work moves to Sunday." },
    { time: "Sun · 15:30", type: "programming",quote: "You've hit your hypertrophy block targets. Next 4 weeks pivot to strength: lower reps, longer rest, two big lifts per session." },
    { time: "Mon · 07:00", type: "cue",        quote: "Gym out of 45s? Plate calc says: 45 + 25 + 10 each side gets you to 245. Two sets at 245 instead of three at 250." },
  ];

  const principles = [
    { n: "01", t: "Reads RPE in real time",  d: "Set felt easier than the last? Next set's load nudges up." },
    { n: "02", t: "Watches the week",         d: "Tracks volume, fatigue, and sleep — and dials sessions accordingly." },
    { n: "03", t: "Owns the long arc",        d: "Eight-week blocks with deloads, peaks, and PR windows planned." },
    { n: "04", t: "Speaks gym, not jargon",   d: "Coaching cues land like a real person texting you back." },
  ];

  const signalList = [
    "8-week volume per muscle group with auto-flagged imbalances",
    "Estimated 1RM trends across the big four lifts",
    "Recovery score that blends sleep, soreness, and load history",
    "PR feed — every breakthrough, dated and contextualized",
  ];

  const footerLinks = [
    { h: "Product", l: ["The Coach", "Programs", "Tracking", "Insights"] },
  ];

  return (
    <div
      style={{
        background: "#08080d",
        color: "#f5f5f7",
        fontFamily: "var(--font-sans)",
        minHeight: "100vh",
      }}
    >
      {/* ── NAV ── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(8,8,13,0.72)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(217,207,237,0.05)",
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            padding: "16px 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <LogoMark size={26} />
            <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em", color: "#fafafa" }}>IronIQ</span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 13 }}>
            <span style={{ color: "#a8a3b3" }}>The Coach</span>
            <span style={{ color: "#a8a3b3" }}>Programs</span>
            <span style={{ color: "#a8a3b3", whiteSpace: "nowrap" }}>Field notes</span>
            <Link href="/login" style={{ color: "#a8a3b3", textDecoration: "none", whiteSpace: "nowrap" }}>Sign in</Link>
            <Link
              href="/signup"
              style={{
                fontSize: 13,
                fontWeight: 500,
                background: "#fafafa",
                color: "#08080d",
                padding: "7px 16px",
                borderRadius: 999,
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              Start free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          borderBottom: "1px solid rgba(217,207,237,0.06)",
        }}
      >
        {/* Ambient violet + rose wash */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(50% 60% at 80% 0%, rgba(124,106,239,0.22) 0%, transparent 70%)," +
              "radial-gradient(40% 50% at 10% 80%, rgba(239,80,80,0.10) 0%, transparent 70%)",
          }}
        />
        {/* Hairline grid */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.4,
            pointerEvents: "none",
            backgroundImage:
              "linear-gradient(rgba(217,207,237,0.04) 1px, transparent 1px)," +
              "linear-gradient(90deg, rgba(217,207,237,0.04) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            maskImage: "radial-gradient(ellipse at center, #000 30%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, #000 30%, transparent 80%)",
          }}
        />

        <div
          style={{
            position: "relative",
            maxWidth: 1240,
            margin: "0 auto",
            padding: "72px 28px 96px",
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: 56,
            alignItems: "center",
          }}
        >
          {/* LEFT — copy */}
          <div>
              {/* Headline */}
            <h1
              style={{
                margin: 0,
                fontSize: 92,
                fontWeight: 200,
                lineHeight: 0.96,
                letterSpacing: "-0.045em",
                color: "#fafafa",
              }}
            >
              Train like
              <br />
              you have a
              <br />
              <span style={{ position: "relative", display: "inline-block" }}>
                <span style={{ fontStyle: "italic", fontWeight: 300, color: "#c4b5fd" }}>coach</span>
                <span
                  style={{
                    position: "absolute",
                    left: -2,
                    right: -2,
                    bottom: 6,
                    height: 14,
                    background: "linear-gradient(90deg, #7c6aef, #c084fc)",
                    opacity: 0.25,
                    zIndex: -1,
                    borderRadius: 2,
                  }}
                />
              </span>
              {" "}
              <span style={{ color: "#7c6aef", fontWeight: 400 }}>.</span>
            </h1>

            <p
              style={{
                margin: "32px 0 0",
                maxWidth: 480,
                fontSize: 17,
                color: "#c2bdcc",
                lineHeight: 1.55,
                fontWeight: 400,
              }}
            >
              IronIQ writes your program, watches every set, and rewrites tomorrow before
              you put the bar down.{" "}
              <span style={{ color: "#fafafa" }}>
                It&apos;s the coach you can&apos;t afford, living in your phone.
              </span>
            </p>

            {/* CTAs */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 36 }}>
              <Link
                href="/signup"
                style={{
                  height: 48,
                  padding: "0 22px",
                  borderRadius: 12,
                  fontWeight: 600,
                  fontSize: 15,
                  background: "#7c6aef",
                  color: "#fff",
                  textDecoration: "none",
                  boxShadow: "0 0 0 1px rgba(124,106,239,0.4), 0 12px 32px -8px rgba(124,106,239,0.6)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  whiteSpace: "nowrap",
                }}
              >
                Start your first block →
              </Link>
              <Link
                href="/login"
                style={{
                  height: 48,
                  padding: "0 18px",
                  borderRadius: 12,
                  fontWeight: 500,
                  fontSize: 14,
                  color: "#fafafa",
                  border: "1px solid rgba(217,207,237,0.14)",
                  background: "rgba(217,207,237,0.03)",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  whiteSpace: "nowrap",
                }}
              >
                <span
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 999,
                    background: "#fafafa",
                    color: "#08080d",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 9,
                  }}
                >
                  ▶
                </span>
                Watch a session
              </Link>
            </div>

            {/* Spec strip */}
            <div
              style={{
                marginTop: 56,
                paddingTop: 24,
                borderTop: "1px solid rgba(217,207,237,0.07)",
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 24,
              }}
            >
              {[
                { v: "47k",  l: "Lifters training" },
                { v: "2.3M", l: "Sets logged · last 30d" },
                { v: "+18%", l: "Avg 12-wk strength gain" },
              ].map((s) => (
                <div key={s.l}>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 26,
                      fontWeight: 400,
                      color: "#fafafa",
                      letterSpacing: "-0.02em",
                      fontFeatureSettings: "'tnum'",
                    }}
                  >
                    {s.v}
                  </div>
                  <div style={{ fontSize: 11, color: "#8b8595", marginTop: 4, letterSpacing: "0.04em" }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — product mockup */}
          <HeroProductVisual />
        </div>
      </section>

      {/* ── FEATURE STRIP ── */}
      <div
        style={{
          borderBottom: "1px solid rgba(217,207,237,0.06)",
          background: "rgba(217,207,237,0.015)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            padding: "18px 28px",
            display: "flex",
            alignItems: "center",
            gap: 48,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "#7a7585",
            textTransform: "uppercase",
            letterSpacing: "0.16em",
            flexWrap: "wrap",
          }}
        >
          <span style={{ color: "#a99afb" }}>● Live</span>
          <span>RPE auto-adjust</span>
          <span style={{ color: "#3a3548" }}>/</span>
          <span>Fatigue trend</span>
        </div>
      </div>

      {/* ── §01 PRINCIPLES ── */}
      <section style={{ borderBottom: "1px solid rgba(217,207,237,0.06)" }}>
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            padding: "104px 28px",
            display: "grid",
            gridTemplateColumns: "0.6fr 1fr",
            gap: 80,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "#7c6aef",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                fontWeight: 500,
              }}
            >
              § 01 — Principle
            </div>
            <h2
              style={{
                margin: "16px 0 0",
                fontSize: 56,
                fontWeight: 200,
                lineHeight: 1.0,
                letterSpacing: "-0.035em",
                color: "#fafafa",
              }}
            >
              Plans don&apos;t
              <br />
              build muscle.
              <br />
              <span style={{ fontStyle: "italic", fontWeight: 300, color: "#c4b5fd" }}>Adjustments do.</span>
            </h2>
          </div>
          <div style={{ paddingTop: 24 }}>
            <p style={{ margin: 0, fontSize: 19, lineHeight: 1.55, color: "#d1ccd9", maxWidth: 560 }}>
              A static program is a fossil. Sleep is patchy, motivation drifts, the left
              knee is grumpy this Tuesday. Real coaches read the room and rewrite the
              session.{" "}
              <span style={{ color: "#fafafa", fontWeight: 500 }}>
                So does IronIQ — between every set, every day, every block.
              </span>
            </p>
            <div
              style={{
                marginTop: 40,
                paddingTop: 28,
                borderTop: "1px solid rgba(217,207,237,0.07)",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 32,
              }}
            >
              {principles.map((p) => (
                <div key={p.n}>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: "#7c6aef",
                      letterSpacing: "0.1em",
                      marginBottom: 8,
                    }}
                  >
                    {p.n}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 500, color: "#fafafa", marginBottom: 4 }}>{p.t}</div>
                  <div style={{ fontSize: 13.5, color: "#a8a3b3", lineHeight: 1.55 }}>{p.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── §02 COACH IN ACTION ── */}
      <section
        style={{
          borderBottom: "1px solid rgba(217,207,237,0.06)",
          background: "radial-gradient(60% 80% at 50% 0%, rgba(124,106,239,0.08) 0%, transparent 70%)",
        }}
      >
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "104px 28px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: 56,
              gap: 40,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "#7c6aef",
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                  fontWeight: 500,
                }}
              >
                § 02 — The coach
              </div>
              <h2
                style={{
                  margin: "16px 0 0",
                  fontSize: 56,
                  fontWeight: 200,
                  lineHeight: 1.0,
                  letterSpacing: "-0.035em",
                  color: "#fafafa",
                  maxWidth: 720,
                }}
              >
                Less app,{" "}
                <span style={{ fontStyle: "italic", fontWeight: 300, color: "#c4b5fd" }}>
                  more conversation
                </span>
                .
              </h2>
            </div>
            <div style={{ fontSize: 13, color: "#a8a3b3", maxWidth: 320, textAlign: "right", flexShrink: 0 }}>
              Real moments from the coach surface — pulled, lightly redacted, from a week of training.
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
            }}
          >
            {coachMoments.map((m) => (
              <CoachCard key={m.time} time={m.time} type={m.type} quote={m.quote} />
            ))}
          </div>
        </div>
      </section>

      {/* ── §03 DATA SHOWCASE ── */}
      <section style={{ borderBottom: "1px solid rgba(217,207,237,0.06)" }}>
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            padding: "104px 28px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
            alignItems: "center",
          }}
        >
          <DataShowcase />
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "#7c6aef",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                fontWeight: 500,
              }}
            >
              § 03 — The signal
            </div>
            <h2
              style={{
                margin: "16px 0 0",
                fontSize: 56,
                fontWeight: 200,
                lineHeight: 1.0,
                letterSpacing: "-0.035em",
                color: "#fafafa",
              }}
            >
              See the{" "}
              <span style={{ fontStyle: "italic", fontWeight: 300, color: "#c4b5fd" }}>signal</span>.
              <br />
              Skip the noise.
            </h2>
            <p style={{ marginTop: 28, fontSize: 17, color: "#c2bdcc", lineHeight: 1.55, maxWidth: 480 }}>
              Strength trends, volume per muscle group, recovery score, PR cadence —
              the numbers that actually move your training. No vanity metrics, no
              step-counter graveyard.
            </p>
            <ul style={{ marginTop: 28, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 14 }}>
              {signalList.map((t, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: 14.5, color: "#d1ccd9" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: "#7c6aef",
                      marginTop: 4,
                      flexShrink: 0,
                      width: 18,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── BIG CTA STRIP ── */}
      <section>
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            padding: "104px 28px 120px",
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 64,
            alignItems: "end",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 96,
              fontWeight: 200,
              lineHeight: 0.92,
              letterSpacing: "-0.045em",
              color: "#fafafa",
            }}
          >
            Show up.
            <br />
            We&apos;ll handle
            <br />
            <span style={{ fontStyle: "italic", fontWeight: 300, color: "#c4b5fd" }}>the rest</span>
            <span style={{ color: "#7c6aef" }}>.</span>
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 280 }}>
            <Link
              href="/signup"
              style={{
                height: 56,
                borderRadius: 14,
                fontWeight: 600,
                fontSize: 16,
                background: "#fafafa",
                color: "#08080d",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              Start training free →
            </Link>
            <Link
              href="/login"
              style={{
                height: 56,
                borderRadius: 14,
                fontWeight: 500,
                fontSize: 15,
                background: "transparent",
                color: "#fafafa",
                border: "1px solid rgba(217,207,237,0.14)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          borderTop: "1px solid rgba(217,207,237,0.06)",
          background: "rgba(217,207,237,0.015)",
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            padding: "48px 28px 32px",
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr",
            gap: 40,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <LogoMark size={22} />
              <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em", color: "#fafafa" }}>IronIQ</span>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: "#8b8595", lineHeight: 1.55, maxWidth: 280 }}>
              The coach you can&apos;t afford, in your phone. Built by lifters in Brooklyn, Oakland, and Berlin.
            </p>
          </div>
          {footerLinks.map((col) => (
            <div key={col.h}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "#a99afb",
                  textTransform: "uppercase",
                  letterSpacing: "0.16em",
                  marginBottom: 14,
                }}
              >
                {col.h}
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                {col.l.map((x) => (
                  <li key={x} style={{ fontSize: 13.5, color: "#c2bdcc" }}>{x}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            padding: "16px 28px 32px",
            borderTop: "1px solid rgba(217,207,237,0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 12,
            color: "#7a7585",
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.04em",
          }}
        >
          <span>© 2026 IRONIQ INC. — ALL RIGHTS RESERVED.</span>
        </div>
      </footer>
    </div>
  );
}
