import Link from "next/link";
import { ArrowLeft, Check, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Planos do Clube do Moura conforme o documento
const CLUB_PLANS = [
    {
        id: "1",
        nome: "Silver Limitado",
        preco: 99.90,
        descricao: "Cortes limitados para uso exclusivo",
        restricao: "Terça, quarta e quinta-feira",
        beneficios: [
            "Cortes de cabelo limitados",
            "Uso exclusivo na terça, quarta e quinta",
            "Agendamento facilitado",
        ],
        popular: false,
    },
    {
        id: "2",
        nome: "Black",
        preco: 119.90,
        descricao: "Cortes ilimitados em qualquer dia",
        restricao: "Qualquer dia da semana",
        beneficios: [
            "Cortes ilimitados",
            "Válido em qualquer dia da semana",
            "Agendamento prioritário",
        ],
        popular: true,
    },
    {
        id: "3",
        nome: "Gold Limitado",
        preco: 169.90,
        descricao: "Corte e Barba para uso exclusivo",
        restricao: "Terça, quarta e quinta-feira",
        beneficios: [
            "Corte + Barba limitados",
            "Uso exclusivo na terça, quarta e quinta",
            "Agendamento prioritário",
        ],
        popular: false,
    },
    {
        id: "4",
        nome: "Premium",
        preco: 199.90,
        descricao: "Corte e Barba ilimitados",
        restricao: "Qualquer dia da semana",
        beneficios: [
            "Corte + Barba ilimitados",
            "Válido em qualquer dia da semana",
            "Agendamento VIP",
            "Benefícios exclusivos",
        ],
        popular: false,
    },
];

export default function ClubPage() {
    return (
        <div className="min-h-screen bg-[#05384B] text-[#E4D0B0]">
            <div className="container max-w-5xl mx-auto px-6 py-12">
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
                    <div className="text-center">
                        <Badge className="mb-4 bg-[#E4D0B0] text-[#05384B]">
                            <Crown className="h-3 w-3 mr-1" />
                            Clube do Moura
                        </Badge>
                        <h1 className="text-4xl font-bold mb-3" style={{ fontFamily: "Tangerine, cursive" }}>
                            Clube do Moura
                        </h1>
                        <p className="text-[#E4D0B0]/70 max-w-2xl mx-auto">
                            Assine nosso clube e tenha acesso a serviços ilimitados com
                            condições especiais. Escolha o plano ideal para você.
                        </p>
                    </div>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {CLUB_PLANS.map((plan) => (
                        <Card
                            key={plan.id}
                            className={`relative ${plan.popular
                                    ? "bg-[#E4D0B0]/10 border-[#E4D0B0] shadow-lg"
                                    : "bg-[#05384B]/50 border-[#E4D0B0]/20"
                                } hover:border-[#E4D0B0]/60 transition-all`}
                        >
                            {plan.popular && (
                                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#E4D0B0] text-[#05384B]">
                                    Mais Popular
                                </Badge>
                            )}
                            <CardContent className="p-6">
                                <h3 className="text-2xl font-bold text-[#E4D0B0] mb-2">
                                    {plan.nome}
                                </h3>
                                <p className="text-[#E4D0B0]/70 text-sm mb-3">
                                    {plan.descricao}
                                </p>
                                <div className="mb-4">
                                    <span className="text-4xl font-bold text-[#E4D0B0]">
                                        R$ {plan.preco.toFixed(2).replace(".", ",")}
                                    </span>
                                    <span className="text-[#E4D0B0]/60">/mês</span>
                                </div>
                                <div className="mb-4">
                                    <p className="text-sm text-[#E4D0B0]/80 font-medium">
                                        📅 {plan.restricao}
                                    </p>
                                </div>
                                <ul className="space-y-2 mb-6">
                                    {plan.beneficios.map((beneficio, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-[#E4D0B0]/80">
                                            <Check className="h-4 w-4 text-[#E4D0B0] flex-shrink-0 mt-0.5" />
                                            <span>{beneficio}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    className={`w-full ${plan.popular
                                            ? "bg-[#E4D0B0] text-[#05384B] hover:bg-[#E4D0B0]/90"
                                            : "bg-transparent border border-[#E4D0B0] text-[#E4D0B0] hover:bg-[#E4D0B0]/10"
                                        }`}
                                    asChild
                                >
                                    <Link href="/clube">Assinar {plan.nome}</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Additional Info */}
                <div className="mt-8 p-6 bg-[#05384B]/50 border border-[#E4D0B0]/20 rounded-lg">
                    <h3 className="text-lg font-semibold text-[#E4D0B0] mb-3">
                        Por que assinar o Clube do Moura?
                    </h3>
                    <ul className="space-y-2 text-sm text-[#E4D0B0]/70">
                        <li>✅ Economia garantida com serviços ilimitados</li>
                        <li>✅ Agendamento facilitado para assinantes</li>
                        <li>✅ Flexibilidade para escolher seus horários</li>
                        <li>✅ Cancele quando quiser, sem multa</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
