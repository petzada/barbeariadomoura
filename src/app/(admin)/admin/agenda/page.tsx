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
import { createClient } from "@/lib/supabase/client";
import { cn, formatCurrency, getInitials } from "@/lib/utils";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  CheckCircle,
  XCircle,
  Play,
  Ban,
  Loader2,
  CreditCard,
  Crown,
} from "lucide-react";
import { format, addDays, subDays, startOfDay, endOfDay, parseISO } from "date-fns";
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
  payment_method: string | null;
  cliente: {
    id: string;
    nome: string;
    telefone: string | null;
    avatar_url: string | null;
  };
  servico: {
    id: string;
    nome: string;
    duracao_minutos: number;
  };
  profissional: {
    id: string;
    user: {
      nome: string;
    };
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

export default function AdminAgendaPage() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [actionType, setActionType] = useState<"start" | "finish" | "noshow" | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("dinheiro");
  const [processing, setProcessing] = useState(false);

  // Carregar agendamentos
  useEffect(() => {
    async function loadAppointments() {
      setLoading(true);
      const supabase = createClient();

      const dayStart = startOfDay(selectedDate).toISOString();
      const dayEnd = endOfDay(selectedDate).toISOString();

      const { data, error } = await supabase
        .from("appointments")
        .select(`
          *,
          cliente:users!appointments_cliente_id_fkey(id, nome, telefone, avatar_url),
          servico:services(id, nome, duracao_minutos),
          profissional:professionals(
            id,
            user:users(nome)
          )
        `)
        .gte("data_hora_inicio", dayStart)
        .lte("data_hora_inicio", dayEnd)
        .order("data_hora_inicio");

      if (!error && data) {
        setAppointments(data as Appointment[]);
      }
      setLoading(false);
    }

    loadAppointments();

    // Configurar realtime
    const supabase = createClient();
    const channel = supabase
      .channel("appointments-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "appointments" },
        () => {
          loadAppointments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedDate]);

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
      let updateData: Record<string, string> = {};

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Agenda</h1>
          <p className="text-muted-foreground">
            Gerencie os atendimentos do dia
          </p>
        </div>

        {/* Navegação de data */}
        <div className="flex items-center gap-2">
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
      </div>

      {/* Lista de Agendamentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Agendamentos ({appointments.filter((a) => a.status !== "cancelado").length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhum agendamento para este dia</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => {
                const status = statusConfig[appointment.status] || statusConfig.agendado;
                const dataHora = parseISO(appointment.data_hora_inicio);

                return (
                  <div
                    key={appointment.id}
                    className={cn(
                      "flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border",
                      appointment.status === "cancelado" && "opacity-50"
                    )}
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
                              {appointment.servico.nome} •{" "}
                              {appointment.profissional.user.nome}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="text-right mr-4">
                        <p className="font-medium">
                          {appointment.coberto_assinatura
                            ? "Incluso"
                            : formatCurrency(appointment.valor_cobrado)}
                        </p>
                        {appointment.payment_status === "pago" && (
                          <p className="text-xs text-success">Pago</p>
                        )}
                      </div>

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
                "Confirme a finalização e recebimento do pagamento."}
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
                {actionType === "finish" && !selectedAppointment.coberto_assinatura && (
                  <p>
                    <strong>Valor:</strong>{" "}
                    {formatCurrency(selectedAppointment.valor_cobrado)}
                  </p>
                )}
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
