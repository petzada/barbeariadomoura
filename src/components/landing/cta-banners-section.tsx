import { Crown, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, SectionWrapper } from "./primitives";

export function CtaBannersSection() {
  return (
    <SectionWrapper bg="dark">
      <Container>
        <div className="grid md:grid-cols-2 gap-4">
          {/* Banner Clube */}
          <div className="relative rounded-xl overflow-hidden border border-black min-h-[220px] flex flex-col justify-end p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-[#EAD8AC]/15 via-[#013648]/80 to-[#012A3A]" />
            <div className="relative z-10 space-y-3">
              <Crown className="h-8 w-8 text-[#EAD8AC]" />
              <h3 className="text-xl font-bold text-[#EAD8AC]">
                Clube do Moura
              </h3>
              <p className="text-sm text-[#EAD8AC]/80 max-w-sm">
                Assine e tenha cortes ilimitados, prioridade na agenda e
                descontos exclusivos em produtos.
              </p>
              <Button variant="gradient" size="sm" asChild>
                <a href="#login">Conhecer planos</a>
              </Button>
            </div>
          </div>

          {/* Banner Agendamento */}
          <div className="relative rounded-xl overflow-hidden border border-black min-h-[220px] flex flex-col justify-end p-6">
            <div className="absolute inset-0 bg-gradient-to-bl from-[#013648]/90 via-[#012A3A]/80 to-[#EAD8AC]/10" />
            <div className="relative z-10 space-y-3">
              <CalendarCheck className="h-8 w-8 text-[#EAD8AC]" />
              <h3 className="text-xl font-bold text-[#EAD8AC]">
                Agende online
              </h3>
              <p className="text-sm text-[#EAD8AC]/80 max-w-sm">
                Escolha o profissional, o servico e o horario que funcionam
                melhor para voce. Simples e rapido.
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href="#login">Agendar agora</a>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </SectionWrapper>
  );
}
