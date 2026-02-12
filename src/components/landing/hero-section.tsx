import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Container } from "./primitives";

export function HeroSection() {
  return (
    <section className="relative min-h-[72vh] md:min-h-[88vh] flex items-center super-page-bg overflow-hidden">
      <div className="hero-atmosphere" />
      <div className="absolute inset-x-5 md:inset-x-16 lg:inset-x-24 top-24 md:top-28 bottom-10 rounded-3xl border border-[#EAD8AC]/20 overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.35)]">
        <Image
          src="/images/hero-barbearia.jpg"
          alt="Barbeiro finalizando acabamento de barba"
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 80vw"
        />
        <div className="absolute inset-0 bg-[#011E2D]/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#011E2D]/80 via-transparent to-[#011E2D]/70" />
      </div>

      <Container className="relative z-10 pt-24 pb-16">
        <div className="max-w-3xl mx-auto text-center space-y-7 animate-in">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#EAD8AC] text-balance">
            Experiencia premium pra quem nao abre mao de presenca.
          </h1>

          <p className="super-subheading text-base sm:text-lg max-w-xl mx-auto">
            Agenda facil, atendimento especializado e uma equipe focada no seu visual.
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
