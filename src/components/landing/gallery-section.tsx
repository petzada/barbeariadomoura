import { Container, SectionWrapper } from "./primitives";

const galleryItems = [
  "from-[#EAD8AC]/18 via-[#013648]/65 to-[#011E2D]/90",
  "from-[#013648]/80 via-[#EAD8AC]/14 to-[#012A3A]/90",
  "from-[#EAD8AC]/14 via-[#012A3A]/82 to-[#011E2D]/85",
  "from-[#011E2D]/85 via-[#EAD8AC]/12 to-[#013648]/80",
  "from-[#EAD8AC]/10 via-[#013648]/72 to-[#012A3A]/88",
];

export function GallerySection() {
  return (
    <SectionWrapper bg="dark">
      <Container>
        <span className="section-label">Galeria</span>

        <div className="mt-5 flex gap-2 overflow-x-auto hide-scrollbar md:overflow-visible md:h-[560px]">
          {galleryItems.map((gradient, index) => (
            <div
              key={index}
              className="relative min-w-[220px] sm:min-w-[260px] md:min-w-0 md:flex-1 h-[420px] md:h-full rounded-lg overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
              <div className="absolute inset-0 animate-shimmer opacity-35" />
            </div>
          ))}
        </div>
      </Container>
    </SectionWrapper>
  );
}

