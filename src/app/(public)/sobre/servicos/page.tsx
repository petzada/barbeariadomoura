import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getActiveServices } from "@/lib/scheduling/actions";
import { formatCurrency } from "@/lib/utils";

export default async function ServicesPage() {
  const services = await getActiveServices();

  return (
    <div className="min-h-screen bg-[#05384B] text-[#E4D0B0]">
      <div className="container max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            asChild
            className="mb-6 text-[#E4D0B0] hover:text-[#E4D0B0]/80"
          >
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
          <h1 className="text-3xl font-bold mb-3">
            Nossos Serviços
          </h1>
          <p className="text-sm text-[#E4D0B0]/70">
            Confira todos os serviços disponíveis na Barbearia do Moura
          </p>
        </div>

        {/* Services Grid */}
        {services && services.length > 0 ? (
          <div className="grid gap-6">
            {services.map((service) => (
              <Card
                key={service.id}
                className="bg-[#05384B]/50 border-[#E4D0B0]/20 hover:border-[#E4D0B0]/40 transition-all"
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#E4D0B0] mb-1.5">
                        {service.nome}
                      </h3>
                      <p className="text-[#E4D0B0]/70 text-sm mb-3">
                        {service.descricao}
                      </p>
                      <div className="flex items-center text-sm text-[#E4D0B0]/60">
                        <Clock className="h-4 w-4 mr-1" />
                        {service.duracao_minutos} minutos
                      </div>
                    </div>
                    <Badge
                      variant="default"
                      className="bg-[#E4D0B0] text-[#05384B] text-lg font-bold px-4 py-2"
                    >
                      {formatCurrency(service.preco)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#E4D0B0]/60">
              Nenhum serviço disponível no momento.
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-8 text-center">
          <Button
            size="lg"
            asChild
            className="bg-[#E4D0B0] text-[#05384B] hover:bg-[#E4D0B0]/90"
          >
            <Link href="/agendar">Agendar Agora</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
