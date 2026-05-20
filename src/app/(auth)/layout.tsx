export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-dvh items-center justify-center px-4 py-12 overflow-hidden">
      {/* Drifting background orbs */}
      <div
        className="pointer-events-none absolute top-[-20%] left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full opacity-15 blur-[100px]"
        style={{
          background: "oklch(0.623 0.214 259.815)",
          animation: "ironiq-drift 8s ease-in-out infinite",
        }}
      />
      <div
        className="pointer-events-none absolute bottom-[-10%] left-1/4 h-[300px] w-[300px] rounded-full opacity-10 blur-[80px]"
        style={{
          background: "oklch(0.704 0.191 22.216)",
          animation: "ironiq-drift 10s ease-in-out infinite reverse",
        }}
      />

      {/* Hairline grid overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: 0.35,
          backgroundImage:
            "linear-gradient(rgba(217,207,237,0.05) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(217,207,237,0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center, #000 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, #000 30%, transparent 75%)",
        }}
      />

      <div
        className="relative w-full max-w-sm"
        style={{ animation: "ironiq-fade-in .5s ease both" }}
      >
        {children}
      </div>
    </div>
  );
}
