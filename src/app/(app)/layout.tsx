import { Navigation } from "@/components/navigation/tab-bar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <Navigation />
      <main className="flex-1 pb-20 md:pb-0 md:pt-16">{children}</main>
    </div>
  );
}
