import Link from "next/link";
import { ArrowLeft, Scissors, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { getActiveProfessionals } from "@/lib/scheduling/actions";
import { getInitials } from "@/lib/utils";

export default async function ProfessionalsPage() {
  const professionals = await getActiveProfessionals();

  return (
    <div className="min-h-screen super-page-bg">
      <div className="hero-atmosphere" />
      <div className="container-app py-8 sm:py-12">
        <div className="max-w-5xl mx-auto">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para inicio
            </Link>
          </Button>

          <div className="mb-8 space-y-3">
            <Badge className="bg-[#EAD8AC]/10 border-[#EAD8AC]/30 text-[#EAD8AC]">
              <Scissors className="h-3 w-3 mr-1" />
              Time especializado
            </Badge>
            <h1 className="super-heading">Profissionais da casa</h1>
            <p className="super-subheading max-w-2xl">
              Conheca a equipe que atende diariamente com foco em consistencia, acabamento e atendimento de alto nivel.
            </p>
          </div>

          {professionals && professionals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {professionals.map((professional) => (
                <Card key={professional.id} variant="interactive" className="h-full">
                  <CardContent className="p-5 text-center">
                    <Avatar className="mx-auto h-20 w-20 mb-3" status="online">
                      <AvatarImage
                        src={professional.user?.avatar_url || undefined}
                        alt={professional.user?.nome || "Profissional"}
                      />
                      <AvatarFallback className="text-lg">
                        {getInitials(professional.user?.nome || "P")}
                      </AvatarFallback>
                    </Avatar>

                    <h2 className="text-lg font-semibold text-[#EAD8AC]">
                      {professional.user?.nome || "Profissional"}
                    </h2>
                    <p className="text-sm text-[#EAD8AC]/75 mt-2">
                      {professional.bio || "Especialista em cortes modernos e classicos."}
                    </p>

                    <div className="mt-4 inline-flex items-center gap-1 rounded-full border border-black bg-black/30 px-3 py-1 text-xs">
                      <Star className="h-3.5 w-3.5 text-[#EAD8AC]" />
                      Atendimento premium
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Users}
              title="Sem profissionais ativos"
              description="No momento nao ha profissionais disponiveis para exibicao."
              action={
                <Button asChild variant="outline">
                  <Link href="/">Voltar para inicio</Link>
                </Button>
              }
              className="max-w-lg mx-auto"
            />
          )}

          <div className="mt-8 grid sm:grid-cols-2 gap-3">
            <Button asChild variant="gradient" size="lg">
              <Link href="/login">Criar conta</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/sobre/servicos">Ver servicos</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


