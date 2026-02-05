"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Calendar, DollarSign, CalendarOff, Home } from "lucide-react";

const navItems = [
  { href: "/profissional/dashboard", label: "Minha Agenda", icon: Calendar },
  { href: "/profissional/comissoes", label: "Minhas Comissões", icon: DollarSign },
  { href: "/profissional/bloqueios", label: "Bloqueios", icon: CalendarOff },
];

export function ProfessionalSidebar() {
  const pathname = usePathname();

  return (
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
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-primary/10 text-primary font-medium border-l-2 border-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <item.icon className={cn("h-4 w-4", isActive && "text-primary")} />
              {item.label}
            </Link>
          );
        })}
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
  );
}
