"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { registerAction, type AuthState } from "@/lib/auth/actions";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const initialState: AuthState = {
  success: false,
  message: "",
};

export default function CadastroPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [state, setState] = useState<AuthState>(initialState);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (state.success) {
      toast({
        title: "Conta criada",
        description: state.message,
        variant: "success",
      });
      const timer = setTimeout(() => {
        router.push("/agendar");
        router.refresh();
      }, 900);
      return () => clearTimeout(timer);
    }

    if (state.message && !state.success) {
      toast({
        title: "Erro no cadastro",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state.success, state.message, router, toast]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isPending || state.success) return;

    setIsPending(true);
    try {
      const formData = new FormData(e.currentTarget);
      const result = await registerAction(initialState, formData);
      setState(result || { success: false, message: "Erro inesperado. Tente novamente." });
    } catch {
      setState({ success: false, message: "Erro ao criar conta. Tente novamente." });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#05384B] text-[#E4D0B0] flex flex-col super-page-bg">
      <div className="flex-1 flex flex-col px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2 text-[#E4D0B0] hover:text-[#E4D0B0]/80 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Voltar</span>
          </Link>
          <div className="relative w-16 h-16">
            <Image
              src="/logo.png"
              alt="Barbearia do Moura"
              fill
              className="rounded-full object-cover border-2 border-[#E4D0B0]/35"
            />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            <Card variant="highlighted">
              <CardContent className="p-5 sm:p-6">
                <Badge className="mb-3 bg-[#E4D0B0]/10 border-[#E4D0B0]/30 text-[#E4D0B0]">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Novo cadastro
                </Badge>

                <h1 className="text-2xl font-bold text-center mb-2">Criar conta</h1>
                <p className="text-sm text-[#E4D0B0]/70 text-center mb-6">
                  Cadastre-se para agendar seus horarios e acompanhar tudo pelo app.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="nome">Nome completo</Label>
                    <Input id="nome" name="nome" type="text" placeholder="Seu nome" required autoComplete="name" disabled={state.success} />
                    {state.errors?.nome && <p className="text-xs text-red-300">{state.errors.nome[0]}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="seu@email.com" required autoComplete="email" disabled={state.success} />
                    {state.errors?.email && <p className="text-xs text-red-300">{state.errors.email[0]}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="telefone">Telefone (opcional)</Label>
                    <Input id="telefone" name="telefone" type="tel" placeholder="(11) 99999-9999" autoComplete="tel" disabled={state.success} />
                    {state.errors?.telefone && <p className="text-xs text-red-300">{state.errors.telefone[0]}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="password">Senha</Label>
                    <Input id="password" name="password" type="password" placeholder="Minimo 6 caracteres" required minLength={6} autoComplete="new-password" disabled={state.success} />
                    {state.errors?.password && <p className="text-xs text-red-300">{state.errors.password[0]}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword">Confirmar senha</Label>
                    <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="Repita a senha" required autoComplete="new-password" disabled={state.success} />
                    {state.errors?.confirmPassword && <p className="text-xs text-red-300">{state.errors.confirmPassword[0]}</p>}
                  </div>

                  {isPending && (
                    <div className="flex items-center justify-center py-1">
                      <Loader2 className="h-5 w-5 animate-spin text-[#E4D0B0]" />
                    </div>
                  )}

                  <Button type="submit" variant="gradient" className="w-full" size="lg" disabled={state.success || isPending}>
                    {state.success ? "Redirecionando..." : isPending ? "Criando conta..." : "Criar conta"}
                  </Button>

                  <p className="text-sm text-center text-[#E4D0B0]/70">
                    Ja tem uma conta?{" "}
                    <Link href="/" className="text-[#E4D0B0] hover:text-[#E4D0B0]/80 transition-colors">
                      Faca login
                    </Link>
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

