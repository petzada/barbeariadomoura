import { Container, SectionWrapper, SectionTitle } from "./primitives";

const galleryItems = [
  { label: "Corte classico", gradient: "from-[#EAD8AC]/15 via-[#013648]/60 to-[#EAD8AC]/05" },
  { label: "Barba delineada", gradient: "from-[#013648]/70 via-[#EAD8AC]/10 to-[#013648]/50" },
  { label: "Degrade moderno", gradient: "from-[#EAD8AC]/10 via-[#012A3A]/80 to-[#EAD8AC]/08" },
  { label: "Pigmentacao", gradient: "from-[#012A3A]/60 via-[#EAD8AC]/12 to-[#013648]/70" },
  { label: "Ambiente premium", gradient: "from-[#EAD8AC]/12 via-[#013648]/50 to-[#012A3A]/80" },
  { label: "Detalhes que importam", gradient: "from-[#013648]/60 via-[#EAD8AC]/08 to-[#012A3A]/70" },
];

export function GallerySection() {
  return (
    <SectionWrapper bg="dark">
      <Container>
        <SectionTitle
          badge="Galeria"
          title="Nosso trabalho fala por si"
          description="Cada corte e uma expressao unica do estilo de quem nos visita."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryItems.map((item) => (
            <div
              key={item.label}
              className="relative aspect-[4/3] rounded-xl border border-black overflow-hidden group"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${item.gradient} transition-transform duration-500 group-hover:scale-105`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <span className="absolute bottom-3 left-3 text-sm font-medium text-[#EAD8AC]">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </SectionWrapper>
  );
}
