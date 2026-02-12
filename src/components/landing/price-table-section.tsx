import { formatCurrency } from "@/lib/utils";
import { Container, SectionWrapper, SectionTitle } from "./primitives";
import type { Service } from "@/types";

interface PriceTableSectionProps {
  services: Service[];
}

export function PriceTableSection({ services }: PriceTableSectionProps) {
  const half = Math.ceil(services.length / 2);
  const col1 = services.slice(0, half);
  const col2 = services.slice(half);

  return (
    <SectionWrapper id="precos">
      <Container>
        <SectionTitle
          badge="Tabela de Precos"
          title="Investimento no seu estilo"
          description="Valores transparentes para voce planejar seu proximo corte."
        />

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[col1, col2].map((col, colIdx) => (
            <div key={colIdx} className="space-y-0">
              {col.map((service, i) => (
                <div
                  key={service.id}
                  className={`flex items-center justify-between py-4 px-2 ${
                    i < col.length - 1
                      ? "border-b border-[#EAD8AC]/10"
                      : ""
                  }`}
                >
                  <div>
                    <p className="font-medium text-[#EAD8AC]">
                      {service.nome}
                    </p>
                    <p className="text-xs text-[#EAD8AC]/60">
                      {service.duracao_minutos} min
                    </p>
                  </div>
                  <span className="font-bold text-[#EAD8AC] text-lg">
                    {formatCurrency(service.preco)}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Container>
    </SectionWrapper>
  );
}
