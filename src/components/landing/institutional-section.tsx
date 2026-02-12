import { Scissors, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, SectionWrapper } from "./primitives";

export function InstitutionalSection() {
  return (
    <SectionWrapper bg="dark">
      <Container>
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Text */}
          <div className="space-y-5">
            <span className="inline-block mb-1 px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full border border-[#EAD8AC]/30 bg-[#EAD8AC]/10 text-[#EAD8AC]">
              Sobre nos
            </span>
            <h2 className="super-heading text-3xl sm:text-4xl">
              Mais que uma barbearia — um ritual de cuidado masculino
            </h2>
            <p className="text-[#EAD8AC]/80 leading-relaxed">
              Desde 2018 a Barbearia do Moura reune tecnica, ambiente acolhedor
              e produtos selecionados para entregar um resultado que faz
              diferenca no dia a dia. Cada corte e pensado para valorizar o
              estilo de quem senta na cadeira.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button variant="gradient" asChild>
                <a href="#login">
                  <Scissors className="h-4 w-4 mr-1" />
                  Agendar horario
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="#profissionais">
                  <Award className="h-4 w-4 mr-1" />
                  Conhecer a equipe
                </a>
              </Button>
            </div>
          </div>

          {/* Image placeholders */}
          <div className="relative h-[340px] sm:h-[420px]">
            <div className="absolute top-0 right-0 w-[65%] h-[75%] rounded-xl img-placeholder border border-black" />
            <div className="absolute bottom-0 left-0 w-[55%] h-[55%] rounded-xl img-placeholder-alt border border-[#EAD8AC]/20 shadow-lg" />
          </div>
        </div>
      </Container>
    </SectionWrapper>
  );
}
