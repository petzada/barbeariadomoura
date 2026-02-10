import Link from "next/link";
import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials, formatCurrency, getWhatsAppLink } from "@/lib/utils";
import { getActiveServices, getActiveProfessionals } from "@/lib/scheduling/actions";
import {
  Scissors,
  Clock,
  Calendar,
  Star,
  ArrowRight,
  Crown,
  Check,
  MapPin,
  Phone,
  MessageCircle,
} from "lucide-react";

// Planos de assinatura (estáticos pois são gerenciados apenas pelo sistema)
const PLANS = [
  {
    id: "1",
    nome: "Plano Básico",
    descricao: "Cortes ilimitados de terça a quinta",
    preco_mensal: 89.9,
    beneficios: [
      "Cortes de cabelo ilimitados",
      "Válido terça, quarta e quinta",
      "Agendamento prioritário",
    ],
    popular: false,
  },
  {
    id: "2",
    nome: "Plano Premium",
    descricao: "Corte + Barba ilimitados, qualquer dia",
    preco_mensal: 149.9,
    beneficios: [
      "Corte + Barba ilimitados",
      "Válido todos os dias",
      "Agendamento prioritário",
      "Produtos com desconto",
    ],
    popular: true,
  },
  {
    id: "3",
    nome: "Plano VIP",
    descricao: "Todos os serviços inclusos",
    preco_mensal: 199.9,
    beneficios: [
      "Todos os serviços inclusos",
      "Válido todos os dias",
      "Agendamento VIP",
      "Produtos com 20% off",
      "Cerveja cortesia",
    ],
    popular: false,
  },
];

const SOCIAL_PROOF = [
  {
    id: "1",
    nome: "Rafael Martins",
    bairro: "Vila Bocaina, Maua",
    feedback:
      "Atendimento pontual e corte sempre consistente. Depois que comecei a agendar pelo site, nunca mais perdi horario.",
    nota: 5,
  },
  {
    id: "2",
    nome: "Diego Almeida",
    bairro: "Jardim Zaíra, Maua",
    feedback:
      "Ambiente organizado, barbeiros muito tecnicos e resultado impecavel. Recomendo para quem busca padrao profissional.",
    nota: 5,
  },
  {
    id: "3",
    nome: "Lucas Ferreira",
    bairro: "Centro, Maua",
    feedback:
      "Assinei o clube e valeu cada real. Agendamento rapido, atendimento de qualidade e excelente custo-beneficio no mes.",
    nota: 5,
  },
];

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5511960234545";

// ============================================
// COMPONENTES DE DADOS DINÂMICOS
// ============================================

// Componente para exibir serviços do banco de dados
async function ServicesSection() {
  const services = await getActiveServices();

  if (!services || services.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Nenhum serviço disponível no momento.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <Card key={service.id} className="card-hover">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">{service.nome}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {service.descricao}
                </p>
              </div>
              <Badge variant="default" className="text-lg font-bold">
                {formatCurrency(service.preco)}
              </Badge>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              {service.duracao_minutos} min
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Loading skeleton para serviços
function ServicesLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
            <Skeleton className="h-4 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Componente para exibir profissionais do banco de dados
async function ProfessionalsSection() {
  const professionals = await getActiveProfessionals();

  if (!professionals || professionals.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Nenhum profissional disponível no momento.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
      {professionals.map((prof) => (
        <Card key={prof.id} className="card-hover text-center">
          <CardContent className="p-6">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarImage src={prof.user?.avatar_url || undefined} alt={prof.user?.nome || "Profissional"} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {getInitials(prof.user?.nome || "?")}
              </AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-lg">{prof.user?.nome || "Profissional"}</h3>
            <p className="text-sm text-muted-foreground mt-2">
              {prof.bio || "Barbeiro profissional"}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Loading skeleton para profissionais
function ProfessionalsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="text-center">
          <CardContent className="p-6">
            <Skeleton className="h-24 w-24 rounded-full mx-auto mb-4" />
            <Skeleton className="h-6 w-32 mx-auto mb-2" />
            <Skeleton className="h-4 w-48 mx-auto" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ============================================
// PÁGINA PRINCIPAL
// ============================================
export default function HomePage() {
  return (
    <>
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/20" />

          {/* Content */}
          <div className="container-app relative z-10 text-center py-20">
            <Badge variant="default" className="mb-6">
              <Crown className="h-3 w-3 mr-1" />
              A melhor barbearia de Mauá-SP
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold mb-6 font-vintage tracking-wide">
              Estilo e tradição na
              <br />
              <span className="text-gradient-gold block mt-2 text-5xl sm:text-7xl lg:text-8xl">Barbearia do Moura</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Cortes modernos, barba tradicional e ambiente acolhedor. Agende
              online 24/7 e descubra por que somos referência na região.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/agendar">
                  <Calendar className="mr-2 h-5 w-5" />
                  Agendar Agora
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#clube">
                  <Crown className="mr-2 h-5 w-5" />
                  Conhecer o Clube
                </a>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-16">
              <div>
                <p className="text-3xl font-bold text-primary">15+</p>
                <p className="text-sm text-muted-foreground">Anos de experiência</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">5000+</p>
                <p className="text-sm text-muted-foreground">Clientes satisfeitos</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">4.9</p>
                <p className="text-sm text-muted-foreground">
                  <Star className="h-4 w-4 inline text-primary" /> Avaliação
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Serviços Section */}
        <section id="servicos" className="section-padding bg-card/50">
          <div className="container-app">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">
                <Scissors className="h-3 w-3 mr-1" />
                Nossos Serviços
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-vintage text-[#F5F5F0]">
                Serviços de <span className="text-primary">Qualidade</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Oferecemos uma variedade de serviços para você ficar no estilo.
                Todos executados por profissionais experientes.
              </p>
            </div>

            <Suspense fallback={<ServicesLoadingSkeleton />}>
              <ServicesSection />
            </Suspense>

            <div className="text-center mt-8">
              <Button asChild>
                <Link href="/agendar">
                  Agendar Serviço
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Profissionais Section */}
        <section id="profissionais" className="section-padding">
          <div className="container-app">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">
                Nossa Equipe
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-vintage text-[#F5F5F0]">
                Profissionais <span className="text-primary">Experientes</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Conheça os barbeiros que vão cuidar do seu visual com
                dedicação e profissionalismo.
              </p>
            </div>

            <Suspense fallback={<ProfessionalsLoadingSkeleton />}>
              <ProfessionalsSection />
            </Suspense>
          </div>
        </section>

        {/* Depoimentos Section */}
        <section id="depoimentos" className="section-padding bg-card/50">
          <div className="container-app">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">
                <Star className="h-3 w-3 mr-1" />
                Depoimentos
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                O que nossos <span className="text-gradient-gold">Clientes</span> dizem
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A satisfação dos nossos clientes é nossa maior recompensa.
                Confira alguns depoimentos de quem já passou por aqui.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {SOCIAL_PROOF.map((item) => (
                <Card key={item.id} className="card-hover">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-1 text-primary mb-3">
                      {Array.from({ length: item.nota }).map((_, index) => (
                        <Star key={`${item.id}-${index}`} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      &quot;{item.feedback}&quot;
                    </p>
                    <div>
                      <p className="font-medium">{item.nome}</p>
                      <p className="text-xs text-muted-foreground">{item.bairro}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Clube Section */}
        <section id="clube" className="section-padding">
          <div className="container-app">
            <div className="text-center mb-12">
              <Badge variant="default" className="mb-4">
                <Crown className="h-3 w-3 mr-1" />
                Clube do Moura
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Assine e <span className="text-gradient-gold">Economize</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Faça parte do nosso clube e tenha acesso a serviços ilimitados
                com preços especiais. Escolha o plano ideal para você.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {PLANS.map((plan) => (
                <Card
                  key={plan.id}
                  className={`relative ${plan.popular
                    ? "border-primary shadow-lg scale-105"
                    : "card-hover"
                    }`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                      Mais Popular
                    </Badge>
                  )}
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-xl mb-2">{plan.nome}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {plan.descricao}
                    </p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-gradient-gold">
                        {formatCurrency(plan.preco_mensal)}
                      </span>
                      <span className="text-muted-foreground">/mês</span>
                    </div>
                    <ul className="space-y-3 mb-6">
                      {plan.beneficios.map((beneficio, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-success flex-shrink-0" />
                          {beneficio}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full"
                      variant={plan.popular ? "default" : "outline"}
                      asChild
                    >
                      <Link href="/clube">Assinar Agora</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contato Section */}
        <section id="contato" className="section-padding">
          <div className="container-app">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Badge variant="secondary" className="mb-4">
                  Contato
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  Venha nos <span className="text-gradient-gold">Visitar</span>
                </h2>
                <p className="text-muted-foreground mb-8">
                  Estamos localizados no centro de Mauá, com fácil acesso e
                  estacionamento próximo. Venha conhecer nossa estrutura!
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Endereço</h4>
                      <p className="text-muted-foreground">
                        Rua Exemplo, 123 - Centro
                        <br />
                        Mauá-SP, 09310-000
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Horário de Funcionamento</h4>
                      <p className="text-muted-foreground">
                        Terça a Sexta: 09h às 20h
                        <br />
                        Sábado: 09h às 18h
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Telefone / WhatsApp</h4>
                      <p className="text-muted-foreground">(11) 96023-4545</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <Button asChild>
                    <Link href="/agendar">
                      <Calendar className="mr-2 h-4 w-4" />
                      Agendar Online
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <a
                      href={getWhatsAppLink(
                        WHATSAPP_NUMBER,
                        "Olá! Gostaria de agendar um horário."
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      WhatsApp
                    </a>
                  </Button>
                </div>
              </div>

              {/* Mapa placeholder */}
              <div className="aspect-square md:aspect-auto md:h-[500px] rounded-xl overflow-hidden bg-secondary">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3654.8889!2d-46.4614!3d-23.6676!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDQwJzAzLjQiUyA0NsKwMjcnNDEuMCJX!5e0!3m2!1spt-BR!2sbr!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localização da Barbearia do Moura"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20">
          <div className="container-app text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Pronto para ficar no estilo?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Agende agora mesmo e venha conhecer a Barbearia do Moura.
              Primeira visita? Ganhe 10% de desconto!
            </p>
            <Button size="lg" asChild>
              <Link href="/agendar">
                Agendar Meu Horário
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
