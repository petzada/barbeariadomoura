"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerAction, type AuthState } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { AuthFormShell } from "@/components/auth/auth-form-shell";

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
      }, 1000);
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
      if (result) {
        setState(result);
      } else {
        setState({
          success: false,
          message: "Erro inesperado. Tente novamente.",
        });
      }
    } catch {
      setState({
        success: false,
        message: "Erro ao criar conta. Tente novamente.",
      });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <AuthFormShell
      title="Criar conta"
      description="Cadastre-se para agendar seus horarios"
      backHref="/login"
      backLabel="Voltar para login"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome completo</Label>
          <Input
            id="nome"
            name="nome"
            type="text"
            placeholder="Seu nome"
            required
            autoComplete="name"
            disabled={state.success}
          />
          {state.errors?.nome && (
            <p className="text-sm text-red-300">{state.errors.nome[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="seu@email.com"
            required
            autoComplete="email"
            disabled={state.success}
          />
          {state.errors?.email && (
            <p className="text-sm text-red-300">{state.errors.email[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefone">Telefone (opcional)</Label>
          <Input
            id="telefone"
            name="telefone"
            type="tel"
            placeholder="(11) 99999-9999"
            autoComplete="tel"
            disabled={state.success}
          />
          {state.errors?.telefone && (
            <p className="text-sm text-red-300">{state.errors.telefone[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Minimo 6 caracteres"
            required
            autoComplete="new-password"
            minLength={6}
            disabled={state.success}
          />
          {state.errors?.password && (
            <p className="text-sm text-red-300">{state.errors.password[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar senha</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Digite a senha novamente"
            required
            autoComplete="new-password"
            disabled={state.success}
          />
          {state.errors?.confirmPassword && (
            <p className="text-sm text-red-300">{state.errors.confirmPassword[0]}</p>
          )}
        </div>

        {isPending && (
          <div className="flex items-center justify-center py-1">
            <Loader2 className="h-5 w-5 animate-spin text-[#EAD8AC]" />
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={state.success || isPending}
        >
          {state.success
            ? "Redirecionando..."
            : isPending
              ? "Criando conta..."
              : "Criar conta"}
        </Button>

        <p className="text-center text-sm text-[#EAD8AC]/70">
          Ja tem uma conta?{" "}
          <Link href="/login" className="text-[#EAD8AC] hover:text-[#EAD8AC]/80">
            Faca login
          </Link>
        </p>
      </form>
    </AuthFormShell>
  );
}