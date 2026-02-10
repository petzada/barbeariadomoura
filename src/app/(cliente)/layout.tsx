import { ClientNav } from "@/components/layout/client-nav";

export default function ClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <ClientNav />
      <main className="flex-1">{children}</main>
    </div>
  );
}
