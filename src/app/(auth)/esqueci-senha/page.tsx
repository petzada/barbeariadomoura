"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { forgotPasswordAction, type AuthState } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";

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
    } catch (error) {
      console.error("Forgot password error:", error);
      setState({
        success: false,
        message: "Erro ao enviar email. Tente novamente.",
      });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="relative">
      {/* Overlay de loading */}
      {isPending && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#013648]/80 backdrop-blur-sm rounded-lg">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-[#EAD8AC]" />
            <p className="text-sm text-[#EAD8AC]">Enviando email...</p>
          </div>
        </div>
      )}

      <Card className="border-black bg-card">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Esqueceu a senha?</CardTitle>
        <CardDescription>
          Digite seu email e enviaremos instruções para redefinir sua senha
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#EAD8AC]" />
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
              <p className="text-sm text-[#EAD8AC]">{state.errors.email[0]}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          {!state.success ? (
            <Button type="submit" className="w-full" loading={isPending}>
              Enviar instruções
            </Button>
          ) : (
            <Button asChild variant="outline" className="w-full">
              <Link href="/login">Voltar para o login</Link>
            </Button>
          )}

          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-sm text-[#EAD8AC] hover:text-[#EAD8AC]"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para o login
          </Link>
        </CardFooter>
      </form>
    </Card>
    </div>
  );
}


