import { Instagram } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Container, SectionWrapper, SectionTitle } from "./primitives";

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

export function ProfessionalsSection({
  professionals,
}: ProfessionalsSectionProps) {
  return (
    <SectionWrapper id="profissionais">
      <Container>
        <SectionTitle
          badge="Equipe"
          title="Profissionais dedicados"
          description="Conhca quem cuida do seu estilo com tecnica e atencao aos detalhes."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {professionals.map((prof) => {
            const nome = prof.user?.nome ?? "Profissional";
            const avatarUrl = prof.user?.avatar_url ?? prof.foto_url;

            return (
              <Card key={prof.id} variant="interactive">
                <CardContent className="p-5 text-center space-y-3">
                  <Avatar size="xl" className="mx-auto">
                    <AvatarImage
                      src={avatarUrl ?? undefined}
                      alt={nome}
                    />
                    <AvatarFallback>{getInitials(nome)}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-[#EAD8AC]">{nome}</h3>
                  {prof.bio && (
                    <p className="text-sm text-[#EAD8AC]/70 line-clamp-2">
                      {prof.bio}
                    </p>
                  )}
                  <div className="flex justify-center gap-2 pt-1">
                    <span className="w-8 h-8 rounded-full border border-black bg-black/30 flex items-center justify-center text-[#EAD8AC]/50 hover:text-[#EAD8AC] transition-colors cursor-pointer">
                      <Instagram className="h-4 w-4" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Container>
    </SectionWrapper>
  );
}
