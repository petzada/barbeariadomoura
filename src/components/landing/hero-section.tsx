import { Button } from "@/components/ui/button";
import { Container } from "./primitives";

export function HeroSection() {
  return (
    <section className="relative min-h-[72vh] md:min-h-[88vh] flex items-center super-page-bg overflow-hidden">
      <div className="hero-atmosphere" />
      <div className="absolute inset-x-5 md:inset-x-16 lg:inset-x-24 top-24 md:top-28 bottom-10 rounded-3xl border border-[#EAD8AC]/20 bg-gradient-to-br from-[#EAD8AC]/12 via-[#013648]/70 to-[#011E2D]/95 shadow-[0_40px_120px_rgba(0,0,0,0.35)]" />
      <Container className="relative z-10 pt-24 pb-16">
        <div className="max-w-3xl mx-auto text-center space-y-7 animate-in">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#EAD8AC] text-balance">
            Experiencia premium para quem nao abre mao de presenca
          </h1>

          <p className="super-subheading text-base sm:text-lg max-w-xl mx-auto">
            Agenda facil, atendimento consistente e uma equipe focada no seu
            melhor visual. Desde 2018 em Maua-SP.
          </p>

          <div className="flex justify-center pt-2">
            <Button variant="gradient" size="lg" asChild>
              <a href="/login">Agendar agora</a>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

