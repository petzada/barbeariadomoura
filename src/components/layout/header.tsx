"use client";

import Link from "next/link";
import { getWhatsAppLink } from "@/lib/utils";
import { UserNav } from "./user-nav";
import { Scissors, Users, Crown, Phone } from "lucide-react";

interface HeaderProps {
  showNav?: boolean;
}

export function Header({ showNav = true }: HeaderProps) {
  const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5511960234545";
  const navLinks = [
    { href: "/sobre/servicos", label: "Servicos", icon: Scissors },
    { href: "/sobre/profissionais", label: "Profissionais", icon: Users },
    { href: "/sobre/clube", label: "Clube", icon: Crown },
    { href: getWhatsAppLink(WHATSAPP_NUMBER), label: "Contato", icon: Phone, external: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black bg-[#013648] backdrop-blur">
      <div className="container-app py-4">
        <div className="grid grid-cols-[1fr_auto_1fr] items-start">
          <div />

          <div className="flex flex-col items-center gap-4">
            <Link href="/" className="group flex items-center justify-center">
              <div className="relative h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-full border-2 border-black group-hover:border-[#EAD8AC] transition-colors">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt="Barbearia do Moura"
                  className="h-full w-full object-cover"
                />
              </div>
            </Link>

            {showNav && (
              <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                {navLinks.map((link) => (
                  link.external ? (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-[#EAD8AC] hover:text-[#EAD8AC] transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-sm font-medium text-[#EAD8AC] hover:text-[#EAD8AC] transition-colors"
                    >
                      {link.label}
                    </Link>
                  )
                ))}
              </nav>
            )}
          </div>

          <div className="flex justify-end">
            <UserNav />
          </div>
        </div>
      </div>
    </header>
  );
}
