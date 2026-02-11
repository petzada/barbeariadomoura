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
  DollarSign,
  Settings,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Users,
} from "lucide-react";
import { format, parseISO, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

const initialState: AuthState = {
  success: false,
  message: "",
};

interface ProfessionalStats {
  clientesAtendidos: number;
  atendimentosMes: number;
  ganhosMes: number;
}

export default function PerfilProfissionalPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: loadingUser, isAuthenticated, isBarbeiro, refresh } = useUser();

  const [state, setState] = useState<AuthState>(initialState);
  const [isPending, setIsPending] = useState(false);
  const [stats, setStats] = useState<ProfessionalStats>({
    clientesAtendidos: 0,
    atendimentosMes: 0,
    ganhosMes: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  // Redirecionar se não autenticado ou não for barbeiro
  useEffect(() => {
    if (!loadingUser) {
      if (!isAuthenticated) {
        router.push("/login?redirect=/profissional/perfil");
      } else if (!isBarbeiro) {
        router.push("/perfil");
      }
    }
  }, [loadingUser, isAuthenticated, isBarbeiro, router]);

  // Carregar estatísticas do profissional
  useEffect(() => {
    async function loadStats() {
      if (!user) return;

      const supabase = createClient();

      // Buscar ID do profissional
      const { data: professional } = await supabase
        .from("professionals")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!professional) {
        setLoadingStats(false);
        return;
      }

      const now = new Date();
      const monthStart = startOfMonth(now).toISOString();
      const monthEnd = endOfMonth(now).toISOString();

      // Contar clientes únicos atendidos (total)
      const { data: clientesData } = await supabase
        .from("appointments")
        .select("cliente_id")
        .eq("profissional_id", professional.id)
        .eq("status", "concluido");

      const clientesUnicos = new Set(clientesData?.map(a => a.cliente_id) || []);

      // Contar atendimentos do mês
      const { count: atendimentosMes } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("profissional_id", professional.id)
        .eq("status", "concluido")
        .gte("data_hora_inicio", monthStart)
        .lte("data_hora_inicio", monthEnd);

      // Somar ganhos do mês (comissões)
      const { data: comissoesData } = await supabase
        .from("commissions")
        .select("valor_comissao")
        .eq("profissional_id", professional.id)
        .gte("created_at", monthStart)
        .lte("created_at", monthEnd);

      const ganhosMes = comissoesData?.reduce((acc, c) => acc + (c.valor_comissao || 0), 0) || 0;

      setStats({
        clientesAtendidos: clientesUnicos.size,
        atendimentosMes: atendimentosMes || 0,
        ganhosMes,
      });
      setLoadingStats(false);
    }

    if (user && isBarbeiro) {
      loadStats();
    }
  }, [user, isBarbeiro]);

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
        <Loader2 className="h-8 w-8 animate-spin text-[#EAD8AC]" />
      </div>
    );
  }

  if (!user || !isBarbeiro) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/profissional/dashboard">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Meu Perfil</h1>
          <p className="text-[#EAD8AC]">
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
                <AvatarFallback className="bg-primary text-[#EAD8AC] text-2xl">
                  {getInitials(user.nome)}
                </AvatarFallback>
              </Avatar>
              <h2 className="font-semibold text-lg">{user.nome}</h2>
              <p className="text-sm text-[#EAD8AC]">{user.email}</p>
              <Badge variant="default" className="mt-2">
                Profissional
              </Badge>
            </CardContent>
          </Card>

          {/* Card Estatísticas */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                Estatísticas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingStats ? (
                <Skeleton className="h-24" />
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#EAD8AC]">Clientes atendidos</span>
                    <span className="font-semibold">{stats.clientesAtendidos}</span>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#EAD8AC]">Atendimentos este mês</span>
                    <span className="font-semibold">{stats.atendimentosMes}</span>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#EAD8AC]">Ganhos do mês</span>
                    <span className="font-semibold text-[#EAD8AC]">
                      {formatCurrency(stats.ganhosMes)}
                    </span>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#EAD8AC]">Membro desde</span>
                    <span className="text-sm">
                      {user.created_at
                        ? format(parseISO(user.created_at), "MMM/yyyy", { locale: ptBR })
                        : "-"}
                    </span>
                  </div>
                </>
              )}
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
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-[#EAD8AC]/10 text-[#EAD8AC] text-sm">
                    <CheckCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{state.message}</span>
                  </div>
                )}

                {/* Mensagem de erro */}
                {state.message && !state.success && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-[#EAD8AC]/10 text-[#EAD8AC] text-sm">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{state.message}</span>
                  </div>
                )}

                {/* Nome */}
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#EAD8AC]" />
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
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#EAD8AC]" />
                    <Input
                      id="email"
                      type="email"
                      value={user.email}
                      className="pl-10"
                      disabled
                    />
                  </div>
                  <p className="text-xs text-[#EAD8AC]">
                    O email não pode ser alterado
                  </p>
                </div>

                {/* Telefone */}
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#EAD8AC]" />
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
                href="/profissional/perfil/configuracoes"
                className="flex items-center justify-between p-4 rounded-lg border border-black hover:bg-[#013648] hover:border-[#EAD8AC] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-[#EAD8AC]" />
                  <div>
                    <p className="font-medium">Configurações</p>
                    <p className="text-sm text-[#EAD8AC]">
                      Alterar senha, preferências e mais
                    </p>
                  </div>
                </div>
                <ArrowLeft className="h-5 w-5 rotate-180 text-[#EAD8AC]" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


