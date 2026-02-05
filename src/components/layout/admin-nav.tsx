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
  Home,
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

  if (loading) {
    return <Skeleton className="h-10 w-10 rounded-full" />;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" asChild>
          <Link href="/login">Entrar</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {/* Dropdown Menu Desktop - Apenas Perfil, Configurações e Sair */}
      <div className="hidden lg:block">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar_url || undefined} alt={user.nome} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitials(user.nome)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.nome}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
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
              className="text-destructive focus:text-destructive cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Menu Hamburguer Mobile - Com todos os itens da sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[350px]">
          <SheetHeader>
            <SheetTitle className="text-gradient-gold">Painel Administrativo</SheetTitle>
          </SheetHeader>

          {/* User Info */}
          <div className="flex items-center gap-3 mt-6 pb-4 border-b border-border">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar_url || undefined} alt={user.nome} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(user.nome)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.nome}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-1 mt-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Separator */}
          <div className="border-t border-border my-6" />

          {/* Profile Links */}
          <nav className="flex flex-col gap-1">
            <Link
              href="/perfil"
              onClick={closeMenu}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <User className="h-5 w-5" />
              Meu Perfil
            </Link>
            <Link
              href="/perfil/configuracoes"
              onClick={closeMenu}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <Settings className="h-5 w-5" />
              Configurações
            </Link>
            <Link
              href="/"
              onClick={closeMenu}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <Home className="h-5 w-5" />
              Ver Site
            </Link>
          </nav>

          {/* Logout */}
          <div className="mt-6 pt-6 border-t border-border">
            <Button
              variant="outline"
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={() => {
                handleLogout();
                closeMenu();
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Avatar visível no mobile */}
      <div className="lg:hidden">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.avatar_url || undefined} alt={user.nome} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {getInitials(user.nome)}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
