"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { registerAction, type AuthState } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";

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
            <h1 className="text-2xl font-bold text-center mb-2">Criar conta</h1>
            <p className="text-sm text-[#E4D0B0]/70 text-center mb-6">
              Cadastre-se para agendar seus horários
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nome */}
              <div>
                <Label htmlFor="nome" className="text-[#E4D0B0]">
                  Nome completo
                </Label>
                <Input
                  id="nome"
                  name="nome"
                  type="text"
                  placeholder="Seu nome"
                  required
                  autoComplete="name"
                  disabled={state.success}
                  className="bg-[#05384B]/50 border-[#E4D0B0]/30 text-[#E4D0B0] placeholder:text-[#E4D0B0]/40 focus:border-[#E4D0B0] focus:ring-[#E4D0B0]"
                />
                {state.errors?.nome && (
                  <p className="text-sm text-red-300 mt-1">{state.errors.nome[0]}</p>
                )}
              </div>

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
                  disabled={state.success}
                  className="bg-[#05384B]/50 border-[#E4D0B0]/30 text-[#E4D0B0] placeholder:text-[#E4D0B0]/40 focus:border-[#E4D0B0] focus:ring-[#E4D0B0]"
                />
                {state.errors?.email && (
                  <p className="text-sm text-red-300 mt-1">{state.errors.email[0]}</p>
                )}
              </div>

              {/* Telefone */}
              <div>
                <Label htmlFor="telefone" className="text-[#E4D0B0]">
                  Telefone{" "}
                  <span className="text-[#E4D0B0]/60 font-normal">(opcional)</span>
                </Label>
                <Input
                  id="telefone"
                  name="telefone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  autoComplete="tel"
                  disabled={state.success}
                  className="bg-[#05384B]/50 border-[#E4D0B0]/30 text-[#E4D0B0] placeholder:text-[#E4D0B0]/40 focus:border-[#E4D0B0] focus:ring-[#E4D0B0]"
                />
                {state.errors?.telefone && (
                  <p className="text-sm text-red-300 mt-1">{state.errors.telefone[0]}</p>
                )}
              </div>

              {/* Senha */}
              <div>
                <Label htmlFor="password" className="text-[#E4D0B0]">
                  Senha
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  required
                  autoComplete="new-password"
                  minLength={6}
                  disabled={state.success}
                  className="bg-[#05384B]/50 border-[#E4D0B0]/30 text-[#E4D0B0] placeholder:text-[#E4D0B0]/40 focus:border-[#E4D0B0] focus:ring-[#E4D0B0]"
                />
                {state.errors?.password && (
                  <p className="text-sm text-red-300 mt-1">{state.errors.password[0]}</p>
                )}
              </div>

              {/* Confirmar Senha */}
              <div>
                <Label htmlFor="confirmPassword" className="text-[#E4D0B0]">
                  Confirmar senha
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Digite a senha novamente"
                  required
                  autoComplete="new-password"
                  disabled={state.success}
                  className="bg-[#05384B]/50 border-[#E4D0B0]/30 text-[#E4D0B0] placeholder:text-[#E4D0B0]/40 focus:border-[#E4D0B0] focus:ring-[#E4D0B0]"
                />
                {state.errors?.confirmPassword && (
                  <p className="text-sm text-red-300 mt-1">
                    {state.errors.confirmPassword[0]}
                  </p>
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
                disabled={state.success || isPending}
              >
                {state.success
                  ? "Redirecionando..."
                  : isPending
                    ? "Criando conta..."
                    : "Criar conta"}
              </Button>

              {/* Link para login */}
              <p className="text-sm text-center text-[#E4D0B0]/70">
                Já tem uma conta?{" "}
                <Link href="/" className="text-[#E4D0B0] hover:text-[#E4D0B0]/80 transition-colors">
                  Faça login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
