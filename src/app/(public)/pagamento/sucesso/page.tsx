import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Calendar, Home } from "lucide-react";

export const metadata = {
  title: "Pagamento Aprovado | Barbearia do Moura",
  description: "Seu pagamento foi processado com sucesso.",
};

export default function PagamentoSucessoPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/20">
      <Card className="max-w-md w-full text-center">
        <CardHeader className="pb-4">
          <div className="w-20 h-20 mx-auto mb-4 bg-success/20 rounded-full flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-success" />
          </div>
          <CardTitle className="text-2xl text-success">
            Pagamento Aprovado!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Seu pagamento foi processado com sucesso. Você receberá uma
            confirmação por e-mail em instantes.
          </p>

          <div className="bg-secondary rounded-lg p-4 text-sm text-left space-y-2">
            <p className="text-muted-foreground">
              ✓ Pagamento confirmado pelo Mercado Pago
            </p>
            <p className="text-muted-foreground">
              ✓ Agendamento/Assinatura ativado
            </p>
            <p className="text-muted-foreground">
              ✓ E-mail de confirmação enviado
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1">
              <Link href="/meus-agendamentos">
                <Calendar className="h-4 w-4 mr-2" />
                Meus Agendamentos
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex-1">
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
