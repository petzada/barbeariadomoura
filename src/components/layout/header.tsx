import Link from "next/link";
import { UserNav } from "./user-nav";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface HeaderProps {
  showNav?: boolean;
}

export function Header({ showNav = true }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-app flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-gradient-gold">
            Barbearia do Moura
          </span>
        </Link>

        {/* Navegação Desktop */}
        {showNav && (
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/#servicos"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Serviços
            </Link>
            <Link
              href="/#profissionais"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Profissionais
            </Link>
            <Link
              href="/clube"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Clube
            </Link>
            <Link
              href="/#contato"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Contato
            </Link>
          </nav>
        )}

        {/* Ações */}
        <div className="flex items-center gap-4">
          {showNav && (
            <Button asChild className="hidden sm:inline-flex">
              <Link href="/agendar">Agendar Agora</Link>
            </Button>
          )}

          <UserNav />

          {/* Menu Mobile */}
          {showNav && (
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
