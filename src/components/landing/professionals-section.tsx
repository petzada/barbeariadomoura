import { Container, SectionWrapper } from "./primitives";

interface ProfessionalData {
  id: string;
  bio: string | null;
  foto_url: string | null;
  user?: {
    nome: string;
    avatar_url: string | null;
  } | null;
}

interface ProfessionalsSectionProps {
  professionals: ProfessionalData[];
}

export function ProfessionalsSection({ professionals }: ProfessionalsSectionProps) {
  const featuredProfessionals = professionals.slice(0, 2);

  return (
    <SectionWrapper id="profissionais">
      <Container>
        <div className="mb-8 md:mb-10 text-center">
          <span className="section-label">Equipe</span>
          <h2 className="super-heading text-3xl sm:text-4xl lg:text-[2.75rem] mt-2">
            Profissionais dedicados
          </h2>
          <p className="super-subheading mt-3 max-w-2xl mx-auto">
            Conheca quem cuida do seu estilo com técnica e atenção aos detalhes.
          </p>
        </div>

        {featuredProfessionals.length > 0 ? (
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 justify-center">
            {featuredProfessionals.map((prof) => {
              const nome = prof.user?.nome ?? "Profissional";
              const photoUrl = prof.user?.avatar_url ?? prof.foto_url;

              return (
                <article key={prof.id} className="relative h-[440px] sm:h-[520px] rounded-xl overflow-hidden border border-black">
                  {photoUrl ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${photoUrl})` }}
                    />
                  ) : (
                    <div className="absolute inset-0 img-placeholder" />
                  )}

                  <div className="absolute inset-0 bg-black/55" />

                  <div className="relative z-10 p-5 sm:p-6 flex h-full flex-col justify-end text-center">
                    <h3 className="text-2xl font-semibold text-[#EAD8AC]">{nome}</h3>
                    <p className="mt-2 text-sm sm:text-base text-[#EAD8AC]/85 max-w-md mx-auto">
                      {prof.bio || "Especialista em cortes modernos, classicos e acabamento premium."}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 justify-center">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="relative h-[440px] sm:h-[520px] rounded-xl overflow-hidden border border-black img-placeholder"
              >
                <div className="absolute inset-0 bg-black/55" />
                <div className="relative z-10 p-6 flex h-full items-end justify-center text-center">
                  <p className="text-lg font-semibold text-[#EAD8AC]">Profissional</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </SectionWrapper>
  );
}

