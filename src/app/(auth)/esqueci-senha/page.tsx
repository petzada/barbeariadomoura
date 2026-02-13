"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { forgotPasswordAction, type AuthState } from "@/lib/auth/actions";
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

export default function EsqueciSenhaPage() {
  const { toast } = useToast();
  const [state, setState] = useState<AuthState>(initialState);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (state.success) {
      toast({
        title: "Email enviado",
        description: state.message,
        variant: "success",
      });
    } else if (state.message && !state.success) {
      toast({
        title: "Erro",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state.success, state.message, toast]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isPending) return;

    setIsPending(true);
    try {
      const formData = new FormData(e.currentTarget);
      const result = await forgotPasswordAction(initialState, formData);
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
        message: "Erro ao enviar email. Tente novamente.",
      });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <AuthFormShell
      title="Esqueceu a senha?"
      description="Informe seu email para receber instrucoes de redefinicao"
      backHref="/login"
      backLabel="Voltar para login"
    >
      {!state.success ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              required
              autoComplete="email"
            />
            {state.errors?.email && (
              <p className="text-sm text-red-300">{state.errors.email[0]}</p>
            )}
          </div>

          {isPending && (
            <div className="flex items-center justify-center py-1">
              <Loader2 className="h-5 w-5 animate-spin text-[#EAD8AC]" />
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={isPending}>
            {isPending ? "Enviando..." : "Enviar instrucoes"}
          </Button>

          <p className="text-center text-sm text-[#EAD8AC]/70">
            Lembrou sua senha?{" "}
            <Link href="/login" className="text-[#EAD8AC] hover:text-[#EAD8AC]/80">
              Entrar
            </Link>
          </p>
        </form>
      ) : (
        <div className="space-y-4 text-center">
          <div className="rounded-lg border border-green-500/30 bg-green-500/20 p-4">
            <p className="text-sm text-green-300">
              Email enviado com sucesso. Verifique sua caixa de entrada.
            </p>
          </div>
          <Button asChild className="w-full" size="lg">
            <Link href="/login">Voltar para login</Link>
          </Button>
        </div>
      )}
    </AuthFormShell>
  );
}