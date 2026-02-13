"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { resetPasswordAction, type AuthState } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock, Loader2 } from "lucide-react";
import { AuthFormShell } from "@/components/auth/auth-form-shell";

const initialState: AuthState = {
  success: false,
  message: "",
};

export default function ResetarSenhaPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [state, setState] = useState<AuthState>(initialState);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (state.success && state.redirectTo) {
      toast({
        title: "Senha redefinida",
        description: state.message,
        variant: "success",
      });

      const timer = setTimeout(() => {
        router.push(state.redirectTo!);
        router.refresh();
      }, 1500);

      return () => clearTimeout(timer);
    }

    if (state.message && !state.success) {
      toast({
        title: "Erro",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state.success, state.redirectTo, state.message, router, toast]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isPending || state.success) return;

    setIsPending(true);
    try {
      const formData = new FormData(e.currentTarget);
      const result = await resetPasswordAction(initialState, formData);
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
        message: "Erro ao redefinir senha. Tente novamente.",
      });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="relative">
      {isPending && (
        <div className="absolute inset-0 z-50 flex items-center justify-center rounded-lg bg-[#013648]/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-[#EAD8AC]" />
            <p className="text-sm text-[#EAD8AC]">Redefinindo senha...</p>
          </div>
        </div>
      )}

      <AuthFormShell
        title="Redefinir senha"
        description="Digite sua nova senha"
        backHref="/login"
        backLabel="Voltar para login"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Nova senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#EAD8AC]" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Minimo 6 caracteres"
                className="pl-10"
                required
                autoComplete="new-password"
                minLength={6}
                disabled={state.success}
              />
            </div>
            {state.errors?.password && (
              <p className="text-sm text-red-300">{state.errors.password[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#EAD8AC]" />
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
              <p className="text-sm text-red-300">{state.errors.confirmPassword[0]}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={state.success || isPending}>
            {state.success ? "Redirecionando..." : "Redefinir senha"}
          </Button>
        </form>
      </AuthFormShell>
    </div>
  );
}