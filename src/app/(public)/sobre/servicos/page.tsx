import Link from "next/link";
import { ArrowLeft, Clock3, Scissors, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { getActiveServices } from "@/lib/scheduling/actions";
import { formatCurrency } from "@/lib/utils";

export default async function ServicesPage() {
  const services = await getActiveServices();

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
              <Sparkles className="h-3 w-3 mr-1" />
              Catalogo de servicos
            </Badge>
            <h1 className="super-heading">Servicos da Barbearia do Moura</h1>
            <p className="super-subheading max-w-2xl">
              Escolha o atendimento ideal para sua rotina. Todos os servicos sao executados por profissionais experientes.
            </p>
          </div>

          {services && services.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {services.map((service) => (
                <Card key={service.id} variant="interactive" className="h-full">
                  <CardContent className="p-5 flex flex-col h-full">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-lg font-semibold text-[#EAD8AC]">{service.nome}</h2>
                      <Badge className="bg-[#EAD8AC] text-[#013648] font-semibold">
                        {formatCurrency(service.preco)}
                      </Badge>
                    </div>
                    <p className="text-sm text-[#EAD8AC]/75 mt-2 flex-1">
                      {service.descricao || "Servico premium com acabamento e atencao aos detalhes."}
                    </p>
                    <div className="mt-4 flex items-center text-sm text-[#EAD8AC]/80">
                      <Clock3 className="h-4 w-4 mr-2" />
                      {service.duracao_minutos} minutos
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Scissors}
              title="Sem servicos ativos"
              description="Nenhum servico disponivel no momento. Tente novamente em breve."
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
              <Link href="/login">Criar conta para agendar</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/sobre/profissionais">Ver profissionais</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


