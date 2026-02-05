import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Calendar, Home, MessageCircle } from "lucide-react";
import { WhatsAppButton } from "@/components/whatsapp-button";

export const metadata = {
  title: "Pagamento Pendente | Barbearia do Moura",
  description: "Seu pagamento está sendo processado.",
};

export default function PagamentoPendentePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/20">
      <Card className="max-w-md w-full text-center">
        <CardHeader className="pb-4">
          <div className="w-20 h-20 mx-auto mb-4 bg-warning/20 rounded-full flex items-center justify-center">
            <Clock className="h-10 w-10 text-warning" />
          </div>
          <CardTitle className="text-2xl text-warning">
            Pagamento Pendente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Seu pagamento está sendo processado. Assim que for confirmado, você
            receberá uma notificação por e-mail.
          </p>

          <div className="bg-secondary rounded-lg p-4 text-sm text-left space-y-3">
            <p className="font-medium">Se você pagou com boleto:</p>
            <p className="text-muted-foreground">
              • O prazo de compensação é de até 3 dias úteis
            </p>
            <p className="text-muted-foreground">
              • Após a confirmação, seu agendamento será ativado automaticamente
            </p>
            
            <p className="font-medium mt-4">Se você pagou com PIX:</p>
            <p className="text-muted-foreground">
              • A confirmação geralmente é instantânea
            </p>
            <p className="text-muted-foreground">
              • Pode levar até alguns minutos em casos excepcionais
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button asChild>
              <Link href="/meus-agendamentos">
                <Calendar className="h-4 w-4 mr-2" />
                Verificar Status
              </Link>
            </Button>
            
            <WhatsAppButton
              variant="outline"
              message="Olá! Fiz um pagamento na Barbearia do Moura e gostaria de saber o status."
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Falar Conosco
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
