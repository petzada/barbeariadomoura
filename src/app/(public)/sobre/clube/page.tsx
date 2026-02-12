import Link from "next/link";
import { ArrowLeft, Check, Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ClubPlan = {
  id: string;
  name: string;
  monthlyPrice: number;
  summary: string;
  scheduleRule: string;
  highlights: string[];
  featured?: boolean;
};

const CLUB_PLANS: ClubPlan[] = [
  {
    id: "silver-limitado",
    name: "Silver Limitado",
    monthlyPrice: 99.9,
    summary: "Cortes limitados para rotina objetiva.",
    scheduleRule: "Uso exclusivo: terca, quarta e quinta",
    highlights: ["Cortes de cabelo no plano", "Agendamento facilitado", "Atendimento recorrente"],
  },
  {
    id: "black",
    name: "Black",
    monthlyPrice: 119.9,
    summary: "Cortes ilimitados em qualquer dia.",
    scheduleRule: "Valido todos os dias da semana",
    highlights: ["Cortes ilimitados", "Prioridade de agenda", "Melhor custo para frequencia alta"],
    featured: true,
  },
  {
    id: "gold-limitado",
    name: "Gold Limitado",
    monthlyPrice: 169.9,
    summary: "Corte e barba com foco em economia.",
    scheduleRule: "Uso exclusivo: terca, quarta e quinta",
    highlights: ["Corte + barba", "Prioridade no atendimento", "Pacote premium limitado"],
  },
  {
    id: "premium",
    name: "Premium",
    monthlyPrice: 199.9,
    summary: "Corte e barba ilimitados com prioridade total.",
    scheduleRule: "Valido todos os dias da semana",
    highlights: ["Corte + barba ilimitados", "Atendimento VIP", "Beneficios extras no plano"],
  },
];

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default function ClubPage() {
  return (
    <div className="min-h-screen super-page-bg">
      <div className="hero-atmosphere" />
      <div className="container-app py-8 sm:py-12">
        <div className="max-w-6xl mx-auto">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para inicio
            </Link>
          </Button>

          <div className="mb-8 space-y-3">
            <Badge className="bg-[#EAD8AC]/10 border-[#EAD8AC]/30 text-[#EAD8AC]">
              <Crown className="h-3 w-3 mr-1" />
              Clube do Moura
            </Badge>
            <h1 className="super-heading">Planos de assinatura</h1>
            <p className="super-subheading max-w-2xl">
              Assine para reduzir custo mensal e ganhar prioridade nos horarios. Escolha o plano mais alinhado ao seu ritmo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {CLUB_PLANS.map((plan) => (
              <Card key={plan.id} variant={plan.featured ? "highlighted" : "interactive"} className="h-full">
                <CardContent className="p-5 flex h-full flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-lg font-semibold">{plan.name}</h2>
                    {plan.featured && (
                      <Badge className="bg-[#EAD8AC] text-[#013648]">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Destaque
                      </Badge>
                    )}
                  </div>

                  <p className="mt-2 text-sm text-[#EAD8AC]/75">{plan.summary}</p>
                  <p className="mt-4 text-3xl font-bold">{currency.format(plan.monthlyPrice)}</p>
                  <p className="text-xs text-[#EAD8AC]/70">por mes</p>

                  <div className="mt-4 rounded-lg border border-black bg-black/25 p-2.5 text-xs text-[#EAD8AC]/80">
                    {plan.scheduleRule}
                  </div>

                  <ul className="mt-4 space-y-2 text-sm flex-1">
                    {plan.highlights.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-[#EAD8AC]/85">
                        <Check className="h-4 w-4 mt-0.5 text-[#EAD8AC]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <Button asChild className="mt-5 w-full" variant={plan.featured ? "gradient" : "outline"}>
                    <Link href="/login">Assinar {plan.name}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 grid sm:grid-cols-2 gap-3">
            <Button asChild variant="gradient" size="lg">
              <Link href="/login">Criar conta e assinar</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/sobre/servicos">Ver servicos incluidos</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


