# layouts.md


## `src/app/layout.tsx`

Source:

```tsx
import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});


import { Toaster } from "@/components/ui/toaster";
import { WhatsAppFloatingButton } from "@/components/whatsapp-button";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Barbearia do Moura | Agendamento Online",
    template: "%s | Barbearia do Moura",
  },
  description:
    "Agende seu horário na Barbearia do Moura. Cortes de cabelo, barba e tratamentos com profissionais especializados em Mauá-SP. Agendamento online 24/7.",
  keywords: [
    "barbearia",
    "corte de cabelo",
    "barba",
    "agendamento online",
    "Mauá",
    "São Paulo",
    "barbeiro",
  ],
  authors: [{ name: "Barbearia do Moura" }],
  creator: "Barbearia do Moura",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/icon.svg",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://barbeariadomoura.vercel.app",
    siteName: "Barbearia do Moura",
    title: "Barbearia do Moura | Agendamento Online",
    description:
      "Agende seu horário na Barbearia do Moura. Cortes de cabelo, barba e tratamentos com profissionais especializados.",
  },
  twitter: {
    card: "summary",
    title: "Barbearia do Moura | Agendamento Online",
    description: "Agende seu horário na melhor barbearia de Mauá-SP.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#013648",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
    >
      <head>
        {/* Schema.org para LocalBusiness */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BarberShop",
              name: "Barbearia do Moura",
              description:
                "Barbearia especializada em cortes masculinos e barba em Mauá-SP",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Mauá",
                addressRegion: "SP",
                addressCountry: "BR",
              },
              priceRange: "$$",
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday"],
                  opens: "09:00",
                  closes: "20:00",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: "Saturday",
                  opens: "09:00",
                  closes: "18:00",
                },
              ],
            }),
          }}
        />
      </head>
      <body className={`min-h-screen bg-[#013648] text-[#EAD8AC] font-sans antialiased ${roboto.variable}`}>
        {children}
        <Toaster />
        <WhatsAppFloatingButton />
      </body>
    </html>
  );
}


```

## `src/app/(public)/layout.tsx`

Source:

```tsx
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-[#013648] text-[#EAD8AC]">{children}</div>;
}

```

## `src/app/(auth)/layout.tsx`

Source:

```tsx
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#013648] text-[#EAD8AC]">
      <header className="p-4 border-b border-black">
        <div className="container-app flex justify-center">
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
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">{children}</div>
      </main>

      <footer className="p-4 text-center text-sm text-[#EAD8AC] border-t border-black">
        <p>&copy; {new Date().getFullYear()} Barbearia do Moura. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

```

## `src/app/(cliente)/layout.tsx`

Source:

```tsx
import { ClientNav } from "@/components/layout/client-nav";

export default function ClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#013648] text-[#EAD8AC]">
      <ClientNav />
      <main className="flex-1">{children}</main>
    </div>
  );
}

```

## `src/app/(admin)/layout.tsx`

Source:

```tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminNav } from "@/components/layout/admin-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/?redirect=/admin/dashboard");
  }

  // Verificar se é admin
  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#013648] text-[#EAD8AC]">
      <AdminNav />
      <main className="flex-1 p-4 sm:p-6">{children}</main>
    </div>
  );
}


```

## `src/app/(profissional)/layout.tsx`

Source:

```tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfessionalNav } from "@/components/layout/professional-nav";

export default async function ProfissionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/?redirect=/profissional/dashboard");
  }

  // Verificar se é barbeiro
  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || (profile.role !== "barbeiro" && profile.role !== "admin")) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#013648] text-[#EAD8AC]">
      <ProfessionalNav />
      <main className="flex-1 p-4 sm:p-6">{children}</main>
    </div>
  );
}


```

## `src/components/layout/admin-nav.tsx`

Source:

```tsx
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
          <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Barbearia do Moura"
              className="h-full w-full object-cover"
            />
          </div>
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




```

## `src/components/layout/client-nav.tsx`

Source:

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
import { createClient } from "@/lib/supabase/client";
import { getInitials, cn } from "@/lib/utils";
import {
  Menu,
  Home,
  Calendar,
  CalendarCheck,
  Crown,
  User,
  Settings,
  LogOut,
  Scissors,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Início", icon: Home },
  { href: "/agendar", label: "Agendar", icon: Calendar },
  { href: "/meus-agendamentos", label: "Agendamentos", icon: CalendarCheck },
  { href: "/feedback", label: "Avaliações", icon: Star },
  { href: "/clube", label: "Clube", icon: Crown },
  { href: "/perfil", label: "Perfil", icon: User },
];

export function ClientNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black bg-[#013648] backdrop-blur ">
      <div className="container-app flex h-14 items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Barbearia do Moura"
              className="h-full w-full object-cover"
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
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
        <div className="hidden md:flex items-center gap-2">
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
        <div className="md:hidden flex items-center gap-2">
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
                      (item.href !== "/dashboard" && pathname.startsWith(item.href));

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




```

## `src/components/layout/footer.tsx`

Source:

```tsx
import Link from "next/link";
import { getWhatsAppLink } from "@/lib/utils";
import { Instagram, Phone, MapPin, Clock } from "lucide-react";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5511960234545";

export function Footer() {
  return (
    <footer className="border-t border-black bg-[#013648]">
      <div className="container-app py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e descrição */}
          <div className="md:col-span-2">
            <Link href="/" className="text-xl font-bold text-gradient-gold">
              Barbearia do Moura
            </Link>
            <p className="mt-4 text-[#EAD8AC] max-w-md">
              Sua barbearia de confiança em Mauá-SP. Oferecemos cortes modernos,
              barba tradicional e tratamentos capilares com profissionais
              experientes.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="https://instagram.com/barbeariadomoura"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#EAD8AC] hover:text-[#EAD8AC] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={getWhatsAppLink(WHATSAPP_NUMBER)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#EAD8AC] hover:text-[#EAD8AC] transition-colors"
                aria-label="WhatsApp"
              >
                <Phone className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links rápidos */}
          <div>
            <h3 className="font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/agendar"
                  className="text-[#EAD8AC] hover:text-[#EAD8AC] transition-colors"
                >
                  Agendar Horário
                </Link>
              </li>
              <li>
                <Link
                  href="/clube"
                  className="text-[#EAD8AC] hover:text-[#EAD8AC] transition-colors"
                >
                  Clube do Moura
                </Link>
              </li>
              <li>
                <Link
                  href="/sobre/servicos"
                  className="text-[#EAD8AC] hover:text-[#EAD8AC] transition-colors"
                >
                  Nossos Serviços
                </Link>
              </li>
              <li>
                <Link
                  href="/sobre/profissionais"
                  className="text-[#EAD8AC] hover:text-[#EAD8AC] transition-colors"
                >
                  Profissionais
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-semibold mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-[#EAD8AC]">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>
                  Rua Exemplo, 123
                  <br />
                  Centro, Mauá-SP
                </span>
              </li>
              <li className="flex items-center gap-2 text-[#EAD8AC]">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <a
                  href={getWhatsAppLink(WHATSAPP_NUMBER)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#EAD8AC] transition-colors"
                >
                  (11) 96023-4545
                </a>
              </li>
              <li className="flex items-start gap-2 text-[#EAD8AC]">
                <Clock className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>
                  Ter a Sex: 09h - 20h
                  <br />
                  Sáb: 09h - 18h
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-black flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[#EAD8AC]">
            &copy; {new Date().getFullYear()} Barbearia do Moura. Todos os
            direitos reservados.
          </p>
          <div className="flex gap-4 text-sm text-[#EAD8AC]">
            <Link href="/termos" className="hover:text-[#EAD8AC] transition-colors">
              Termos de Uso
            </Link>
            <Link href="/privacidade" className="hover:text-[#EAD8AC] transition-colors">
              Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}


```

## `src/components/layout/header.tsx`

Source:

```tsx
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

```

## `src/components/layout/professional-nav.tsx`

Source:

```tsx
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
  Calendar,
  DollarSign,
  CalendarOff,
  User,
  Settings,
  LogOut,
  LayoutDashboard,
  Scissors,
} from "lucide-react";

// Links de navegação do profissional
const navItems = [
  { href: "/profissional/dashboard", label: "Agenda", icon: Calendar },
  { href: "/profissional/comissoes", label: "Comissões", icon: DollarSign },
  { href: "/profissional/bloqueios", label: "Bloqueios", icon: CalendarOff },
  { href: "/profissional/perfil", label: "Perfil", icon: User },
];

export function ProfessionalNav() {
  const { user, loading, isAdmin } = useUser();
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
        <Link href="/profissional/dashboard" className="flex items-center gap-2">
          <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Barbearia do Moura"
              className="h-full w-full object-cover"
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
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
        <div className="hidden md:flex items-center gap-2">
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
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard Admin
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/profissional/perfil">
                      <User className="mr-2 h-4 w-4" />
                      Meu Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profissional/perfil/configuracoes">
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
        <div className="md:hidden flex items-center gap-2">
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
                    {isAdmin && (
                      <Link
                        href="/admin/dashboard"
                        onClick={closeMenu}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#EAD8AC] hover:text-[#EAD8AC] hover:bg-[#013648] hover:border-[#EAD8AC] transition-colors"
                      >
                        <LayoutDashboard className="h-5 w-5" />
                        Dashboard Admin
                      </Link>
                    )}
                    <Link
                      href="/profissional/perfil/configuracoes"
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




```

## `src/components/layout/user-nav.tsx`

Source:

```tsx
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
          <Link href="/">Entrar</Link>
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
            <AvatarFallback className="bg-primary text-[#EAD8AC]">
              {getInitials(user.nome)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.nome}</p>
            <p className="text-xs leading-none text-[#EAD8AC]">
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

          {/* Links exclusivos para clientes (não barbeiros e não admins) */}
          {!isBarbeiro && !isAdmin && (
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
          className="text-[#EAD8AC] focus:text-[#EAD8AC] cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}



```
