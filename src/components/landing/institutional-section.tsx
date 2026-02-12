import { Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, SectionWrapper } from "./primitives";

export function InstitutionalSection() {
  return (
    <SectionWrapper bg="dark">
      <Container>
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-5">
            <span className="section-label">Sobre nós</span>
            <h2 className="super-heading text-3xl sm:text-4xl">
              Mais que uma barbearia, uma paixão pelo trabalho.
            </h2>
            <p className="text-[#EAD8AC]/80 leading-relaxed">
              A Barbearia do Moura reune técnica, ambiente acolhedor
              e produtos selecionados para entregar um resultado que faz
              diferença no dia a dia. Cada corte é pensado para valorizar o
              estilo de quem senta na cadeira.
            </p>
            <div className="pt-2">
              <Button variant="outline" asChild>
                <a href="#profissionais">
                  <Award className="h-4 w-4 mr-1" />
                  Conheça nossa equipe
                </a>
              </Button>
            </div>
          </div>

          <div className="relative h-[320px] sm:h-[400px]">
            <div className="absolute top-0 right-0 w-[65%] h-[75%] rounded-xl img-placeholder border border-black" />
            <div className="absolute bottom-0 left-0 w-[55%] h-[55%] rounded-xl img-placeholder-alt border border-[#EAD8AC]/20 shadow-lg" />
          </div>
        </div>
      </Container>
    </SectionWrapper>
  );
}

