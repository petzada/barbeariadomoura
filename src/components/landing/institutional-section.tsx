import Image from "next/image";
import { Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, SectionWrapper } from "./primitives";

export function InstitutionalSection() {
  return (
    <SectionWrapper bg="dark">
      <Container>
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-5">
            <span className="section-label">Sobre nos</span>
            <h2 className="super-heading text-3xl sm:text-4xl">
              Mais que uma barbearia, uma paixao pelo trabalho.
            </h2>
            <p className="text-[#EAD8AC]/80 leading-relaxed">
              A Barbearia do Moura reune tecnica, ambiente acolhedor e produtos
              selecionados para entregar um resultado que faz diferenca no dia
              a dia. Cada corte e pensado para valorizar o estilo de quem senta
              na cadeira.
            </p>
            <div className="pt-2">
              <Button variant="outline" asChild>
                <a href="#profissionais">
                  <Award className="h-4 w-4 mr-1" />
                  Conheca nossa equipe
                </a>
              </Button>
            </div>
          </div>

          <div className="relative h-[340px] sm:h-[430px]">
            <div className="absolute top-0 right-0 w-[65%] h-[75%] rounded-xl overflow-hidden border border-black shadow-xl">
              <Image
                src="/images/sobre-corte.jpg"
                alt="Barbeiro realizando corte degradado"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 65vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/25" />
            </div>

            <div className="absolute bottom-0 left-0 w-[55%] h-[55%] rounded-xl overflow-hidden border border-[#EAD8AC]/20 shadow-xl">
              <Image
                src="/images/sobre-barba.jpg"
                alt="Acabamento de barba com maquina"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 55vw, 28vw"
              />
              <div className="absolute inset-0 bg-black/25" />
            </div>
          </div>
        </div>
      </Container>
    </SectionWrapper>
  );
}
