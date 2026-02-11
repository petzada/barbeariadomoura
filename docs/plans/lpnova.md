# Plano: Nova Página Inicial - Estilo App Nativo

## Visão Geral

Transformar a landing page tradicional em uma página inicial minimalista estilo app nativo, otimizada para mobile. O app será usado por clientes fiéis, dispensando a necessidade de CTAs agressivos e marketing tradicional.

---

## Estrutura Visual (Regra dos Terços)

```
┌─────────────────────────────────┐
│                                 │
│         PRIMEIRO TERÇO          │
│                                 │
│      ┌─────────────────┐        │
│      │                 │        │
│      │   LOGO CÍRCULO  │        │
│      │   (minimalista) │        │
│      │                 │        │
│      └─────────────────┘        │
│                                 │
├─────────────────────────────────┤
│                                 │
│         SEGUNDO TERÇO           │
│                                 │
│   ┌─────────────────────────┐   │
│   │  Email                  │   │
│   └─────────────────────────┘   │
│   ┌─────────────────────────┐   │
│   │  Senha                  │   │
│   └─────────────────────────┘   │
│   ┌─────────────────────────┐   │
│   │       ENTRAR            │   │
│   └─────────────────────────┘   │
│   Esqueceu a senha? | Cadastrar │
│                                 │
├─────────────────────────────────┤
│                                 │
│         TERCEIRO TERÇO          │
│                                 │
│SERVIÇOS - PROFISSIONAIS - CLUBE |
│                                 |
│                                 │
└─────────────────────────────────┘
```

---

## Arquivos a Criar

### 1. Nova Página Inicial
**Arquivo:** `src/app/(public)/page.tsx`

- Substituir completamente a landing page atual, guardar backup
- Layout centralizado, altura mínima 100vh
- Sem header/footer (experiência app)
- Background azul petróleo com leve detalhes de tesouras

**Componentes:**
- Logo circular centralizado (usar `/public/logo.png`)
- Formulário de login inline (não em card)
- Links de navegação em grid 2x2 ou 3 colunas

### 2. Página de Serviços
**Arquivo:** `src/app/(public)/sobre/servicos/page.tsx`

**Conteúdo baseado na landing atual:**
- Título: "Nossos Serviços"
- Lista de serviços do banco de dados (dinâmico)
- Para cada serviço: nome, descrição, preço, duração
- Estilo minimalista
- Botão voltar para home

### 3. Página de Profissionais
**Arquivo:** `src/app/(public)/sobre/profissionais/page.tsx`

**Conteúdo baseado na landing atual:**
- Título: "Nossa Equipe"
- Lista de profissionais do banco de dados (dinâmico)
- Para cada profissional: foto, nome, bio
- Estilo minimalista
- Botão voltar para home

### 4. Página do Clube
**Arquivo:** `src/app/(public)/sobre/clube/page.tsx`

**Conteúdo baseado na landing atual:**
- Título: "Clube do Moura"
- Explicação interativa dos planos:
  - Plano Silver Limitado (R$ 99,90/mês) - Cortes limitados somente para uso exclusivo na terça, quarta e quinta-feira.
  - Plano Black (R$ 119,90/mês) - Cortes ilimitados - pode ser realizado somente corte em qualquer dia da semana.
  - Plano Gold Limitado (R$ 169,90/mês) - Corte e Barba somente para uso exclusivo na terça, quarta e quinta-feira.
  - Plano Premium (R$ 199,90/mês) - Corte e Barba ilimitados - pode ser realizado corte e barba em qualquer dia da semana.
- Benefícios detalhados de cada plano 
- Estilo minimalista
- Botão voltar para home

---

## Arquivos a Modificar

### 1. Layout Público
**Arquivo:** `src/app/(public)/layout.tsx`

- Remover import do Header/Footer (se houver)
- Manter apenas estrutura básica

---

## Arquivos a Remover/Deprecar

- Conteúdo da seção de depoimentos (SOCIAL_PROOF)
- Conteúdo da seção de contato com mapa
- CTA final

---

## Especificações de Design

### Cores (manter tema atual)
- Background: `#05384B`
- Primary: `#E4D0B0`
- Texto: `#E4D0B0`

### Tipografia
- Logo: /public/logo.png
- Títulos: Tangerine
- Corpo: Roboto

### Espaçamento Mobile-First
- Padding lateral: 1.5rem (24px)
- Gap entre seções: 2rem (32px)
- Tamanho logo: 120px x 120px

### Interações
- Inputs com foco suave (ring primary)
- Botão com hover sutil
- Links com transição de cor

---

## Implementação Passo a Passo

### Fase 1: Criar Páginas Informativas
1. Criar estrutura `src/app/(public)/sobre/`
2. Criar `sobre/servicos/page.tsx`
3. Criar `sobre/profissionais/page.tsx`
4. Criar `sobre/clube/page.tsx`

### Fase 2: Nova Página Inicial
1. Fazer backup da landing atual (opcional)
2. Reescrever `src/app/(public)/page.tsx`
3. Implementar layout de terços
4. Implementar formulário de login inline
5. Implementar links de navegação

### Fase 3: Ajustes Finais
1. Testar responsividade em diferentes telas
2. Verificar fluxo de login
3. Testar navegação entre páginas
4. Ajustar animações/transições

---

## Componentes Reutilizados

- `Button` de shadcn/ui
- `Input` de shadcn/ui
- `Label` de shadcn/ui
- `Card` de shadcn/ui (para páginas informativas)
- `Avatar` de shadcn/ui (para profissionais)
- `Badge` de shadcn/ui (para planos)

---

## Server Actions Existentes (Reutilizar)

- `loginAction` de `@/lib/auth/actions`
- `getActiveServices` de `@/lib/scheduling/actions`
- `getActiveProfessionals` de `@/lib/scheduling/actions`

---

## Considerações de UX

1. **Login inline** - O formulário faz parte da página, não é um redirect
2. **Navegação simples** - Máximo 3 links informativos
3. **Feedback visual** - Loading states claros
4. **Mobile-first** - Funciona perfeitamente em telas pequenas
5. **Minimalismo** - Apenas o essencial, sem distrações

---

## Rotas Finais

| Rota | Descrição |
|------|-----------|
| `/` | Página inicial com login |
| `/sobre/servicos` | Página de serviços |
| `/sobre/profissionais` | Página de profissionais |
| `/sobre/clube` | Página do clube |
| `/cadastro` | Cadastro (já existe) |
| `/esqueci-senha` | Recuperar senha (já existe) |

---

## Checklist de Entrega

- [ ] Página inicial com login inline
- [ ] Logo circular centralizado
- [ ] Formulário de email/senha funcional
- [ ] Links para páginas informativas
- [ ] Página de serviços com dados dinâmicos
- [ ] Página de profissionais com dados dinâmicos
- [ ] Página do clube com planos detalhados
- [ ] Layout responsivo mobile-first
- [ ] Navegação de volta para home em cada página
- [ ] Testes de fluxo completo
