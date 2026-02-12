import { Scissors, Sparkles, Crown, Droplets } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Container, SectionWrapper, SectionTitle } from "./primitives";
import type { Service } from "@/types";

const serviceIcons = [Scissors, Sparkles, Crown, Droplets];

interface ServicesSectionProps {
  services: Service[];
}

export function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <SectionWrapper id="servicos">
      <Container>
        <SectionTitle
          badge="Servicos"
          title="O que oferecemos"
          description="Cortes modernos, barba classica e tratamentos para manter seu estilo sempre em dia."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.slice(0, 8).map((service, i) => {
            const Icon = serviceIcons[i % serviceIcons.length];
            return (
              <Card key={service.id} variant="interactive">
                <CardContent className="p-5 space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-[#EAD8AC]/10 border border-[#EAD8AC]/20 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-[#EAD8AC]" />
                  </div>
                  <h3 className="font-semibold text-[#EAD8AC]">
                    {service.nome}
                  </h3>
                  {service.descricao && (
                    <p className="text-sm text-[#EAD8AC]/70 line-clamp-2">
                      {service.descricao}
                    </p>
                  )}
                  <Button variant="ghost" size="sm" className="w-full" asChild>
                    <a href="#login">Agendar</a>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Container>
    </SectionWrapper>
  );
}
