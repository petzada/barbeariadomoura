"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";
import { DateFilterCalendarButton } from "@/components/date-filter-calendar-button";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Scissors,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  parseISO,
} from "date-fns";
import { ptBR } from "date-fns/locale";

interface Commission {
  id: string;
  valor_servico: number;
  percentual: number;
  valor_comissao: number;
  created_at: string;
  agendamento: {
    data_hora_inicio: string;
    servico: {
      nome: string;
    };
    cliente: {
      nome: string;
    };
  };
}

interface MonthlyStats {
  totalComissoes: number;
  atendimentos: number;
  ticketMedio: number;
  percentualMedio: number;
}

export default function ComissoesPage() {
  const { user } = useUser();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [markedDates, setMarkedDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [professionalId, setProfessionalId] = useState<string | null>(null);
  const [stats, setStats] = useState<MonthlyStats>({
    totalComissoes: 0,
    atendimentos: 0,
    ticketMedio: 0,
    percentualMedio: 0,
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

  // Carregar comissões do mês selecionado
  useEffect(() => {
    async function loadCommissions() {
      if (!professionalId) return;

      setLoading(true);
      const supabase = createClient();

      const monthStart = startOfMonth(selectedMonth).toISOString();
      const monthEnd = endOfMonth(selectedMonth).toISOString();

      const { data } = await supabase
        .from("commissions")
        .select(`
          id,
          valor_servico,
          percentual,
          valor_comissao,
          created_at,
          agendamento:appointments(
            data_hora_inicio,
            servico:services(nome),
            cliente:users!appointments_cliente_id_fkey(nome)
          )
        `)
        .eq("profissional_id", professionalId)
        .gte("created_at", monthStart)
        .lte("created_at", monthEnd)
        .order("created_at", { ascending: false });

      if (data) {
        setCommissions(data as unknown as Commission[]);

        // Calcular estatísticas
        const totalComissoes = data.reduce(
          (acc, c) => acc + (c.valor_comissao || 0),
          0
        );
        const atendimentos = data.length;
        const ticketMedio = atendimentos > 0 ? totalComissoes / atendimentos : 0;
        const percentualMedio =
          atendimentos > 0
            ? data.reduce((acc, c) => acc + (c.percentual || 0), 0) /
              atendimentos
            : 0;

        setStats({
          totalComissoes,
          atendimentos,
          ticketMedio,
          percentualMedio,
        });
      }

      const markerStart = startOfMonth(subMonths(selectedMonth, 4)).toISOString();
      const markerEnd = endOfMonth(addMonths(selectedMonth, 4)).toISOString();
      const { data: markerData } = await supabase
        .from("commissions")
        .select("created_at")
        .eq("profissional_id", professionalId)
        .gte("created_at", markerStart)
        .lte("created_at", markerEnd);

      if (markerData) {
        const uniqueDates = Array.from(
          new Set(
            markerData.map((item) =>
              format(parseISO(item.created_at), "yyyy-MM-dd")
            )
          )
        );
        setMarkedDates(uniqueDates);
      }

      setLoading(false);
    }

    loadCommissions();
  }, [professionalId, selectedMonth]);

  // Navegar entre meses
  const goToPreviousMonth = () => setSelectedMonth((prev) => subMonths(prev, 1));
  const goToNextMonth = () => setSelectedMonth((prev) => addMonths(prev, 1));
  const goToCurrentMonth = () => setSelectedMonth(new Date());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Minhas Comissões</h1>
        <p className="text-[#EAD8AC]">
          Acompanhe seus ganhos mensais e histórico de comissões
        </p>
      </div>

      {/* Navegação de mês */}
      <div className="flex items-center justify-center gap-2">
        <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" onClick={goToCurrentMonth}>
          Mês Atual
        </Button>
        <div className="min-w-0 text-center font-medium text-sm sm:text-base">
          {format(selectedMonth, "MMMM 'de' yyyy", { locale: ptBR })}
        </div>
        <DateFilterCalendarButton
          value={selectedMonth}
          onChange={setSelectedMonth}
          markedDates={markedDates}
          title="Filtrar comissoes por data"
        />
        <Button variant="outline" size="icon" onClick={goToNextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Estatísticas do Mês */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#EAD8AC] flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total em Comissões
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-[#EAD8AC]">
                {formatCurrency(stats.totalComissoes)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#EAD8AC] flex items-center gap-2">
              <Scissors className="h-4 w-4" />
              Atendimentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats.atendimentos}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#EAD8AC] flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Ticket Médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">
                {formatCurrency(stats.ticketMedio)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#EAD8AC] flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              % Médio de Comissão
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">
                {stats.percentualMedio.toFixed(0)}%
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Lista de Comissões */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Comissões</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          ) : commissions.length === 0 ? (
            <div className="text-center py-12 text-[#EAD8AC]">
              <DollarSign className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhuma comissão registrada neste mês</p>
            </div>
          ) : (
            <div className="space-y-3">
              {commissions.map((commission) => (
                <div
                  key={commission.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border hover:bg-[#013648] hover:border-[#EAD8AC]/50 transition-colors"
                >
                  {/* Info */}
                  <div className="mb-2 sm:mb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">
                        {commission.agendamento?.servico?.nome || "Serviço"}
                      </p>
                      <Badge variant="secondary">
                        {commission.percentual}%
                      </Badge>
                    </div>
                    <p className="text-sm text-[#EAD8AC]">
                      {commission.agendamento?.cliente?.nome || "Cliente"} •{" "}
                      {format(
                        parseISO(commission.agendamento?.data_hora_inicio || commission.created_at),
                        "dd/MM/yyyy 'às' HH:mm",
                        { locale: ptBR }
                      )}
                    </p>
                  </div>

                  {/* Valores */}
                  <div className="text-right">
                    <p className="text-lg font-bold text-[#EAD8AC]">
                      +{formatCurrency(commission.valor_comissao)}
                    </p>
                    <p className="text-xs text-[#EAD8AC]">
                      Serviço: {formatCurrency(commission.valor_servico)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resumo */}
      {!loading && commissions.length > 0 && (
        <Card className="bg-gold/10 border-gold/30">
          <CardContent className="py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gold/20 rounded-full">
                  <DollarSign className="h-6 w-6 text-gold" />
                </div>
                <div>
                  <p className="text-sm text-[#EAD8AC]">
                    Total a receber em{" "}
                    {format(selectedMonth, "MMMM", { locale: ptBR })}
                  </p>
                  <p className="text-2xl font-bold text-gold">
                    {formatCurrency(stats.totalComissoes)}
                  </p>
                </div>
              </div>
              <p className="text-sm text-[#EAD8AC] text-center sm:text-right">
                Baseado em {stats.atendimentos} atendimentos concluídos
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

