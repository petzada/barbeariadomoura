"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/use-user";
import { cn, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Menu,
  LayoutDashboard,
  Calendar,
  Scissors,
  Users,
  Crown,
  CreditCard,
  PieChart,
  Clock,
  User,
  Settings,
  LogOut,
  Star,
} from "lucide-react";

// Links de navegação do admin
const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/agenda", label: "Agenda", icon: Calendar },
  { href: "/admin/servicos", label: "Serviços", icon: Scissors },
  { href: "/admin/profissionais", label: "Profissionais", icon: Users },
  { href: "/admin/assinantes", label: "Assinantes", icon: Crown },
  { href: "/admin/financeiro", label: "Financeiro", icon: CreditCard },
  { href: "/admin/comissoes", label: "Comissões", icon: PieChart },
  { href: "/admin/feedbacks", label: "Feedbacks", icon: Star },
  { href: "/admin/bloqueios", label: "Bloqueios", icon: Clock },
];

export function AdminNav() {
  const { user, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black bg-[#013648] backdrop-blur ">
      <div className="container-app flex h-14 items-center justify-between">
        {/* Logo */}
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <div className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Barbearia do Moura"
              className="h-full w-full object-cover"
            />
          </div>
          <span className="font-bold text-gradient-gold hidden sm:inline">
            Admin
          </span>
          <span className="font-bold text-gradient-gold sm:hidden">
            Admin
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors",
                  isActive
                    ? "bg-[#013648]/70 text-[#EAD8AC]"
                    : "text-[#EAD8AC] hover:text-[#EAD8AC] hover:bg-[#013648] hover:border-[#EAD8AC]"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Menu Desktop */}
        <div className="hidden lg:flex items-center gap-2">
          {loading ? (
            <Skeleton className="h-8 w-8 rounded-full" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar_url || undefined} alt={user.nome} />
                    <AvatarFallback className="bg-primary text-[#EAD8AC] text-xs">
                      {getInitials(user.nome)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.nome}</p>
                    <p className="text-xs text-[#EAD8AC]">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/perfil">
                      <User className="mr-2 h-4 w-4" />
                      Meu Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/perfil/configuracoes">
                      <Settings className="mr-2 h-4 w-4" />
                      Configurações
                    </Link>
                  </DropdownMenuItem>

                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-[#EAD8AC] focus:text-[#EAD8AC] cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden flex items-center gap-2">
          {loading ? (
            <Skeleton className="h-8 w-8 rounded-full" />
          ) : user ? (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px]">
                <SheetHeader>
                  <SheetTitle className="text-left">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar_url || undefined} alt={user.nome} />
                        <AvatarFallback className="bg-primary text-[#EAD8AC]">
                          {getInitials(user.nome)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.nome}</p>
                        <p className="text-xs text-[#EAD8AC]">{user.email}</p>
                      </div>
                    </div>
                  </SheetTitle>
                </SheetHeader>

                {/* Mobile Nav Links */}
                <nav className="flex flex-col gap-1 mt-6">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href ||
                      pathname.startsWith(item.href + "/");

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMenu}
                        className={cn(
                          "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                          isActive
                            ? "bg-[#013648]/70 text-[#EAD8AC]"
                            : "text-[#EAD8AC] hover:text-[#EAD8AC] hover:bg-[#013648] hover:border-[#EAD8AC]"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>

                {/* Mobile Footer */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="border-t border-black pt-4 space-y-2">
                    <Link
                      href="/perfil/configuracoes"
                      onClick={closeMenu}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#EAD8AC] hover:text-[#EAD8AC] hover:bg-[#013648] hover:border-[#EAD8AC] transition-colors"
                    >
                      <Settings className="h-5 w-5" />
                      Configurações
                    </Link>

                    <button
                      onClick={() => {
                        closeMenu();
                        handleLogout();
                      }}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#EAD8AC] hover:bg-[#EAD8AC]/10 transition-colors w-full"
                    >
                      <LogOut className="h-5 w-5" />
                      Sair
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          ) : null}
        </div>
      </div>
    </header>
  );
}


