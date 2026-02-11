"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import { cn, formatCurrency, getInitials, getWhatsAppLink } from "@/lib/utils";
import {
  getClienteAgendamentos,
  cancelarAgendamento,
  validarCancelamento,
} from "@/lib/scheduling/actions";
import {
  Calendar,
  Clock,
  User,
  Scissors,
  X,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  Plus,
  MessageCircle,
  Crown,
} from "lucide-react";
import { format, parseISO, isPast, isFuture } from "date-fns";
import { ptBR } from "date-fns/locale";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5511960234545";

interface Appointment {
  id: string;
  data_hora_inicio: string;
  data_hora_fim: string;
  status: string;
  valor_servico: number;
  valor_cobrado: number;
  coberto_assinatura: boolean;
  payment_status: string;
  profissional_nome: string | null;
  servico: {
    nome: string;
    duracao_minutos: number;
  };
  profissional: {
    foto_url: string | null;
    user: {
      nome: string;
      avatar_url: string | null;
    };
  } | null;
}

const statusConfig: Record<string, { label: string; variant: "default" | "success" | "warning" | "destructive" | "secondary" }> = {
  agendado: { label: "Agendado", variant: "default" },
  em_andamento: { label: "Em andamento", variant: "warning" },
  concluido: { label: "Concluído", variant: "success" },
  cancelado: { label: "Cancelado", variant: "destructive" },
  nao_compareceu: { label: "Não compareceu", variant: "secondary" },
};

export default function MeusAgendamentosPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { loading: loadingUser, isAuthenticated } = useUser();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);

  // Redirecionar se não autenticado
  useEffect(() => {
    if (!loadingUser && !isAuthenticated) {
      router.push("/?redirect=/meus-agendamentos");
    }
  }, [loadingUser, isAuthenticated, router]);

  // Carregar agendamentos
  useEffect(() => {
    async function loadAppointments() {
      try {
        const data = await getClienteAgendamentos();
        setAppointments(data as Appointment[]);
      } catch {
        toast({
          title: "Erro",
          description: "Não foi possível carregar seus agendamentos.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    if (isAuthenticated) {
      loadAppointments();
    }
  }, [isAuthenticated, toast]);

  // Verificar se pode cancelar
  const handleCancelClick = async (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setCancelError(null);

    const validation = await validarCancelamento(appointment.data_hora_inicio);
    if (!validation.pode) {
      setCancelError(validation.motivo || "Não é possível cancelar este agendamento.");
    }

    setShowCancelDialog(true);
  };

  // Confirmar cancelamento
  const handleConfirmCancel = async () => {
    if (!selectedAppointment) return;

    setCancelingId(selectedAppointment.id);

    try {
      const result = await cancelarAgendamento(selectedAppointment.id);

      if (result.success) {
        toast({
          title: "Sucesso",
          description: result.message,
          variant: "success",
        });
        // Atualizar lista
        setAppointments((prev) =>
          prev.map((a) =>
            a.id === selectedAppointment.id ? { ...a, status: "cancelado" } : a
          )
        );
      } else {
        toast({
          title: "Erro",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível cancelar o agendamento.",
        variant: "destructive",
      });
    } finally {
      setCancelingId(null);
      setShowCancelDialog(false);
    }
  };

  // Separar agendamentos futuros e passados
  const futureAppointments = appointments.filter(
    (a) => isFuture(parseISO(a.data_hora_inicio)) && a.status !== "cancelado"
  );
  const pastAppointments = appointments.filter(
    (a) => isPast(parseISO(a.data_hora_inicio)) || a.status === "cancelado"
  );

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#EAD8AC]" />
      </div>
    );
  }

  return (
    <>
      <div className="py-8">
        <div className="container-app max-w-4xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Meus Agendamentos</h1>
              <p className="text-[#EAD8AC] mt-1">
                Gerencie seus horários na Barbearia do Moura
              </p>
            </div>
            <Button asChild>
              <Link href="/agendar">
                <Plus className="mr-2 h-4 w-4" />
                Novo Agendamento
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          ) : appointments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-16 w-16 text-[#EAD8AC] mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Nenhum agendamento encontrado
                </h3>
                <p className="text-[#EAD8AC] text-center mb-6">
                  Você ainda não fez nenhum agendamento. Que tal agendar agora?
                </p>
                <Button asChild>
                  <Link href="/agendar">Agendar Horário</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {/* Próximos agendamentos */}
              {futureAppointments.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold mb-4 flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-[#EAD8AC]" />
                    Próximos Agendamentos
                  </h2>
                  <div className="space-y-4">
                    {futureAppointments.map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        onCancel={() => handleCancelClick(appointment)}
                        canceling={cancelingId === appointment.id}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Histórico */}
              {pastAppointments.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold mb-4 flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-[#EAD8AC]" />
                    Histórico
                  </h2>
                  <div className="space-y-4">
                    {pastAppointments.map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        isPast
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Dialog de Cancelamento */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Agendamento</DialogTitle>
            <DialogDescription>
              {cancelError ? (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-[#EAD8AC]/10 text-[#EAD8AC] mt-4">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p>{cancelError}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      asChild
                    >
                      <a
                        href={getWhatsAppLink(
                          WHATSAPP_NUMBER,
                          `Olá! Preciso de ajuda para cancelar meu agendamento do dia ${selectedAppointment
                            ? format(
                              parseISO(selectedAppointment.data_hora_inicio),
                              "dd/MM/yyyy 'às' HH:mm",
                              { locale: ptBR }
                            )
                            : ""
                          }.`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Falar no WhatsApp
                      </a>
                    </Button>
                  </div>
                </div>
              ) : (
                "Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita."
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedAppointment && !cancelError && (
            <div className="py-4">
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Serviço:</strong> {selectedAppointment.servico?.nome ?? "Serviço"}
                </p>
                <p>
                  <strong>Data:</strong>{" "}
                  {format(
                    parseISO(selectedAppointment.data_hora_inicio),
                    "EEEE, dd 'de' MMMM 'às' HH:mm",
                    { locale: ptBR }
                  )}
                </p>
                <p>
                  <strong>Profissional:</strong>{" "}
                  {selectedAppointment.profissional?.user?.nome || selectedAppointment.profissional_nome || "Profissional removido"}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
            >
              Voltar
            </Button>
            {!cancelError && (
              <Button
                variant="destructive"
                onClick={handleConfirmCancel}
                disabled={!!cancelingId}
              >
                {cancelingId ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cancelando...
                  </>
                ) : (
                  "Confirmar Cancelamento"
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Componente de Card do Agendamento
function AppointmentCard({
  appointment,
  onCancel,
  canceling,
  isPast,
}: {
  appointment: Appointment;
  onCancel?: () => void;
  canceling?: boolean;
  isPast?: boolean;
}) {
  const status = statusConfig[appointment.status] || statusConfig.agendado;
  const dataHora = parseISO(appointment.data_hora_inicio);

  // Calcular horas até o agendamento para determinar ações disponíveis
  const horasAteAgendamento = (dataHora.getTime() - Date.now()) / (1000 * 60 * 60);
  const podeCancelar = horasAteAgendamento >= 4 && appointment.status === "agendado";
  const podeContatarWhatsApp = horasAteAgendamento > 0 && horasAteAgendamento < 4 && appointment.status === "agendado";

  const profissionalNome = appointment.profissional?.user?.nome || appointment.profissional_nome || "Profissional removido";
  const profissionalFoto = appointment.profissional?.foto_url || appointment.profissional?.user?.avatar_url || undefined;

  return (
    <Card className={cn(isPast && "opacity-70")}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Info */}
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={profissionalFoto}
                alt={profissionalNome}
              />
              <AvatarFallback className="bg-primary text-[#EAD8AC]">
                {getInitials(profissionalNome)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold">{appointment.servico?.nome ?? "Serviço"}</h3>
                <Badge variant={status.variant}>{status.label}</Badge>
                {appointment.coberto_assinatura && (
                  <Badge variant="success">
                    <Crown className="h-3 w-3 mr-1" />
                    Assinatura
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-[#EAD8AC]">
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {format(dataHora, "EEE, dd/MM/yyyy", { locale: ptBR })}
                </span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {format(dataHora, "HH:mm")} -{" "}
                  {format(parseISO(appointment.data_hora_fim), "HH:mm")}
                </span>
                <span className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {profissionalNome}
                </span>
              </div>
            </div>
          </div>

          {/* Valor e Ações */}
          <div className="flex items-center gap-4 sm:flex-col sm:items-end">
            <div className="text-right">
              {appointment.coberto_assinatura ? (
                <span className="text-[#EAD8AC] font-semibold">Incluso</span>
              ) : (
                <span className="font-semibold">
                  {formatCurrency(appointment.valor_cobrado)}
                </span>
              )}
            </div>

            {/* Botão Cancelar - disponível apenas se faltam 4+ horas */}
            {!isPast && podeCancelar && onCancel && (
              <Button
                variant="outline"
                size="sm"
                onClick={onCancel}
                disabled={canceling}
              >
                {canceling ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <X className="h-4 w-4 mr-1" />
                    Cancelar
                  </>
                )}
              </Button>
            )}

            {/* Botão WhatsApp - disponível quando faltam menos de 4 horas */}
            {!isPast && podeContatarWhatsApp && (
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <a
                  href={getWhatsAppLink(
                    WHATSAPP_NUMBER,
                    `Olá! Preciso de ajuda com meu agendamento do dia ${format(
                      dataHora,
                      "dd/MM/yyyy 'às' HH:mm",
                      { locale: ptBR }
                    )}.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  WhatsApp
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card >
  );
}



