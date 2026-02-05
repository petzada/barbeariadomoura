"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { resetPasswordAction, type AuthState } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, AlertCircle, CheckCircle } from "lucide-react";

const initialState: AuthState = {
  success: false,
  message: "",
};

export default function ResetarSenhaPage() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>(initialState);
  const [isPending, setIsPending] = useState(false);

  // Redirect quando reset for bem-sucedido
  useEffect(() => {
    if (state.success && state.redirectTo) {
      const timer = setTimeout(() => {
        router.push(state.redirectTo!);
        router.refresh();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state.success, state.redirectTo, router]);

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
    } catch (error) {
      console.error("Reset password error:", error);
      setState({
        success: false,
        message: "Erro ao redefinir senha. Tente novamente.",
      });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Redefinir senha</CardTitle>
        <CardDescription>
          Digite sua nova senha abaixo
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
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

          {/* Nova Senha */}
          <div className="space-y-2">
            <Label htmlFor="password">Nova senha</Label>
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

          {/* Confirmar Nova Senha */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
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

        <CardFooter>
          <Button 
            type="submit" 
            className="w-full" 
            loading={isPending}
            disabled={state.success || isPending}
          >
            {state.success ? "Redirecionando..." : isPending ? "Redefinindo..." : "Redefinir senha"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
