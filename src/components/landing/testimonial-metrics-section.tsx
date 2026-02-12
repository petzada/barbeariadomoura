import { Container, SectionWrapper } from "./primitives";

const metrics = [
  { value: "4.9", label: "Avaliacao media" },
  { value: "+3k", label: "Atendimentos" },
  { value: "6+", label: "Anos de experiencia" },
  { value: "98%", label: "Clientes satisfeitos" },
];

export function TestimonialMetricsSection() {
  return (
    <SectionWrapper>
      <Container>
        {/* Testimonial quote */}
        <div className="max-w-2xl mx-auto text-center mb-14">
          <span className="text-5xl font-serif text-[#EAD8AC]/30 leading-none">
            &ldquo;
          </span>
          <blockquote className="text-lg sm:text-xl text-[#EAD8AC]/90 italic -mt-6">
            Desde que comecei a frequentar a Barbearia do Moura, minha
            confianca mudou. Atendimento impecavel e resultado sempre
            consistente.
          </blockquote>
          <p className="mt-4 text-sm text-[#EAD8AC]/60">
            — Rafael S., cliente desde 2020
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="super-surface p-5 text-center"
            >
              <p className="text-3xl sm:text-4xl font-bold text-[#EAD8AC]">
                {m.value}
              </p>
              <p className="text-xs sm:text-sm text-[#EAD8AC]/70 mt-1">
                {m.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </SectionWrapper>
  );
}
