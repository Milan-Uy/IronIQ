import { TabBar } from "@/components/navigation/tab-bar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <main className="flex-1 pb-20">{children}</main>
      <TabBar />
    </div>
  );
}
