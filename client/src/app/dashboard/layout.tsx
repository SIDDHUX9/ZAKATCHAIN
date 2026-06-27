import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1">
      <Sidebar />
      <main className="flex-1 bg-secondary min-h-[calc(100vh-4rem)]">
        {children}
      </main>
    </div>
  );
}
