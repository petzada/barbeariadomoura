import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency, getInitials } from "@/lib/utils";
import { endOfDay, format, startOfDay, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  AlertTriangle,
  Calendar,
  CalendarClock,
  Clock3,
  DollarSign,
  Scissors,
  ShieldAlert,
} from "lucide-react";

export const metadata = {
  title: "Dashboard",
};

type AppointmentStatus =
  | "agendado"
  | "em_andamento"
  | "concluido"
  | "cancelado"
  | "nao_compareceu";

interface AppointmentRow {
  id: string;
  status: AppointmentStatus;
  data_hora_inicio: string;
  data_hora_fim: string;
  valor_cobrado: number;
  coberto_assinatura: boolean;
  cliente: {
    nome: string | null;
    avatar_url: string | null;
  } | null;
  servico: {
    nome: string | null;
  } | null;
  profissional: {
    user: {
      nome: string | null;
    } | null;
  } | null;
}

interface AppointmentQueryRow {
  id: string;
  status: string;
  data_hora_inicio: string;
  data_hora_fim: string;
  valor_cobrado: number;
  coberto_assinatura: boolean;
  cliente:
    | {
        nome: string | null;
        avatar_url: string | null;
      }
    | Array<{
        nome: string | null;
        avatar_url: string | null;
      }>
    | null;
  servico:
    | {
        nome: string | null;
      }
    | Array<{
        nome: string | null;
      }>
    | null;
  profissional:
    | {
        user:
          | {
              nome: string | null;
            }
          | Array<{
              nome: string | null;
            }>
          | null;
      }
    | Array<{
        user:
          | {
              nome: string | null;
            }
          | Array<{
              nome: string | null;
            }>
          | null;
      }>
    | null;
}

interface BlockedSlotRow {
  id: string;
  profissional_id: string | null;
  data_inicio: string;
  data_fim: string;
  motivo: string | null;
}

interface DashboardMetrics {
  agendamentosHoje: number;
  faturamentoHoje: number;
  faturamentoOntem: number;
  emAndamento: number;
  proximos: number;
  noShow: number;
}

interface CriticalAlert {
  id: string;
  severity: "high" | "medium";
  title: string;
  description: string;
}

type TimelineEntry =
  | {
      kind: "appointment";
      appointment: AppointmentRow;
    }
  | {
      kind: "gap";
      id: string;
      startsAt: string;
      minutes: number;
    };

interface DashboardData {
  adminName: string;
  now: Date;
  metrics: DashboardMetrics;
  timelineEntries: TimelineEntry[];
  alerts: CriticalAlert[];
}

function getGreeting(date: Date): string {
  const hour = date.getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

function pickOne<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

function normalizeStatus(value: string): AppointmentStatus {
  const validStatus: AppointmentStatus[] = [
    "agendado",
    "em_andamento",
    "concluido",
    "cancelado",
    "nao_compareceu",
  ];

  if (validStatus.includes(value as AppointmentStatus)) {
    return value as AppointmentStatus;
  }

  return "agendado";
}

function getRevenueTrendPercentage(
  faturamentoHoje: number,
  faturamentoOntem: number
): number | null {
  if (faturamentoOntem <= 0) return null;
  const value = ((faturamentoHoje - faturamentoOntem) / faturamentoOntem) * 100;
  return Number(value.toFixed(1));
}

function getStatusLabel(status: AppointmentStatus): string {
  const labels: Record<AppointmentStatus, string> = {
    agendado: "Previsto",
    em_andamento: "Em andamento",
    concluido: "Concluido",
    cancelado: "Cancelado",
    nao_compareceu: "Nao compareceu",
  };

  return labels[status];
}

function getStatusClassName(status: AppointmentStatus): string {
  const styles: Record<AppointmentStatus, string> = {
    agendado: "border-l-[#EAD8AC]/40",
    em_andamento: "border-l-[#EAD8AC]",
    concluido: "border-l-[#EAD8AC]/70",
    cancelado: "border-l-[#EAD8AC]/20",
    nao_compareceu: "border-l-[#EAD8AC]/30",
  };

  return styles[status];
}

function formatBlockedSlotDescription(slot: BlockedSlotRow): string {
  const start = new Date(slot.data_inicio);
  const end = new Date(slot.data_fim);
  const range = `${format(start, "HH:mm")} - ${format(end, "HH:mm")}`;
  return slot.motivo ? `${range} | ${slot.motivo}` : range;
}

function buildTimelineEntries(appointments: AppointmentRow[]): TimelineEntry[] {
  const entries: TimelineEntry[] = [];

  appointments.forEach((appointment, index) => {
    entries.push({ kind: "appointment", appointment });

    const next = appointments[index + 1];
    if (!next) return;

    const currentEnd = new Date(appointment.data_hora_fim).getTime();
    const nextStart = new Date(next.data_hora_inicio).getTime();

    if (Number.isNaN(currentEnd) || Number.isNaN(nextStart)) return;

    const gapMinutes = Math.round((nextStart - currentEnd) / 60000);

    if (gapMinutes > 30) {
      entries.push({
        kind: "gap",
        id: `${appointment.id}-${next.id}`,
        startsAt: appointment.data_hora_fim,
        minutes: gapMinutes,
      });
    }
  });

  return entries;
}

async function getDashboardData(): Promise<DashboardData> {
  const supabase = await createClient();
  const now = new Date();

  const todayStart = startOfDay(now).toISOString();
  const todayEnd = endOfDay(now).toISOString();

  const yesterday = subDays(now, 1);
  const yesterdayStart = startOfDay(yesterday).toISOString();
  const yesterdayEnd = endOfDay(yesterday).toISOString();

  const [authResult, appointmentsResult, paymentsTodayResult, paymentsYesterdayResult, blockedSlotsResult] =
    await Promise.all([
      supabase.auth.getUser(),
      supabase
        .from("appointments")
        .select(
          `
            id,
            status,
            data_hora_inicio,
            data_hora_fim,
            valor_cobrado,
            coberto_assinatura,
            cliente:users!appointments_cliente_id_fkey(nome, avatar_url),
            servico:services(nome),
            profissional:professionals(
              user:users(nome)
            )
          `
        )
        .gte("data_hora_inicio", todayStart)
        .lte("data_hora_inicio", todayEnd)
        .not("status", "eq", "cancelado")
        .order("data_hora_inicio", { ascending: true }),
      supabase
        .from("payments")
        .select("valor")
        .gte("created_at", todayStart)
        .lte("created_at", todayEnd)
        .eq("status", "pago"),
      supabase
        .from("payments")
        .select("valor")
        .gte("created_at", yesterdayStart)
        .lte("created_at", yesterdayEnd)
        .eq("status", "pago"),
      supabase
        .from("blocked_slots")
        .select("id, profissional_id, data_inicio, data_fim, motivo")
        .lte("data_inicio", todayEnd)
        .gte("data_fim", todayStart)
        .order("data_inicio", { ascending: true }),
    ]);

  if (appointmentsResult.error) throw appointmentsResult.error;
  if (paymentsTodayResult.error) throw paymentsTodayResult.error;
  if (paymentsYesterdayResult.error) throw paymentsYesterdayResult.error;
  if (blockedSlotsResult.error) throw blockedSlotsResult.error;

  const adminMetadataName = authResult.data.user?.user_metadata?.nome;
  const adminName =
    typeof adminMetadataName === "string" && adminMetadataName.trim().length > 0
      ? adminMetadataName.split(" ")[0]
      : "Admin";

  const appointments = (appointmentsResult.data ?? [])
    .map((row) => {
      const source = row as AppointmentQueryRow;
      const cliente = pickOne(source.cliente);
      const servico = pickOne(source.servico);
      const profissional = pickOne(source.profissional);
      const professionalUser = pickOne(profissional?.user ?? null);

      return {
        id: source.id,
        status: normalizeStatus(source.status),
        data_hora_inicio: source.data_hora_inicio,
        data_hora_fim: source.data_hora_fim,
        valor_cobrado: source.valor_cobrado,
        coberto_assinatura: source.coberto_assinatura,
        cliente: cliente
          ? {
              nome: cliente.nome ?? null,
              avatar_url: cliente.avatar_url ?? null,
            }
          : null,
        servico: servico
          ? {
              nome: servico.nome ?? null,
            }
          : null,
        profissional: professionalUser
          ? {
              user: {
                nome: professionalUser.nome ?? null,
              },
            }
          : null,
      } satisfies AppointmentRow;
    })
    .sort(
      (a, b) =>
        new Date(a.data_hora_inicio).getTime() -
        new Date(b.data_hora_inicio).getTime()
    );

  const paymentsToday = (paymentsTodayResult.data ?? []) as Array<{ valor: number | null }>;
  const paymentsYesterday = (paymentsYesterdayResult.data ?? []) as Array<{
    valor: number | null;
  }>;

  const blockedSlots = (blockedSlotsResult.data ?? []) as BlockedSlotRow[];

  const faturamentoHoje = paymentsToday.reduce(
    (acc, payment) => acc + (payment.valor ?? 0),
    0
  );
  const faturamentoOntem = paymentsYesterday.reduce(
    (acc, payment) => acc + (payment.valor ?? 0),
    0
  );

  const emAndamento = appointments.filter(
    (item) => item.status === "em_andamento"
  ).length;
  const proximos = appointments.filter(
    (item) =>
      item.status === "agendado" && new Date(item.data_hora_inicio).getTime() >= now.getTime()
  ).length;
  const noShow = appointments.filter(
    (item) => item.status === "nao_compareceu"
  ).length;

  const metrics: DashboardMetrics = {
    agendamentosHoje: appointments.length,
    faturamentoHoje,
    faturamentoOntem,
    emAndamento,
    proximos,
    noShow,
  };

  const blockedAlerts: CriticalAlert[] = blockedSlots.map((slot) => ({
    id: slot.id,
    severity: slot.profissional_id ? "medium" : "high",
    title: slot.profissional_id ? "Bloqueio de profissional" : "Bloqueio geral",
    description: formatBlockedSlotDescription(slot),
  }));

  const alerts: CriticalAlert[] = [...blockedAlerts];

  if (noShow > 0) {
    alerts.push({
      id: "noshow-today",
      severity: "medium",
      title: "Nao comparecimentos hoje",
      description: `${noShow} agendamento(s) marcado(s) como nao compareceu`,
    });
  }

  return {
    adminName,
    now,
    metrics,
    timelineEntries: buildTimelineEntries(appointments),
    alerts,
  };
}

function GreetingHeader({ adminName, now }: { adminName: string; now: Date }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm text-[#EAD8AC]/70">{getGreeting(now)},</p>
        <h1 className="text-3xl font-bold tracking-tight">{adminName}</h1>
      </div>

      <div className="hidden text-right sm:block">
        <p className="text-2xl font-bold">{format(now, "dd 'de' MMM", { locale: ptBR })}</p>
        <p className="text-xs uppercase tracking-widest text-[#EAD8AC]/60">
          {format(now, "EEEE", { locale: ptBR })}
        </p>
      </div>
    </div>
  );
}

function MetricsGrid({ metrics }: { metrics: DashboardMetrics }) {
  const revenueTrend = getRevenueTrendPercentage(
    metrics.faturamentoHoje,
    metrics.faturamentoOntem
  );

  const metricCards = [
    {
      key: "agendamentos",
      title: "Agendamentos Hoje",
      value: String(metrics.agendamentosHoje),
      description: "Total de atendimentos do dia",
      icon: Calendar,
    },
    {
      key: "faturamento",
      title: "Faturamento Hoje",
      value: formatCurrency(metrics.faturamentoHoje),
      description:
        revenueTrend === null
          ? "Sem base comparativa de ontem"
          : `${revenueTrend >= 0 ? "+" : ""}${revenueTrend}% vs ontem`,
      icon: DollarSign,
    },
    {
      key: "andamento",
      title: "Em Andamento",
      value: String(metrics.emAndamento),
      description: "Atendimentos em execucao",
      icon: CalendarClock,
    },
    {
      key: "proximos",
      title: "Proximos",
      value: String(metrics.proximos),
      description: "Agendados para os proximos horarios",
      icon: Clock3,
    },
  ] as const;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metricCards.map((card) => (
        <Card key={card.key} className="bg-black/50">
          <CardHeader className="pb-2">
            <div className="mb-3 flex items-center justify-between">
              <div className="rounded-lg bg-[#EAD8AC]/10 p-2 text-[#EAD8AC]">
                <card.icon className="h-5 w-5" />
              </div>
            </div>
            <CardDescription className="text-xs text-[#EAD8AC]/60">
              {card.title}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold sm:text-3xl">{card.value}</p>
            <p className="mt-2 text-xs text-[#EAD8AC]/60">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ScheduleTimeline({ entries }: { entries: TimelineEntry[] }) {
  if (entries.length === 0) {
    return (
      <Card className="bg-black/50">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Fluxo da agenda de hoje
          </CardTitle>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/agenda">Ver calendario</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-dashed border-[#EAD8AC]/30 p-8 text-center">
            <p className="text-sm text-[#EAD8AC]/80">Nenhum agendamento para hoje.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/50">
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Fluxo da agenda de hoje
        </CardTitle>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/agenda">Ver calendario</Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {entries.map((entry) => {
          if (entry.kind === "gap") {
            return (
              <div key={entry.id} className="grid grid-cols-[56px_1fr] items-start gap-3 opacity-70">
                <p className="pt-1 text-xs font-semibold text-[#EAD8AC]/60">
                  {format(new Date(entry.startsAt), "HH:mm")}
                </p>
                <div className="rounded-lg border border-dashed border-[#EAD8AC]/30 p-2 text-xs italic text-[#EAD8AC]/70">
                  Espaco livre de {entry.minutes} min
                </div>
              </div>
            );
          }

          const appointment = entry.appointment;
          const status = getStatusLabel(appointment.status);
          const serviceName = appointment.servico?.nome ?? "Servico";
          const professionalName = appointment.profissional?.user?.nome ?? "Profissional";
          const clientName = appointment.cliente?.nome ?? "Cliente";
          const valueLabel = appointment.coberto_assinatura
            ? "Assinatura"
            : formatCurrency(appointment.valor_cobrado ?? 0);

          return (
            <div
              key={appointment.id}
              className="grid grid-cols-[56px_1fr] items-start gap-3"
            >
              <p className="pt-2 text-xs font-semibold text-[#EAD8AC]/60">
                {format(new Date(appointment.data_hora_inicio), "HH:mm")}
              </p>

              <div
                className={`rounded-xl border border-black border-l-4 bg-black/40 p-4 ${getStatusClassName(
                  appointment.status
                )}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-black">
                      <AvatarImage
                        src={appointment.cliente?.avatar_url ?? undefined}
                        alt={clientName}
                      />
                      <AvatarFallback className="bg-[#EAD8AC] text-[#013648] text-xs">
                        {getInitials(clientName)}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <p className="text-sm font-semibold">{clientName}</p>
                      <p className="text-xs text-[#EAD8AC]/70">
                        {serviceName} | {professionalName}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-semibold">{valueLabel}</p>
                    <Badge variant="outline" className="mt-1 border-black text-[10px]">
                      {status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function AdminQuickActions() {
  const actions = [
    {
      href: "/admin/agenda",
      label: "Novo agendamento",
      icon: Calendar,
      highlighted: true,
    },
    {
      href: "/admin/bloqueios",
      label: "Bloquear horario",
      icon: ShieldAlert,
      highlighted: false,
    },
    {
      href: "/admin/servicos",
      label: "Gerenciar servicos",
      icon: Scissors,
      highlighted: false,
    },
    {
      href: "/admin/financeiro",
      label: "Ver financeiro",
      icon: DollarSign,
      highlighted: false,
    },
  ] as const;

  return (
    <Card className="bg-black/50">
      <CardHeader>
        <CardTitle>Central de acoes</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-3">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={`flex items-center gap-3 rounded-lg border px-3 py-3 text-sm font-medium transition-all ${
              action.highlighted
                ? "border-black bg-[#EAD8AC] text-[#013648] hover:brightness-110"
                : "border-black bg-transparent text-[#EAD8AC] hover:bg-[#EAD8AC]/10"
            }`}
          >
            <action.icon className="h-4 w-4" />
            {action.label}
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}

function OperationalAlerts({ alerts }: { alerts: CriticalAlert[] }) {
  if (alerts.length === 0) return null;

  return (
    <Card className="bg-black/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Alertas operacionais
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`rounded-md border-l-2 bg-black/20 p-3 ${
              alert.severity === "high" ? "border-l-[#EAD8AC]" : "border-l-[#EAD8AC]/60"
            }`}
          >
            <p className="text-sm font-semibold">{alert.title}</p>
            <p className="mt-1 text-xs text-[#EAD8AC]/70">{alert.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-8">
      <GreetingHeader adminName={data.adminName} now={data.now} />

      <MetricsGrid metrics={data.metrics} />

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <ScheduleTimeline entries={data.timelineEntries} />
        </div>

        <div className="space-y-6 lg:col-span-4">
          <AdminQuickActions />
          <OperationalAlerts alerts={data.alerts} />
        </div>
      </div>
    </div>
  );
}
