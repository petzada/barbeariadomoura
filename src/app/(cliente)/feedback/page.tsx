"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import { getInitials } from "@/lib/utils";
import {
  getAgendamentosPendentesFeedback,
  getMeusFeedbacks,
  enviarFeedback,
} from "@/lib/feedback/actions";
import {
  Star,
  MessageSquare,
  Clock,
  Loader2,
  CheckCircle,
  Scissors,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AgendamentoPendente {
  id: string;
  data_hora_inicio: string;
  data_hora_fim: string;
  profissional_id: string | null;
  profissional_nome: string | null;
  servico: {
    id: string;
    nome: string;
  };
  profissional: {
    id: string;
    foto_url: string | null;
    user: {
      nome: string;
      avatar_url: string | null;
    };
  } | null;
}

interface MeuFeedback {
  id: string;
  nota: number;
  comentario: string | null;
  profissional_nome: string | null;
  created_at: string;
  agendamento: {
    data_hora_inicio: string;
    servico: {
      nome: string;
    };
  };
}

export default function FeedbackPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { loading: loadingUser, isAuthenticated } = useUser();

  const [pendentes, setPendentes] = useState<AgendamentoPendente[]>([]);
  const [meusFeedbacks, setMeusFeedbacks] = useState<MeuFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [selectedAgendamento, setSelectedAgendamento] = useState<AgendamentoPendente | null>(null);
  const [nota, setNota] = useState(5);
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);

  // Redirecionar se não autenticado
  useEffect(() => {
    if (!loadingUser && !isAuthenticated) {
      router.push("/login?redirect=/feedback");
    }
  }, [loadingUser, isAuthenticated, router]);

  // Carregar dados
  useEffect(() => {
    async function loadData() {
      try {
        const [pendentesData, feedbacksData] = await Promise.all([
          getAgendamentosPendentesFeedback(),
          getMeusFeedbacks(),
        ]);
        // Transformar dados para o formato esperado
        const transformedPendentes = (pendentesData || []).map((p: any) => ({
          ...p,
          servico: Array.isArray(p.servico) ? p.servico[0] : p.servico,
          profissional: Array.isArray(p.profissional) ? (p.profissional[0] ? {
            ...p.profissional[0],
            user: Array.isArray(p.profissional[0]?.user) ? p.profissional[0].user[0] : p.profissional[0]?.user
          } : null) : (p.profissional ? {
            ...p.profissional,
            user: Array.isArray(p.profissional?.user) ? p.profissional.user[0] : p.profissional?.user
          } : null)
        }));
        const transformedFeedbacks = (feedbacksData || []).map((f: any) => ({
          ...f,
          agendamento: Array.isArray(f.agendamento) ? {
            ...f.agendamento[0],
            servico: Array.isArray(f.agendamento[0]?.servico) ? f.agendamento[0].servico[0] : f.agendamento[0]?.servico
          } : {
            ...f.agendamento,
            servico: Array.isArray(f.agendamento?.servico) ? f.agendamento.servico[0] : f.agendamento?.servico
          }
        }));
        setPendentes(transformedPendentes as AgendamentoPendente[]);
        setMeusFeedbacks(transformedFeedbacks as MeuFeedback[]);
      } catch {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, toast]);

  // Abrir dialog de feedback
  const openFeedbackDialog = (agendamento: AgendamentoPendente) => {
    setSelectedAgendamento(agendamento);
    setNota(5);
    setComentario("");
    setShowFeedbackDialog(true);
  };

  // Enviar feedback
  const handleEnviarFeedback = async () => {
    if (!selectedAgendamento) return;

    setEnviando(true);
    try {
      const result = await enviarFeedback(
        selectedAgendamento.id,
        nota,
        comentario
      );

      if (result.success) {
        toast({
          title: "Sucesso",
          description: result.message,
          variant: "success",
        });

        // Atualizar listas
        setPendentes((prev) => prev.filter((p) => p.id !== selectedAgendamento.id));

        // Adicionar ao meus feedbacks
        const novoFeedback: MeuFeedback = {
          id: Date.now().toString(),
          nota,
          comentario: comentario || null,
          profissional_nome:
            selectedAgendamento.profissional?.user?.nome ||
            selectedAgendamento.profissional_nome,
          created_at: new Date().toISOString(),
          agendamento: {
            data_hora_inicio: selectedAgendamento.data_hora_inicio,
            servico: selectedAgendamento.servico,
          },
        };
        setMeusFeedbacks((prev) => [novoFeedback, ...prev]);

        setShowFeedbackDialog(false);
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
        description: "Não foi possível enviar a avaliação.",
        variant: "destructive",
      });
    } finally {
      setEnviando(false);
    }
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="py-8">
        <div className="container-app max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Avaliações</h1>
            <p className="text-muted-foreground mt-1">
              Avalie seus atendimentos e ajude-nos a melhorar
            </p>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          ) : (
            <Tabs defaultValue="pendentes" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pendentes" className="relative">
                  Pendentes
                  {pendentes.length > 0 && (
                    <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs flex items-center justify-center">
                      {pendentes.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="enviados">
                  Enviados ({meusFeedbacks.length})
                </TabsTrigger>
              </TabsList>

              {/* Tab: Pendentes */}
              <TabsContent value="pendentes" className="space-y-4">
                {pendentes.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <CheckCircle className="h-16 w-16 text-success mb-4" />
                      <h3 className="text-xl font-semibold mb-2">
                        Tudo em dia!
                      </h3>
                      <p className="text-muted-foreground text-center">
                        Você não tem avaliações pendentes.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  pendentes.map((agendamento) => {
                    const profNome =
                      agendamento.profissional?.user?.nome ||
                      agendamento.profissional_nome ||
                      "Profissional";
                    const profFoto =
                      agendamento.profissional?.foto_url ||
                      agendamento.profissional?.user?.avatar_url ||
                      undefined;

                    return (
                      <Card key={agendamento.id}>
                        <CardContent className="p-6">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={profFoto} alt={profNome} />
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                  {getInitials(profNome)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold">
                                  {agendamento.servico?.nome ?? "Serviço"}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  com {profNome}
                                </p>
                                <p className="text-sm text-muted-foreground flex items-center mt-1">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {format(
                                    parseISO(agendamento.data_hora_inicio),
                                    "dd/MM/yyyy 'às' HH:mm",
                                    { locale: ptBR }
                                  )}
                                </p>
                              </div>
                            </div>
                            <Button onClick={() => openFeedbackDialog(agendamento)}>
                              <Star className="h-4 w-4 mr-2" />
                              Avaliar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </TabsContent>

              {/* Tab: Enviados */}
              <TabsContent value="enviados" className="space-y-4">
                {meusFeedbacks.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
                      <h3 className="text-xl font-semibold mb-2">
                        Nenhuma avaliação enviada
                      </h3>
                      <p className="text-muted-foreground text-center">
                        Suas avaliações aparecerão aqui.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  meusFeedbacks.map((feedback) => (
                    <Card key={feedback.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Scissors className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">
                                {feedback.agendamento?.servico?.nome ?? "Serviço"}
                              </span>
                              <span className="text-muted-foreground">
                                • {feedback.profissional_nome || "Profissional"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${star <= feedback.nota
                                      ? "fill-primary text-primary"
                                      : "text-muted-foreground"
                                    }`}
                                />
                              ))}
                            </div>
                          </div>
                          {feedback.comentario && (
                            <p className="text-sm text-muted-foreground italic">
                              &ldquo;{feedback.comentario}&rdquo;
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Atendimento em{" "}
                            {format(
                              parseISO(feedback.agendamento.data_hora_inicio),
                              "dd/MM/yyyy",
                              { locale: ptBR }
                            )}{" "}
                            • Avaliado em{" "}
                            {format(
                              parseISO(feedback.created_at),
                              "dd/MM/yyyy",
                              { locale: ptBR }
                            )}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>

      {/* Dialog de Feedback */}
      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Avaliar Atendimento</DialogTitle>
            <DialogDescription>
              Como foi seu atendimento? Sua opinião é muito importante para nós.
            </DialogDescription>
          </DialogHeader>

          {selectedAgendamento && (
            <div className="py-4 space-y-6">
              {/* Info do agendamento */}
              <div className="bg-secondary rounded-lg p-4">
                <p className="font-medium">{selectedAgendamento.servico?.nome ?? "Serviço"}</p>
                <p className="text-sm text-muted-foreground">
                  com{" "}
                  {selectedAgendamento.profissional?.user?.nome ||
                    selectedAgendamento.profissional_nome ||
                    "Profissional"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {format(
                    parseISO(selectedAgendamento.data_hora_inicio),
                    "dd/MM/yyyy 'às' HH:mm",
                    { locale: ptBR }
                  )}
                </p>
              </div>

              {/* Seletor de nota */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Nota</label>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNota(star)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-8 w-8 ${star <= nota
                            ? "fill-primary text-primary"
                            : "text-muted-foreground hover:text-primary/50"
                          }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  {nota === 1 && "Muito ruim"}
                  {nota === 2 && "Ruim"}
                  {nota === 3 && "Regular"}
                  {nota === 4 && "Bom"}
                  {nota === 5 && "Excelente"}
                </p>
              </div>

              {/* Comentário */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Comentário{" "}
                  <span className="text-muted-foreground font-normal">
                    (opcional)
                  </span>
                </label>
                <Textarea
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="Conte como foi sua experiência..."
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowFeedbackDialog(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleEnviarFeedback} disabled={enviando}>
              {enviando ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar Avaliação"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
