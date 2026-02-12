"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/layout/user-nav";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const navLinks = [
  { href: "#servicos", label: "Servicos" },
  { href: "#profissionais", label: "Profissionais" },
  { href: "#precos", label: "Precos" },
  { href: "#contato", label: "Contato" },
];

export function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#013648]/95 backdrop-blur-md border-b border-black shadow-lg"
          : "bg-transparent"
      )}
    >
      <div className="container-landing flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-9 h-9">
            <Image
              src="/logo.png"
              alt="Barbearia do Moura"
              fill
              className="rounded-full object-cover border border-[#EAD8AC]/30"
              sizes="36px"
            />
          </div>
          <span className="font-bold text-[#EAD8AC] hidden sm:inline">
            Barbearia do Moura
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="nav-item px-3 py-2"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <UserNav />
          </div>

          {/* Mobile hamburger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <nav className="flex flex-col gap-1 mt-8">
                {navLinks.map((link) => (
                  <SheetClose key={link.href} asChild>
                    <a
                      href={link.href}
                      className="nav-item px-3 py-3 text-base"
                    >
                      {link.label}
                    </a>
                  </SheetClose>
                ))}
                <div className="mt-6 pt-4 border-t border-black">
                  <UserNav />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
