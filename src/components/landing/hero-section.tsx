import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Container } from "./primitives";

export function HeroSection() {
  return (
    <section className="relative min-h-[86vh] md:min-h-screen flex items-center super-page-bg overflow-hidden">
      <Image
        src="/images/hero-barbearia.jpg"
        alt="Barbeiro finalizando acabamento de barba"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[#011E2D]/58" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#011E2D]/82 via-transparent to-[#011E2D]/72" />
      <div className="hero-atmosphere" />

      <Container className="relative z-10 pt-28 md:pt-32 pb-16">
        <div className="max-w-3xl mx-auto text-center space-y-7 animate-in">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#EAD8AC] text-balance">
            Experiência premium pra quem não abre mão de presença.
          </h1>

          <p className="super-subheading text-base sm:text-lg max-w-xl mx-auto">
            Agenda fácil, atendimento especializado e uma equipe focada no seu visual.
          </p>

          <div className="flex justify-center gap-3 pt-2">
            <Button variant="gradient" size="lg" asChild>
              <a href="/login">Agendar agora</a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="/login">Entrar</a>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
