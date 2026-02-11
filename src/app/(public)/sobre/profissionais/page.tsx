import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getActiveProfessionals } from "@/lib/scheduling/actions";
import { getInitials } from "@/lib/utils";

export default async function ProfessionalsPage() {
    const professionals = await getActiveProfessionals();

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
                        Nossa Equipe
                    </h1>
                    <p className="text-sm text-[#E4D0B0]/70">
                        Conheça os profissionais que farão seu atendimento
                    </p>
                </div>

                {/* Professionals Grid */}
                {professionals && professionals.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {professionals.map((prof) => (
                            <Card
                                key={prof.id}
                                className="bg-[#05384B]/50 border-[#E4D0B0]/20 hover:border-[#E4D0B0]/40 transition-all"
                            >
                                <CardContent className="p-4 text-center">
                                    <Avatar className="h-20 w-20 mx-auto mb-3 border-2 border-[#E4D0B0]/20">
                                        <AvatarImage
                                            src={prof.user?.avatar_url || undefined}
                                            alt={prof.user?.nome || "Profissional"}
                                        />
                                        <AvatarFallback className="bg-[#E4D0B0] text-[#05384B] text-2xl font-bold">
                                            {getInitials(prof.user?.nome || "?")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <h3 className="text-lg font-semibold text-[#E4D0B0] mb-1.5">
                                        {prof.user?.nome || "Profissional"}
                                    </h3>
                                    <p className="text-[#E4D0B0]/70 text-sm">
                                        {prof.bio || "Barbeiro profissional"}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-[#E4D0B0]/60">
                            Nenhum profissional disponível no momento.
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
