"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageSquare,
  Dumbbell,
  ClipboardList,
  BarChart3,
  User,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { name: "Coach", href: "/coach", icon: MessageSquare },
  { name: "Program", href: "/program", icon: ClipboardList },
  { name: "Track", href: "/track", icon: Dumbbell },
  { name: "Insights", href: "/insights", icon: BarChart3 },
  { name: "Profile", href: "/profile", icon: User },
] as const;

function BrandMark() {
  return (
    <Link href="/coach" className="flex items-center gap-2 select-none">
      <Zap className="h-5 w-5 text-primary" />
      <span className="text-lg font-bold tracking-tight">
        Iron<span className="text-primary">IQ</span>
      </span>
    </Link>
  );
}

export function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop top bar (md+) */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 h-16 items-center border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6">
          <BrandMark />
          <div className="flex items-center gap-1">
            {tabs.map((tab) => {
              const isActive = pathname.startsWith(tab.href);
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile bottom tab bar (below md) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2">
          {tabs.map((tab) => {
            const isActive = pathname.startsWith(tab.href);
            const Icon = tab.icon;
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 py-2 text-xs transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{tab.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

export { Navigation as TabBar };
