"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
import { cn, formatCurrency } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import {
  Crown,
  Check,
  Loader2,
  AlertTriangle,
  Calendar,
  CreditCard,
  Star,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Plan {
  id: string;
  nome: string;
  descricao: string | null;
  preco_mensal: number;
  servicos_inclusos: string[];
  dias_permitidos: number[] | null;
}

interface Subscription {
  id: string;
  status: string;
  data_inicio: string;
  proxima_cobranca: string | null;
  plano: Plan;
}

export default function ClubePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: loadingUser, isAuthenticated } = useUser();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [loadingSubscription, setLoadingSubscription] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showSubscribeDialog, setShowSubscribeDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Carregar planos
  useEffect(() => {
    async function loadPlans() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .eq("ativo", true)
        .order("preco_mensal");

      if (!error && data) {
        setPlans(data);
      }
      setLoadingPlans(false);
    }

    loadPlans();
  }, []);

  // Carregar assinatura do usuário
  useEffect(() => {
    async function loadSubscription() {
      if (!user) {
        setLoadingSubscription(false);
        return;
      }

      const supabase = createClient();
      const { data, error } = await supabase
        .from("subscriptions")
        .select(`*, plano:subscription_plans(*)`)
        .eq("cliente_id", user.id)
        .eq("status", "ativa")
        .single();

      if (!error && data) {
        setCurrentSubscription(data as Subscription);
      }
      setLoadingSubscription(false);
    }

    if (user) {
      loadSubscription();
    }
  }, [user]);

  // Simular assinatura (em produção, usaria Mercado Pago)
  const handleSubscribe = async () => {
    if (!selectedPlan || !user) return;

    setProcessing(true);

    try {
      const supabase = createClient();

      // Criar assinatura
      const { data, error } = await supabase
        .from("subscriptions")
        .insert({
          cliente_id: user.id,
          plano_id: selectedPlan.id,
          status: "ativa",
          data_inicio: new Date().toISOString().split("T")[0],
          proxima_cobranca: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString().split("T")[0],
        })
        .select(`*, plano:subscription_plans(*)`)
        .single();

      if (error) throw error;

      const { error: paymentError } = await supabase.from("payments").insert({
        assinatura_id: data.id,
        valor: selectedPlan.preco_mensal,
        metodo: "assinatura",
        status: "pago",
      });

      if (paymentError) throw paymentError;

      setCurrentSubscription(data as Subscription);
      setShowSubscribeDialog(false);

      toast({
        title: "Assinatura realizada!",
        description: `Bem-vindo ao ${selectedPlan.nome}! Seus benefícios já estão ativos.`,
        variant: "success",
      });
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível processar a assinatura. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  // Cancelar assinatura
  const handleCancelSubscription = async () => {
    if (!currentSubscription) return;

    setProcessing(true);

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("subscriptions")
        .update({
          status: "cancelada",
          data_cancelamento: new Date().toISOString(),
        })
        .eq("id", currentSubscription.id);

      if (error) throw error;

      setCurrentSubscription(null);
      setShowCancelDialog(false);

      toast({
        title: "Assinatura cancelada",
        description: "Sua assinatura foi cancelada. Sentiremos sua falta!",
      });
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível cancelar a assinatura.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  // Mapear dias para português
  const formatDias = (dias: number[] | null) => {
    if (!dias) return "Todos os dias";
    const diasNomes: Record<number, string> = {
      0: "Dom",
      1: "Seg",
      2: "Ter",
      3: "Qua",
      4: "Qui",
      5: "Sex",
      6: "Sáb",
    };
    return dias.map((d) => diasNomes[d]).join(", ");
  };

  return (
    <>
      <div className="py-8">
        <div className="container-app max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge variant="default" className="mb-4">
              <Crown className="h-3 w-3 mr-1" />
              Clube do Moura
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Assine e <span className="text-gradient-gold">Economize</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Faça parte do nosso clube exclusivo e tenha acesso a serviços
              ilimitados com preços especiais. Escolha o plano ideal para você.
            </p>
          </div>

          {/* Assinatura Atual */}
          {!loadingUser && isAuthenticated && (
            <div className="mb-12">
              {loadingSubscription ? (
                <Skeleton className="h-32 max-w-2xl mx-auto" />
              ) : currentSubscription ? (
                <Card className="max-w-2xl mx-auto border-primary">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Crown className="h-5 w-5 text-primary" />
                        Sua Assinatura Ativa
                      </CardTitle>
                      <Badge variant="success">Ativa</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                      <div>
                        <p className="text-sm text-muted-foreground">Plano</p>
                        <p className="font-semibold">{currentSubscription.plano.nome}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Valor mensal</p>
                        <p className="font-semibold">
                          {formatCurrency(currentSubscription.plano.preco_mensal)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Membro desde</p>
                        <p className="font-semibold">
                          {format(parseISO(currentSubscription.data_inicio), "dd/MM/yyyy", {
                            locale: ptBR,
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Próxima cobrança</p>
                        <p className="font-semibold">
                          {currentSubscription.proxima_cobranca
                            ? format(
                                parseISO(currentSubscription.proxima_cobranca),
                                "dd/MM/yyyy",
                                { locale: ptBR }
                              )
                            : "-"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Button asChild>
                        <Link href="/agendar">
                          <Calendar className="mr-2 h-4 w-4" />
                          Agendar Agora
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowCancelDialog(true)}
                      >
                        Cancelar Assinatura
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          )}

          {/* Planos */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-center mb-6">
              {currentSubscription
                ? "Outros Planos Disponíveis"
                : "Escolha seu Plano"}
            </h2>

            {loadingPlans ? (
              <div className="grid md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-96" />
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {plans.map((plan, index) => {
                  const isPremium = index === 1;
                  const isCurrentPlan = currentSubscription?.plano.id === plan.id;

                  return (
                    <Card
                      key={plan.id}
                      className={cn(
                        "relative flex flex-col",
                        isPremium && "border-primary shadow-lg scale-105 z-10",
                        isCurrentPlan && "opacity-60"
                      )}
                    >
                      {isPremium && (
                        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <Star className="h-3 w-3 mr-1" />
                          Mais Popular
                        </Badge>
                      )}
                      {isCurrentPlan && (
                        <Badge
                          variant="secondary"
                          className="absolute -top-3 left-1/2 -translate-x-1/2"
                        >
                          Seu Plano Atual
                        </Badge>
                      )}
                      <CardContent className="p-6 flex-1 flex flex-col">
                        <h3 className="font-semibold text-xl mb-2">{plan.nome}</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {plan.descricao}
                        </p>

                        <div className="mb-6">
                          <span className="text-4xl font-bold text-gradient-gold">
                            {formatCurrency(plan.preco_mensal)}
                          </span>
                          <span className="text-muted-foreground">/mês</span>
                        </div>

                        <ul className="space-y-3 mb-6 flex-1">
                          <li className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-success flex-shrink-0" />
                            Serviços inclusos ilimitados
                          </li>
                          <li className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-success flex-shrink-0" />
                            {formatDias(plan.dias_permitidos)}
                          </li>
                          <li className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-success flex-shrink-0" />
                            Agendamento prioritário
                          </li>
                          <li className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-success flex-shrink-0" />
                            Sem fidelidade
                          </li>
                        </ul>

                        <Button
                          className="w-full"
                          variant={isPremium ? "default" : "outline"}
                          disabled={isCurrentPlan || !isAuthenticated}
                          onClick={() => {
                            if (!isAuthenticated) {
                              router.push("/login?redirect=/clube");
                              return;
                            }
                            setSelectedPlan(plan);
                            setShowSubscribeDialog(true);
                          }}
                        >
                          {isCurrentPlan
                            ? "Plano Atual"
                            : !isAuthenticated
                            ? "Faça Login"
                            : "Assinar Agora"}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* FAQ */}
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold text-center mb-6">
              Perguntas Frequentes
            </h2>
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">Como funciona a assinatura?</h3>
                  <p className="text-sm text-muted-foreground">
                    Você paga um valor fixo mensal e tem acesso ilimitado aos
                    serviços inclusos no seu plano. Basta agendar normalmente e o
                    desconto é aplicado automaticamente.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">Posso cancelar quando quiser?</h3>
                  <p className="text-sm text-muted-foreground">
                    Sim! Não há fidelidade. Você pode cancelar sua assinatura a
                    qualquer momento diretamente pelo site.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">
                    E se eu quiser um serviço fora do plano?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Serviços não inclusos no plano são cobrados normalmente. No
                    agendamento, você verá se o serviço está incluso ou não.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog de Assinatura */}
      <Dialog open={showSubscribeDialog} onOpenChange={setShowSubscribeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Assinatura</DialogTitle>
            <DialogDescription>
              Você está prestes a assinar o {selectedPlan?.nome}.
            </DialogDescription>
          </DialogHeader>

          {selectedPlan && (
            <div className="py-4">
              <div className="bg-card border border-border rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plano</span>
                  <span className="font-medium">{selectedPlan.nome}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valor mensal</span>
                  <span className="font-medium">
                    {formatCurrency(selectedPlan.preco_mensal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Primeira cobrança</span>
                  <span className="font-medium">Hoje</span>
                </div>
              </div>

              <div className="flex items-start gap-2 mt-4 p-3 rounded-lg bg-info/10 text-info text-sm">
                <CreditCard className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>
                  Pagamento processado via Mercado Pago com cartão de crédito.
                  Você pode cancelar a qualquer momento.
                </span>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSubscribeDialog(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleSubscribe} disabled={processing}>
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                "Confirmar Assinatura"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Cancelamento */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Assinatura</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja cancelar sua assinatura? Você perderá todos
              os benefícios do {currentSubscription?.plano.nome}.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/10 text-warning text-sm">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span>
              Ao cancelar, sua assinatura será encerrada imediatamente e você não
              receberá reembolso do período restante.
            </span>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
            >
              Manter Assinatura
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelSubscription}
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
    </>
  );
}
