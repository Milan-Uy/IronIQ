export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-dvh items-center justify-center px-4 py-12 overflow-hidden">
      {/* Background glow effects */}
      <div
        className="pointer-events-none absolute top-[-20%] left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full opacity-15 blur-[100px]"
        style={{ background: "oklch(0.623 0.214 259.815)" }}
      />
      <div
        className="pointer-events-none absolute bottom-[-10%] left-1/4 h-[300px] w-[300px] rounded-full opacity-10 blur-[80px]"
        style={{ background: "oklch(0.704 0.191 22.216)" }}
      />

      <div className="relative w-full max-w-sm">{children}</div>
    </div>
  );
}
