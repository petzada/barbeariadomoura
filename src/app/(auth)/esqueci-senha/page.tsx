"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { forgotPasswordAction, type AuthState } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";

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
    <div className="min-h-screen bg-[#05384B] text-[#E4D0B0] flex flex-col">
      <div className="flex-1 flex flex-col px-6 py-8">
        {/* Header com logo e voltar */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-[#E4D0B0] hover:text-[#E4D0B0]/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Voltar</span>
          </Link>
          <div className="relative w-16 h-16">
            <Image
              src="/logo.png"
              alt="Barbearia do Moura"
              fill
              className="rounded-full object-cover border-2 border-[#E4D0B0]/30"
            />
          </div>
        </div>

        {/* Formulário centralizado */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            <h1 className="text-2xl font-bold text-center mb-2">Esqueceu a senha?</h1>
            <p className="text-sm text-[#E4D0B0]/70 text-center mb-6">
              Digite seu email e enviaremos instruções para redefinir sua senha
            </p>

            {!state.success ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <Label htmlFor="email" className="text-[#E4D0B0]">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    required
                    autoComplete="email"
                    className="bg-[#05384B]/50 border-[#E4D0B0]/30 text-[#E4D0B0] placeholder:text-[#E4D0B0]/40 focus:border-[#E4D0B0] focus:ring-[#E4D0B0]"
                  />
                  {state.errors?.email && (
                    <p className="text-sm text-red-300 mt-1">{state.errors.email[0]}</p>
                  )}
                </div>

                {/* Loading overlay */}
                {isPending && (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="h-6 w-6 animate-spin text-[#E4D0B0]" />
                  </div>
                )}

                {/* Botão submit */}
                <Button
                  type="submit"
                  className="w-full bg-[#E4D0B0] text-[#05384B] hover:bg-[#E4D0B0]/90 font-semibold"
                  size="lg"
                  disabled={isPending}
                >
                  {isPending ? "Enviando..." : "Enviar instruções"}
                </Button>

                {/* Link para voltar ao login */}
                <p className="text-sm text-center text-[#E4D0B0]/70">
                  Lembrou sua senha?{" "}
                  <Link
                    href="/"
                    className="text-[#E4D0B0] hover:text-[#E4D0B0]/80 transition-colors"
                  >
                    Voltar para o login
                  </Link>
                </p>
              </form>
            ) : (
              <div className="space-y-4 text-center">
                <div className="p-4 rounded-lg bg-green-500/20 border border-green-500/30">
                  <p className="text-sm text-green-300">
                    Email enviado com sucesso! Verifique sua caixa de entrada.
                  </p>
                </div>
                <Button
                  asChild
                  className="w-full bg-[#E4D0B0] text-[#05384B] hover:bg-[#E4D0B0]/90"
                  size="lg"
                >
                  <Link href="/">Voltar para o login</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
