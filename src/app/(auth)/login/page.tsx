"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { loginAction, type AuthState } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, Lock, AlertCircle, CheckCircle } from "lucide-react";

const initialState: AuthState = {
  success: false,
  message: "",
};

function LoginForm() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>(initialState);
  const [isPending, setIsPending] = useState(false);
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  const successMessage = searchParams.get("message");

  // Redirect quando login for bem-sucedido
  useEffect(() => {
    if (state.success && state.redirectTo) {
      const timer = setTimeout(() => {
        router.push(state.redirectTo!);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [state.success, state.redirectTo, router]);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    try {
      const result = await loginAction(state, formData);
      setState(result);
    } catch {
      setState({
        success: false,
        message: "Erro ao fazer login. Tente novamente.",
      });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Bem-vindo de volta</CardTitle>
        <CardDescription>
          Entre com seu email e senha para acessar sua conta
        </CardDescription>
      </CardHeader>

      <form action={handleSubmit}>
        <CardContent className="space-y-4">
          {/* Mensagem de sucesso (ex: senha alterada) */}
          {successMessage && !state.message && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 text-success text-sm">
              <CheckCircle className="h-4 w-4 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Mensagem de sucesso do login */}
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

          {/* Campo de redirect oculto */}
          {redirectParam && (
            <input type="hidden" name="redirect" value={redirectParam} />
          )}

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
              <p className="text-sm text-destructive">{state.errors.email[0]}</p>
            )}
          </div>

          {/* Senha */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              <Link
                href="/esqueci-senha"
                className="text-sm text-primary hover:underline"
              >
                Esqueceu a senha?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
              <p className="text-sm text-destructive">{state.errors.password[0]}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button 
            type="submit" 
            className="w-full" 
            loading={isPending}
            disabled={state.success}
          >
            {state.success ? "Redirecionando..." : "Entrar"}
          </Button>

          <p className="text-sm text-center text-muted-foreground">
            Não tem uma conta?{" "}
            <Link href="/cadastro" className="text-primary hover:underline">
              Cadastre-se
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}

function LoginSkeleton() {
  return (
    <Card className="border-border bg-card">
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
