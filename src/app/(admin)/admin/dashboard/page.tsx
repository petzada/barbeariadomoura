import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatCurrency, getInitials } from "@/lib/utils";
import {
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  Crown,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { format, startOfDay, endOfDay, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";

export const metadata = {
  title: "Dashboard",
};

// Componente de Métrica
function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ElementType;
  trend?: { value: number; positive: boolean };
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div
            className={`flex items-center text-xs mt-2 ${
              trend.positive ? "text-success" : "text-destructive"
            }`}
          >
            <TrendingUp
              className={`h-3 w-3 mr-1 ${!trend.positive && "rotate-180"}`}
            />
            {trend.positive ? "+" : "-"}
            {trend.value}% vs mês anterior
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Buscar métricas
async function getMetrics() {
  const supabase = await createClient();
  const today = new Date();
  const todayStart = startOfDay(today).toISOString();
  const todayEnd = endOfDay(today).toISOString();
  const monthStart = startOfMonth(today).toISOString();
  const monthEnd = endOfMonth(today).toISOString();

  // Agendamentos do dia
  const { count: agendamentosHoje } = await supabase
    .from("appointments")
    .select("*", { count: "exact", head: true })
    .gte("data_hora_inicio", todayStart)
    .lte("data_hora_inicio", todayEnd)
    .not("status", "eq", "cancelado");

  // Faturamento do dia
  const { data: faturamentoHojeData } = await supabase
    .from("appointments")
    .select("valor_cobrado")
    .gte("data_hora_inicio", todayStart)
    .lte("data_hora_inicio", todayEnd)
    .eq("status", "concluido")
    .eq("payment_status", "pago");

  const faturamentoHoje = (faturamentoHojeData as { valor_cobrado: number }[] | null)?.reduce(
    (acc, a) => acc + (a.valor_cobrado || 0),
    0
  ) || 0;

  // Faturamento do mês
  const { data: faturamentoMesData } = await supabase
    .from("appointments")
    .select("valor_cobrado")
    .gte("data_hora_inicio", monthStart)
    .lte("data_hora_inicio", monthEnd)
    .eq("status", "concluido")
    .eq("payment_status", "pago");

  const faturamentoMes = (faturamentoMesData as { valor_cobrado: number }[] | null)?.reduce(
    (acc, a) => acc + (a.valor_cobrado || 0),
    0
  ) || 0;

  // Assinantes ativos
  const { count: assinantesAtivos } = await supabase
    .from("subscriptions")
    .select("*", { count: "exact", head: true })
    .eq("status", "ativa");

  // Novos clientes do mês
  const { count: novosClientes } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("role", "cliente")
    .gte("created_at", monthStart);

  return {
    agendamentosHoje: agendamentosHoje || 0,
    faturamentoHoje,
    faturamentoMes,
    assinantesAtivos: assinantesAtivos || 0,
    novosClientes: novosClientes || 0,
  };
}

// Buscar agendamentos do dia
async function getTodayAppointments() {
  const supabase = await createClient();
  const today = new Date();
  const todayStart = startOfDay(today).toISOString();
  const todayEnd = endOfDay(today).toISOString();

  const { data } = await supabase
    .from("appointments")
    .select(`
      *,
      cliente:users!appointments_cliente_id_fkey(nome, avatar_url),
      servico:services(nome),
      profissional:professionals(
        user:users(nome)
      )
    `)
    .gte("data_hora_inicio", todayStart)
    .lte("data_hora_inicio", todayEnd)
    .not("status", "eq", "cancelado")
    .order("data_hora_inicio");

  return data || [];
}

// Componente de Métricas
async function DashboardMetrics() {
  const metrics = await getMetrics();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Agendamentos Hoje"
        value={metrics.agendamentosHoje}
        icon={Calendar}
        description="Total de atendimentos"
      />
      <MetricCard
        title="Faturamento Hoje"
        value={formatCurrency(metrics.faturamentoHoje)}
        icon={DollarSign}
      />
      <MetricCard
        title="Faturamento do Mês"
        value={formatCurrency(metrics.faturamentoMes)}
        icon={TrendingUp}
      />
      <MetricCard
        title="Assinantes Ativos"
        value={metrics.assinantesAtivos}
        icon={Crown}
        description={`${metrics.novosClientes} novos este mês`}
      />
    </div>
  );
}

// Componente de Agenda do Dia
async function TodaySchedule() {
  const appointments = await getTodayAppointments();

  const statusConfig: Record<string, { icon: React.ElementType; color: string }> = {
    agendado: { icon: Clock, color: "text-primary" },
    em_andamento: { icon: AlertCircle, color: "text-warning" },
    concluido: { icon: CheckCircle, color: "text-success" },
    nao_compareceu: { icon: XCircle, color: "text-destructive" },
  };

  if (appointments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Agenda de Hoje
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Nenhum agendamento para hoje</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Agenda de Hoje
        </CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/agenda">Ver Completa</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map((appointment: any) => {
            const status = statusConfig[appointment.status] || statusConfig.agendado;
            const StatusIcon = status.icon;

            return (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={appointment.cliente?.avatar_url}
                      alt={appointment.cliente?.nome}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(appointment.cliente?.nome || "?")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{appointment.cliente?.nome}</p>
                    <p className="text-sm text-muted-foreground">
                      {appointment.servico?.nome} • {appointment.profissional?.user?.nome}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">
                      {format(new Date(appointment.data_hora_inicio), "HH:mm")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {appointment.coberto_assinatura
                        ? "Assinatura"
                        : formatCurrency(appointment.valor_cobrado)}
                    </p>
                  </div>
                  <StatusIcon className={`h-5 w-5 ${status.color}`} />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton para loading
function MetricsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-3 w-32 mt-2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ScheduleSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16" />
        ))}
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao painel administrativo da Barbearia do Moura
        </p>
      </div>

      {/* Métricas */}
      <Suspense fallback={<MetricsSkeleton />}>
        <DashboardMetrics />
      </Suspense>

      {/* Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Agenda do Dia */}
        <Suspense fallback={<ScheduleSkeleton />}>
          <TodaySchedule />
        </Suspense>

        {/* Ações Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button asChild variant="outline" className="h-auto py-4 flex-col">
              <Link href="/admin/agenda">
                <Calendar className="h-6 w-6 mb-2" />
                Ver Agenda
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4 flex-col">
              <Link href="/admin/servicos">
                <Users className="h-6 w-6 mb-2" />
                Gerenciar Serviços
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4 flex-col">
              <Link href="/admin/bloqueios">
                <Clock className="h-6 w-6 mb-2" />
                Bloquear Horário
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4 flex-col">
              <Link href="/admin/financeiro">
                <DollarSign className="h-6 w-6 mb-2" />
                Ver Caixa
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
