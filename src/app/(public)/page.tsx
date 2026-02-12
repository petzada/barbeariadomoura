"use client";

import Link from "next/link";
import Image from "next/image";
import { useFormState } from "react-dom";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Scissors, Users, Crown, Star, Sparkles, CalendarClock, BadgeCheck } from "lucide-react";
import { loginAction } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const initialState = {
  success: false,
  message: "",
  redirectTo: undefined,
};

const featureCards = [
  {
    href: "/sobre/servicos",
    icon: Scissors,
    title: "Servicos",
    description: "Cortes, barba e tratamentos com padrao premium.",
  },
  {
    href: "/sobre/profissionais",
    icon: Users,
    title: "Profissionais",
    description: "Equipe especializada para manter seu estilo em dia.",
  },
  {
    href: "/sobre/clube",
    icon: Crown,
    title: "Clube",
    description: "Planos para economizar com frequencia e prioridade.",
  },
];

export default function HomePage() {
  const [state, formAction] = useFormState(loginAction, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success && state.redirectTo) {
      router.push(state.redirectTo);
    }
  }, [state.success, state.redirectTo, router]);

  return (
    <div className="min-h-screen super-page-bg">
      <div className="hero-atmosphere" />
      <div className="container-app py-8 sm:py-12">
        <section className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 items-start">
          <div className="space-y-5 animate-in">
            <Badge className="bg-[#EAD8AC]/10 border-[#EAD8AC]/30 text-[#EAD8AC]">
              <Sparkles className="h-3 w-3 mr-1" />
              Estilo e Tradicao em Cada Corte
            </Badge>

            <div className="relative w-24 h-24">
              <Image
                src="/logo.png"
                alt="Barbearia do Moura"
                fill
                className="rounded-full object-cover border-4 border-[#EAD8AC]/35 shadow-[0_0_24px_rgba(234,216,172,0.25)]"
                priority
              />
            </div>

            <h1 className="super-heading text-balance">
              Experiencia premium para quem nao abre mao de presenca
            </h1>
            <p className="super-subheading max-w-xl">
              Agenda facil, atendimento consistente e uma equipe focada no seu melhor visual.
            </p>

            <div className="kpi-strip max-w-xl">
              <div className="kpi-card">
                <p className="text-2xl font-bold">4.9</p>
                <p className="text-xs text-[#EAD8AC]/75">Media de avaliacoes</p>
              </div>
              <div className="kpi-card">
                <p className="text-2xl font-bold">+3k</p>
                <p className="text-xs text-[#EAD8AC]/75">Atendimentos</p>
              </div>
              <div className="kpi-card">
                <p className="text-2xl font-bold">24/7</p>
                <p className="text-xs text-[#EAD8AC]/75">Agendamento online</p>
              </div>
              <div className="kpi-card">
                <p className="text-2xl font-bold">VIP</p>
                <p className="text-xs text-[#EAD8AC]/75">Clube de beneficios</p>
              </div>
            </div>
          </div>

          <Card variant="highlighted" className="animate-in">
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Entrar</h2>
                <p className="text-sm text-[#EAD8AC]/75">Acesse sua agenda e beneficios</p>
              </div>

              <form action={formAction} className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required placeholder="seu@email.com" />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password">Senha</Label>
                  <Input id="password" name="password" type="password" required placeholder="••••••••" />
                </div>

                {state.message && (
                  <div
                    className={`text-sm p-2.5 rounded-lg border ${
                      state.success
                        ? "border-[#22C55E]/50 bg-[#22C55E]/10 text-[#BBF7D0]"
                        : "border-[#EF4444]/50 bg-[#EF4444]/10 text-[#FECACA]"
                    }`}
                  >
                    {state.message}
                  </div>
                )}

                <Button type="submit" variant="gradient" className="w-full">
                  Entrar
                </Button>
              </form>

              <div className="flex justify-between text-sm pt-1">
                <Link href="/esqueci-senha" className="text-[#EAD8AC]/75 hover:text-[#EAD8AC] transition-colors">
                  Esqueceu a senha?
                </Link>
                <Link href="/cadastro" className="text-[#EAD8AC]/75 hover:text-[#EAD8AC] transition-colors">
                  Cadastrar
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-8 sm:mt-10 section-divider py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {featureCards.map((item) => (
              <Link key={item.href} href={item.href}>
                <Card variant="interactive" className="h-full">
                  <CardContent className="p-4 sm:p-5">
                    <item.icon className="h-6 w-6 mb-2 text-[#EAD8AC]" />
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-[#EAD8AC]/75 mt-1">{item.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-2 grid md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 sm:p-5">
              <p className="font-semibold flex items-center gap-2">
                <Star className="h-4 w-4 text-[#EAD8AC]" />
                Social Proof
              </p>
              <div className="mt-3 timeline-rail space-y-4">
                <div className="timeline-item">
                  <p className="text-sm">
                    &ldquo;Agendamento rapido e sempre no horario.&rdquo; <span className="text-[#EAD8AC]/75">- Cliente recorrente</span>
                  </p>
                </div>
                <div className="timeline-item">
                  <p className="text-sm">
                    &ldquo;Padrao de atendimento excelente em todas as visitas.&rdquo; <span className="text-[#EAD8AC]/75">- Assinante clube</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-5">
              <p className="font-semibold flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-[#EAD8AC]" />
                Por que nos escolher
              </p>
              <ul className="mt-3 space-y-2 text-sm text-[#EAD8AC]/85">
                <li className="flex items-center gap-2">
                  <CalendarClock className="h-4 w-4" />
                  Agendamento online em poucos passos
                </li>
                <li className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Profissionais experientes e consistentes
                </li>
                <li className="flex items-center gap-2">
                  <Crown className="h-4 w-4" />
                  Clube com economia e prioridade de agenda
                </li>
              </ul>
              <Button asChild className="w-full mt-4">
                <Link href="/cadastro">Comecar agora</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
