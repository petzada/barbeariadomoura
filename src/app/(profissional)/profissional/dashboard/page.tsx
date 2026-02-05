"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { format, addDays, subDays, startOfDay, endOfDay, parseISO, startOfMonth, endOfMonth } from "date-fns";
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
  });

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

      // Métricas
      const { count: atendimentosHoje } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("profissional_id", professionalId)
        .gte("data_hora_inicio", dayStart)
        .lte("data_hora_inicio", dayEnd)
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
      });

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Minha Agenda</h1>
        <p className="text-muted-foreground">
          Gerencie seus atendimentos do dia
        </p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

      {/* Navegação de data */}
      <div className="flex items-center justify-center gap-2">
        <Button variant="outline" size="icon" onClick={goToPreviousDay}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" onClick={goToToday}>
          Hoje
        </Button>
        <div className="min-w-[200px] text-center font-medium">
          {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
        </div>
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
