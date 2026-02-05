"use client";

import { useActionState } from "react";
import Link from "next/link";
import { forgotPasswordAction, type AuthState } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";

const initialState: AuthState = {
  success: false,
  message: "",
};

export default function EsqueciSenhaPage() {
  const [state, formAction, isPending] = useActionState(forgotPasswordAction, initialState);

  return (
    <Card className="border-border bg-card">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Esqueceu a senha?</CardTitle>
        <CardDescription>
          Digite seu email e enviaremos instruções para redefinir sua senha
        </CardDescription>
      </CardHeader>

      <form action={formAction}>
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
                error={!!state.errors?.email}
                disabled={state.success}
              />
            </div>
            {state.errors?.email && (
              <p className="text-sm text-destructive">{state.errors.email[0]}</p>
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
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para o login
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}
