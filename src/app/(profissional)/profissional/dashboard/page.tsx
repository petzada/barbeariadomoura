"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client";
import { cn, formatCurrency, getInitials } from "@/lib/utils";
import { DateFilterCalendarButton } from "@/components/date-filter-calendar-button";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  Play,
  Ban,
  Loader2,
  Crown,
  DollarSign,
  CalendarOff,
  User,
  Settings,
  ArrowRight,
} from "lucide-react";
import {
  format,
  addDays,
  addMonths,
  subDays,
  subMonths,
  startOfDay,
  endOfDay,
  parseISO,
  startOfMonth,
  endOfMonth,
  isAfter,
} from "date-fns";
import { ptBR } from "date-fns/locale";

interface Appointment {
  id: string;
  data_hora_inicio: string;
  data_hora_fim: string;
  status: string;
  valor_servico: number;
  valor_cobrado: number;
  coberto_assinatura: boolean;
  payment_status: string;
  cliente: {
    nome: string;
    telefone: string | null;
    avatar_url: string | null;
  };
  servico: {
    nome: string;
    duracao_minutos: number;
  };
}

const statusConfig: Record<
  string,
  { label: string; variant: "default" | "success" | "warning" | "destructive" | "secondary" }
> = {
  agendado: { label: "Agendado", variant: "default" },
  em_andamento: { label: "Em andamento", variant: "warning" },
  concluido: { label: "Concluído", variant: "success" },
  cancelado: { label: "Cancelado", variant: "destructive" },
  nao_compareceu: { label: "Não compareceu", variant: "secondary" },
};

export default function ProfissionalDashboardPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [markedDates, setMarkedDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [professionalId, setProfessionalId] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [actionType, setActionType] = useState<"start" | "finish" | "noshow" | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("dinheiro");
  const [processing, setProcessing] = useState(false);

  // Métricas
  const [metricas, setMetricas] = useState({
    atendimentosHoje: 0,
    ganhosMes: 0,
    atendimentosMes: 0,
  });

  // Próximo atendimento
  const [proximoAtendimento, setProximoAtendimento] = useState<Appointment | null>(null);

  // Buscar professional_id
  useEffect(() => {
    async function loadProfessional() {
      if (!user) return;

      const supabase = createClient();
      const { data } = await supabase
        .from("professionals")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setProfessionalId(data.id);
      }
    }

    loadProfessional();
  }, [user]);

  // Carregar agendamentos e métricas
  useEffect(() => {
    async function loadData() {
      if (!professionalId) return;

      setLoading(true);
      const supabase = createClient();

      const dayStart = startOfDay(selectedDate).toISOString();
      const dayEnd = endOfDay(selectedDate).toISOString();
      const monthStart = startOfMonth(new Date()).toISOString();
      const monthEnd = endOfMonth(new Date()).toISOString();

      // Agendamentos do dia
      const { data: appointmentsData } = await supabase
        .from("appointments")
        .select(`
          *,
          cliente:users!appointments_cliente_id_fkey(nome, telefone, avatar_url),
          servico:services(nome, duracao_minutos)
        `)
        .eq("profissional_id", professionalId)
        .gte("data_hora_inicio", dayStart)
        .lte("data_hora_inicio", dayEnd)
        .order("data_hora_inicio");

      if (appointmentsData) {
        setAppointments(appointmentsData as Appointment[]);
      }

      const rangeStart = startOfMonth(subMonths(selectedDate, 2)).toISOString();
      const rangeEnd = endOfMonth(addMonths(selectedDate, 2)).toISOString();
      const { data: markedData } = await supabase
        .from("appointments")
        .select("data_hora_inicio")
        .eq("profissional_id", professionalId)
        .gte("data_hora_inicio", rangeStart)
        .lte("data_hora_inicio", rangeEnd)
        .not("status", "eq", "cancelado");

      if (markedData) {
        const uniqueDates = Array.from(
          new Set(
            markedData.map((item) =>
              format(parseISO(item.data_hora_inicio), "yyyy-MM-dd")
            )
          )
        );
        setMarkedDates(uniqueDates);
      }

      // Métricas
      const { count: atendimentosHoje } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("profissional_id", professionalId)
        .gte("data_hora_inicio", dayStart)
        .lte("data_hora_inicio", dayEnd)
        .eq("status", "concluido");

      const { count: atendimentosMes } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("profissional_id", professionalId)
        .gte("data_hora_inicio", monthStart)
        .lte("data_hora_inicio", monthEnd)
        .eq("status", "concluido");

      const { data: comissoesData } = await supabase
        .from("commissions")
        .select("valor_comissao")
        .eq("profissional_id", professionalId)
        .gte("created_at", monthStart)
        .lte("created_at", monthEnd);

      const ganhosMes = comissoesData?.reduce(
        (acc, c) => acc + (c.valor_comissao || 0),
        0
      ) || 0;

      setMetricas({
        atendimentosHoje: atendimentosHoje || 0,
        ganhosMes,
        atendimentosMes: atendimentosMes || 0,
      });

      // Buscar próximo atendimento
      const agora = new Date().toISOString();
      const { data: proximoData } = await supabase
        .from("appointments")
        .select(`
          *,
          cliente:users!appointments_cliente_id_fkey(nome, telefone, avatar_url),
          servico:services(nome, duracao_minutos)
        `)
        .eq("profissional_id", professionalId)
        .gte("data_hora_inicio", agora)
        .in("status", ["agendado", "em_andamento"])
        .order("data_hora_inicio")
        .limit(1)
        .single();

      if (proximoData) {
        setProximoAtendimento(proximoData as Appointment);
      } else {
        setProximoAtendimento(null);
      }

      setLoading(false);
    }

    loadData();
  }, [professionalId, selectedDate]);

  // Navegar entre dias
  const goToPreviousDay = () => setSelectedDate((prev) => subDays(prev, 1));
  const goToNextDay = () => setSelectedDate((prev) => addDays(prev, 1));
  const goToToday = () => setSelectedDate(new Date());

  // Abrir dialog de ação
  const openActionDialog = (appointment: Appointment, action: "start" | "finish" | "noshow") => {
    setSelectedAppointment(appointment);
    setActionType(action);
    setShowActionDialog(true);
  };

  // Executar ação
  const handleAction = async () => {
    if (!selectedAppointment || !actionType) return;

    setProcessing(true);
    const supabase = createClient();

    try {
      let updateData: Record<string, any> = {};

      switch (actionType) {
        case "start":
          updateData = { status: "em_andamento" };
          break;
        case "finish":
          updateData = {
            status: "concluido",
            payment_status: "pago",
            payment_method: selectedAppointment.coberto_assinatura
              ? "assinatura"
              : paymentMethod,
          };
          break;
        case "noshow":
          updateData = { status: "nao_compareceu" };
          break;
      }

      const { error } = await supabase
        .from("appointments")
        .update(updateData)
        .eq("id", selectedAppointment.id);

      if (error) throw error;

      if (actionType === "finish" && selectedAppointment.valor_cobrado > 0) {
        const paymentPayload = {
          agendamento_id: selectedAppointment.id,
          valor: selectedAppointment.valor_cobrado,
          metodo: selectedAppointment.coberto_assinatura ? "assinatura" : paymentMethod,
          status: "pago" as const,
        };

        const { data: existingPayment } = await supabase
          .from("payments")
          .select("id")
          .eq("agendamento_id", selectedAppointment.id)
          .maybeSingle();

        if (existingPayment?.id) {
          await supabase.from("payments").update(paymentPayload).eq("id", existingPayment.id);
        } else {
          await supabase.from("payments").insert(paymentPayload);
        }
      }

      // Atualizar lista local
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === selectedAppointment.id ? { ...a, ...updateData } : a
        )
      );

      toast({
        title: "Sucesso",
        description:
          actionType === "start"
            ? "Atendimento iniciado"
            : actionType === "finish"
            ? "Atendimento finalizado"
            : "Marcado como não compareceu",
        variant: "success",
      });

      setShowActionDialog(false);
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o agendamento",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  // Saudação baseada no horário
  const getSaudacao = () => {
    const hora = new Date().getHours();
    if (hora < 12) return "Bom dia";
    if (hora < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <div className="space-y-6">
      {/* Header com Saudação */}
      <div>
        <p className="text-muted-foreground">{getSaudacao()},</p>
        <h1 className="text-2xl font-bold">{user?.nome?.split(" ")[0]}</h1>
      </div>

      {/* Ações Rápidas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link href="/profissional/dashboard#agenda" className="block">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center min-h-[100px]">
              <Calendar className="h-8 w-8 mb-2 text-primary" />
              <p className="text-sm font-medium">Minha Agenda</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/profissional/comissoes" className="block">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center min-h-[100px]">
              <DollarSign className="h-8 w-8 mb-2 text-success" />
              <p className="text-sm font-medium">Comissões</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/profissional/bloqueios" className="block">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center min-h-[100px]">
              <CalendarOff className="h-8 w-8 mb-2 text-warning" />
              <p className="text-sm font-medium">Bloqueios</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/profissional/perfil" className="block">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center min-h-[100px]">
              <User className="h-8 w-8 mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">Meu Perfil</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Próximo Atendimento */}
      {proximoAtendimento && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Próximo Atendimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={proximoAtendimento.cliente.avatar_url || undefined}
                    alt={proximoAtendimento.cliente.nome}
                  />
                  <AvatarFallback className="bg-secondary text-secondary-foreground">
                    {getInitials(proximoAtendimento.cliente.nome)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{proximoAtendimento.cliente.nome}</p>
                  <p className="text-sm text-muted-foreground">
                    {proximoAtendimento.servico.nome}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">
                  {format(parseISO(proximoAtendimento.data_hora_inicio), "HH:mm")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {format(parseISO(proximoAtendimento.data_hora_inicio), "dd/MM", { locale: ptBR })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Atendimentos Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas.atendimentosHoje}</div>
            <p className="text-xs text-muted-foreground">Concluídos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Atendimentos no Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas.atendimentosMes}</div>
            <p className="text-xs text-muted-foreground">Concluídos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ganhos do Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {formatCurrency(metricas.ganhosMes)}
            </div>
            <p className="text-xs text-muted-foreground">Em comissões</p>
          </CardContent>
        </Card>
      </div>

      {/* Link para Configurações */}
      <Card className="hover:border-primary/30 transition-colors">
        <Link href="/profissional/perfil/configuracoes">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Configurações</span>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </CardContent>
        </Link>
      </Card>

      {/* Título da Agenda */}
      <div id="agenda">
        <h2 className="text-xl font-bold">Agenda do Dia</h2>
        <p className="text-muted-foreground text-sm">
          Gerencie seus atendimentos
        </p>
      </div>

      {/* Navegação de data */}
      <div className="flex items-center justify-center gap-2">
        <Button variant="outline" size="icon" onClick={goToPreviousDay}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" onClick={goToToday}>
          Hoje
        </Button>
        <div className="min-w-0 text-center font-medium text-sm sm:text-base">
          {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
        </div>
        <DateFilterCalendarButton
          value={selectedDate}
          onChange={setSelectedDate}
          markedDates={markedDates}
          title="Filtrar meus atendimentos por data"
        />
        <Button variant="outline" size="icon" onClick={goToNextDay}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Lista de Agendamentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Meus Atendimentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
          ) : appointments.filter((a) => a.status !== "cancelado").length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhum atendimento para este dia</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments
                .filter((a) => a.status !== "cancelado")
                .map((appointment) => {
                  const status = statusConfig[appointment.status] || statusConfig.agendado;
                  const dataHora = parseISO(appointment.data_hora_inicio);

                  return (
                    <div
                      key={appointment.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border"
                    >
                      {/* Info */}
                      <div className="flex items-start gap-4 mb-4 sm:mb-0">
                        <div className="text-center min-w-[60px]">
                          <p className="text-2xl font-bold">
                            {format(dataHora, "HH:mm")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {appointment.servico.duracao_minutos} min
                          </p>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <Badge variant={status.variant}>{status.label}</Badge>
                            {appointment.coberto_assinatura && (
                              <Badge variant="success">
                                <Crown className="h-3 w-3 mr-1" />
                                Assinatura
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={appointment.cliente.avatar_url || undefined}
                                alt={appointment.cliente.nome}
                              />
                              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                {getInitials(appointment.cliente.nome)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{appointment.cliente.nome}</p>
                              <p className="text-sm text-muted-foreground">
                                {appointment.servico.nome}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {appointment.status === "agendado" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => openActionDialog(appointment, "start")}
                            >
                              <Play className="h-4 w-4 mr-1" />
                              Iniciar
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => openActionDialog(appointment, "noshow")}
                            >
                              <Ban className="h-4 w-4 mr-1" />
                              Faltou
                            </Button>
                          </>
                        )}

                        {appointment.status === "em_andamento" && (
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => openActionDialog(appointment, "finish")}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Finalizar
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Ação */}
      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "start" && "Iniciar Atendimento"}
              {actionType === "finish" && "Finalizar Atendimento"}
              {actionType === "noshow" && "Cliente Não Compareceu"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "start" &&
                "Confirme o início do atendimento para este cliente."}
              {actionType === "finish" &&
                "Confirme a finalização do atendimento."}
              {actionType === "noshow" &&
                "Confirme que o cliente não compareceu ao agendamento."}
            </DialogDescription>
          </DialogHeader>

          {selectedAppointment && (
            <div className="py-4">
              <div className="bg-secondary rounded-lg p-4 space-y-2">
                <p>
                  <strong>Cliente:</strong> {selectedAppointment.cliente.nome}
                </p>
                <p>
                  <strong>Serviço:</strong> {selectedAppointment.servico.nome}
                </p>
                <p>
                  <strong>Horário:</strong>{" "}
                  {format(parseISO(selectedAppointment.data_hora_inicio), "HH:mm")}
                </p>
              </div>

              {/* Seletor de forma de pagamento */}
              {actionType === "finish" && !selectedAppointment.coberto_assinatura && (
                <div className="mt-4">
                  <label className="text-sm font-medium mb-2 block">
                    Forma de Pagamento
                  </label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dinheiro">Dinheiro</SelectItem>
                      <SelectItem value="pix">PIX</SelectItem>
                      <SelectItem value="cartao_credito">Cartão de Crédito</SelectItem>
                      <SelectItem value="cartao_debito">Cartão de Débito</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowActionDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleAction}
              disabled={processing}
              variant={actionType === "noshow" ? "destructive" : "default"}
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                "Confirmar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
