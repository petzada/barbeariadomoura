"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import { updateProfileAction, type AuthState } from "@/lib/auth/actions";
import { createClient } from "@/lib/supabase/client";
import { getInitials, formatCurrency } from "@/lib/utils";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Crown,
  Settings,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Subscription {
  id: string;
  status: string;
  data_inicio: string;
  proxima_cobranca: string | null;
  plano: {
    nome: string;
    preco_mensal: number;
  };
}

const initialState: AuthState = {
  success: false,
  message: "",
};

export default function PerfilPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: loadingUser, isAuthenticated, refresh } = useUser();

  const [state, setState] = useState<AuthState>(initialState);
  const [isPending, setIsPending] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);
  const [appointmentsCount, setAppointmentsCount] = useState(0);

  // Redirecionar se não autenticado
  useEffect(() => {
    if (!loadingUser && !isAuthenticated) {
      router.push("/login?redirect=/perfil");
    }
  }, [loadingUser, isAuthenticated, router]);

  // Carregar dados adicionais
  useEffect(() => {
    async function loadAdditionalData() {
      if (!user) return;

      try {
        const supabase = createClient();

        // Carregar assinatura ativa
        const { data: subData } = await supabase
          .from("subscriptions")
          .select(`*, plano:subscription_plans(nome, preco_mensal)`)
          .eq("cliente_id", user.id)
          .eq("status", "ativa")
          .maybeSingle();

        if (subData) {
          setSubscription(subData as Subscription);
        }

        // Contar agendamentos
        const { count } = await supabase
          .from("appointments")
          .select("*", { count: "exact", head: true })
          .eq("cliente_id", user.id);

        setAppointmentsCount(count || 0);
      } catch {
        // Silently handle - data will show defaults
      } finally {
        setLoadingSubscription(false);
      }
    }

    if (user) {
      loadAdditionalData();
    }
  }, [user]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isPending) return;

    setIsPending(true);
    setState(initialState);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await updateProfileAction(initialState, formData);
      
      if (result) {
        setState(result);
        if (result.success) {
          toast({
            title: "Sucesso",
            description: result.message,
            variant: "success",
          });
          refresh(); // Atualizar dados do usuário
        }
      }
    } catch (error) {
      console.error("Profile update error:", error);
      setState({
        success: false,
        message: "Erro ao atualizar perfil. Tente novamente.",
      });
    } finally {
      setIsPending(false);
    }
  }

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container-app max-w-4xl py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Meu Perfil</h1>
            <p className="text-muted-foreground">
              Gerencie suas informações pessoais
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Sidebar - Info do Usuário */}
          <div className="md:col-span-1 space-y-6">
            {/* Card Avatar */}
            <Card>
              <CardContent className="pt-6 text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src={user.avatar_url || undefined} alt={user.nome} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {getInitials(user.nome)}
                  </AvatarFallback>
                </Avatar>
                <h2 className="font-semibold text-lg">{user.nome}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <Badge variant="secondary" className="mt-2">
                  {user.role === "admin" ? "Administrador" : user.role === "barbeiro" ? "Profissional" : "Cliente"}
                </Badge>
              </CardContent>
            </Card>

            {/* Card Assinatura */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Crown className="h-4 w-4 text-primary" />
                  Clube do Moura
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingSubscription ? (
                  <Skeleton className="h-16" />
                ) : subscription ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Plano</span>
                      <Badge variant="success">{subscription.plano.nome}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Valor</span>
                      <span className="font-medium">
                        {formatCurrency(subscription.plano.preco_mensal)}/mês
                      </span>
                    </div>
                    {subscription.proxima_cobranca && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Próxima cobrança</span>
                        <span className="text-sm">
                          {format(parseISO(subscription.proxima_cobranca), "dd/MM/yyyy", { locale: ptBR })}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-2">
                    <p className="text-sm text-muted-foreground mb-3">
                      Você não possui assinatura ativa
                    </p>
                    <Button size="sm" asChild>
                      <Link href="/clube">Conhecer Planos</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Card Estatísticas */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Estatísticas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total de agendamentos</span>
                  <span className="font-semibold">{appointmentsCount}</span>
                </div>
                <Separator className="my-3" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Membro desde</span>
                  <span className="text-sm">
                    {user.created_at
                      ? format(parseISO(user.created_at), "MMM/yyyy", { locale: ptBR })
                      : "-"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Formulário */}
          <div className="md:col-span-2 space-y-6">
            {/* Formulário de Edição */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>
                  Atualize suas informações de perfil
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Mensagem de sucesso */}
                  {state.success && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 text-success text-sm">
                      <CheckCircle className="h-4 w-4 flex-shrink-0" />
                      <span>{state.message}</span>
                    </div>
                  )}

                  {/* Mensagem de erro */}
                  {state.message && !state.success && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <span>{state.message}</span>
                    </div>
                  )}

                  {/* Nome */}
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="nome"
                        name="nome"
                        type="text"
                        defaultValue={user.nome}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Email (readonly) */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={user.email}
                        className="pl-10"
                        disabled
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      O email não pode ser alterado
                    </p>
                  </div>

                  {/* Telefone */}
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="telefone"
                        name="telefone"
                        type="tel"
                        defaultValue={user.telefone || ""}
                        placeholder="(11) 99999-9999"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={isPending}>
                      {isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        "Salvar Alterações"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Link para Configurações */}
            <Card>
              <CardContent className="pt-6">
                <Link
                  href="/perfil/configuracoes"
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Settings className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Configurações</p>
                      <p className="text-sm text-muted-foreground">
                        Alterar senha, preferências e mais
                      </p>
                    </div>
                  </div>
                  <ArrowLeft className="h-5 w-5 rotate-180 text-muted-foreground" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
