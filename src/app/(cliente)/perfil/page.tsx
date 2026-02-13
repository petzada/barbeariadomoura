"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateProfileAction, type AuthState } from "@/lib/auth/actions";
import { useUser } from "@/hooks/use-user";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle,
  Crown,
  Loader2,
  Mail,
  Phone,
  Settings,
  User,
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

  useEffect(() => {
    if (!loadingUser && !isAuthenticated) {
      router.push("/login?redirect=/perfil");
    }
  }, [loadingUser, isAuthenticated, router]);

  useEffect(() => {
    async function loadAdditionalData() {
      if (!user) return;

      try {
        const supabase = createClient();

        const { data: subData } = await supabase
          .from("subscriptions")
          .select(`*, plano:subscription_plans(nome, preco_mensal)`)
          .eq("cliente_id", user.id)
          .eq("status", "ativa")
          .maybeSingle();

        if (subData) setSubscription(subData as Subscription);

        const { count } = await supabase
          .from("appointments")
          .select("*", { count: "exact", head: true })
          .eq("cliente_id", user.id);

        setAppointmentsCount(count || 0);
      } finally {
        setLoadingSubscription(false);
      }
    }

    if (user) loadAdditionalData();
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
          refresh();
        }
      }
    } catch {
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
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#EAD8AC]" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="bg-[#013648] pb-8">
      <section className="bg-gradient-to-b from-black/20 to-transparent py-8 md:py-10">
        <div className="container-app">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-[#EAD8AC]/60">Area do cliente</p>
              <h1 className="text-4xl font-bold tracking-tight">Meu Perfil</h1>
              <p className="text-[#EAD8AC]/70">Gerencie seus dados e assinatura</p>
            </div>
            <Button asChild variant="outline" className="hidden sm:inline-flex">
              <Link href="/dashboard">Voltar ao dashboard</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="container-app grid gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-4">
          <Card className="rounded-3xl border-black bg-black/50 backdrop-blur-sm">
            <CardContent className="space-y-4 p-8 text-center">
              <Avatar className="mx-auto h-24 w-24 border-2 border-black">
                <AvatarImage src={user.avatar_url || undefined} alt={user.nome} />
                <AvatarFallback className="bg-[#EAD8AC] text-[#013648] text-2xl">
                  {getInitials(user.nome)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold">{user.nome}</h2>
                <p className="text-sm text-[#EAD8AC]/70">{user.email}</p>
              </div>
              <Badge variant="outline" className="border-black">
                {user.role === "admin" ? "Administrador" : user.role === "barbeiro" ? "Profissional" : "Cliente"}
              </Badge>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-black bg-black/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Crown className="h-4 w-4" />
                Clube do Moura
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingSubscription ? (
                <Skeleton className="h-16" />
              ) : subscription ? (
                <div className="space-y-3">
                  <p className="font-semibold">{subscription.plano.nome}</p>
                  <p className="text-sm text-[#EAD8AC]/70">
                    {formatCurrency(subscription.plano.preco_mensal)}/mes
                  </p>
                  {subscription.proxima_cobranca && (
                    <p className="text-xs text-[#EAD8AC]/60">
                      Proxima cobranca: {format(parseISO(subscription.proxima_cobranca), "dd/MM/yyyy", { locale: ptBR })}
                    </p>
                  )}
                  <Button asChild className="w-full" size="sm">
                    <Link href="/clube">Gerenciar assinatura</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 text-center">
                  <p className="text-sm text-[#EAD8AC]/70">Nenhuma assinatura ativa.</p>
                  <Button asChild size="sm" className="w-full">
                    <Link href="/clube">Conhecer planos</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-black bg-black/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="h-4 w-4" />
                Estatisticas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#EAD8AC]/70">Total de agendamentos</span>
                <span className="text-lg font-bold">{appointmentsCount}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#EAD8AC]/70">Membro desde</span>
                <span className="text-sm font-medium">
                  {user.created_at ? format(parseISO(user.created_at), "MMM/yyyy", { locale: ptBR }) : "-"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-8">
          <Card className="rounded-3xl border-black bg-black/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Informacoes Pessoais</CardTitle>
              <CardDescription>Atualize seus dados de cadastro</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {state.success && (
                  <div className="flex items-center gap-2 rounded-lg bg-green-500/20 p-3 text-sm text-green-300">
                    <CheckCircle className="h-4 w-4" />
                    <span>{state.message}</span>
                  </div>
                )}

                {state.message && !state.success && (
                  <div className="flex items-center gap-2 rounded-lg bg-red-500/20 p-3 text-sm text-red-300">
                    <AlertCircle className="h-4 w-4" />
                    <span>{state.message}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="nome">Nome completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#EAD8AC]/60" />
                    <Input id="nome" name="nome" type="text" defaultValue={user.nome} className="pl-10" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#EAD8AC]/60" />
                    <Input id="email" type="email" value={user.email} className="pl-10" disabled />
                  </div>
                  <p className="text-xs text-[#EAD8AC]/60">O email nao pode ser alterado.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#EAD8AC]/60" />
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

                <div className="pt-2">
                  <Button type="submit" disabled={isPending} className="h-11 px-6">
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      "Salvar alteracoes"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-black bg-black/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <Link
                href="/perfil/configuracoes"
                className="flex items-center justify-between rounded-2xl border border-black p-4 transition-colors hover:border-[#EAD8AC] hover:bg-black/20"
              >
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-[#EAD8AC]" />
                  <div>
                    <p className="font-medium">Configuracoes da conta</p>
                    <p className="text-sm text-[#EAD8AC]/70">Senha, notificacoes e privacidade</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-[#EAD8AC]/70" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
