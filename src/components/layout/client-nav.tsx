"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { UserNav } from "./user-nav";
import {
  Calendar,
  CalendarCheck,
  Crown,
  Home,
  Plus,
  Star,
  User,
} from "lucide-react";

const desktopNavItems = [
  { href: "/dashboard", label: "Inicio", icon: Home },
  { href: "/meus-agendamentos", label: "Agendamentos", icon: CalendarCheck },
  { href: "/feedback", label: "Avaliacoes", icon: Star },
  { href: "/clube", label: "Clube", icon: Crown },
  { href: "/perfil", label: "Perfil", icon: User },
];

const mobileNavItems = [
  { href: "/dashboard", label: "Inicio", icon: Home },
  { href: "/meus-agendamentos", label: "Agenda", icon: CalendarCheck },
  { href: "/clube", label: "Clube", icon: Crown },
  { href: "/perfil", label: "Perfil", icon: User },
];

function isItemActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === href;
  if (href === "/perfil") return pathname === "/perfil" || pathname.startsWith("/perfil/");
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function ClientNav() {
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-black bg-[#013648]/95 backdrop-blur supports-[backdrop-filter]:bg-[#013648]/70">
        <div className="container-app flex h-16 items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Barbearia do Moura"
                className="h-full w-full object-cover"
              />
            </div>
            <span className="hidden text-lg font-bold tracking-tight sm:inline">
              MOURA
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {desktopNavItems.map((item) => {
              const active = isItemActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "border-black bg-[#EAD8AC]/10 text-[#EAD8AC]"
                      : "border-transparent text-[#EAD8AC]/80 hover:border-black hover:bg-black/20 hover:text-[#EAD8AC]"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden text-right leading-tight lg:block">
              <p className="text-xs text-[#EAD8AC]/60">Area do cliente</p>
              <p className="text-sm font-medium">Barbearia do Moura</p>
            </div>
            <UserNav />
          </div>
        </div>
      </header>

      <nav className="safe-area-bottom fixed bottom-0 left-0 right-0 z-50 border-t border-black bg-[#013648]/95 px-4 py-2 backdrop-blur md:hidden">
        <div className="container-app flex items-center justify-between">
          {mobileNavItems.slice(0, 2).map((item) => {
            const active = isItemActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-w-[56px] flex-col items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold transition-colors",
                  active ? "text-[#EAD8AC]" : "text-[#EAD8AC]/50"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <Link
            href="/agendar"
            className={cn(
              "relative -top-4 flex h-14 w-14 items-center justify-center rounded-full border-4 border-[#013648] bg-[#EAD8AC] text-[#013648] shadow-lg transition-transform active:scale-95",
              pathname === "/agendar" && "ring-2 ring-[#EAD8AC]/40"
            )}
            aria-label="Novo agendamento"
          >
            <Plus className="h-6 w-6" />
          </Link>

          {mobileNavItems.slice(2).map((item) => {
            const active = isItemActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-w-[56px] flex-col items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold transition-colors",
                  active ? "text-[#EAD8AC]" : "text-[#EAD8AC]/50"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
