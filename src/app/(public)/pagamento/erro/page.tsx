import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle, RefreshCw, Home, MessageCircle } from "lucide-react";
import { WhatsAppButton } from "@/components/whatsapp-button";

export const metadata = {
  title: "Pagamento Recusado | Barbearia do Moura",
  description: "Houve um problema com seu pagamento.",
};

export default function PagamentoErroPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#013648]">
      <Card className="max-w-md w-full text-center">
        <CardHeader className="pb-4">
          <div className="w-20 h-20 mx-auto mb-4 bg-[#EAD8AC]/20 rounded-full flex items-center justify-center">
            <XCircle className="h-10 w-10 text-[#EAD8AC]" />
          </div>
          <CardTitle className="text-2xl text-[#EAD8AC]">
            Pagamento Recusado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-[#EAD8AC]">
            Infelizmente seu pagamento não foi aprovado. Isso pode acontecer por
            diversos motivos, como saldo insuficiente ou dados incorretos.
          </p>

          <div className="bg-card border border-black rounded-lg p-4 text-sm text-left space-y-2">
            <p className="font-medium mb-2">Possíveis causas:</p>
            <p className="text-[#EAD8AC]">• Saldo ou limite insuficiente</p>
            <p className="text-[#EAD8AC]">• Dados do cartão incorretos</p>
            <p className="text-[#EAD8AC]">• Cartão bloqueado ou vencido</p>
            <p className="text-[#EAD8AC]">• Recusa pela operadora</p>
          </div>

          <div className="flex flex-col gap-3">
            <Button asChild>
              <Link href="/agendar">
                <RefreshCw className="h-4 w-4 mr-2" />
                Tentar Novamente
              </Link>
            </Button>
            
            <WhatsAppButton
              variant="outline"
              message="Olá! Tive um problema com meu pagamento na Barbearia do Moura. Podem me ajudar?"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Falar com Suporte
            </WhatsAppButton>

            <Button variant="ghost" asChild>
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Página Inicial
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


