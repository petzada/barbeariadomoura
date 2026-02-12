import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function TermosPage() {
  return (
    <div className="min-h-screen super-page-bg">
      <div className="hero-atmosphere" />
      <div className="container-app py-8 sm:py-12">
        <div className="max-w-3xl mx-auto space-y-4">
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para inicio
            </Link>
          </Button>

          <Card>
            <CardContent className="p-5 sm:p-6 space-y-4">
              <h1 className="super-heading">Termos de uso</h1>
              <p className="text-sm text-[#EAD8AC]/80">
                Este aplicativo organiza agendamentos e assinaturas da Barbearia do Moura. Ao usar a plataforma, voce concorda com as regras de uso, politicas de cancelamento e comunicacoes operacionais.
              </p>
              <p className="text-sm text-[#EAD8AC]/80">
                Dica: para duvidas especificas sobre planos, cancelamentos e pagamentos, utilize os canais oficiais da barbearia.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
