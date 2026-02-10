"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency, getInitials } from "@/lib/utils";
import {
  PieChart,
  DollarSign,
  Settings,
  Check,
  Loader2,
  Percent,
  Calendar,
  User,
} from "lucide-react";
import { format, parseISO, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Professional {
  id: string;
  user: {
    nome: string;
    avatar_url: string | null;
  };
}

interface Service {
  id: string;
  nome: string;
  preco: number;
}

interface CommissionRate {
  id: string;
  profissional_id: string;
  servico_id: string;
  percentual: number;
}

interface Commission {
  id: string;
  profissional_id: string;
  valor_servico: number;
  percentual: number;
  valor_comissao: number;
  pago: boolean;
  data_pagamento: string | null;
  created_at: string;
  profissional: {
    user: {
      nome: string;
      avatar_url: string | null;
    };
  };
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

export default function AdminComissoesPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("comissoes");
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [commissionRates, setCommissionRates] = useState<CommissionRate[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Filtros
  const [selectedProfessional, setSelectedProfessional] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Dialog de configurar taxa
  const [showRateDialog, setShowRateDialog] = useState(false);
  const [rateProfessional, setRateProfessional] = useState("");
  const [rateService, setRateService] = useState("");
  const [ratePercentual, setRatePercentual] = useState("50");

  // Carregar dados
  useEffect(() => {
    async function loadData() {
      const supabase = createClient();

      // Carregar profissionais
      const { data: profsData } = await supabase
        .from("professionals")
        .select(`
          id,
          user:users!professionals_user_id_fkey(nome, avatar_url)
        `)
        .eq("ativo", true)
        .order("created_at");

      if (profsData) {
        const transformedProfs = profsData.map((item: any) => ({
          ...item,
          user: Array.isArray(item.user) ? item.user[0] : item.user,
        })) as Professional[];
        setProfessionals(transformedProfs);
      }

      // Carregar serviços
      const { data: servicesData } = await supabase
        .from("services")
        .select("id, nome, preco")
        .eq("ativo", true)
        .order("nome");

      if (servicesData) {
        setServices(servicesData);
      }

      // Carregar taxas de comissão
      const { data: ratesData } = await supabase
        .from("commission_rates")
        .select("*");

      if (ratesData) {
        setCommissionRates(ratesData);
      }

      // Carregar comissões do mês atual
      const monthStart = startOfMonth(new Date()).toISOString();
      const monthEnd = endOfMonth(new Date()).toISOString();

      const { data: commissionsData } = await supabase
        .from("commissions")
        .select(`
          id,
          profissional_id,
          valor_servico,
          percentual,
          valor_comissao,
          pago,
          data_pagamento,
          created_at,
          profissional:professionals(
            user:users(nome, avatar_url)
          ),
          agendamento:appointments(
            data_hora_inicio,
            servico:services(nome),
            cliente:users!appointments_cliente_id_fkey(nome)
          )
        `)
        .gte("created_at", monthStart)
        .lte("created_at", monthEnd)
        .order("created_at", { ascending: false });

      if (commissionsData) {
        const transformedCommissions = commissionsData.map((item: any) => ({
          ...item,
          profissional: Array.isArray(item.profissional) ? {
            ...item.profissional[0],
            user: Array.isArray(item.profissional[0]?.user) ? item.profissional[0].user[0] : item.profissional[0]?.user,
          } : item.profissional ? {
            ...item.profissional,
            user: Array.isArray(item.profissional?.user) ? item.profissional.user[0] : item.profissional?.user,
          } : null,
          agendamento: Array.isArray(item.agendamento) ? {
            ...item.agendamento[0],
            servico: Array.isArray(item.agendamento[0]?.servico) ? item.agendamento[0].servico[0] : item.agendamento[0]?.servico,
            cliente: Array.isArray(item.agendamento[0]?.cliente) ? item.agendamento[0].cliente[0] : item.agendamento[0]?.cliente,
          } : item.agendamento ? {
            ...item.agendamento,
            servico: Array.isArray(item.agendamento?.servico) ? item.agendamento.servico[0] : item.agendamento?.servico,
            cliente: Array.isArray(item.agendamento?.cliente) ? item.agendamento.cliente[0] : item.agendamento?.cliente,
          } : null,
        })) as Commission[];
        setCommissions(transformedCommissions);
      }

      setLoading(false);
    }

    loadData();
  }, []);

  // Obter taxa de um profissional para um serviço
  const getRate = (profissionalId: string, servicoId: string): number => {
    const rate = commissionRates.find(
      (r) => r.profissional_id === profissionalId && r.servico_id === servicoId
    );
    return rate?.percentual ?? 50; // Padrão 50%
  };

  // Salvar taxa de comissão
  const handleSaveRate = async () => {
    if (!rateProfessional || !rateService || !ratePercentual) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    const percentual = parseFloat(ratePercentual);
    if (percentual < 0 || percentual > 100) {
      toast({
        title: "Erro",
        description: "O percentual deve estar entre 0 e 100",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    const supabase = createClient();

    try {
      // Verificar se já existe
      const existingRate = commissionRates.find(
        (r) => r.profissional_id === rateProfessional && r.servico_id === rateService
      );

      if (existingRate) {
        // Atualizar
        const { error } = await supabase
          .from("commission_rates")
          .update({ percentual })
          .eq("id", existingRate.id);

        if (error) throw error;

        setCommissionRates((prev) =>
          prev.map((r) => r.id === existingRate.id ? { ...r, percentual } : r)
        );
      } else {
        // Criar
        const { data, error } = await supabase
          .from("commission_rates")
          .insert({
            profissional_id: rateProfessional,
            servico_id: rateService,
            percentual,
          })
          .select()
          .single();

        if (error) throw error;

        setCommissionRates((prev) => [...prev, data]);
      }

      toast({
        title: "Sucesso",
        description: "Taxa de comissão salva",
        variant: "success",
      });

      setShowRateDialog(false);
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível salvar a taxa",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  // Marcar comissão como paga
  const handleMarkAsPaid = async (commissionId: string) => {
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from("commissions")
        .update({
          pago: true,
          data_pagamento: new Date().toISOString().split("T")[0],
        })
        .eq("id", commissionId);

      if (error) throw error;

      setCommissions((prev) =>
        prev.map((c) =>
          c.id === commissionId
            ? { ...c, pago: true, data_pagamento: new Date().toISOString().split("T")[0] }
            : c
        )
      );

      toast({
        title: "Sucesso",
        description: "Comissão marcada como paga",
        variant: "success",
      });
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a comissão",
        variant: "destructive",
      });
    }
  };

  // Filtrar comissões
  const filteredCommissions = commissions.filter((c) => {
    if (selectedProfessional !== "all" && c.profissional_id !== selectedProfessional) {
      return false;
    }
    if (selectedStatus === "pendente" && c.pago) return false;
    if (selectedStatus === "pago" && !c.pago) return false;
    return true;
  });

  // Estatísticas
  const stats = {
    total: commissions.reduce((acc, c) => acc + c.valor_comissao, 0),
    pendente: commissions.filter((c) => !c.pago).reduce((acc, c) => acc + c.valor_comissao, 0),
    pago: commissions.filter((c) => c.pago).reduce((acc, c) => acc + c.valor_comissao, 0),
    count: commissions.length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Comissões</h1>
        <p className="text-muted-foreground">
          Configure taxas e gerencie as comissões dos profissionais
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{formatCurrency(stats.total)}</div>
            <p className="text-sm text-muted-foreground">Total do Mês</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-warning">{formatCurrency(stats.pendente)}</div>
            <p className="text-sm text-muted-foreground">Pendente</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-success">{formatCurrency(stats.pago)}</div>
            <p className="text-sm text-muted-foreground">Pago</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.count}</div>
            <p className="text-sm text-muted-foreground">Atendimentos</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="comissoes">Comissões</TabsTrigger>
          <TabsTrigger value="taxas">Taxas por Serviço</TabsTrigger>
        </TabsList>

        {/* Tab de Comissões */}
        <TabsContent value="comissoes" className="space-y-4">
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={selectedProfessional} onValueChange={setSelectedProfessional}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Profissional" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Profissionais</SelectItem>
                {professionals.map((prof) => (
                  <SelectItem key={prof.id} value={prof.id}>
                    {prof.user?.nome ?? "Profissional"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="pago">Pago</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Lista de Comissões */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Comissões do Mês ({filteredCommissions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20" />
                  ))}
                </div>
              ) : filteredCommissions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <PieChart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhuma comissão encontrada</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredCommissions.map((commission) => (
                    <div
                      key={commission.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border"
                    >
                      <div className="flex items-start gap-4 mb-4 sm:mb-0">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={commission.profissional?.user?.avatar_url || undefined}
                            alt={commission.profissional?.user?.nome ?? "Profissional"}
                          />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getInitials(commission.profissional?.user?.nome ?? "P")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{commission.profissional?.user?.nome ?? "Profissional"}</p>
                          <p className="text-sm text-muted-foreground">
                            {commission.agendamento?.servico?.nome ?? "Serviço"} • {commission.agendamento?.cliente?.nome ?? "Cliente"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {commission.agendamento?.data_hora_inicio ? format(parseISO(commission.agendamento.data_hora_inicio), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }) : "-"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold text-success">
                            {formatCurrency(commission.valor_comissao)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {commission.percentual}% de {formatCurrency(commission.valor_servico)}
                          </p>
                        </div>
                        {commission.pago ? (
                          <Badge variant="success">Pago</Badge>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMarkAsPaid(commission.id)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Pagar
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Taxas */}
        <TabsContent value="taxas" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setShowRateDialog(true)}>
              <Settings className="h-4 w-4 mr-2" />
              Configurar Taxa
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Percent className="h-5 w-5" />
                Taxas de Comissão por Profissional
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-40" />
              ) : professionals.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhum profissional cadastrado</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {professionals.map((prof) => (
                    <div key={prof.id} className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={prof.user?.avatar_url || undefined}
                            alt={prof.user?.nome ?? "Profissional"}
                          />
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {getInitials(prof.user?.nome ?? "P")}
                          </AvatarFallback>
                        </Avatar>
                        <h4 className="font-medium">{prof.user?.nome ?? "Profissional"}</h4>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pl-11">
                        {services.map((service) => {
                          const rate = getRate(prof.id, service.id);
                          return (
                            <div
                              key={service.id}
                              className="p-2 rounded-lg bg-secondary/50 text-sm"
                            >
                              <p className="text-muted-foreground truncate">{service.nome}</p>
                              <p className="font-bold">{rate}%</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog de Configurar Taxa */}
      <Dialog open={showRateDialog} onOpenChange={setShowRateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configurar Taxa de Comissão</DialogTitle>
            <DialogDescription>
              Defina o percentual de comissão para um profissional em um serviço específico.
              O padrão é 50%.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Profissional</Label>
              <Select value={rateProfessional} onValueChange={setRateProfessional}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o profissional" />
                </SelectTrigger>
                <SelectContent>
                  {professionals.map((prof) => (
                    <SelectItem key={prof.id} value={prof.id}>
                      {prof.user?.nome ?? "Profissional"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Serviço</Label>
              <Select value={rateService} onValueChange={setRateService}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o serviço" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.nome} ({formatCurrency(service.preco)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Percentual de Comissão (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={ratePercentual}
                onChange={(e) => setRatePercentual(e.target.value)}
                placeholder="50"
              />
              {rateProfessional && rateService && ratePercentual && (
                <p className="text-xs text-muted-foreground">
                  O profissional receberá{" "}
                  {formatCurrency(
                    (services.find((s) => s.id === rateService)?.preco || 0) *
                      (parseFloat(ratePercentual) / 100)
                  )}{" "}
                  por atendimento deste serviço.
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRateDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveRate} disabled={processing}>
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
