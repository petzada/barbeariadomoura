import Image from "next/image";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "./primitives";

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] md:min-h-[90vh] flex items-center super-page-bg overflow-hidden">
      <div className="hero-atmosphere" />
      <Container className="relative z-10 pt-24 pb-16">
        <div className="max-w-3xl mx-auto text-center space-y-6 animate-in">
          <Badge className="bg-[#EAD8AC]/10 border-[#EAD8AC]/30 text-[#EAD8AC]">
            <Sparkles className="h-3 w-3 mr-1" />
            Estilo e Tradicao em Cada Corte
          </Badge>

          <div className="relative w-24 h-24 mx-auto">
            <Image
              src="/logo.png"
              alt="Barbearia do Moura"
              fill
              className="rounded-full object-cover border-4 border-[#EAD8AC]/35 shadow-[0_0_24px_rgba(234,216,172,0.25)]"
              priority
            />
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#EAD8AC] text-balance">
            Experiencia premium para quem nao abre mao de presenca
          </h1>

          <p className="super-subheading text-base sm:text-lg max-w-xl mx-auto">
            Agenda facil, atendimento consistente e uma equipe focada no seu
            melhor visual. Desde 2018 em Maua-SP.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button variant="gradient" size="lg" asChild>
              <a href="#login">Agendar agora</a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="#servicos">Ver servicos</a>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
