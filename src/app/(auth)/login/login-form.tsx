"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { loginAction, type AuthState } from "@/lib/auth/actions";

const initialState: AuthState = {
  success: false,
  message: "",
};

export function LoginForm({ resetMessage }: { resetMessage?: string }) {
  const [state, formAction] = useFormState(loginAction, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success && state.redirectTo) {
      router.push(state.redirectTo);
      router.refresh();
    }
  }, [state.success, state.redirectTo, router]);

  return (
    <AuthFormShell title="Entrar" description="Acesse sua conta para continuar">
      <div className="space-y-4">
        {resetMessage && !state.message && (
          <div className="rounded-lg bg-green-500/20 p-3 text-center text-sm text-green-300">
            {resetMessage}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="********"
              autoComplete="current-password"
              required
            />
          </div>

          {state.message && (
            <div
              className={`rounded-lg p-3 text-center text-sm ${
                state.success
                  ? "bg-green-500/20 text-green-300"
                  : "bg-red-500/20 text-red-300"
              }`}
            >
              {state.message}
            </div>
          )}

          <Button type="submit" className="w-full" size="lg">
            Entrar
          </Button>
        </form>

        <div className="flex items-center justify-between text-sm">
          <Link href="/esqueci-senha" className="text-[#EAD8AC]/70 hover:text-[#EAD8AC]">
            Esqueceu a senha?
          </Link>
          <Link href="/cadastro" className="text-[#EAD8AC]/70 hover:text-[#EAD8AC]">
            Criar conta
          </Link>
        </div>
      </div>
    </AuthFormShell>
  );
}
