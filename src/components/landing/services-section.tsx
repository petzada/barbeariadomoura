import { Clock3, Crown, Droplets, Scissors, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Container, SectionWrapper } from "./primitives";
import type { Service } from "@/types";

const serviceIcons = [Scissors, Sparkles, Crown, Droplets];

interface ServicesSectionProps {
  services: Service[];
}

export function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <SectionWrapper id="servicos">
      <Container>
        <div className="mb-8 md:mb-10 text-center">
          <span className="section-label">Servicos</span>
          <h2 className="super-heading text-3xl sm:text-4xl lg:text-[2.75rem] mt-2">
            O que oferecemos?
          </h2>
          <p className="super-subheading mt-3 max-w-2xl mx-auto">
            Cortes modernos, barba clássica e tratamentos para manter seu estilo sempre em dia.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {services.slice(0, 8).map((service, i) => {
            const Icon = serviceIcons[i % serviceIcons.length];
            return (
              <Card key={service.id} variant="interactive" className="h-full">
                <CardContent className="p-5 space-y-3 h-full flex flex-col">
                  <div className="w-10 h-10 rounded-lg bg-[#EAD8AC]/10 border border-[#EAD8AC]/20 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-[#EAD8AC]" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-semibold text-[#EAD8AC]">{service.nome}</h3>
                    <p className="text-lg font-bold text-[#EAD8AC]">
                      {formatCurrency(service.preco)}
                    </p>
                  </div>

                  <p className="text-sm text-[#EAD8AC]/70 line-clamp-3 flex-1">
                    {service.descricao || "Servico premium com acabamento e atencao aos detalhes."}
                  </p>

                  <div className="text-xs text-[#EAD8AC]/65 flex items-center gap-1.5">
                    <Clock3 className="h-3.5 w-3.5" />
                    {service.duracao_minutos} min
                  </div>

                  <Button variant="ghost" size="sm" className="w-full" asChild>
                    <a href="/login">Agendar</a>
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

