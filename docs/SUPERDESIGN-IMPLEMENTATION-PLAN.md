# Plano de Implementação SuperDesign Skill

## Barbearia do Moura - Refatoração Completa de UI/UX

---

## Sumário

1. [Visão Geral da Skill](#1-visão-geral-da-skill)
2. [Instalação e Configuração](#2-instalação-e-configuração)
3. [Estrutura do Design System](#3-estrutura-do-design-system)
4. [Plano de Refatoração por Módulo](#4-plano-de-refatoração-por-módulo)
5. [Cronograma de Execução](#5-cronograma-de-execução)
6. [Comandos de Referência](#6-comandos-de-referência)

---

## 1. Visão Geral da Skill

### O que é SuperDesign?

SuperDesign é uma ferramenta de design integrada ao Claude Code que permite:

- **Buscar inspirações** de design em uma biblioteca curada
- **Gerar drafts** de UI em um canvas infinito
- **Iterar designs** com múltiplas variações
- **Extrair brand guides** de sites existentes
- **Criar fluxos** de múltiplas páginas conectadas

### Benefícios para o Projeto

| Benefício | Descrição |
|-----------|-----------|
| **Consistência Visual** | Design system unificado para todas as telas |
| **Iteração Rápida** | Gerar múltiplas variações antes de implementar |
| **Mobile-First** | Designs otimizados para mobile desde o início |
| **Profissionalismo** | UI de nível profissional sem designer dedicado |
| **Documentação** | Design system documentado em markdown |

---

## 2. Instalação e Configuração

### 2.1 Pré-requisitos

```bash
# Node.js 18+ instalado
node --version

# npm ou yarn disponível
npm --version
```

### 2.2 Instalação da CLI

```bash
# Instalar CLI globalmente
npm install -g @superdesign/cli@latest

# Verificar instalação
superdesign --version
```

### 2.3 Adicionar Skill ao Projeto

```bash
# Navegar para o diretório do projeto
cd C:\Users\Marcio\barbeariadomoura-2

# Adicionar a skill
npx skills add superdesigndev/superdesign-skill
```

### 2.4 Estrutura de Pastas a Criar

```
barbeariadomoura-2/
├── .superdesign/
│   ├── design-system.md          # Obrigatório - tokens e guidelines
│   └── replica_html_template/    # Templates HTML das páginas atuais
│       ├── landing.html
│       ├── login.html
│       ├── cadastro.html
│       ├── dashboard-cliente.html
│       ├── dashboard-profissional.html
│       ├── dashboard-admin.html
│       ├── agendar.html
│       ├── meus-agendamentos.html
│       ├── clube.html
│       ├── perfil.html
│       ├── admin-agenda.html
│       ├── admin-servicos.html
│       ├── admin-profissionais.html
│       ├── admin-financeiro.html
│       └── [outras páginas...]
└── ...
```

### 2.5 Criar Diretório Base

```bash
# Criar estrutura de pastas
mkdir -p .superdesign/replica_html_template
```

---

## 3. Estrutura do Design System

### 3.1 Arquivo design-system.md

Criar em `.superdesign/design-system.md`:

```markdown
# Barbearia do Moura - Design System

## Brand Identity

### Nome
Barbearia do Moura

### Tagline
"Estilo e Tradição em Cada Corte"

### Tom de Voz
- Profissional mas acolhedor
- Masculino e sofisticado
- Tradicional com toque moderno

---

## Color Tokens

### Primary Palette
| Token | Hex | Uso |
|-------|-----|-----|
| `--color-primary` | #EAD8AC | Ouro - elementos de destaque, textos importantes |
| `--color-primary-dark` | #C4B48A | Ouro escuro - hover states |
| `--color-primary-light` | #F5EBCD | Ouro claro - backgrounds sutis |

### Secondary Palette
| Token | Hex | Uso |
|-------|-----|-----|
| `--color-secondary` | #013648 | Azul profundo - backgrounds de cards |
| `--color-secondary-light` | #05384B | Azul médio - inputs, overlays |
| `--color-secondary-dark` | #012030 | Azul escuro - borders, shadows |

### Neutral Palette
| Token | Hex | Uso |
|-------|-----|-----|
| `--color-background` | #121212 | Fundo principal |
| `--color-surface` | #1A1A1A | Superfícies elevadas |
| `--color-border` | #2A2A2A | Bordas padrão |

### Semantic Colors
| Token | Hex | Uso |
|-------|-----|-----|
| `--color-success` | #22C55E | Sucesso, confirmações |
| `--color-warning` | #F59E0B | Alertas, pendências |
| `--color-error` | #EF4444 | Erros, cancelamentos |
| `--color-info` | #3B82F6 | Informações |

---

## Typography

### Font Family
```css
--font-primary: 'Roboto', sans-serif;
--font-display: 'Playfair Display', serif; /* Para títulos elegantes */
```

### Font Weights
| Weight | Uso |
|--------|-----|
| 400 (Regular) | Corpo de texto |
| 500 (Medium) | Labels, subtítulos |
| 700 (Bold) | Títulos, CTAs |

### Font Sizes (Mobile First)
| Token | Mobile | Desktop | Uso |
|-------|--------|---------|-----|
| `--text-xs` | 12px | 12px | Badges, timestamps |
| `--text-sm` | 14px | 14px | Labels, descrições |
| `--text-base` | 16px | 16px | Corpo padrão |
| `--text-lg` | 18px | 20px | Subtítulos |
| `--text-xl` | 20px | 24px | Títulos de seção |
| `--text-2xl` | 24px | 30px | Títulos de página |
| `--text-3xl` | 30px | 36px | Headlines |

---

## Spacing System

### Base Unit: 4px

| Token | Value | Uso |
|-------|-------|-----|
| `--space-1` | 4px | Micro espaçamentos |
| `--space-2` | 8px | Dentro de componentes |
| `--space-3` | 12px | Entre elementos relacionados |
| `--space-4` | 16px | Padding padrão |
| `--space-5` | 20px | Entre seções menores |
| `--space-6` | 24px | Padding de cards |
| `--space-8` | 32px | Entre seções |
| `--space-10` | 40px | Margens de página |
| `--space-12` | 48px | Separação de blocos |

---

## Border Radius

| Token | Value | Uso |
|-------|-------|-----|
| `--radius-sm` | 4px | Inputs, badges |
| `--radius-md` | 8px | Botões, cards pequenos |
| `--radius-lg` | 12px | Cards médios |
| `--radius-xl` | 16px | Cards grandes, modais |
| `--radius-2xl` | 24px | Elementos de destaque |
| `--radius-full` | 9999px | Avatares, pills |

---

## Shadows

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5);
--shadow-glow: 0 0 20px rgba(234, 216, 172, 0.3); /* Glow dourado */
```

---

## Component Patterns

### Cards
- Background: `--color-secondary` com opacity 0.8
- Border: 1px solid `--color-border` ou `--color-primary` (ativo)
- Border-radius: `--radius-xl`
- Padding: `--space-6`
- Shadow: `--shadow-md` no hover

### Buttons

#### Primary Button
- Background: `--color-primary`
- Text: `--color-secondary-dark`
- Border-radius: `--radius-md`
- Height: 44px (mobile), 48px (desktop)
- Font-weight: 700

#### Secondary Button
- Background: transparent
- Border: 1px solid `--color-primary`
- Text: `--color-primary`

#### Ghost Button
- Background: transparent
- Text: `--color-primary`
- Hover: background rgba(234, 216, 172, 0.1)

### Inputs
- Background: `--color-secondary-light` com opacity 0.5
- Border: 1px solid rgba(234, 216, 172, 0.3)
- Border-radius: `--radius-md`
- Height: 44px
- Focus: border-color `--color-primary`

### Badges
- Border-radius: `--radius-full`
- Padding: 4px 12px
- Font-size: `--text-xs`
- Font-weight: 500

---

## Layout Guidelines

### Container Widths
| Breakpoint | Max-width |
|------------|-----------|
| Mobile | 100% (padding 16px) |
| Tablet (768px) | 720px |
| Desktop (1024px) | 960px |
| Large (1280px) | 1200px |

### Grid System
- Mobile: 1 coluna
- Tablet: 2 colunas
- Desktop: 3-4 colunas
- Gap: 16px (mobile), 24px (desktop)

### Navigation
- Header height: 64px
- Mobile: hamburger menu com sheet
- Desktop: horizontal nav com dropdown

---

## Animation Guidelines

### Durations
| Token | Value | Uso |
|-------|-------|-----|
| `--duration-fast` | 150ms | Hover, focus |
| `--duration-normal` | 200ms | Transições padrão |
| `--duration-slow` | 300ms | Modais, expansões |

### Easing
```css
--ease-default: cubic-bezier(0.4, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
```

---

## Iconography

### Library
Lucide React (https://lucide.dev)

### Sizes
| Size | Dimension | Uso |
|------|-----------|-----|
| sm | 16x16 | Inline, badges |
| md | 20x20 | Botões, nav |
| lg | 24x24 | Headers, destaque |
| xl | 32x32 | Empty states |

### Style
- Stroke width: 2px
- Color: herda do texto

---

## Accessibility

### Contrast Ratios
- Texto normal: mínimo 4.5:1
- Texto grande: mínimo 3:1
- Elementos interativos: mínimo 3:1

### Focus States
- Outline: 2px solid `--color-primary`
- Outline-offset: 2px

### Touch Targets
- Mínimo: 44x44px

---

## Responsive Breakpoints

```css
/* Mobile First */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

---

## Dark Theme (Único)

Este projeto usa exclusivamente dark theme. Não há light mode.

---

## Imagens e Assets

### Logo
- Formato: SVG preferido
- Variantes: completo, símbolo
- Cor: `--color-primary` sobre fundo escuro

### Placeholder Images
- Usar gradientes ou ícones
- Nunca usar imagens genéricas

### User Avatars
- Fallback: iniciais sobre `--color-primary`
- Border-radius: full
- Size padrão: 40x40px
```

---

## 4. Plano de Refatoração por Módulo

### 4.1 Fase 1: Páginas Públicas e Autenticação

#### Landing Page (/)

**Estado Atual:**
- Login inline com formulário
- Navegação básica
- Hero com logo

**Melhorias com SuperDesign:**
- Hero section com gradiente animado
- Cards de serviços com hover effects
- Seção de depoimentos/social proof
- Seção "Por que nos escolher"
- CTA mais impactante
- Animações suaves de entrada

**Comandos:**
```bash
# Buscar inspirações para landing pages de barbearia
superdesign search-prompts --keyword "barbershop landing" --json
superdesign search-prompts --tags "hero,dark-theme,luxury" --json

# Criar projeto
superdesign create-project --title "Landing Page Moura" \
  --html-file .superdesign/replica_html_template/landing.html \
  --set-project-prompt-file .superdesign/design-system.md --json

# Gerar variações
superdesign iterate-design-draft --draft-id <id> \
  -p "luxury barbershop with gold accents" \
  -p "modern minimalist dark theme" \
  -p "app-native mobile first" \
  --mode branch --json
```

#### Páginas de Autenticação

**Login, Cadastro, Esqueci Senha, Reset Senha**

**Melhorias:**
- Formulários centralizados com card elegante
- Ilustrações ou patterns decorativos
- Transições suaves entre estados
- Feedback visual em tempo real
- Social proof sutil

---

### 4.2 Fase 2: Área do Cliente

#### Dashboard do Cliente (/dashboard)

**Estado Atual:**
- Saudação com nome
- Próximo agendamento
- Ações rápidas
- Estatísticas básicas

**Melhorias com SuperDesign:**
- Card de próximo agendamento mais visual (com foto do barbeiro)
- Timeline de agendamentos recentes
- Widget de status do clube com progressão visual
- Cards de ação com ícones ilustrados
- Métricas com gráficos minimalistas
- Quick actions mais intuitivas

**Estrutura Proposta:**
```
┌─────────────────────────────────────┐
│ Header: Saudação + Avatar + Notif   │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ PRÓXIMO AGENDAMENTO             │ │
│ │ Card visual com barbeiro, data, │ │
│ │ serviço e countdown             │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ ┌───────────┐ ┌───────────┐        │
│ │ Agendar   │ │ Meus      │        │
│ │ Horário   │ │ Agendamentos│       │
│ └───────────┘ └───────────┘        │
│ ┌───────────┐ ┌───────────┐        │
│ │ Clube     │ │ Perfil    │        │
│ │ do Moura  │ │           │        │
│ └───────────┘ └───────────┘        │
├─────────────────────────────────────┤
│ ESTATÍSTICAS (cortes, economia)     │
└─────────────────────────────────────┘
```

#### Página de Agendamento (/agendar)

**Estado Atual:**
- Wizard 4 steps
- Seleção de serviço
- Seleção de profissional
- Calendário + horários
- Confirmação

**Melhorias com SuperDesign:**
- Stepper visual mais elegante
- Cards de serviço com ícones ilustrados
- Cards de profissional com foto e especialidades
- Calendário customizado com visual premium
- Slots de horário como pills selecionáveis
- Resumo visual do agendamento
- Animações de transição entre steps

**Comandos:**
```bash
# Buscar inspirações para booking flow
superdesign search-prompts --keyword "booking wizard appointment" --json
superdesign search-prompts --tags "calendar,scheduling,mobile" --json

# Criar flow de múltiplas páginas
superdesign execute-flow-pages --draft-id <id> --pages '[
  {"title": "Step 1 - Serviço", "prompt": "Service selection with illustrated cards"},
  {"title": "Step 2 - Profissional", "prompt": "Professional selection with photos and ratings"},
  {"title": "Step 3 - Data/Hora", "prompt": "Calendar and time slot selection"},
  {"title": "Step 4 - Confirmação", "prompt": "Booking summary with confirm button"}
]' --json
```

#### Meus Agendamentos (/meus-agendamentos)

**Melhorias:**
- Tabs visuais (Próximos / Histórico)
- Cards de agendamento com status visual
- Timeline para histórico
- Ações inline (cancelar, remarcar)
- Empty state ilustrado

#### Clube do Moura (/clube)

**Melhorias:**
- Comparativo de planos visual (pricing table)
- Card de assinatura atual com benefícios
- Barra de progresso de economia
- FAQ com accordion estilizado
- CTA para upgrade/assinatura

#### Perfil e Configurações

**Melhorias:**
- Avatar upload com preview
- Formulário em seções colapsáveis
- Toggle switches estilizados
- Confirmação visual de alterações

---

### 4.3 Fase 3: Painel do Profissional

#### Dashboard do Profissional (/profissional/dashboard)

**Estado Atual:**
- Agenda do dia
- Navegação de datas
- Métricas
- Próximo atendimento

**Melhorias com SuperDesign:**
- Vista diária tipo agenda/calendário
- Cards de atendimento com status visual
- Métricas em cards com ícones
- Quick actions flutuantes
- Indicador de próximo cliente

**Estrutura Proposta:**
```
┌─────────────────────────────────────┐
│ Header: Data atual + Navegação      │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ PRÓXIMO CLIENTE                 │ │
│ │ Nome, serviço, horário, foto    │ │
│ │ [Iniciar Atendimento]           │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ AGENDA DO DIA                       │
│ ┌─────────────────────────────────┐ │
│ │ 09:00 ░░░░░░░░░░░░░░░░░░░░░░░░ │ │
│ │ 10:00 █████ João - Corte        │ │
│ │ 11:00 █████ Pedro - Barba       │ │
│ │ 12:00 ░░░░░░░░░░░░░░░░░░░░░░░░ │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ ┌───────┐ ┌───────┐ ┌───────┐      │
│ │ Hoje  │ │ Semana│ │Comissão│     │
│ │ 5     │ │ 23    │ │R$ 450 │     │
│ └───────┘ └───────┘ └───────┘      │
└─────────────────────────────────────┘
```

#### Comissões (/profissional/comissoes)

**Melhorias:**
- Gráfico de evolução mensal
- Cards de resumo (ganhos, pendentes)
- Lista detalhada com filtros
- Export para PDF

#### Bloqueios (/profissional/bloqueios)

**Melhorias:**
- Calendário visual para selecionar datas
- Lista de bloqueios ativos
- Formulário de criação inline
- Confirmação de exclusão

---

### 4.4 Fase 4: Painel Administrativo

#### Dashboard Admin (/admin/dashboard)

**Melhorias com SuperDesign:**
- KPIs em cards destacados
- Gráficos de faturamento (mini charts)
- Agenda do dia com visão geral
- Alertas e notificações
- Quick actions para tarefas comuns

**Estrutura Proposta:**
```
┌─────────────────────────────────────────────┐
│ MÉTRICAS DO DIA                             │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│ │Agendamentos│Faturamento│Assinantes│Cancelam.│
│ │    12     │ R$ 890   │    45    │    2    │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘
├─────────────────────────────────────────────┤
│ ┌───────────────────┐ ┌───────────────────┐ │
│ │ AGENDA DE HOJE    │ │ AÇÕES RÁPIDAS     │ │
│ │ Lista compacta    │ │ - Novo agendamento│ │
│ │ por profissional  │ │ - Ver financeiro  │ │
│ │                   │ │ - Bloquear horário│ │
│ └───────────────────┘ └───────────────────┘ │
├─────────────────────────────────────────────┤
│ ALERTAS                                      │
│ - 3 agendamentos pendentes de confirmação    │
│ - 2 assinaturas vencem esta semana          │
└─────────────────────────────────────────────┘
```

#### Agenda Admin (/admin/agenda)

**Melhorias:**
- Vista por dia/semana/mês
- Filtro por profissional
- Drag & drop para remarcar
- Cores por status
- Criar agendamento inline

#### Serviços (/admin/servicos)

**Melhorias:**
- Cards de serviço com toggle ativo/inativo
- Formulário de criação em modal
- Ordenação drag & drop
- Categorização visual

#### Profissionais (/admin/profissionais)

**Melhorias:**
- Cards com foto e estatísticas
- Status online/offline
- Comissão configurável
- Horários de trabalho

#### Financeiro (/admin/financeiro)

**Melhorias:**
- Dashboard financeiro com gráficos
- Fluxo de caixa visual
- Relatórios exportáveis
- Filtros por período

#### Assinantes (/admin/assinantes)

**Melhorias:**
- Lista com busca e filtros
- Status de assinatura visual
- Ações em batch
- Métricas de retenção

#### Comissões Admin (/admin/comissoes)

**Melhorias:**
- Visão por profissional
- Período customizável
- Pagamentos pendentes destacados
- Histórico de pagamentos

#### Feedbacks (/admin/feedbacks)

**Melhorias:**
- Cards de feedback com rating visual
- Filtros por nota/período
- Resposta inline
- Métricas de satisfação

#### Bloqueios Admin (/admin/bloqueios)

**Melhorias:**
- Vista unificada (barbearia + profissionais)
- Calendário visual
- Criação rápida
- Conflitos destacados

---

### 4.5 Componentes Compartilhados a Refatorar

| Componente | Melhorias |
|------------|-----------|
| **Card** | Variantes (default, highlighted, interactive), hover effects, loading state |
| **Button** | Novas variantes (gradient, icon-only), loading state, disabled visual |
| **Input/Select** | Floating labels, inline validation, character count |
| **Modal/Dialog** | Animações de entrada/saída, tamanhos responsivos |
| **Navigation** | Indicadores ativos animados, badges de notificação |
| **Avatar** | Status indicator, múltiplos tamanhos, grupo de avatares |
| **Badge** | Animação de pulse, variantes de tamanho |
| **Toast** | Posição customizável, ações inline, progress bar |
| **Skeleton** | Shimmer effect melhorado, variantes de forma |
| **Empty State** | Ilustrações customizadas, CTAs contextuais |

---

## 5. Cronograma de Execução

### Sprint 1: Setup e Fundação
- [ ] Instalar SuperDesign CLI
- [ ] Criar estrutura `.superdesign/`
- [ ] Desenvolver `design-system.md` completo
- [ ] Criar replicas HTML das páginas atuais
- [ ] Configurar projeto no SuperDesign

### Sprint 2: Páginas Públicas
- [ ] Landing Page - Novo design
- [ ] Login - Refatoração
- [ ] Cadastro - Refatoração
- [ ] Esqueci/Reset Senha - Refatoração
- [ ] Páginas públicas (Sobre)

### Sprint 3: Área do Cliente
- [ ] Dashboard Cliente
- [ ] Wizard de Agendamento (4 steps)
- [ ] Meus Agendamentos
- [ ] Clube do Moura
- [ ] Perfil e Configurações

### Sprint 4: Painel Profissional
- [ ] Dashboard Profissional
- [ ] Comissões
- [ ] Bloqueios
- [ ] Perfil Profissional

### Sprint 5: Painel Administrativo
- [ ] Dashboard Admin
- [ ] Agenda
- [ ] Serviços
- [ ] Profissionais
- [ ] Financeiro

### Sprint 6: Painel Admin (continuação) + Polimento
- [ ] Assinantes
- [ ] Comissões Admin
- [ ] Feedbacks
- [ ] Bloqueios Admin
- [ ] Componentes compartilhados
- [ ] Testes de responsividade
- [ ] Ajustes finais

---

## 6. Comandos de Referência

### Buscar Inspirações

```bash
# Por keyword
superdesign search-prompts --keyword "barbershop" --json
superdesign search-prompts --keyword "dark theme dashboard" --json
superdesign search-prompts --keyword "mobile booking" --json

# Por tags
superdesign search-prompts --tags "luxury,gold,dark" --json
superdesign search-prompts --tags "dashboard,metrics,cards" --json
superdesign search-prompts --tags "calendar,scheduling" --json
```

### Extrair Brand Guide

```bash
# De site de referência
superdesign extract-brand-guide --url https://referencia.com --json
```

### Criar Projeto

```bash
# Projeto simples
superdesign create-project \
  --title "Nome do Projeto" \
  --set-project-prompt-file .superdesign/design-system.md \
  --json

# Projeto com HTML base
superdesign create-project \
  --title "Nome do Projeto" \
  --html-file .superdesign/replica_html_template/pagina.html \
  --set-project-prompt-file .superdesign/design-system.md \
  --json
```

### Iterar Design

```bash
# Modo replace (única variação)
superdesign iterate-design-draft \
  --draft-id <id> \
  -p "Make it more luxurious with gold accents" \
  --mode replace \
  --json

# Modo branch (múltiplas variações)
superdesign iterate-design-draft \
  --draft-id <id> \
  -p "luxury version" \
  -p "minimal version" \
  -p "bold version" \
  --mode branch \
  --json
```

### Criar Fluxo Multi-páginas

```bash
superdesign execute-flow-pages \
  --draft-id <id> \
  --pages '[
    {"title": "Page 1", "prompt": "Description 1"},
    {"title": "Page 2", "prompt": "Description 2"},
    {"title": "Page 3", "prompt": "Description 3"}
  ]' \
  --json
```

### Recuperar Design

```bash
# Obter HTML do design
superdesign get-design --draft-id <id> --output ./design.html

# Listar nodes do projeto
superdesign fetch-design-nodes --project-id <id> --json
```

---

## Próximos Passos

1. **Imediato**: Executar comandos de instalação (Seção 2)
2. **Criar**: Arquivo `design-system.md` (copiar template da Seção 3)
3. **Mapear**: Criar replicas HTML de cada página atual
4. **Iniciar**: Sprint 1 - Setup e fundação
5. **Iterar**: Seguir o plano por sprints

---

## Notas Importantes

- Sempre usar `--json` nos comandos para parsing automático
- Manter o `design-system.md` atualizado conforme decisões de design
- Fazer backup das páginas atuais antes de implementar mudanças
- Testar responsividade em cada iteração
- Documentar decisões de design no próprio arquivo

---

*Documento criado para o projeto Barbearia do Moura*
*Skill: SuperDesign (superdesigndev/superdesign-skill)*
