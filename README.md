# 💈 Barbearia do Moura

Sistema completo de agendamento online para barbearia com clube de assinaturas, desenvolvido com as melhores práticas de React/Next.js.

## 🚀 Stack Tecnológica

- **Frontend**: Next.js 14+ (App Router), React 18, TypeScript
- **Estilização**: Tailwind CSS, shadcn/ui, Lucide Icons
- **Backend**: Supabase (Auth, PostgreSQL, Realtime, Storage)
- **Pagamentos**: Mercado Pago (PIX, Cartão, Boleto)
- **Deploy**: Vercel

## ✨ Funcionalidades

### Para Clientes
- 📅 Agendamento online em 4 etapas simples
- 👥 Escolha de profissional preferido
- 💳 Pagamento online via Mercado Pago
- 🏆 Clube de Assinaturas com benefícios exclusivos
- 📱 WhatsApp integrado para suporte

### Para Profissionais
- 📊 Dashboard com agenda do dia
- 💰 Extrato de comissões mensal
- ✅ Controle de atendimentos

### Para Administradores
- 📈 Métricas em tempo real
- 🗓️ Agenda visual com Realtime
- 🛠️ CRUD completo de serviços e profissionais
- 💵 Gestão financeira

## 📋 Pré-requisitos

- Node.js 18+
- npm ou pnpm
- Conta no Supabase
- Conta no Mercado Pago (para pagamentos)

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/barbearia-do-moura.git
cd barbearia-do-moura
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

Preencha as variáveis no arquivo `.env.local`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=sua_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
SUPABASE_SERVICE_ROLE_KEY=sua_service_key

# Mercado Pago
MERCADO_PAGO_ACCESS_TOKEN=seu_access_token
NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY=sua_public_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=5511999999999
```

4. Configure o banco de dados:
   - Acesse o Supabase SQL Editor
   - Execute os scripts em `supabase/migrations/` na ordem

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── (admin)/        # Painel administrativo
│   ├── (auth)/         # Autenticação
│   ├── (cliente)/      # Área do cliente
│   ├── (profissional)/ # Painel do profissional
│   ├── (public)/       # Páginas públicas
│   └── api/            # API Routes e Webhooks
├── components/
│   ├── layout/         # Header, Footer, Nav
│   └── ui/             # shadcn/ui components
├── hooks/              # Custom hooks
├── lib/
│   ├── mercadopago/    # Integração Mercado Pago
│   ├── scheduling/     # Lógica de agendamento
│   └── supabase/       # Clientes Supabase
└── types/              # TypeScript types
```

## 🔒 Segurança

- Row Level Security (RLS) em todas as tabelas
- Autenticação via Supabase Auth
- Middleware de proteção de rotas
- Validação de dados com Zod
- Headers de segurança via Vercel

## 🎨 Design System

- **Tema**: Dark mode por padrão
- **Cores**: Paleta dourada (#D4AF37) com tons escuros
- **Fonte**: Geist (display e texto)
- **Componentes**: shadcn/ui customizados

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte o repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

```bash
npm run build  # Build de produção
```

### Configuração do Webhook Mercado Pago

Configure a URL do webhook no painel do Mercado Pago:
```
https://seu-dominio.vercel.app/api/webhooks/mercadopago
```

## 📊 Regras de Negócio

### Cálculo de Valor do Agendamento
- Verifica se cliente possui assinatura ativa
- Aplica desconto se serviço está incluído no plano
- Considera restrições de dias da semana do plano

### Cancelamento
- Permitido até 4 horas antes do horário agendado
- Após esse prazo, não é possível cancelar pelo app

### Comissões
- Calculadas automaticamente ao finalizar atendimento
- Percentual configurável por profissional/serviço

## 📝 Scripts Disponíveis

```bash
npm run dev      # Desenvolvimento
npm run build    # Build de produção
npm run start    # Iniciar produção
npm run lint     # Verificar código
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Desenvolvido com ❤️ para a Barbearia do Moura
