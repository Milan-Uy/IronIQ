import Link from "next/link";
import {
  MessageSquare,
  ClipboardList,
  Dumbbell,
  BarChart3,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* ── NAV ── */}
      <nav aria-label="Main" className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Iron<span className="text-[#7c6aef]">IQ</span>
        </Link>
        <div className="flex items-center gap-6">
          <a href="#features" className="text-sm text-white/50 hover:text-white transition-colors">
            Features
          </a>
          <Link
            href="/signup"
            className="text-sm font-medium bg-[#7c6aef] hover:bg-[#6b5be0] transition-colors text-white px-5 py-2 rounded-lg"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <main>
      {/* ── HERO ── */}
      <section className="relative text-center px-6 pt-24 pb-20 max-w-3xl mx-auto">
        {/* Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(124,106,239,0.18) 0%, transparent 80%)",
          }}
        />

        {/* Badge */}
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full text-[13px] text-[#a99afb] border border-[#7c6aef]/30 bg-[#7c6aef]/10">
          AI-Powered Strength Coaching
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl font-extrabold leading-[1.1] tracking-tight mb-5">
          Train Smarter with{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #7c6aef, #a78bfa, #c084fc)",
            }}
          >
            Intelligent Coaching
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-lg text-white/50 leading-relaxed mb-10 max-w-xl mx-auto">
          IronIQ combines AI coaching with workout tracking to build programs
          that adapt to your goals, schedule, and progress.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/signup"
            className="px-8 py-3.5 rounded-xl font-semibold text-base bg-[#7c6aef] hover:bg-[#6b5be0] transition-colors text-white"
          >
            Start Training Free
          </Link>
          <a
            href="#features"
            className="px-8 py-3.5 rounded-xl font-medium text-base text-white/70 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="px-6 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Everything You Need</h2>
          <p className="text-white/50 text-base">
            Four tools that work together to level up your training
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              icon: <MessageSquare className="w-5 h-5 text-[#a99afb]" />,
              title: "AI Coach",
              description:
                "Chat with your personal AI coach for form tips, programming advice, and motivation.",
            },
            {
              icon: <ClipboardList className="w-5 h-5 text-[#a99afb]" />,
              title: "Smart Programs",
              description:
                "Choose from proven templates or build custom programs tailored to your goals.",
            },
            {
              icon: <Dumbbell className="w-5 h-5 text-[#a99afb]" />,
              title: "Workout Tracking",
              description:
                "Log sets, reps, and weight with a clean interface designed for the gym floor.",
            },
            {
              icon: <BarChart3 className="w-5 h-5 text-[#a99afb]" />,
              title: "Progress Insights",
              description:
                "Visualize your gains with charts that show volume, strength trends, and streaks.",
            },
          ].map(({ icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-7 hover:border-[#7c6aef]/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-[#7c6aef]/15 flex items-center justify-center mb-4">
                <span aria-hidden="true">{icon}</span>
              </div>
              <h3 className="font-semibold text-base mb-2">{title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="px-6 py-24 max-w-2xl mx-auto text-center">
        <div
          className="rounded-3xl border border-[#7c6aef]/20 p-14"
          style={{
            background:
              "linear-gradient(135deg, rgba(124,106,239,0.12), rgba(192,132,252,0.07))",
          }}
        >
          <h2 className="text-3xl font-bold mb-3">Ready to Train Smarter?</h2>
          <p className="text-white/50 mb-8">
            Join IronIQ and let AI guide your strength journey.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-3.5 rounded-xl font-semibold text-base bg-[#7c6aef] hover:bg-[#6b5be0] transition-colors text-white"
          >
            Get Started — It&apos;s Free
          </Link>
        </div>
      </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/[0.06] px-6 py-8 max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="font-bold text-base">
          Iron<span className="text-[#7c6aef]">IQ</span>
        </Link>
        <span className="text-sm text-white/40">&copy; 2026 IronIQ</span>
      </footer>
    </div>
  );
}
