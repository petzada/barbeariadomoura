"use client";

import { useState, useEffect, Suspense, FormEvent, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { loginAction, type AuthState } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, AlertCircle, CheckCircle, Loader2 } from "lucide-react";

const initialState: AuthState = {
  success: false,
  message: "",
};

function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [state, setState] = useState<AuthState>(initialState);
  const [isPending, setIsPending] = useState(false);
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  const successMessage = searchParams.get("message");
  const formRef = useRef<HTMLFormElement>(null);

  // Mostrar toast quando chegar com mensagem de sucesso (ex: senha alterada)
  useEffect(() => {
    if (successMessage) {
      toast({
        title: "Sucesso",
        description: successMessage,
        variant: "success",
      });
    }
  }, [successMessage, toast]);

  // Redirect quando login for bem-sucedido
  useEffect(() => {
    if (state.success && state.redirectTo) {
      toast({
        title: "Login realizado",
        description: state.message,
        variant: "success",
      });
      const timer = setTimeout(() => {
        router.push(state.redirectTo!);
        router.refresh();
      }, 500);
      return () => clearTimeout(timer);
    } else if (state.message && !state.success) {
      toast({
        title: "Erro no login",
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
      if (redirectParam) {
        formData.set("redirect", redirectParam);
      }
      const result = await loginAction(initialState, formData);
      if (result) {
        setState(result);
      } else {
        const errorMsg = "Erro inesperado. Tente novamente.";
        setState({
          success: false,
          message: errorMsg,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMsg = "Erro ao fazer login. Tente novamente.";
      setState({
        success: false,
        message: errorMsg,
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
            <p className="text-sm text-[#EAD8AC]">Entrando...</p>
          </div>
        </div>
      )}

      <Card className="border-black bg-card">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Bem-vindo de volta</CardTitle>
          <CardDescription>
            Entre com seu email e senha para acessar sua conta
          </CardDescription>
        </CardHeader>

        <form ref={formRef} onSubmit={handleSubmit}>
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

          {/* Senha */}
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#EAD8AC]" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className="pl-10"
                required
                autoComplete="current-password"
                disabled={state.success}
              />
            </div>
            {state.errors?.password && (
              <p className="text-sm text-[#EAD8AC]">{state.errors.password[0]}</p>
            )}
            <div className="text-right">
              <Link
                href="/esqueci-senha"
                className="text-sm text-[#EAD8AC] hover:underline"
              >
                Esqueceu a senha?
              </Link>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button 
            type="submit" 
            className="w-full" 
            loading={isPending}
            disabled={state.success || isPending}
          >
            {state.success ? "Redirecionando..." : isPending ? "Entrando..." : "Entrar"}
          </Button>

          <p className="text-sm text-center text-[#EAD8AC]">
            Não tem uma conta?{" "}
            <Link href="/cadastro" className="text-[#EAD8AC] hover:underline">
              Cadastre-se
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
    </div>
  );
}

function LoginSkeleton() {
  return (
    <Card className="border-black bg-card">
      <CardHeader className="space-y-1 text-center">
        <Skeleton className="h-8 w-48 mx-auto" />
        <Skeleton className="h-4 w-64 mx-auto" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}


