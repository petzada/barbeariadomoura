import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { UserNav } from "@/components/layout/user-nav";
import {
  LayoutDashboard,
  Calendar,
  Scissors,
  Users,
  CreditCard,
  PieChart,
  Settings,
  Crown,
  Clock,
} from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/agenda", label: "Agenda", icon: Calendar },
  { href: "/admin/servicos", label: "Serviços", icon: Scissors },
  { href: "/admin/profissionais", label: "Profissionais", icon: Users },
  { href: "/admin/assinantes", label: "Assinantes", icon: Crown },
  { href: "/admin/financeiro", label: "Financeiro", icon: CreditCard },
  { href: "/admin/comissoes", label: "Comissões", icon: PieChart },
  { href: "/admin/bloqueios", label: "Bloqueios", icon: Clock },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/admin/dashboard");
  }

  // Verificar se é admin
  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link href="/admin/dashboard" className="text-xl font-bold text-gradient-gold">
            Barbearia do Moura
          </Link>
          <p className="text-xs text-muted-foreground mt-1">Painel Administrativo</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <Settings className="h-4 w-4" />
            Ver Site
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6">
          <div className="lg:hidden">
            <Link href="/admin/dashboard" className="text-lg font-bold text-gradient-gold">
              Admin
            </Link>
          </div>
          <div className="hidden lg:block" />
          <UserNav />
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
