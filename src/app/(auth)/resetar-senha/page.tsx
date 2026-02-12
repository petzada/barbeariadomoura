"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, KeyRound, Loader2 } from "lucide-react";
import { resetPasswordAction, type AuthState } from "@/lib/auth/actions";
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
      }, 1200);
      return () => clearTimeout(timer);
    }

    if (state.message && !state.success) {
      toast({
        title: "Erro",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state.success, state.message, state.redirectTo, router, toast]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isPending || state.success) return;

    setIsPending(true);
    try {
      const formData = new FormData(e.currentTarget);
      const result = await resetPasswordAction(initialState, formData);
      setState(result || { success: false, message: "Erro inesperado. Tente novamente." });
    } catch {
      setState({ success: false, message: "Erro ao redefinir senha. Tente novamente." });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="min-h-screen super-page-bg">
      <div className="hero-atmosphere" />
      <div className="container-app py-8 sm:py-10">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2 text-[#EAD8AC] hover:text-[#EAD8AC]/85 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Voltar</span>
          </Link>

          <div className="relative h-16 w-16 sm:h-20 sm:w-20">
            <Image
              src="/logo.png"
              alt="Barbearia do Moura"
              fill
              className="rounded-full object-cover border-2 border-[#EAD8AC]/35"
            />
          </div>
        </div>

        <div className="mx-auto w-full max-w-md">
          <Card variant="highlighted">
            <CardContent className="p-5 sm:p-6">
              <Badge className="mb-3 bg-[#EAD8AC]/10 border-[#EAD8AC]/30 text-[#EAD8AC]">
                <KeyRound className="h-3 w-3 mr-1" />
                Nova senha
              </Badge>

              <h1 className="text-2xl font-bold text-center mb-2">Redefinir senha</h1>
              <p className="text-sm text-[#EAD8AC]/70 text-center mb-6">
                Informe e confirme sua nova senha para concluir o acesso.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="password">Nova senha</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Minimo 6 caracteres"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    disabled={state.success}
                  />
                  {state.errors?.password && <p className="text-xs text-red-300">{state.errors.password[0]}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword">Confirmar senha</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Repita a senha"
                    required
                    autoComplete="new-password"
                    disabled={state.success}
                  />
                  {state.errors?.confirmPassword && <p className="text-xs text-red-300">{state.errors.confirmPassword[0]}</p>}
                </div>

                {isPending && (
                  <div className="flex items-center justify-center py-1">
                    <Loader2 className="h-5 w-5 animate-spin text-[#EAD8AC]" />
                  </div>
                )}

                <Button type="submit" variant="gradient" className="w-full" size="lg" disabled={state.success || isPending}>
                  {state.success ? "Redirecionando..." : isPending ? "Redefinindo..." : "Redefinir senha"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
