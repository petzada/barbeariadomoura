"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction, type AuthState } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, Lock, AlertCircle } from "lucide-react";

const initialState: AuthState = {
  success: false,
  message: "",
};

export default function CadastroPage() {
  const [state, formAction, isPending] = useActionState(registerAction, initialState);

  return (
    <Card className="border-border bg-card">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Criar conta</CardTitle>
        <CardDescription>
          Cadastre-se para agendar seus horários
        </CardDescription>
      </CardHeader>

      <form action={formAction}>
        <CardContent className="space-y-4">
          {/* Mensagem de erro */}
          {state.message && !state.success && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{state.message}</span>
            </div>
          )}

          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="nome">Nome completo</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="nome"
                name="nome"
                type="text"
                placeholder="Seu nome"
                className="pl-10"
                required
                autoComplete="name"
                error={!!state.errors?.nome}
              />
            </div>
            {state.errors?.nome && (
              <p className="text-sm text-destructive">{state.errors.nome[0]}</p>
            )}
          </div>

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
              />
            </div>
            {state.errors?.email && (
              <p className="text-sm text-destructive">{state.errors.email[0]}</p>
            )}
          </div>

          {/* Telefone */}
          <div className="space-y-2">
            <Label htmlFor="telefone">
              Telefone{" "}
              <span className="text-muted-foreground font-normal">(opcional)</span>
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="telefone"
                name="telefone"
                type="tel"
                placeholder="(11) 99999-9999"
                className="pl-10"
                autoComplete="tel"
                error={!!state.errors?.telefone}
              />
            </div>
            {state.errors?.telefone && (
              <p className="text-sm text-destructive">{state.errors.telefone[0]}</p>
            )}
          </div>

          {/* Senha */}
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
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
                error={!!state.errors?.password}
              />
            </div>
            {state.errors?.password && (
              <p className="text-sm text-destructive">{state.errors.password[0]}</p>
            )}
          </div>

          {/* Confirmar Senha */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar senha</Label>
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
                error={!!state.errors?.confirmPassword}
              />
            </div>
            {state.errors?.confirmPassword && (
              <p className="text-sm text-destructive">{state.errors.confirmPassword[0]}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" loading={isPending}>
            Criar conta
          </Button>

          <p className="text-sm text-center text-muted-foreground">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Faça login
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
