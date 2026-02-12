"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import { cn, formatCurrency, getInitials, getWhatsAppLink } from "@/lib/utils";
import {
  getActiveServices,
  getActiveProfessionals,
  buscarHorariosDisponiveis,
  calcularValorAgendamento,
  criarAgendamento,
} from "@/lib/scheduling/actions";
import type { CalculoAgendamento } from "@/types";
import {
  Calendar,
  Clock,
  Check,
  ArrowLeft,
  ArrowRight,
  Scissors,
  User,
  CalendarDays,
  CreditCard,
  Crown,
  AlertTriangle,
  MessageCircle,
  Loader2,
} from "lucide-react";
import { format, addDays, isBefore, startOfToday, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5511960234545";

type Step = 1 | 2 | 3 | 4;

interface Service {
  id: string;
  nome: string;
  descricao: string | null;
  preco: number;
  duracao_minutos: number;
}

interface Professional {
  id: string;
  bio: string | null;
  foto_url: string | null;
  user: {
    nome: string;
    avatar_url: string | null;
  };
}

export default function AgendarPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: loadingUser, isAuthenticated } = useUser();
  const [isPending, startTransition] = useTransition();

  // Estado do wizard
  const [step, setStep] = useState<Step>(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Dados
  const [services, setServices] = useState<Service[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [calculo, setCalculo] = useState<CalculoAgendamento | null>(null);

  // Loading states
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingProfessionals, setLoadingProfessionals] = useState(true);
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [loadingCalculo, setLoadingCalculo] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Redirecionar se não autenticado
  useEffect(() => {
    if (!loadingUser && !isAuthenticated) {
      router.push("/?redirect=/agendar");
    }
  }, [loadingUser, isAuthenticated, router]);

  // Carregar serviços e profissionais
  useEffect(() => {
    async function loadData() {
      try {
        const [servicesData, professionalsData] = await Promise.all([
          getActiveServices(),
          getActiveProfessionals(),
        ]);
        setServices(servicesData as Service[]);
        setProfessionals(professionalsData as Professional[]);
      } catch {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados. Tente novamente.",
          variant: "destructive",
        });
      } finally {
        setLoadingServices(false);
        setLoadingProfessionals(false);
      }
    }
    loadData();
  }, [toast]);

  // Carregar horários quando data e profissional selecionados
  useEffect(() => {
    if (!selectedProfessional || !selectedDate || !selectedService) return;

    async function loadTimes() {
      setLoadingTimes(true);
      setAvailableTimes([]);
      setSelectedTime(null);

      try {
        const times = await buscarHorariosDisponiveis(
          selectedProfessional!.id,
          selectedDate!,
          selectedService!.duracao_minutos
        );
        setAvailableTimes(times);
      } catch {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os horários disponíveis.",
          variant: "destructive",
        });
      } finally {
        setLoadingTimes(false);
      }
    }

    loadTimes();
  }, [selectedProfessional, selectedDate, selectedService, toast]);

  // Calcular valor quando tudo selecionado
  useEffect(() => {
    if (!user || !selectedService || !selectedDate || !selectedTime) return;

    async function loadCalculo() {
      setLoadingCalculo(true);

      try {
        const dataHora = `${selectedDate}T${selectedTime}:00`;
        const result = await calcularValorAgendamento(
          user!.id,
          selectedService!.id,
          dataHora
        );
        setCalculo(result);
      } catch {
        toast({
          title: "Erro",
          description: "Não foi possível calcular o valor.",
          variant: "destructive",
        });
      } finally {
        setLoadingCalculo(false);
      }
    }

    loadCalculo();
  }, [user, selectedService, selectedDate, selectedTime, toast]);

  // Gerar próximos 30 dias
  const generateDates = () => {
    const dates = [];
    const today = startOfToday();

    for (let i = 0; i < 30; i++) {
      const date = addDays(today, i);
      dates.push(format(date, "yyyy-MM-dd"));
    }

    return dates;
  };

  // Handlers
  const handleNextStep = () => {
    if (step < 4) {
      startTransition(() => {
        setStep((prev) => (prev + 1) as Step);
      });
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      startTransition(() => {
        setStep((prev) => (prev - 1) as Step);
      });
    }
  };

  const handleSubmit = async () => {
    if (!selectedService || !selectedProfessional || !selectedDate || !selectedTime) return;

    setSubmitting(true);

    try {
      const result = await criarAgendamento({
        servicoId: selectedService.id,
        profissionalId: selectedProfessional.id,
        data: selectedDate,
        horario: selectedTime,
      });

      if (result.success) {
        toast({
          title: "Sucesso!",
          description: result.message,
          variant: "success",
        });
        router.push("/meus-agendamentos");
      } else {
        toast({
          title: "Erro",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar o agendamento.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Verificar se pode avançar
  const canProceed = () => {
    switch (step) {
      case 1:
        return !!selectedService;
      case 2:
        return !!selectedProfessional;
      case 3:
        return !!selectedDate && !!selectedTime;
      case 4:
        return true;
      default:
        return false;
    }
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#EAD8AC]" />
      </div>
    );
  }

  return (
    <>
      <div className="py-8">
        <div className="container-app max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Agendar Horário</h1>
            <p className="text-[#EAD8AC]">
              Selecione o serviço, profissional e horário desejado
            </p>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all",
                    step >= s
                      ? "bg-primary border-primary text-[#EAD8AC]"
                      : "border-black text-[#EAD8AC]"
                  )}
                >
                  {step > s ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="font-medium">{s}</span>
                  )}
                </div>
                {s < 4 && (
                  <div
                    className={cn(
                      "w-12 sm:w-20 h-0.5 mx-2",
                      step > s ? "bg-primary" : "bg-border"
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Labels */}
          <div className="flex justify-center gap-4 sm:gap-8 mb-8 text-xs sm:text-sm">
            <div className={cn("text-center", step === 1 && "text-[#EAD8AC] font-medium")}>
              <Scissors className="h-4 w-4 mx-auto mb-1" />
              Serviço
            </div>
            <div className={cn("text-center", step === 2 && "text-[#EAD8AC] font-medium")}>
              <User className="h-4 w-4 mx-auto mb-1" />
              Profissional
            </div>
            <div className={cn("text-center", step === 3 && "text-[#EAD8AC] font-medium")}>
              <CalendarDays className="h-4 w-4 mx-auto mb-1" />
              Data/Hora
            </div>
            <div className={cn("text-center", step === 4 && "text-[#EAD8AC] font-medium")}>
              <CreditCard className="h-4 w-4 mx-auto mb-1" />
              Confirmação
            </div>
          </div>

          {/* Step Content */}
          <div className="mb-8">
            {/* Step 1: Selecionar Serviço */}
            {step === 1 && (
              <div className="animate-in">
                <h2 className="text-xl font-semibold mb-4">Selecione o serviço</h2>

                {loadingServices ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="h-32" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {services.map((service) => (
                      <Card
                        key={service.id}
                        className={cn(
                          "cursor-pointer transition-all",
                          selectedService?.id === service.id
                            ? "border-primary ring-2 ring-primary"
                            : "hover:border-[#EAD8AC]"
                        )}
                        onClick={() => setSelectedService(service)}
                      >
                        <CardContent className="p-3 sm:p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{service.nome}</h3>
                              <p className="text-sm text-[#EAD8AC] mt-1">
                                {service.descricao}
                              </p>
                              <div className="flex items-center gap-3 mt-2 text-sm text-[#EAD8AC]">
                                <span className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {service.duracao_minutos} min
                                </span>
                              </div>
                            </div>
                            <Badge variant="default" className="text-sm sm:text-lg font-bold">
                              {formatCurrency(service.preco)}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Selecionar Profissional */}
            {step === 2 && (
              <div className="animate-in">
                <h2 className="text-xl font-semibold mb-4">Selecione o profissional</h2>

                {loadingProfessionals ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-40" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {professionals.map((prof) => (
                      <Card
                        key={prof.id}
                        className={cn(
                          "cursor-pointer transition-all text-center",
                          selectedProfessional?.id === prof.id
                            ? "border-primary ring-2 ring-primary"
                            : "hover:border-[#EAD8AC]"
                        )}
                        onClick={() => setSelectedProfessional(prof)}
                      >
                        <CardContent className="p-4 sm:p-6">
                          <Avatar className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-2 sm:mb-3">
                              alt={prof?.user?.nome ?? "Profissional"}
                            <AvatarFallback className="bg-primary text-[#EAD8AC] text-lg">
                              {getInitials(prof?.user?.nome ?? "P")}
                            </AvatarFallback>
                          </Avatar>
                          <h3 className="font-medium">{prof?.user?.nome ?? "Profissional"}</h3>
                          <p className="text-sm text-[#EAD8AC] mt-1 line-clamp-2">
                            {prof.bio}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Selecionar Data e Horário */}
            {step === 3 && (
              <div className="animate-in">
                <h2 className="text-xl font-semibold mb-4">Selecione data e horário</h2>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Calendário */}
                  <div>
                    <h3 className="font-medium mb-3">Data</h3>
                    <div className="grid grid-cols-5 sm:grid-cols-6 gap-1.5 sm:gap-2 max-h-[300px] sm:max-h-[400px] overflow-y-auto pr-2">
                      {generateDates().map((date) => {
                        const dateObj = parseISO(date);
                        const dayName = format(dateObj, "EEE", { locale: ptBR });
                        const dayNum = format(dateObj, "dd");
                        const monthName = format(dateObj, "MMM", { locale: ptBR });

                        return (
                          <button
                            key={date}
                            onClick={() => {
                              setSelectedDate(date);
                              setSelectedTime(null);
                            }}
                            className={cn(
                              "p-3 rounded-lg border text-center transition-all",
                              selectedDate === date
                                ? "border-primary bg-[#013648]/70"
                                : "border-black hover:border-[#EAD8AC]"
                            )}
                          >
                            <div className="text-xs text-[#EAD8AC] capitalize">
                              {dayName}
                            </div>
                            <div className="text-lg font-bold">{dayNum}</div>
                            <div className="text-xs text-[#EAD8AC] capitalize">
                              {monthName}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Horários */}
                  <div>
                    <h3 className="font-medium mb-3">Horário</h3>
                    {!selectedDate ? (
                      <p className="text-[#EAD8AC]">
                        Selecione uma data para ver os horários disponíveis
                      </p>
                    ) : loadingTimes ? (
                      <div className="grid grid-cols-3 gap-2">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                          <Skeleton key={i} className="h-12" />
                        ))}
                      </div>
                    ) : availableTimes.length === 0 ? (
                      <div className="text-center py-8">
                        <AlertTriangle className="h-12 w-12 mx-auto text-[#EAD8AC] mb-3" />
                        <p className="text-[#EAD8AC] mb-4">
                          Não há horários disponíveis para esta data.
                        </p>
                        <p className="text-sm text-[#EAD8AC] mb-4">
                          Para agendamentos de última hora, entre em contato via WhatsApp.
                        </p>
                        <Button variant="outline" asChild>
                          <a
                            href={getWhatsAppLink(
                              WHATSAPP_NUMBER,
                              `Olá! Gostaria de agendar um horário para ${format(
                                parseISO(selectedDate),
                                "dd/MM/yyyy",
                                { locale: ptBR }
                              )}.`
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Falar no WhatsApp
                          </a>
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-4 sm:grid-cols-3 gap-1.5 sm:gap-2 max-h-[300px] sm:max-h-[400px] overflow-y-auto pr-2">
                        {availableTimes.map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={cn(
                              "p-3 rounded-lg border text-center font-medium transition-all",
                              selectedTime === time
                                ? "border-primary bg-[#013648]/70"
                                : "border-black hover:border-[#EAD8AC]"
                            )}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Confirmação */}
            {step === 4 && (
              <div className="animate-in">
                <h2 className="text-xl font-semibold mb-4">Confirmar agendamento</h2>

                <Card>
                  <CardContent className="p-6 space-y-6">
                    {/* Resumo */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm text-[#EAD8AC] mb-1">Serviço</h4>
                        <p className="font-medium">{selectedService?.nome}</p>
                      </div>
                      <div>
                        <h4 className="text-sm text-[#EAD8AC] mb-1">Profissional</h4>
                        <p className="font-medium">{selectedProfessional?.user?.nome ?? "Profissional"}</p>
                      </div>
                      <div>
                        <h4 className="text-sm text-[#EAD8AC] mb-1">Data</h4>
                        <p className="font-medium">
                          {selectedDate &&
                            format(parseISO(selectedDate), "EEEE, dd 'de' MMMM", {
                              locale: ptBR,
                            })}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm text-[#EAD8AC] mb-1">Horário</h4>
                        <p className="font-medium">{selectedTime}</p>
                      </div>
                    </div>

                    <hr className="border-black" />

                    {/* Valor */}
                    {loadingCalculo ? (
                      <Skeleton className="h-20" />
                    ) : calculo ? (
                      <div>
                        {calculo.avisoPlanoLimitado && (
                          <div className="flex items-start gap-2 p-3 rounded-lg bg-[#EAD8AC]/10 text-[#EAD8AC] text-sm mb-4">
                            <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                            <span>{calculo.avisoPlanoLimitado}</span>
                          </div>
                        )}

                        {calculo.cobertoAssinatura ? (
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-[#EAD8AC]">
                                Valor do serviço:{" "}
                                <span className="line-through">
                                  {formatCurrency(calculo.valorServico)}
                                </span>
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="success">
                                  <Crown className="h-3 w-3 mr-1" />
                                  Incluso no seu plano
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-3xl font-bold text-[#EAD8AC]">GRÁTIS</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-[#EAD8AC]">Pagamento na barbearia</p>
                              <p className="text-sm text-[#EAD8AC]">
                                PIX, cartão ou dinheiro
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-3xl font-bold">
                                {formatCurrency(calculo.valorCobrado)}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevStep}
              disabled={step === 1 || isPending}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>

            {step < 4 ? (
              <Button onClick={handleNextStep} disabled={!canProceed() || isPending}>
                Continuar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Agendando...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Confirmar Agendamento
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}



