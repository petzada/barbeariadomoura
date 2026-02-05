"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Banknote,
  Smartphone,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Crown,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { format, startOfDay, endOfDay, startOfMonth, endOfMonth, addDays, subDays, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Payment {
  id: string;
  agendamento_id: string | null;
  assinatura_id: string | null;
  valor: number;
  metodo: string;
  status: string;
  created_at: string;
  agendamento?: {
    cliente: { nome: string };
    servico: { nome: string };
  };
}

interface DayStats {
  total: number;
  pix: number;
  credito: number;
  debito: number;
  dinheiro: number;
  assinatura: number;
  count: number;
}

const metodoConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  pix: { label: "PIX", icon: Smartphone, color: "text-success" },
  cartao_credito: { label: "Crédito", icon: CreditCard, color: "text-primary" },
  cartao_debito: { label: "Débito", icon: CreditCard, color: "text-blue-500" },
  dinheiro: { label: "Dinheiro", icon: Banknote, color: "text-warning" },
  assinatura: { label: "Assinatura", icon: Crown, color: "text-purple-500" },
};

export default function AdminFinanceiroPage() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [dayStats, setDayStats] = useState<DayStats>({
    total: 0, pix: 0, credito: 0, debito: 0, dinheiro: 0, assinatura: 0, count: 0
  });
  const [monthStats, setMonthStats] = useState({
    total: 0,
    count: 0,
    avgTicket: 0,
  });
  const [filterMethod, setFilterMethod] = useState<string>("all");

  // Carregar dados
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const supabase = createClient();

      const dayStart = startOfDay(selectedDate).toISOString();
      const dayEnd = endOfDay(selectedDate).toISOString();
      const monthStart = startOfMonth(selectedDate).toISOString();
      const monthEnd = endOfMonth(selectedDate).toISOString();

      // Pagamentos do dia
      const { data: paymentsData } = await supabase
        .from("payments")
        .select(`
          id,
          agendamento_id,
          assinatura_id,
          valor,
          metodo,
          status,
          created_at,
          agendamento:appointments(
            cliente:users!appointments_cliente_id_fkey(nome),
            servico:services(nome)
          )
        `)
        .gte("created_at", dayStart)
        .lte("created_at", dayEnd)
        .eq("status", "pago")
        .order("created_at", { ascending: false });

      if (paymentsData) {
        const transformedPayments = paymentsData.map((item: any) => ({
          ...item,
          agendamento: Array.isArray(item.agendamento) ? {
            ...item.agendamento[0],
            cliente: Array.isArray(item.agendamento[0]?.cliente) ? item.agendamento[0].cliente[0] : item.agendamento[0]?.cliente,
            servico: Array.isArray(item.agendamento[0]?.servico) ? item.agendamento[0].servico[0] : item.agendamento[0]?.servico,
          } : item.agendamento ? {
            ...item.agendamento,
            cliente: Array.isArray(item.agendamento?.cliente) ? item.agendamento.cliente[0] : item.agendamento?.cliente,
            servico: Array.isArray(item.agendamento?.servico) ? item.agendamento.servico[0] : item.agendamento?.servico,
          } : undefined,
        })) as Payment[];
        setPayments(transformedPayments);

        // Calcular estatísticas do dia
        const stats: DayStats = {
          total: 0, pix: 0, credito: 0, debito: 0, dinheiro: 0, assinatura: 0, count: paymentsData.length
        };

        transformedPayments.forEach((p: Payment) => {
          stats.total += p.valor;
          if (p.metodo === "pix") stats.pix += p.valor;
          if (p.metodo === "cartao_credito") stats.credito += p.valor;
          if (p.metodo === "cartao_debito") stats.debito += p.valor;
          if (p.metodo === "dinheiro") stats.dinheiro += p.valor;
          if (p.metodo === "assinatura") stats.assinatura += p.valor;
        });

        setDayStats(stats);
      }

      // Pagamentos do mês (apenas total)
      const { data: monthData } = await supabase
        .from("payments")
        .select("valor")
        .gte("created_at", monthStart)
        .lte("created_at", monthEnd)
        .eq("status", "pago");

      if (monthData) {
        const total = monthData.reduce((acc, p) => acc + p.valor, 0);
        setMonthStats({
          total,
          count: monthData.length,
          avgTicket: monthData.length > 0 ? total / monthData.length : 0,
        });
      }

      setLoading(false);
    }

    loadData();
  }, [selectedDate]);

  // Navegar entre dias
  const goToPreviousDay = () => setSelectedDate((prev) => subDays(prev, 1));
  const goToNextDay = () => setSelectedDate((prev) => addDays(prev, 1));
  const goToToday = () => setSelectedDate(new Date());

  // Filtrar pagamentos
  const filteredPayments = filterMethod === "all"
    ? payments
    : payments.filter((p) => p.metodo === filterMethod);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Financeiro</h1>
        <p className="text-muted-foreground">
          Acompanhe o caixa e movimentações financeiras
        </p>
      </div>

      {/* Estatísticas do Mês */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Faturamento do Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {formatCurrency(monthStats.total)}
            </div>
            <p className="text-xs text-muted-foreground">
              {monthStats.count} pagamentos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Ticket Médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(monthStats.avgTicket)}
            </div>
            <p className="text-xs text-muted-foreground">
              Por atendimento
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Caixa de Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(dayStats.total)}
            </div>
            <p className="text-xs text-muted-foreground">
              {dayStats.count} recebimentos
            </p>
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

      {/* Resumo por Método de Pagamento */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resumo por Forma de Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {Object.entries(metodoConfig).map(([key, config]) => {
              const value = key === "pix" ? dayStats.pix
                : key === "cartao_credito" ? dayStats.credito
                : key === "cartao_debito" ? dayStats.debito
                : key === "dinheiro" ? dayStats.dinheiro
                : dayStats.assinatura;

              return (
                <div
                  key={key}
                  className="p-3 rounded-lg bg-secondary/50 text-center"
                >
                  <config.icon className={`h-5 w-5 mx-auto mb-2 ${config.color}`} />
                  <p className="text-xs text-muted-foreground">{config.label}</p>
                  <p className="font-bold">{formatCurrency(value)}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Filtro e Lista de Pagamentos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Movimentações do Dia
          </CardTitle>
          <Select value={filterMethod} onValueChange={setFilterMethod}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filtrar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pix">PIX</SelectItem>
              <SelectItem value="cartao_credito">Crédito</SelectItem>
              <SelectItem value="cartao_debito">Débito</SelectItem>
              <SelectItem value="dinheiro">Dinheiro</SelectItem>
              <SelectItem value="assinatura">Assinatura</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <DollarSign className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhuma movimentação neste dia</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPayments.map((payment) => {
                const metodo = metodoConfig[payment.metodo] || metodoConfig.dinheiro;
                const MetodoIcon = metodo.icon;

                return (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg bg-secondary ${metodo.color}`}>
                        <MetodoIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {payment.agendamento?.cliente?.nome || "Pagamento de Assinatura"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {payment.agendamento?.servico?.nome || "Plano mensal"} •{" "}
                          {format(parseISO(payment.created_at), "HH:mm")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-success flex items-center">
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                        {formatCurrency(payment.valor)}
                      </span>
                      <Badge variant="secondary">{metodo.label}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
