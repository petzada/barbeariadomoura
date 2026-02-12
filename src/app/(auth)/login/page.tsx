"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { loginAction, registerAction, type AuthState } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const initialState: AuthState = {
  success: false,
  message: "",
};

type AuthMode = "login" | "cadastro";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");

  const [loginState, loginFormAction] = useFormState(loginAction, initialState);

  const [registerState, setRegisterState] = useState<AuthState>(initialState);
  const [isRegisterPending, setIsRegisterPending] = useState(false);

  useEffect(() => {
    if (loginState.success && loginState.redirectTo) {
      router.push(loginState.redirectTo);
      router.refresh();
    }
  }, [loginState.success, loginState.redirectTo, router]);

  useEffect(() => {
    if (registerState.success) {
      const timer = setTimeout(() => {
        router.push("/agendar");
        router.refresh();
      }, 800);
      return () => clearTimeout(timer);
    }

    return undefined;
  }, [registerState.success, router]);

  async function handleRegisterSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isRegisterPending || registerState.success) return;

    setIsRegisterPending(true);
    try {
      const formData = new FormData(e.currentTarget);
      const result = await registerAction(initialState, formData);
      setRegisterState(result || { success: false, message: "Erro ao criar conta." });
    } catch {
      setRegisterState({ success: false, message: "Erro ao criar conta. Tente novamente." });
    } finally {
      setIsRegisterPending(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#013648] text-[#EAD8AC]">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="order-2 lg:order-1 px-5 sm:px-8 py-8 sm:py-12 flex items-center justify-center">
          <div className="w-full max-w-md">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#EAD8AC]/85 hover:text-[#EAD8AC] mb-5">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Link>

            <Card variant="highlighted">
              <CardContent className="p-5 sm:p-6">
                <div className="flex gap-2 mb-6 rounded-xl border border-black bg-black/35 p-1">
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${mode === "login"
                      ? "bg-[#EAD8AC] text-[#013648]"
                      : "text-[#EAD8AC]/80 hover:text-[#EAD8AC]"
                      }`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("cadastro")}
                    className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${mode === "cadastro"
                      ? "bg-[#EAD8AC] text-[#013648]"
                      : "text-[#EAD8AC]/80 hover:text-[#EAD8AC]"
                      }`}
                  >
                    Criar conta
                  </button>
                </div>

                {mode === "login" ? (
                  <div className="space-y-4">
                    <div>
                      <h1 className="text-2xl font-bold">Entrar</h1>
                      <p className="text-sm text-[#EAD8AC]/75 mt-1">
                        Acesse sua conta para agendar seus horários.
                      </p>
                    </div>

                    <form action={loginFormAction} className="space-y-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" required placeholder="seu@email.com" autoComplete="email" />
                        {loginState.errors?.email && <p className="text-xs text-red-300">{loginState.errors.email[0]}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="password">Senha</Label>
                        <Input id="password" name="password" type="password" required placeholder="Mínimo 6 caracteres" autoComplete="current-password" />
                        {loginState.errors?.password && <p className="text-xs text-red-300">{loginState.errors.password[0]}</p>}
                      </div>

                      {loginState.message && (
                        <div
                          className={`text-sm p-2.5 rounded-lg border ${loginState.success
                            ? "border-[#22C55E]/50 bg-[#22C55E]/10 text-[#BBF7D0]"
                            : "border-[#EF4444]/50 bg-[#EF4444]/10 text-[#FECACA]"
                            }`}
                        >
                          {loginState.message}
                        </div>
                      )}

                      <Button type="submit" variant="gradient" className="w-full" size="lg">
                        Entrar
                      </Button>
                    </form>

                    <div className="flex justify-between text-sm">
                      <Link href="/esqueci-senha" className="text-[#EAD8AC]/75 hover:text-[#EAD8AC] transition-colors">
                        Esqueci a senha
                      </Link>
                      <button
                        type="button"
                        onClick={() => setMode("cadastro")}
                        className="text-[#EAD8AC]/75 hover:text-[#EAD8AC] transition-colors"
                      >
                        Criar conta
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h1 className="text-2xl font-bold">Criar conta</h1>
                      <p className="text-sm text-[#EAD8AC]/75 mt-1">
                        Cadastre-se para agendar online.
                      </p>
                    </div>

                    <form onSubmit={handleRegisterSubmit} className="space-y-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="nome">Nome completo</Label>
                        <Input id="nome" name="nome" type="text" required placeholder="Seu nome" autoComplete="name" disabled={registerState.success} />
                        {registerState.errors?.nome && <p className="text-xs text-red-300">{registerState.errors.nome[0]}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="register-email">Email</Label>
                        <Input id="register-email" name="email" type="email" required placeholder="seu@email.com" autoComplete="email" disabled={registerState.success} />
                        {registerState.errors?.email && <p className="text-xs text-red-300">{registerState.errors.email[0]}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="telefone">Telefone (opcional)</Label>
                        <Input id="telefone" name="telefone" type="tel" placeholder="(11) 99999-9999" autoComplete="tel" disabled={registerState.success} />
                        {registerState.errors?.telefone && <p className="text-xs text-red-300">{registerState.errors.telefone[0]}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="register-password">Senha</Label>
                        <Input id="register-password" name="password" type="password" required minLength={6} placeholder="Mínimo 6 caracteres" autoComplete="new-password" disabled={registerState.success} />
                        {registerState.errors?.password && <p className="text-xs text-red-300">{registerState.errors.password[0]}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="confirmPassword">Confirmar senha</Label>
                        <Input id="confirmPassword" name="confirmPassword" type="password" required autoComplete="new-password" placeholder="Repita a senha" disabled={registerState.success} />
                        {registerState.errors?.confirmPassword && <p className="text-xs text-red-300">{registerState.errors.confirmPassword[0]}</p>}
                      </div>

                      {registerState.message && (
                        <div
                          className={`text-sm p-2.5 rounded-lg border ${registerState.success
                            ? "border-[#22C55E]/50 bg-[#22C55E]/10 text-[#BBF7D0]"
                            : "border-[#EF4444]/50 bg-[#EF4444]/10 text-[#FECACA]"
                            }`}
                        >
                          {registerState.message}
                        </div>
                      )}

                      <Button type="submit" variant="gradient" className="w-full" size="lg" disabled={isRegisterPending || registerState.success}>
                        {isRegisterPending ? (
                          <span className="inline-flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Criando conta...
                          </span>
                        ) : registerState.success ? (
                          "Redirecionando..."
                        ) : (
                          "Criar conta"
                        )}
                      </Button>
                    </form>

                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className="text-sm text-[#EAD8AC]/75 hover:text-[#EAD8AC] transition-colors"
                    >
                      Já tenho conta
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        <aside className="hidden lg:block order-1 lg:order-2 relative min-h-[260px] lg:min-h-screen border-b lg:border-b-0 lg:border-l border-black overflow-hidden">
          <Image
            src="/images/hero-barbearia.jpg"
            alt="Barbearia do Moura"
            fill
            priority
            className="object-cover"
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/35 via-transparent to-black/45" />
          <div className="absolute inset-0 hero-atmosphere opacity-70" />
        </aside>
      </div>
    </div>
  );
}

