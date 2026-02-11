"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { getInitials } from "@/lib/utils";
import { getAllFeedbacks, getFeedbackStats } from "@/lib/feedback/actions";
import {
  Star,
  MessageSquare,
  TrendingUp,
  Users,
  BarChart3,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Feedback {
  id: string;
  nota: number;
  comentario: string | null;
  profissional_id: string | null;
  profissional_nome: string | null;
  created_at: string;
  cliente: {
    nome: string;
    avatar_url: string | null;
  };
  agendamento: {
    data_hora_inicio: string;
    servico: {
      nome: string;
    };
  };
}

interface Professional {
  id: string;
  user: {
    nome: string;
  };
}

interface Stats {
  totalFeedbacks: number;
  mediaGeral: number;
  estatisticasPorProfissional: {
    profissionalId: string;
    profissionalNome: string;
    totalFeedbacks: number;
    mediaNotas: number;
  }[];
  distribuicaoNotas: {
    nota: number;
    quantidade: number;
  }[];
}

export default function AdminFeedbacksPage() {
  const { toast } = useToast();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<string>("todos");

  // Carregar dados
  useEffect(() => {
    async function loadData() {
      try {
        const supabase = createClient();

        // Carregar profissionais para o filtro
        const { data: profsData } = await supabase
          .from("professionals")
          .select("id, user:users(nome)")
          .eq("ativo", true);

        if (profsData) {
          const transformed = profsData.map((p: any) => ({
            id: p.id,
            user: Array.isArray(p.user) ? p.user[0] : p.user,
          }));
          setProfessionals(transformed);
        }

        // Carregar feedbacks
        const feedbacksData = await getAllFeedbacks(
          filtro !== "todos" ? { profissionalId: filtro } : undefined
        );
        // Transformar dados para o formato esperado
        const transformedFeedbacks = (feedbacksData || []).map((f: any) => ({
          ...f,
          cliente: Array.isArray(f.cliente) ? f.cliente[0] : f.cliente,
          agendamento: Array.isArray(f.agendamento) ? {
            ...f.agendamento[0],
            servico: Array.isArray(f.agendamento[0]?.servico) ? f.agendamento[0].servico[0] : f.agendamento[0]?.servico
          } : {
            ...f.agendamento,
            servico: Array.isArray(f.agendamento?.servico) ? f.agendamento.servico[0] : f.agendamento?.servico
          }
        }));
        setFeedbacks(transformedFeedbacks as Feedback[]);

        // Carregar estatísticas
        const statsData = await getFeedbackStats();
        setStats(statsData);
      } catch {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os feedbacks.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [filtro, toast]);

  // Renderizar estrelas
  const renderStars = (nota: number, size: "sm" | "md" = "sm") => {
    const sizeClass = size === "sm" ? "h-4 w-4" : "h-5 w-5";
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= nota
                ? "fill-primary text-[#EAD8AC]"
                : "text-[#EAD8AC]/30"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Feedbacks</h1>
        <p className="text-[#EAD8AC]">
          Acompanhe as avaliações dos clientes sobre os atendimentos
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
          <Skeleton className="h-64" />
        </div>
      ) : (
        <>
          {/* Cards de Estatísticas */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Avaliações
                </CardTitle>
                <MessageSquare className="h-4 w-4 text-[#EAD8AC]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.totalFeedbacks || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Média Geral
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-[#EAD8AC]" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">
                    {stats?.mediaGeral || 0}
                  </span>
                  {renderStars(Math.round(stats?.mediaGeral || 0), "md")}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  5 Estrelas
                </CardTitle>
                <Star className="h-4 w-4 text-[#EAD8AC] fill-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.distribuicaoNotas?.find((d) => d.nota === 5)?.quantidade || 0}
                </div>
                <p className="text-xs text-[#EAD8AC]">
                  {stats?.totalFeedbacks
                    ? Math.round(
                        ((stats.distribuicaoNotas?.find((d) => d.nota === 5)?.quantidade || 0) /
                          stats.totalFeedbacks) *
                          100
                      )
                    : 0}
                  % do total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Profissionais Avaliados
                </CardTitle>
                <Users className="h-4 w-4 text-[#EAD8AC]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.estatisticasPorProfissional?.length || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Estatísticas por Profissional */}
          {stats?.estatisticasPorProfissional && stats.estatisticasPorProfissional.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Ranking de Profissionais
                </CardTitle>
                <CardDescription>
                  Média de avaliações por profissional
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.estatisticasPorProfissional.map((prof, index) => (
                    <div
                      key={prof.profissionalId}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-[#EAD8AC] w-6">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium">{prof.profissionalNome}</p>
                          <p className="text-sm text-[#EAD8AC]">
                            {prof.totalFeedbacks} avaliações
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">
                          {Math.round(prof.mediaNotas * 10) / 10}
                        </span>
                        {renderStars(Math.round(prof.mediaNotas))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filtros e Lista de Feedbacks */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Avaliações Recentes
                </CardTitle>
                <Select value={filtro} onValueChange={setFiltro}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filtrar por profissional" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os profissionais</SelectItem>
                    {professionals.map((prof) => (
                      <SelectItem key={prof.id} value={prof.id}>
                        {prof.user?.nome ?? "Profissional"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {feedbacks.length === 0 ? (
                <div className="text-center py-12 text-[#EAD8AC]">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhuma avaliação encontrada</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {feedbacks.map((feedback) => (
                    <div
                      key={feedback.id}
                      className="flex flex-col sm:flex-row sm:items-start gap-4 p-4 rounded-lg border"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={feedback.cliente?.avatar_url || undefined}
                          alt={feedback.cliente?.nome ?? "Cliente"}
                        />
                        <AvatarFallback className="bg-primary text-[#EAD8AC]">
                          {getInitials(feedback.cliente?.nome ?? "C")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium">
                            {feedback.cliente?.nome ?? "Cliente"}
                          </span>
                          {renderStars(feedback.nota)}
                          <Badge variant="secondary">
                            {feedback.profissional_nome || "Profissional removido"}
                          </Badge>
                        </div>
                        <p className="text-sm text-[#EAD8AC]">
                          {feedback.agendamento?.servico?.nome ?? "Serviço"} •{" "}
                          {format(
                            parseISO(feedback.agendamento.data_hora_inicio),
                            "dd/MM/yyyy",
                            { locale: ptBR }
                          )}
                        </p>
                        {feedback.comentario && (
                          <p className="text-sm italic mt-2">
                            &ldquo;{feedback.comentario}&rdquo;
                          </p>
                        )}
                        <p className="text-xs text-[#EAD8AC]">
                          Avaliado em{" "}
                          {format(
                            parseISO(feedback.created_at),
                            "dd/MM/yyyy 'às' HH:mm",
                            { locale: ptBR }
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}


