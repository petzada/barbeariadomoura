import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProfessionalNav } from "@/components/layout/professional-nav";
import { Calendar, DollarSign, CalendarOff, Home } from "lucide-react";

const navItems = [
  { href: "/profissional/dashboard", label: "Minha Agenda", icon: Calendar },
  { href: "/profissional/comissoes", label: "Minhas Comissões", icon: DollarSign },
  { href: "/profissional/bloqueios", label: "Bloqueios", icon: CalendarOff },
];

export default async function ProfissionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/profissional/dashboard");
  }

  // Verificar se é barbeiro
  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "barbeiro" && profile?.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link href="/profissional/dashboard" className="text-xl font-bold text-gradient-gold">
            Barbearia do Moura
          </Link>
          <p className="text-xs text-muted-foreground mt-1">Painel do Profissional</p>
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
            <Home className="h-4 w-4" />
            Ver Site
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6">
          <div className="lg:hidden">
            <Link href="/profissional/dashboard" className="text-lg font-bold text-gradient-gold">
              Profissional
            </Link>
          </div>
          <div className="hidden lg:block" />
          <ProfessionalNav />
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
