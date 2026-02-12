"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { Phone } from "lucide-react";
import { loginAction } from "@/lib/auth/actions";
import { getWhatsAppLink } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Container, SectionWrapper } from "./primitives";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5511960234545";

const initialState = {
  success: false,
  message: "",
  redirectTo: undefined,
};

export function LoginSection() {
  const [state, formAction] = useFormState(loginAction, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success && state.redirectTo) {
      router.push(state.redirectTo);
    }
  }, [state.success, state.redirectTo, router]);

  return (
    <SectionWrapper id="login" bg="dark">
      <Container>
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: text */}
          <div className="space-y-5">
            <span className="inline-block mb-1 px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full border border-[#EAD8AC]/30 bg-[#EAD8AC]/10 text-[#EAD8AC]">
              Acesse sua conta
            </span>
            <h2 className="super-heading text-3xl sm:text-4xl">
              Entre e agende seu horario
            </h2>
            <p className="text-[#EAD8AC]/80 leading-relaxed">
              Faca login para agendar servicos, acompanhar seus horarios e
              aproveitar beneficios exclusivos do Clube do Moura.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Button variant="outline" asChild>
                <a
                  href={getWhatsAppLink(
                    WHATSAPP_NUMBER,
                    "Ola! Gostaria de saber mais sobre a Barbearia do Moura."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Phone className="h-4 w-4 mr-1" />
                  WhatsApp
                </a>
              </Button>
            </div>
          </div>

          {/* Right: login form */}
          <Card variant="highlighted" className="animate-in">
            <CardContent className="p-5 sm:p-6 space-y-4">
              <div>
                <h3 className="text-xl font-semibold">Entrar</h3>
                <p className="text-sm text-[#EAD8AC]/75">
                  Acesse sua agenda e beneficios
                </p>
              </div>

              <form action={formAction} className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="seu@email.com"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                  />
                </div>

                {state.message && (
                  <div
                    className={`text-sm p-2.5 rounded-lg border ${
                      state.success
                        ? "border-[#22C55E]/50 bg-[#22C55E]/10 text-[#BBF7D0]"
                        : "border-[#EF4444]/50 bg-[#EF4444]/10 text-[#FECACA]"
                    }`}
                  >
                    {state.message}
                  </div>
                )}

                <Button type="submit" variant="gradient" className="w-full">
                  Entrar
                </Button>
              </form>

              <div className="flex justify-between text-sm pt-1">
                <Link
                  href="/esqueci-senha"
                  className="text-[#EAD8AC]/75 hover:text-[#EAD8AC] transition-colors"
                >
                  Esqueceu a senha?
                </Link>
                <Link
                  href="/login"
                  className="text-[#EAD8AC]/75 hover:text-[#EAD8AC] transition-colors"
                >
                  Cadastrar
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </SectionWrapper>
  );
}


