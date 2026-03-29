interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: { svg: 32, text: "text-lg" },
  md: { svg: 48, text: "text-2xl" },
  lg: { svg: 64, text: "text-4xl" },
};

export function Logo({ size = "md", className = "" }: LogoProps) {
  const { svg, text } = sizes[size];

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="relative">
        {/* Glow effect behind logo */}
        <div
          className="absolute inset-0 blur-2xl opacity-40 rounded-full"
          style={{ background: "oklch(0.623 0.214 259.815)" }}
        />
        <svg
          width={svg}
          height={svg}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative"
        >
          {/* Barbell bar */}
          <rect
            x="8"
            y="29"
            width="48"
            height="6"
            rx="3"
            fill="currentColor"
            className="text-primary"
          />

          {/* Left weight plates */}
          <rect
            x="6"
            y="18"
            width="8"
            height="28"
            rx="3"
            fill="currentColor"
            className="text-primary"
          />
          <rect
            x="12"
            y="22"
            width="5"
            height="20"
            rx="2.5"
            fill="currentColor"
            className="text-primary/70"
          />

          {/* Right weight plates */}
          <rect
            x="50"
            y="18"
            width="8"
            height="28"
            rx="3"
            fill="currentColor"
            className="text-primary"
          />
          <rect
            x="47"
            y="22"
            width="5"
            height="20"
            rx="2.5"
            fill="currentColor"
            className="text-primary/70"
          />

          {/* Brain circuit dots — representing IQ */}
          <circle cx="28" cy="26" r="2" className="text-primary-foreground" fill="currentColor" />
          <circle cx="36" cy="26" r="2" className="text-primary-foreground" fill="currentColor" />
          <circle cx="32" cy="22" r="1.5" className="text-primary-foreground" fill="currentColor" />
          <circle cx="32" cy="30" r="1.5" className="text-primary-foreground" fill="currentColor" />

          {/* Circuit lines */}
          <line x1="28" y1="26" x2="32" y2="22" stroke="currentColor" strokeWidth="1" className="text-primary-foreground" opacity="0.6" />
          <line x1="36" y1="26" x2="32" y2="22" stroke="currentColor" strokeWidth="1" className="text-primary-foreground" opacity="0.6" />
          <line x1="28" y1="26" x2="32" y2="30" stroke="currentColor" strokeWidth="1" className="text-primary-foreground" opacity="0.6" />
          <line x1="36" y1="26" x2="32" y2="30" stroke="currentColor" strokeWidth="1" className="text-primary-foreground" opacity="0.6" />
        </svg>
      </div>
      <h1 className={`${text} font-bold tracking-tight`}>
        Iron<span className="text-primary">IQ</span>
      </h1>
    </div>
  );
}
