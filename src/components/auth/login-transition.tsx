"use client";

import { useEffect, useState } from "react";

const MONO = "ui-monospace, 'SF Mono', 'JetBrains Mono', monospace";

const AUTH_STEPS = [
  { label: "AUTHENTICATING",           value: "OK" },
  { label: "RECOVERY · SLEEP · HRV",   value: "86 / 100" },
  { label: "FETCHING TODAY'S SESSION", value: "WK 3 / 8" },
  { label: "WARMING UP THE COACH",     value: "READY" },
];

// Total duration: 350 + 4×520 = 2430ms for steps, then +350 for done, +1100 for onComplete
const STEP_DELAY = 350;
const STEP_INTERVAL = 520;

interface LoginTransitionProps {
  onComplete: () => void;
}

export function LoginTransition({ onComplete }: LoginTransitionProps) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    AUTH_STEPS.forEach((_, i) => {
      timers.push(setTimeout(() => setStep(i + 1), STEP_DELAY + i * STEP_INTERVAL));
    });

    const doneAt = STEP_DELAY + AUTH_STEPS.length * STEP_INTERVAL + STEP_DELAY;
    timers.push(setTimeout(() => setDone(true), doneAt));
    timers.push(setTimeout(() => onComplete(), doneAt + 1100));

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const totalMs = STEP_DELAY + AUTH_STEPS.length * STEP_INTERVAL;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "#08080d",
        color: "#fafafa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "ironiq-fade-in .35s ease both",
        overflow: "hidden",
      }}
    >
      {/* Ambient violet + red washes */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(50% 60% at 50% 30%, rgba(124,106,239,0.28) 0%, transparent 70%)," +
            "radial-gradient(40% 50% at 20% 80%, rgba(239,80,80,0.08) 0%, transparent 70%)",
          animation: "ironiq-drift 8s ease-in-out infinite",
        }}
      />

      {/* Hairline grid */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.35,
          pointerEvents: "none",
          backgroundImage:
            "linear-gradient(rgba(217,207,237,0.05) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(217,207,237,0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center, #000 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, #000 30%, transparent 75%)",
        }}
      />

      {/* Scanline sweep */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: 2,
          background: "linear-gradient(90deg, transparent, rgba(124,106,239,0.6), transparent)",
          boxShadow: "0 0 24px rgba(124,106,239,0.6)",
          animation: "ironiq-scan 2.6s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          textAlign: "center",
          width: "100%",
          maxWidth: 460,
          padding: "0 24px",
        }}
      >
        {/* IQ zap glyph with orbit rings */}
        <div
          style={{
            position: "relative",
            width: 132,
            height: 132,
            margin: "0 auto 40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Outer dashed orbit */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "1px dashed rgba(124,106,239,0.35)",
              animation: "ironiq-ring-spin 6s linear infinite",
            }}
          />
          {/* Inner solid orbit */}
          <div
            style={{
              position: "absolute",
              inset: 12,
              borderRadius: "50%",
              border: "1px solid rgba(124,106,239,0.18)",
              animation: "ironiq-ring-spin 8s linear infinite reverse",
            }}
          />
          {/* Radial glow */}
          <div
            style={{
              position: "absolute",
              inset: -8,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(124,106,239,0.35), transparent 70%)",
              filter: "blur(10px)",
              animation: "ironiq-zap-charge 1.8s ease-in-out infinite",
            }}
          />
          {/* Zap SVG */}
          <svg
            width="56"
            height="56"
            viewBox="0 0 24 24"
            fill="#7c6aef"
            stroke="#7c6aef"
            strokeWidth="1"
            strokeLinejoin="round"
            style={{
              position: "relative",
              animation: "ironiq-zap-charge 1.8s ease-in-out infinite",
            }}
          >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>

        {/* Status text */}
        <div
          style={{
            fontFamily: MONO,
            fontSize: 11,
            color: "#a99afb",
            textTransform: "uppercase",
            letterSpacing: "0.22em",
            marginBottom: 8,
          }}
        >
          {done ? "Welcome back" : "Signing you in"}
        </div>
        <div
          style={{
            fontSize: 26,
            fontWeight: 300,
            letterSpacing: "-0.02em",
            color: "#fafafa",
            marginBottom: 36,
          }}
        >
          {done ? "You're in." : "Reading the room…"}
        </div>

        {/* CLI diagnostic lines */}
        <div
          style={{
            maxWidth: 380,
            margin: "0 auto 28px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            textAlign: "left",
          }}
        >
          {AUTH_STEPS.map((s, i) => {
            const active = step === i;
            const past = step > i;
            const show = step >= i;
            return (
              <div
                key={s.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  fontFamily: MONO,
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  color: past ? "#d1ccd9" : active ? "#fafafa" : "#3a3548",
                  opacity: show ? 1 : 0.25,
                  transition: "color .3s ease, opacity .3s ease",
                }}
              >
                <span
                  style={{
                    width: 14,
                    height: 14,
                    flexShrink: 0,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {past ? (
                    <span style={{ color: "#34d399" }}>✓</span>
                  ) : active ? (
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        border: "1.5px solid #7c6aef",
                        borderTopColor: "transparent",
                        animation: "ironiq-spinner .8s linear infinite",
                        display: "inline-block",
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: 999,
                        background: "#3a3548",
                        display: "inline-block",
                      }}
                    />
                  )}
                </span>
                <span style={{ flex: 1, textTransform: "uppercase" }}>{s.label}</span>
                <span
                  style={{
                    color: past ? "#a99afb" : "#3a3548",
                    fontVariantNumeric: "tabular-nums",
                    opacity: past ? 1 : 0,
                    transition: "opacity .3s ease",
                  }}
                >
                  {s.value}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div
          style={{
            position: "relative",
            height: 2,
            borderRadius: 999,
            overflow: "hidden",
            background: "rgba(217,207,237,0.08)",
            maxWidth: 380,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              transformOrigin: "0 50%",
              background: "linear-gradient(90deg, #7c6aef, #c084fc)",
              boxShadow: "0 0 16px rgba(124,106,239,0.6)",
              animation: `ironiq-bar-grow ${totalMs}ms cubic-bezier(.4,0,.2,1) both`,
            }}
          />
        </div>

        <div
          style={{
            marginTop: 28,
            fontFamily: MONO,
            fontSize: 10,
            color: "#5a5468",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          IronIQ · secure handshake
        </div>
      </div>
    </div>
  );
}
