"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerAction, type AuthState } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, Lock, Loader2 } from "lucide-react";

const initialState: AuthState = {
  success: false,
  message: "",
};

export default function CadastroPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [state, setState] = useState<AuthState>(initialState);
  const [isPending, setIsPending] = useState(false);

  // Redirect quando cadastro for bem-sucedido
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
      }, 1000);
      return () => clearTimeout(timer);
    } else if (state.message && !state.success) {
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
      if (result) {
        setState(result);
      } else {
        setState({
          success: false,
          message: "Erro inesperado. Tente novamente.",
        });
      }
    } catch (error) {
      console.error("Register error:", error);
      setState({
        success: false,
        message: "Erro ao criar conta. Tente novamente.",
      });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="relative">
      {/* Overlay de loading */}
      {isPending && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Criando conta...</p>
          </div>
        </div>
      )}

      <Card className="border-border bg-card">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Criar conta</CardTitle>
        <CardDescription>
          Cadastre-se para agendar seus horários
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="nome">Nome completo</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="nome"
                name="nome"
                type="text"
                placeholder="Seu nome"
                className="pl-10"
                required
                autoComplete="name"
                disabled={state.success}
              />
            </div>
            {state.errors?.nome && (
              <p className="text-sm text-destructive">{state.errors.nome[0]}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                className="pl-10"
                required
                autoComplete="email"
                disabled={state.success}
              />
            </div>
            {state.errors?.email && (
              <p className="text-sm text-destructive">{state.errors.email[0]}</p>
            )}
          </div>

          {/* Telefone */}
          <div className="space-y-2">
            <Label htmlFor="telefone">
              Telefone{" "}
              <span className="text-muted-foreground font-normal">(opcional)</span>
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="telefone"
                name="telefone"
                type="tel"
                placeholder="(11) 99999-9999"
                className="pl-10"
                autoComplete="tel"
                disabled={state.success}
              />
            </div>
            {state.errors?.telefone && (
              <p className="text-sm text-destructive">{state.errors.telefone[0]}</p>
            )}
          </div>

          {/* Senha */}
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                className="pl-10"
                required
                autoComplete="new-password"
                minLength={6}
                disabled={state.success}
              />
            </div>
            {state.errors?.password && (
              <p className="text-sm text-destructive">{state.errors.password[0]}</p>
            )}
          </div>

          {/* Confirmar Senha */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Digite a senha novamente"
                className="pl-10"
                required
                autoComplete="new-password"
                disabled={state.success}
              />
            </div>
            {state.errors?.confirmPassword && (
              <p className="text-sm text-destructive">{state.errors.confirmPassword[0]}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button 
            type="submit" 
            className="w-full" 
            loading={isPending}
            disabled={state.success || isPending}
          >
            {state.success ? "Redirecionando..." : isPending ? "Criando conta..." : "Criar conta"}
          </Button>

          <p className="text-sm text-center text-muted-foreground">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Faça login
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
    </div>
  );
}
