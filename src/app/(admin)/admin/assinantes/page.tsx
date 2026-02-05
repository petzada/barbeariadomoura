"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { formatCurrency, getInitials } from "@/lib/utils";
import {
  Crown,
  Search,
  Eye,
  Ban,
  Loader2,
  Calendar,
  Mail,
  Phone,
  CreditCard,
  History,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Subscription {
  id: string;
  cliente_id: string;
  plano_id: string;
  status: "ativa" | "cancelada" | "suspensa" | "expirada";
  data_inicio: string;
  proxima_cobranca: string | null;
  data_cancelamento: string | null;
  created_at: string;
  cliente: {
    nome: string;
    email: string;
    telefone: string | null;
    avatar_url: string | null;
  };
  plano: {
    nome: string;
    preco_mensal: number;
  };
}

interface Payment {
  id: string;
  valor: number;
  metodo: string;
  status: string;
  created_at: string;
}

const statusConfig: Record<string, { label: string; variant: "success" | "destructive" | "warning" | "secondary" }> = {
  ativa: { label: "Ativa", variant: "success" },
  cancelada: { label: "Cancelada", variant: "destructive" },
  suspensa: { label: "Suspensa", variant: "warning" },
  expirada: { label: "Expirada", variant: "secondary" },
};

export default function AdminAssinantesPage() {
  const { toast } = useToast();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [loadingPayments, setLoadingPayments] = useState(false);

  // Carregar assinaturas
  useEffect(() => {
    async function loadSubscriptions() {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from("subscriptions")
        .select(`
          id,
          cliente_id,
          plano_id,
          status,
          data_inicio,
          proxima_cobranca,
          data_cancelamento,
          created_at,
          cliente:users!subscriptions_cliente_id_fkey(nome, email, telefone, avatar_url),
          plano:subscription_plans!subscriptions_plano_id_fkey(nome, preco_mensal)
        `)
        .order("created_at", { ascending: false });

      if (!error && data) {
        // Transformar dados para formato correto (Supabase retorna arrays nos joins)
        const transformed = data.map((item: any) => ({
          ...item,
          cliente: Array.isArray(item.cliente) ? item.cliente[0] : item.cliente,
          plano: Array.isArray(item.plano) ? item.plano[0] : item.plano,
        })) as Subscription[];
        setSubscriptions(transformed);
        setFilteredSubscriptions(transformed);
      }
      setLoading(false);
    }

    loadSubscriptions();
  }, []);

  // Filtrar assinaturas
  useEffect(() => {
    let filtered = subscriptions;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (sub) =>
          sub.cliente.nome.toLowerCase().includes(term) ||
          sub.cliente.email.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((sub) => sub.status === statusFilter);
    }

    setFilteredSubscriptions(filtered);
  }, [searchTerm, statusFilter, subscriptions]);

  // Abrir detalhes
  const openDetails = async (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setShowDetailsDialog(true);
    setLoadingPayments(true);

    const supabase = createClient();
    const { data } = await supabase
      .from("payments")
      .select("*")
      .eq("assinatura_id", subscription.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (data) {
      setPayments(data);
    }
    setLoadingPayments(false);
  };

  // Cancelar assinatura
  const handleCancel = async () => {
    if (!selectedSubscription) return;

    setProcessing(true);
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from("subscriptions")
        .update({
          status: "cancelada",
          data_cancelamento: new Date().toISOString(),
        })
        .eq("id", selectedSubscription.id);

      if (error) throw error;

      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.id === selectedSubscription.id
            ? { ...sub, status: "cancelada" as const, data_cancelamento: new Date().toISOString() }
            : sub
        )
      );

      toast({
        title: "Sucesso",
        description: "Assinatura cancelada com sucesso",
        variant: "success",
      });

      setShowCancelDialog(false);
      setShowDetailsDialog(false);
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível cancelar a assinatura",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  // Estatísticas
  const stats = {
    total: subscriptions.length,
    ativas: subscriptions.filter((s) => s.status === "ativa").length,
    canceladas: subscriptions.filter((s) => s.status === "cancelada").length,
    receitaMensal: subscriptions
      .filter((s) => s.status === "ativa")
      .reduce((acc, s) => acc + s.plano.preco_mensal, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Assinantes</h1>
        <p className="text-muted-foreground">
          Gerencie os assinantes do Clube do Moura
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-sm text-muted-foreground">Total de Assinantes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-success">{stats.ativas}</div>
            <p className="text-sm text-muted-foreground">Assinaturas Ativas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-destructive">{stats.canceladas}</div>
            <p className="text-sm text-muted-foreground">Canceladas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(stats.receitaMensal)}
            </div>
            <p className="text-sm text-muted-foreground">Receita Mensal</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="ativa">Ativas</SelectItem>
            <SelectItem value="cancelada">Canceladas</SelectItem>
            <SelectItem value="suspensa">Suspensas</SelectItem>
            <SelectItem value="expirada">Expiradas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Assinantes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Assinantes ({filteredSubscriptions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
          ) : filteredSubscriptions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Crown className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhum assinante encontrado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSubscriptions.map((subscription) => {
                const status = statusConfig[subscription.status] || statusConfig.ativa;

                return (
                  <div
                    key={subscription.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-start gap-4 mb-4 sm:mb-0">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={subscription.cliente.avatar_url || undefined}
                          alt={subscription.cliente.nome}
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials(subscription.cliente.nome)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{subscription.cliente.nome}</h3>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {subscription.plano.nome} • {formatCurrency(subscription.plano.preco_mensal)}/mês
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Desde {format(parseISO(subscription.data_inicio), "dd/MM/yyyy")}
                          </span>
                          {subscription.proxima_cobranca && subscription.status === "ativa" && (
                            <span className="flex items-center">
                              <CreditCard className="h-3 w-3 mr-1" />
                              Próx.: {format(parseISO(subscription.proxima_cobranca), "dd/MM")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDetails(subscription)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Detalhes
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Detalhes */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes da Assinatura</DialogTitle>
          </DialogHeader>

          {selectedSubscription && (
            <div className="space-y-6">
              {/* Info do Cliente */}
              <div className="flex items-center gap-4 p-4 bg-secondary rounded-lg">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={selectedSubscription.cliente.avatar_url || undefined}
                    alt={selectedSubscription.cliente.nome}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    {getInitials(selectedSubscription.cliente.nome)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-lg">{selectedSubscription.cliente.nome}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {selectedSubscription.cliente.email}
                  </p>
                  {selectedSubscription.cliente.telefone && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {selectedSubscription.cliente.telefone}
                    </p>
                  )}
                </div>
              </div>

              {/* Info do Plano */}
              <div className="space-y-3">
                <h4 className="font-medium">Informações do Plano</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Plano</p>
                    <p className="font-medium">{selectedSubscription.plano.nome}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Valor</p>
                    <p className="font-medium">{formatCurrency(selectedSubscription.plano.preco_mensal)}/mês</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <Badge variant={statusConfig[selectedSubscription.status]?.variant || "secondary"}>
                      {statusConfig[selectedSubscription.status]?.label || selectedSubscription.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Data de Início</p>
                    <p className="font-medium">
                      {format(parseISO(selectedSubscription.data_inicio), "dd/MM/yyyy")}
                    </p>
                  </div>
                  {selectedSubscription.proxima_cobranca && (
                    <div>
                      <p className="text-muted-foreground">Próxima Cobrança</p>
                      <p className="font-medium">
                        {format(parseISO(selectedSubscription.proxima_cobranca), "dd/MM/yyyy")}
                      </p>
                    </div>
                  )}
                  {selectedSubscription.data_cancelamento && (
                    <div>
                      <p className="text-muted-foreground">Data de Cancelamento</p>
                      <p className="font-medium text-destructive">
                        {format(parseISO(selectedSubscription.data_cancelamento), "dd/MM/yyyy")}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Histórico de Pagamentos */}
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Histórico de Pagamentos
                </h4>
                {loadingPayments ? (
                  <Skeleton className="h-20" />
                ) : payments.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    Nenhum pagamento registrado
                  </p>
                ) : (
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {payments.map((payment) => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg text-sm"
                      >
                        <div>
                          <p className="font-medium">{formatCurrency(payment.valor)}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(parseISO(payment.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </p>
                        </div>
                        <Badge
                          variant={payment.status === "pago" ? "success" : "secondary"}
                        >
                          {payment.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Ações */}
              {selectedSubscription.status === "ativa" && (
                <div className="pt-4 border-t">
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => setShowCancelDialog(true)}
                  >
                    <Ban className="h-4 w-4 mr-2" />
                    Cancelar Assinatura
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Cancelamento */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Assinatura</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja cancelar esta assinatura? O cliente perderá
              acesso aos benefícios do plano imediatamente.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Voltar
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={processing}
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelando...
                </>
              ) : (
                "Confirmar Cancelamento"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
