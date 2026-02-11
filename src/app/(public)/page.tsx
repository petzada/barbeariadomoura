"use client";

import Link from "next/link";
import Image from "next/image";
import { useFormState } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "@/lib/auth/actions";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Scissors, Users, Crown } from "lucide-react";

const initialState = {
  success: false,
  message: "",
  redirectTo: undefined,
};

export default function HomePage() {
  const [state, formAction] = useFormState(loginAction, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success && state.redirectTo) {
      router.push(state.redirectTo);
    }
  }, [state, router]);

  return (
    <div className="min-h-screen bg-[#05384B] text-[#E4D0B0] flex flex-col">
      {/* Container dividido em três terços */}
      <div className="flex-1 flex flex-col px-6">

        {/* PRIMEIRO TERÇO - Logo */}
        <div className="flex-1 flex items-center justify-center pt-12">
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <Image
                src="/logo.png"
                alt="Barbearia do Moura"
                fill
                className="rounded-full object-cover border-4 border-[#E4D0B0]/30"
                priority
              />
            </div>
            <h1
              className="text-5xl font-bold text-[#E4D0B0]"
              style={{ fontFamily: "Tangerine, cursive" }}
            >
              Barbearia do Moura
            </h1>
          </div>
        </div>

        {/* SEGUNDO TERÇO - Formulário de Login */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-sm space-y-6">
            <form action={formAction} className="space-y-4">
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
                  className="bg-[#05384B]/50 border-[#E4D0B0]/30 text-[#E4D0B0] placeholder:text-[#E4D0B0]/40 focus:border-[#E4D0B0] focus:ring-[#E4D0B0]"
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-[#E4D0B0]">
                  Senha
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="bg-[#05384B]/50 border-[#E4D0B0]/30 text-[#E4D0B0] placeholder:text-[#E4D0B0]/40 focus:border-[#E4D0B0] focus:ring-[#E4D0B0]"
                />
              </div>

              {state.message && (
                <div
                  className={`text-sm text-center p-3 rounded ${state.success
                    ? "bg-green-500/20 text-green-300"
                    : "bg-red-500/20 text-red-300"
                    }`}
                >
                  {state.message}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-[#E4D0B0] text-[#05384B] hover:bg-[#E4D0B0]/90 font-semibold"
                size="lg"
              >
                Entrar
              </Button>
            </form>

            <div className="flex justify-between text-sm">
              <Link
                href="/esqueci-senha"
                className="text-[#E4D0B0]/70 hover:text-[#E4D0B0] transition-colors"
              >
                Esqueceu a senha?
              </Link>
              <Link
                href="/cadastro"
                className="text-[#E4D0B0]/70 hover:text-[#E4D0B0] transition-colors"
              >
                Cadastrar
              </Link>
            </div>
          </div>
        </div>

        {/* TERCEIRO TERÇO - Links de Navegação */}
        <div className="flex-1 flex items-center justify-center pb-12">
          <div className="grid grid-cols-3 gap-4 w-full max-w-lg">
            <Link
              href="/sobre/servicos"
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-[#05384B]/50 border border-[#E4D0B0]/20 hover:border-[#E4D0B0]/60 transition-all"
            >
              <Scissors className="h-6 w-6 text-[#E4D0B0]" />
              <span className="text-sm text-[#E4D0B0] font-medium">Serviços</span>
            </Link>
            <Link
              href="/sobre/profissionais"
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-[#05384B]/50 border border-[#E4D0B0]/20 hover:border-[#E4D0B0]/60 transition-all"
            >
              <Users className="h-6 w-6 text-[#E4D0B0]" />
              <span className="text-sm text-[#E4D0B0] font-medium">Profissionais</span>
            </Link>
            <Link
              href="/sobre/clube"
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-[#05384B]/50 border border-[#E4D0B0]/20 hover:border-[#E4D0B0]/60 transition-all"
            >
              <Crown className="h-6 w-6 text-[#E4D0B0]" />
              <span className="text-sm text-[#E4D0B0] font-medium">Clube</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
