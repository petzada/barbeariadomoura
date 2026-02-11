"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency, getInitials } from "@/lib/utils";
import {
  Calendar,
  Clock,
  Crown,
  Settings,
  User,
  ArrowRight,
  Scissors,
  CalendarCheck,
  Loader2,
  Plus,
} from "lucide-react";
import { format, parseISO, isFuture } from "date-fns";
import { ptBR } from "date-fns/locale";

interface NextAppointment {
  id: string;
  data_hora_inicio: string;
  data_hora_fim: string;
  status: string;
  servico: {
    nome: string;
  };
  profissional: {
    foto_url: string | null;
    user: {
      nome: string;
      avatar_url: string | null;
    };
  };
}

interface Subscription {
  id: string;
  status: string;
  plano: {
    nome: string;
    preco_mensal: number;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: loadingUser, isAuthenticated, isAdmin, isBarbeiro } = useUser();

  const [nextAppointment, setNextAppointment] = useState<NextAppointment | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [appointmentsCount, setAppointmentsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Redirecionar se não autenticado ou se for admin/barbeiro
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

  // Carregar dados do dashboard
  useEffect(() => {
    async function loadDashboardData() {
      if (!user) return;

      const supabase = createClient();

      try {
        // Buscar próximo agendamento
        const { data: appointmentData } = await supabase
          .from("appointments")
          .select(`
            id,
            data_hora_inicio,
            data_hora_fim,
            status,
            servico:services(nome),
            profissional:professionals(
              foto_url,
              user:users(nome, avatar_url)
            )
          `)
          .eq("cliente_id", user.id)
          .eq("status", "agendado")
          .gte("data_hora_inicio", new Date().toISOString())
          .order("data_hora_inicio", { ascending: true })
          .limit(1)
          .single();

        if (appointmentData) {
          setNextAppointment(appointmentData as unknown as NextAppointment);
        }

        // Buscar assinatura ativa
        const { data: subData } = await supabase
          .from("subscriptions")
          .select(`*, plano:subscription_plans(nome, preco_mensal)`)
          .eq("cliente_id", user.id)
          .eq("status", "ativa")
          .single();

        if (subData) {
          setSubscription(subData as Subscription);
        }

        // Contar total de agendamentos
        const { count } = await supabase
          .from("appointments")
          .select("*", { count: "exact", head: true })
          .eq("cliente_id", user.id);

        setAppointmentsCount(count || 0);
      } catch (error) {
        console.error("Dashboard load error:", error);
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#EAD8AC]" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const quickActions = [
    {
      title: "Agendar",
      description: "Marque seu horário",
      href: "/agendar",
      icon: Calendar,
      variant: "default" as const,
    },
    {
      title: "Agendamentos",
      description: "Ver histórico",
      href: "/meus-agendamentos",
      icon: CalendarCheck,
      variant: "outline" as const,
    },
    {
      title: "Clube",
      description: "Planos e assinatura",
      href: "/clube",
      icon: Crown,
      variant: "outline" as const,
    },
    {
      title: "Perfil",
      description: "Editar dados",
      href: "/perfil",
      icon: User,
      variant: "outline" as const,
    },
  ];

  // Saudação baseada no horário
  const getSaudacao = () => {
    const hora = new Date().getHours();
    if (hora < 12) return "Bom dia";
    if (hora < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <div className="min-h-screen bg-[#013648]">
      <div className="container-app py-8">
        {/* Header com Saudação */}
        <div className="mb-6">
          <p className="text-[#EAD8AC]">{getSaudacao()},</p>
          <h1 className="text-3xl font-bold text-gradient-gold tracking-wide">{user?.nome?.split(" ")[0] ?? "Cliente"}</h1>
        </div>

        {/* Ações Rápidas */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href}>
                <Card className="h-full hover:border-[#EAD8AC] transition-colors cursor-pointer">
                  <CardContent className="p-3 sm:p-4 text-center">
                    <div className={`inline-flex p-2 sm:p-3 rounded-lg mb-2 ${action.variant === "default" ? "bg-[#013648]/70" : "bg-secondary"
                      }`}>
                      <action.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${action.variant === "default" ? "text-[#EAD8AC]" : "text-[#EAD8AC]"
                        }`} />
                    </div>
                    <h3 className="font-medium text-sm sm:text-base">{action.title}</h3>
                    <p className="text-xs text-[#EAD8AC] mt-0.5 hidden sm:block">
                      {action.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Próximo Agendamento */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#EAD8AC]" />
                Próximo Agendamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              {nextAppointment ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage
                        src={
                          nextAppointment.profissional?.foto_url ||
                          nextAppointment.profissional?.user?.avatar_url ||
                          undefined
                        }
                        alt={nextAppointment.profissional?.user?.nome ?? "Profissional"}
                      />
                      <AvatarFallback className="bg-[#013648]/70">
                        {getInitials(nextAppointment.profissional?.user?.nome ?? "P")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{nextAppointment.servico?.nome ?? "Serviço"}</p>
                      <p className="text-sm text-[#EAD8AC]">
                        com {nextAppointment.profissional?.user?.nome ?? "Profissional"}
                      </p>
                    </div>
                    <Badge>Agendado</Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-[#EAD8AC]">
                      <Calendar className="h-4 w-4" />
                      {format(parseISO(nextAppointment.data_hora_inicio), "EEE, dd/MM", { locale: ptBR })}
                    </div>
                    <div className="flex items-center gap-1 text-[#EAD8AC]">
                      <Clock className="h-4 w-4" />
                      {format(parseISO(nextAppointment.data_hora_inicio), "HH:mm")}
                    </div>
                  </div>

                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/meus-agendamentos">
                      Ver Detalhes
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Scissors className="h-12 w-12 mx-auto text-[#EAD8AC] mb-3" />
                  <p className="text-[#EAD8AC] mb-4">
                    Você não tem agendamentos futuros
                  </p>
                  <Button asChild>
                    <Link href="/agendar">
                      <Plus className="mr-2 h-4 w-4" />
                      Agendar Agora
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status da Assinatura */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Crown className="h-4 w-4 text-[#EAD8AC]" />
                Clube do Moura
              </CardTitle>
            </CardHeader>
            <CardContent>
              {subscription ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{subscription.plano.nome}</p>
                      <p className="text-sm text-[#EAD8AC]">
                        {formatCurrency(subscription.plano.preco_mensal)}/mês
                      </p>
                    </div>
                    <Badge variant="success">Ativa</Badge>
                  </div>

                  <div className="p-3 rounded-lg bg-[#EAD8AC]/10 text-[#EAD8AC] text-sm">
                    Você tem benefícios ativos! Seus serviços inclusos são gratuitos.
                  </div>

                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/clube">
                      Gerenciar Assinatura
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Crown className="h-12 w-12 mx-auto text-[#EAD8AC] mb-3" />
                  <p className="text-[#EAD8AC] mb-2">
                    Você ainda não é assinante
                  </p>
                  <p className="text-sm text-[#EAD8AC] mb-4">
                    Assine e ganhe serviços ilimitados!
                  </p>
                  <Button asChild>
                    <Link href="/clube">
                      <Crown className="mr-2 h-4 w-4" />
                      Conhecer Planos
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Estatísticas */}
        <section className="mt-8">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div>
                  <p className="text-3xl font-bold text-[#EAD8AC]">{appointmentsCount}</p>
                  <p className="text-sm text-[#EAD8AC]">
                    {appointmentsCount === 1 ? "Agendamento" : "Agendamentos"}
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#EAD8AC]">
                    {subscription ? "Ativo" : "-"}
                  </p>
                  <p className="text-sm text-[#EAD8AC]">Status do Clube</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}


