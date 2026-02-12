"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";
import { forgotPasswordAction, type AuthState } from "@/lib/auth/actions";
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

export default function EsqueciSenhaPage() {
  const { toast } = useToast();
  const [state, setState] = useState<AuthState>(initialState);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (!state.message) return;
    toast({
      title: state.success ? "Email enviado" : "Erro",
      description: state.message,
      variant: state.success ? "success" : "destructive",
    });
  }, [state, toast]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isPending) return;

    setIsPending(true);
    try {
      const formData = new FormData(e.currentTarget);
      const result = await forgotPasswordAction(initialState, formData);
      setState(result || { success: false, message: "Erro inesperado. Tente novamente." });
    } catch {
      setState({ success: false, message: "Erro ao enviar email. Tente novamente." });
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
                  <MailCheck className="h-3 w-3 mr-1" />
                  Recuperacao de acesso
                </Badge>
                <h1 className="text-2xl font-bold text-center mb-2">Esqueceu a senha?</h1>
                <p className="text-sm text-[#E4D0B0]/70 text-center mb-6">
                  Informe seu email para receber as instrucoes de redefinicao.
                </p>

                {!state.success ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" placeholder="seu@email.com" required autoComplete="email" />
                      {state.errors?.email && <p className="text-xs text-red-300">{state.errors.email[0]}</p>}
                    </div>

                    {isPending && (
                      <div className="flex items-center justify-center py-1">
                        <Loader2 className="h-5 w-5 animate-spin text-[#E4D0B0]" />
                      </div>
                    )}

                    <Button type="submit" variant="gradient" className="w-full" size="lg" disabled={isPending}>
                      {isPending ? "Enviando..." : "Enviar instrucoes"}
                    </Button>

                    <p className="text-sm text-center text-[#E4D0B0]/70">
                      Lembrou sua senha?{" "}
                      <Link href="/" className="text-[#E4D0B0] hover:text-[#E4D0B0]/80 transition-colors">
                        Voltar para o login
                      </Link>
                    </p>
                  </form>
                ) : (
                  <div className="space-y-4 text-center">
                    <div className="rounded-lg border border-[#22C55E]/40 bg-[#22C55E]/10 p-3 text-sm text-[#BBF7D0]">
                      Email enviado com sucesso. Verifique sua caixa de entrada.
                    </div>
                    <Button asChild className="w-full">
                      <Link href="/">Voltar para o login</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

