"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const leftNavLinks = [
  { href: "#servicos", label: "Serviços" },
  { href: "#profissionais", label: "Profissionais" },
];

const rightNavLinks = [
  { href: "/sobre/clube", label: "Clube" },
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
      <div className="container-landing h-16 md:h-20">
        <div className="md:hidden h-full grid grid-cols-[1fr_auto_1fr] items-center">
          <div />
          <Link href="/" className="relative w-10 h-10 justify-self-center">
            <Image
              src="/logo.png"
              alt="Barbearia do Moura"
              fill
              className="rounded-full object-cover border border-[#EAD8AC]/30"
              sizes="40px"
              priority
            />
          </Link>
          <div className="justify-self-end">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <nav className="flex flex-col gap-1 mt-8">
                  {[...leftNavLinks, ...rightNavLinks].map((link) => (
                    <SheetClose key={link.href} asChild>
                      <Link
                        href={link.href}
                        className="nav-item px-3 py-3 text-base"
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="hidden md:grid h-full grid-cols-[1fr_auto_1fr] items-center">
          <nav className="flex items-center gap-1 justify-end pr-8">
            {leftNavLinks.map((link) => (
              <Link key={link.href} href={link.href} className="nav-item px-3 py-2">
                {link.label}
              </Link>
            ))}
          </nav>

          <Link href="/" className="relative w-12 h-12">
            <Image
              src="/logo.png"
              alt="Barbearia do Moura"
              fill
              className="rounded-full object-cover border border-[#EAD8AC]/35"
              sizes="48px"
            />
          </Link>

          <nav className="flex items-center gap-1 justify-start pl-8">
            {rightNavLinks.map((link) => (
              <Link key={link.href} href={link.href} className="nav-item px-3 py-2">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

