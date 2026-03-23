"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageSquare,
  Dumbbell,
  ClipboardList,
  BarChart3,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { name: "Coach", href: "/coach", icon: MessageSquare },
  { name: "Program", href: "/program", icon: ClipboardList },
  { name: "Track", href: "/track", icon: Dumbbell },
  { name: "Insights", href: "/insights", icon: BarChart3 },
  { name: "Profile", href: "/profile", icon: User },
] as const;

export function TabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
  );
}
