"use client";

import { useState } from "react";
import Link from "next/link";
import { UserNav } from "./user-nav";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Scissors, Users, Crown, Phone, Calendar } from "lucide-react";

interface HeaderProps {
  showNav?: boolean;
}

export function Header({ showNav = true }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { href: "/#servicos", label: "Serviços", icon: Scissors },
    { href: "/#profissionais", label: "Profissionais", icon: Users },
    { href: "/clube", label: "Clube", icon: Crown },
    { href: "/#contato", label: "Contato", icon: Phone },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-app flex h-16 items-center justify-between">
        {/* Logo */}
        {/* Logo - Vintage Style */}
        <Link href="/" className="flex items-center gap-2 group">
          {/* Option A: Text based logo mimicking the design */}
          <div className="flex flex-col items-center leading-none select-none">
            <span className="font-vintage text-2xl text-primary tracking-wide drop-shadow-sm group-hover:brightness-110 transition-all">
              Barbearia
            </span>
            <div className="flex items-center gap-2 w-full justify-center">
              <span className="h-[1px] w-3 bg-primary/50 rounded-full"></span>
              <span className="font-vintage text-base text-primary/90 italic -my-1">do</span>
              <span className="h-[1px] w-3 bg-primary/50 rounded-full"></span>
            </div>
            <span className="font-vintage text-3xl text-primary tracking-wider -mt-1 drop-shadow-md group-hover:scale-105 transition-transform duration-300">
              Moura
            </span>
          </div>
        </Link>

        {/* Navegação Desktop */}
        {showNav && (
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Ações */}
        <div className="flex items-center gap-4">
          <UserNav />

          {/* Menu Mobile */}
          {showNav && (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                <SheetHeader>
                  <SheetTitle className="text-gradient-gold text-left">
                    Barbearia do Moura
                  </SheetTitle>
                </SheetHeader>

                {/* Links de Navegação Mobile */}
                <nav className="flex flex-col gap-2 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMenu}
                      className="flex items-center gap-3 px-3 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      <link.icon className="h-5 w-5" />
                      {link.label}
                    </Link>
                  ))}
                </nav>

                {/* Botão de Agendar no Mobile */}
                <div className="mt-8 pt-8 border-t border-border">
                  <Button asChild className="w-full" onClick={closeMenu}>
                    <Link href="/agendar">
                      <Calendar className="mr-2 h-4 w-4" />
                      Agendar Agora
                    </Link>
                  </Button>
                </div>

                {/* Links de Autenticação no Mobile */}
                <div className="mt-4 flex flex-col gap-2">
                  <Button variant="outline" asChild className="w-full" onClick={closeMenu}>
                    <Link href="/login">Entrar</Link>
                  </Button>
                  <Button variant="secondary" asChild className="w-full" onClick={closeMenu}>
                    <Link href="/cadastro">Cadastrar</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
}
