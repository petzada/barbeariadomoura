**Barbearia do Moura – Plataforma Web de Agendamento e Gestão**

** CONTEXTO DO PROJETO **

Você é um desenvolvedor full-stack sênior especializado em Next.js, Supabase e aplicações SaaS. Você vai desenvolver do zero uma plataforma web completa para a Barbearia do Moura, uma barbearia localizada em Mauá-SP que precisa de um sistema moderno de agendamento online, gestão de clientes, clube de assinatura com planos mensais, controle financeiro básico e gestão de comissões de barbeiros.

O projeto deve ser desenvolvido com foco em qualidade de código, segurança (RLS obrigatório), performance e excelente experiência do usuário. Toda a interface deve estar em português do Brasil (pt-BR).

**1. Visão do Produto**
A Barbearia do Moura quer oferecer uma experiência moderna, prática e sem atrito para clientes agendarem horários 24/7, pagarem online e receberem lembretes automáticos, enquanto o dono/profissionais têm controle total da agenda, finanças básicas e fidelização. O produto é uma aplicação web responsiva com três áreas principais:

- Área Pública (site da barbearia) → Landing page;
- Painel do Cliente → Clientes agendam, pagam e acompanham.
- Painel Administrativo → Dono e profissionais gerenciam tudo.

Diferencial: Agenda por profissional + pagamento online + lembretes + clube de assinatura/desconto automático = redução de no-show + aumento de receita recorrente.

**Stack**

Frontend: (Next.js) React + shadcn/ui + Tailwind + Lucide Icons

Backend/DB/Auth: Supabase

Pagamentos: Mercado Pago (PIX + cartão) via Edge Functions (webhooks seguros)

Deploy: Vercel

**2. Personas Principais**

Cliente

Profissional (barbeiro)

Dono/Gerente

**3. Funcionalidades do MVP**

Core (obrigatório no MVP)

1. Agenda personalizável por profissional + controle automático
2. Agendamento online (painel do cliente)
3. Pacotes de serviços
4. Clube de assinatura (descontos recorrentes ou plano mensal fixo)
5. Gestão financeira básica (caixa do dia, entradas de pagamento)
6. Comissões básicas (por serviço, relatório simples)

**4. Fluxos de Usuário Principais**

**Fluxo 1 – Agendamento (Painel do Cliente)**

1. Entra no site → botão “Agendar agora”
2. Cria conta ou faz login
3. Seleciona serviço ou pacote → profissional → data → horário livre (agenda por profissional + bloqueio automático)
4. Escolhe pagamento: pagar na barbearia ou em caso de possuir assinatura, desconto é validado automaticamente
5. Confirma → agendamento criado
6. Tela de sucesso + adição ao calendário + lembrete agendado


**Fluxo 2 – Painel Admin – Dashboard (Dono/Gerente)**

1. Login → Dashboard: agenda do dia (com calendário), caixa atual, faturamento mês, ocupação %
2. Agenda semanal/mensal (visual por profissional)
3. Caixa: lançamentos automáticos dos pagamentos online + manual
4. Relatório comissões (por profissional, período)

**Fluxo 3 – Clube de Assinatura (Cliente + Admin)**

- Cliente: no perfil → “Assinar Clube do Moura” (ex: R$ xx*********/mês = definir planos*********)
- Assinatura recorrente via Mercado Pago com cartão de crédito
- Desconto aplicado automaticamente no agendamento
- Admin: lista de assinantes + cancelamentos

**Fluxo 4 – Pacotes**

- Admin cadastra pacote (ex: Barba + Cabelo + Sobrancelha por R$ 80,00)
- Cliente compra no agendamento junto aos serviços unitários

**Fluxo 5 – Comissões**

- Admin define % por serviço para cada profissional
- Ao marcar serviço como “concluído” → comissão calculada e lançada
- Profissional vê extrato no login dele

**6. Requisitos Técnicos**

- Autenticação: Supabase Auth (e-mail + senha)
- Banco: Tabelas principais (users, professionals, services, appointments, packages, subscriptions, payments, commissions)
- Realtime: agenda atualiza instantaneamente
- Pagamentos: Edge Function para criar preferência Mercado Pago + webhook para confirmar pagamento
- Responsivo: mobile-first

**7. Design System**

/* Cores principais */
  --primary: #ECD8A8;        /* Bege dourado - botões principais, destaques */
  --accent: #013648;         /* Azul escuro - textos importantes, headers */
  --background: #121212;     /* Preto - fundo principal */
  --background-card: #1A1A1A; /* Cinza escuro - cards e containers */
  --background-elevated: #242424; /* Cinza médio - elementos elevados */
  
  /* Cores semânticas */
  --success: #22C55E;        /* Verde - confirmações, sucesso */
  --warning: #E67300;        /* Laranja/marrom - alertas */
  --error: #EF4444;          /* Vermelho - erros */
  --info: #3B82F6;           /* Azul - informações */
  
  /* Textos */
  --text-primary: #FFFFFF;   /* Branco - texto principal */
  --text-secondary: #A1A1AA; /* Cinza claro - texto secundário */
  --text-muted: #71717A;     /* Cinza - texto desabilitado */
  
  /* Bordas */
  --border: #2A2A2A;         /* Borda padrão */
  --border-hover: #3A3A3A;   /* Borda hover */

/* Headings: Geist Bold/ExtraBold */
h1 { font-family: 'Geist', sans-serif; font-weight: 800; }
h2 { font-family: 'Geist', sans-serif; font-weight: 700; }
h3 { font-family: 'Geist', sans-serif; font-weight: 600; }

/* Body: Geist Regular/Medium */
body { font-family: 'Geist', sans-serif; font-weight: 400; }
.font-medium { font-weight: 500; }

** 8. Princípios de UI/UX **

Mobile-first: Toda a aplicação deve ser responsiva, priorizando a experiência mobile
Dark mode nativo: A aplicação usa tema escuro como padrão (não precisa de toggle)
Minimalismo: Interface limpa, sem excesso de elementos, foco na conversão
Feedback visual: Todos os estados (loading, success, error) devem ter feedback claro
Microinterações: Animações sutis com Tailwind (transitions, hover states)
Acessibilidade: Contraste adequado, labels em inputs, navegação por teclado


*** CHECKLIST DE ENTREGA DE FUNÇÕES **

Essencial

 Landing page funcional
 Sistema de autenticação completo
 CRUD de profissionais (admin)
 CRUD de serviços (admin)
 Fluxo completo de agendamento (cliente)
 Visualização de agenda (profissional/admin)
 Confirmação de atendimento e pagamento
 Lógica de desconto por assinatura
 Dashboard admin básico

Importante

 Cancelamento de agendamento
 Gestão de comissões
 Relatório financeiro básico
 Perfil do barbeiro (meus ganhos)
 Bloqueio de horários

Desejável

 Histórico completo de agendamentos
 Exportação de relatórios