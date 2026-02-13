"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, getInitials } from "@/lib/utils";
import {
  ArrowRight,
  Calendar,
  CalendarCheck,
  Clock3,
  Crown,
  Loader2,
  Plus,
  Scissors,
  Sparkles,
  User,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface NextAppointment {
  id: string;
  data_hora_inicio: string;
  data_hora_fim: string;
  status: string;
  servico: {
    nome: string;
  } | null;
  profissional: {
    foto_url: string | null;
    user: {
      nome: string;
      avatar_url: string | null;
    } | null;
  } | null;
}

interface Subscription {
  id: string;
  status: string;
  data_inicio?: string | null;
  proxima_cobranca?: string | null;
  plano: {
    nome: string;
    preco_mensal: number;
  } | null;
}

interface SubscriptionQueryRow {
  id: string;
  status: string;
  data_inicio?: string | null;
  proxima_cobranca?: string | null;
  plano:
    | {
        nome: string;
        preco_mensal: number;
      }
    | Array<{
        nome: string;
        preco_mensal: number;
      }>
    | null;
}

const quickActions = [
  {
    title: "Agendar",
    subtitle: "Reserve seu horario",
    href: "/agendar",
    icon: Calendar,
  },
  {
    title: "Historico",
    subtitle: "Meus agendamentos",
    href: "/meus-agendamentos",
    icon: CalendarCheck,
  },
  {
    title: "Clube",
    subtitle: "Planos e beneficios",
    href: "/clube",
    icon: Crown,
  },
  {
    title: "Perfil",
    subtitle: "Dados e preferencias",
    href: "/perfil",
    icon: User,
  },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

function pickOne<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: loadingUser, isAuthenticated, isAdmin, isBarbeiro } = useUser();

  const [nextAppointment, setNextAppointment] = useState<NextAppointment | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [appointmentsCount, setAppointmentsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loadingUser) {
      if (!isAuthenticated) {
        router.push("/login?redirect=/dashboard");
      } else if (isAdmin) {
        router.push("/admin/dashboard");
      } else if (isBarbeiro) {
        router.push("/profissional/dashboard");
      }
    }
  }, [loadingUser, isAuthenticated, isAdmin, isBarbeiro, router]);

  useEffect(() => {
    async function loadDashboardData() {
      if (!user) return;

      const supabase = createClient();

      try {
        const { data: appointmentData } = await supabase
          .from("appointments")
          .select(
            `
              id,
              data_hora_inicio,
              data_hora_fim,
              status,
              servico:services(nome),
              profissional:professionals(
                foto_url,
                user:users(nome, avatar_url)
              )
            `
          )
          .eq("cliente_id", user.id)
          .eq("status", "agendado")
          .gte("data_hora_inicio", new Date().toISOString())
          .order("data_hora_inicio", { ascending: true })
          .limit(1)
          .maybeSingle();

        if (appointmentData) {
          setNextAppointment(appointmentData as unknown as NextAppointment);
        } else {
          setNextAppointment(null);
        }

        const { data: subData } = await supabase
          .from("subscriptions")
          .select(`
            id,
            status,
            data_inicio,
            proxima_cobranca,
            plano:subscription_plans(nome, preco_mensal)
          `)
          .eq("cliente_id", user.id)
          .eq("status", "ativa")
          .maybeSingle();

        if (subData) {
          const normalized = subData as SubscriptionQueryRow;
          const plan = pickOne(normalized.plano);

          setSubscription({
            id: normalized.id,
            status: normalized.status,
            data_inicio: normalized.data_inicio ?? null,
            proxima_cobranca: normalized.proxima_cobranca ?? null,
            plano: plan
              ? {
                  nome: plan.nome,
                  preco_mensal: plan.preco_mensal,
                }
              : null,
          });
        } else {
          setSubscription(null);
        }

        const { count } = await supabase
          .from("appointments")
          .select("*", { count: "exact", head: true })
          .eq("cliente_id", user.id);

        setAppointmentsCount(count || 0);
      } catch {
        setNextAppointment(null);
        setSubscription(null);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      loadDashboardData();
    }
  }, [user]);

  if (loadingUser || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#EAD8AC]" />
      </div>
    );
  }

  if (!user) return null;

  const firstName = user.nome?.split(" ")[0] ?? "Cliente";

  return (
    <div className="bg-[#013648]">
      <section className="bg-gradient-to-b from-black/20 to-transparent py-10 md:py-12">
        <div className="container-app">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="mb-3 inline-block rounded-full border border-[#EAD8AC]/20 bg-[#EAD8AC]/10 px-3 py-1 text-xs font-semibold tracking-wide text-[#EAD8AC]">
                DASHBOARD DO CLIENTE
              </span>
              <p className="text-lg text-[#EAD8AC]/70">{getGreeting()},</p>
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                Bem-vindo, <span className="text-gradient-gold">{firstName}</span>
              </h1>
            </div>

            <Button asChild size="lg" className="h-14 px-8 text-base font-bold">
              <Link href="/agendar">
                <Plus className="mr-2 h-5 w-5" />
                NOVO AGENDAMENTO
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="container-app space-y-10 pb-12">
        <section>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href} className="group">
                <Card className="h-full border-black bg-black/50 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-[#EAD8AC]">
                  <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/40 transition-colors group-hover:bg-[#EAD8AC]/10">
                      <action.icon className="h-7 w-7 text-[#EAD8AC]" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold">{action.title}</h2>
                      <p className="text-xs text-[#EAD8AC]/60">{action.subtitle}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid items-start gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            {nextAppointment ? (
              <Card className="overflow-hidden rounded-3xl border-black bg-black/50 backdrop-blur-sm">
                <CardContent className="space-y-6 p-8">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="flex items-center gap-2 text-xl font-bold">
                      <Clock3 className="h-5 w-5 text-[#EAD8AC]" />
                      PROXIMO HORARIO
                    </h2>
                    <Badge variant="outline" className="border-black text-xs font-bold">
                      CONFIRMADO
                    </Badge>
                  </div>

                  <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-20 w-20 rounded-2xl border-2 border-black">
                        <AvatarImage
                          src={
                            nextAppointment.profissional?.foto_url ||
                            nextAppointment.profissional?.user?.avatar_url ||
                            undefined
                          }
                          alt={nextAppointment.profissional?.user?.nome ?? "Profissional"}
                        />
                        <AvatarFallback className="rounded-2xl bg-[#EAD8AC] text-[#013648] text-xl">
                          {getInitials(nextAppointment.profissional?.user?.nome ?? "P")}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <p className="text-2xl font-bold">
                          {nextAppointment.servico?.nome ?? "Servico"}
                        </p>
                        <p className="text-sm text-[#EAD8AC]/70">
                          com {nextAppointment.profissional?.user?.nome ?? "Profissional"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-center md:block md:text-right">
                      <div className="rounded-xl border border-black bg-black/20 px-4 py-2 md:mb-2 md:border-none md:bg-transparent md:p-0">
                        <p className="text-xs uppercase tracking-wide text-[#EAD8AC]/60">Data</p>
                        <p className="text-lg font-bold">
                          {format(parseISO(nextAppointment.data_hora_inicio), "EEE, dd MMM", {
                            locale: ptBR,
                          })}
                        </p>
                      </div>
                      <div className="rounded-xl border border-black bg-black/20 px-4 py-2 md:border-none md:bg-transparent md:p-0">
                        <p className="text-xs uppercase tracking-wide text-[#EAD8AC]/60">Horario</p>
                        <p className="text-lg font-bold">
                          {format(parseISO(nextAppointment.data_hora_inicio), "HH:mm")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button asChild className="h-12 flex-1 font-bold">
                      <Link href="/meus-agendamentos">VER DETALHES</Link>
                    </Button>
                    <Button asChild variant="outline" className="h-12 px-8">
                      <Link href="/agendar">REAGENDAR</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="rounded-3xl border-black bg-black/50 backdrop-blur-sm">
                <CardContent className="space-y-4 p-8 text-center">
                  <Scissors className="mx-auto h-14 w-14 text-[#EAD8AC]/70" />
                  <h2 className="text-2xl font-bold">Sem horarios futuros</h2>
                  <p className="text-sm text-[#EAD8AC]/70">
                    Faça um novo agendamento para garantir seu atendimento.
                  </p>
                  <Button asChild className="h-12 px-6">
                    <Link href="/agendar">
                      <Plus className="mr-2 h-4 w-4" />
                      AGENDAR AGORA
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Card className="rounded-3xl border-black bg-black/50 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <CalendarCheck className="mx-auto mb-4 h-8 w-8 text-[#EAD8AC]/40" />
                  <p className="text-4xl font-bold">{appointmentsCount}</p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-[#EAD8AC]/60">
                    Agendamentos
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-black bg-black/50 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <Sparkles className="mx-auto mb-4 h-8 w-8 text-[#EAD8AC]/40" />
                  <p className="text-4xl font-bold">{subscription ? "Ativo" : "-"}</p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-[#EAD8AC]/60">
                    Status do Clube
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-6 lg:col-span-5">
            {subscription ? (
              <Card className="overflow-hidden rounded-3xl border-black bg-gradient-to-br from-[#05384B] to-black">
                <CardContent className="space-y-6 p-8">
                  <div className="flex items-center justify-between">
                    <h2 className="flex items-center gap-2 text-xl font-bold">
                      <Crown className="h-6 w-6 text-[#EAD8AC]" />
                      CLUBE DO MOURA
                    </h2>
                    <Badge variant="outline" className="border-black text-xs font-bold">
                      ATIVO
                    </Badge>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#EAD8AC]/60">Plano atual</p>
                    <p className="text-3xl font-bold">{subscription.plano?.nome ?? "Premium"}</p>
                    <p className="text-sm text-[#EAD8AC]/70">
                      {subscription.plano
                        ? `${formatCurrency(subscription.plano.preco_mensal)}/mes`
                        : "Beneficios ativos"}
                    </p>
                  </div>

                  <div className="space-y-2 text-sm text-[#EAD8AC]/80">
                    <p>• Cortes ilimitados no mes</p>
                    <p>• Prioridade no agendamento</p>
                    <p>• Atendimento preferencial</p>
                  </div>

                  {subscription.proxima_cobranca && (
                    <p className="text-xs text-[#EAD8AC]/60">
                      Proxima cobranca: {format(parseISO(subscription.proxima_cobranca), "dd/MM/yyyy", {
                        locale: ptBR,
                      })}
                    </p>
                  )}

                  <Button asChild variant="outline" className="h-12 w-full font-bold">
                    <Link href="/clube">
                      GERENCIAR ASSINATURA
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="rounded-3xl border-black bg-black/50 backdrop-blur-sm">
                <CardContent className="space-y-4 p-8 text-center">
                  <Crown className="mx-auto h-12 w-12 text-[#EAD8AC]/70" />
                  <h2 className="text-2xl font-bold">Entre para o Clube</h2>
                  <p className="text-sm text-[#EAD8AC]/70">
                    Tenha beneficios exclusivos e economize em cada atendimento.
                  </p>
                  <Button asChild className="h-12 px-6">
                    <Link href="/clube">CONHECER PLANOS</Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            <Card className="rounded-3xl border-[#EAD8AC]/20 bg-[#EAD8AC]/5">
              <CardContent className="p-6">
                <p className="text-sm text-[#EAD8AC]/80">
                  Dica: agende seu proximo horario com antecedencia para garantir disponibilidade no melhor turno.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
