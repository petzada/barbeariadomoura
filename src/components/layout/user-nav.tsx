"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/use-user";
import { getInitials } from "@/lib/utils";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  Calendar,
  CreditCard,
  Settings,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

export function UserNav() {
  const { user, loading, isAdmin, isBarbeiro } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return <Skeleton className="h-10 w-10 rounded-full" />;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" asChild>
          <Link href="/login">Entrar</Link>
        </Button>
        <Button asChild>
          <Link href="/cadastro">Cadastrar</Link>
        </Button>
      </div>
    );
  }

  return (
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

        {/* Links baseados no role */}
        <DropdownMenuGroup>
          {isAdmin && (
            <DropdownMenuItem asChild>
              <Link href="/admin/dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard Admin
              </Link>
            </DropdownMenuItem>
          )}

          {isBarbeiro && (
            <DropdownMenuItem asChild>
              <Link href="/profissional/dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Minha Agenda
              </Link>
            </DropdownMenuItem>
          )}

          {/* Links exclusivos para clientes (não barbeiros) */}
          {!isBarbeiro && (
            <>
              <DropdownMenuItem asChild>
                <Link href="/meus-agendamentos">
                  <Calendar className="mr-2 h-4 w-4" />
                  Meus Agendamentos
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href="/clube">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Clube do Moura
                </Link>
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuItem asChild>
            <Link href={isBarbeiro ? "/profissional/perfil" : "/perfil"}>
              <User className="mr-2 h-4 w-4" />
              Meu Perfil
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href={isBarbeiro ? "/profissional/perfil/configuracoes" : "/perfil/configuracoes"}>
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
  );
}
