import { Container, SectionWrapper, SectionTitle } from "./primitives";

const brands = [
  "Barber Pro",
  "Gold Line",
  "Premium Cuts",
  "Style Lab",
  "Razor Edge",
  "Classic Man",
  "Sharp Co.",
  "Urban Groom",
];

export function BrandsSection() {
  return (
    <SectionWrapper bg="darker">
      <Container>
        <SectionTitle
          badge="Parceiros"
          title="Marcas que confiamos"
          description="Trabalhamos apenas com produtos de primeira linha."
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {brands.map((brand) => (
            <div
              key={brand}
              className="flex items-center justify-center h-20 rounded-xl border border-black bg-black/30 backdrop-blur-sm grayscale hover:grayscale-0 transition-all duration-300 hover:border-[#EAD8AC]/30"
            >
              <span className="text-sm font-semibold text-[#EAD8AC]/50 tracking-wider uppercase">
                {brand}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </SectionWrapper>
  );
}
