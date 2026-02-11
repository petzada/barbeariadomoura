# Plano de Refatoracao de Design - Barbearia do Moura

## Objetivo
Refatorar o design dos dashboards e paginas internas da aplicacao para:
- Implementar layout em grid 2x2 para reducao de rolagem vertical
- Otimizar experiencia mobile-first
- Manter todas as funcionalidades, copys, imagens e logicas de negocio

---

## Analise do Estado Atual

### Padroes Identificados

| Componente | Estado Atual | Problema |
|------------|--------------|----------|
| Acoes Rapidas | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` | Em mobile, cards empilhados verticalmente geram muita rolagem |
| Metricas | `grid-cols-1 sm:grid-cols-2` ou `grid-cols-1 sm:grid-cols-3` | Layout inconsistente entre paginas |
| Cards de Informacao | Cards grandes com muito padding | Ocupam espaco desnecessario em telas pequenas |
| Listas | `space-y-4` com items grandes | Muita rolagem em listas extensas |
| Dialogs | Padding excessivo | Poderia ser mais compacto |

---

## Estrategia de Refatoracao

### Principio 1: Grid 2x2 como Padrao Mobile
- **Antes**: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- **Depois**: `grid-cols-2 lg:grid-cols-4`

Todas as secoes de acoes rapidas/metricas devem usar grid 2x2 por padrao em mobile.

### Principio 2: Cards Compactos
Reduzir padding interno dos cards em contextos de grid:
- **Antes**: `p-6` ou `pt-6`
- **Depois**: `p-4` ou `p-3` em mobile

### Principio 3: Tipografia Responsiva
Ajustar tamanhos de fonte para melhor aproveitamento de espaco:
- Titulos de card: `text-sm` em mobile
- Descricoes: `text-xs`
- Valores/metricas: manter destaque mas reduzir em mobile

---

## Implementacao por Pagina

### 1. Dashboard do Cliente (`src/app/(cliente)/dashboard/page.tsx`)

#### Acoes Rapidas (Linha 206)
```tsx
// ANTES
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

// DEPOIS
<div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
```

#### Cards de Acoes Rapidas (Linha 209-223)
```tsx
// ANTES
<CardContent className="pt-6 text-center">
  <div className={`inline-flex p-3 rounded-lg mb-3 ...`}>
    <action.icon className="h-6 w-6 ..." />
  </div>
  <h3 className="font-medium">{action.title}</h3>
  <p className="text-xs text-[#EAD8AC] mt-1">{action.description}</p>
</CardContent>

// DEPOIS
<CardContent className="p-3 sm:p-4 text-center">
  <div className={`inline-flex p-2 sm:p-3 rounded-lg mb-2 ...`}>
    <action.icon className="h-5 w-5 sm:h-6 sm:w-6 ..." />
  </div>
  <h3 className="font-medium text-sm sm:text-base">{action.title}</h3>
  <p className="text-xs text-[#EAD8AC] mt-0.5 hidden sm:block">{action.description}</p>
</CardContent>
```

#### Grid Principal (Linha 227)
Manter `grid gap-6 md:grid-cols-2` - ja esta otimizado.

#### Secao Estatisticas (Linha 351-370)
```tsx
// ANTES
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">

// DEPOIS
<div className="grid grid-cols-2 gap-3 text-center">
```

---

### 2. Dashboard do Admin (`src/app/(admin)/admin/dashboard/page.tsx`)

#### Grid de Metricas (Linha 141)
```tsx
// ANTES
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

// DEPOIS
<div className="grid grid-cols-2 gap-3">
```

#### Acoes Rapidas (Linha 305)
```tsx
// ANTES
<CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">

// DEPOIS
<CardContent className="grid grid-cols-2 gap-3 p-4">
```

#### Botoes de Acoes Rapidas (Linha 306-330)
```tsx
// ANTES
<Button asChild variant="outline" className="h-auto py-4 flex-col">

// DEPOIS
<Button asChild variant="outline" className="h-auto py-3 sm:py-4 flex-col text-xs sm:text-sm">
  <Link href="...">
    <Calendar className="h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2" />
    Ver Agenda
  </Link>
</Button>
```

---

### 3. Dashboard do Profissional (`src/app/(profissional)/profissional/dashboard/page.tsx`)

#### Acoes Rapidas (Linha 351)
```tsx
// ANTES
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

// DEPOIS
<div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
```

#### Cards de Acoes (Linha 353-383)
```tsx
// ANTES
<CardContent className="p-4 flex flex-col items-center justify-center text-center min-h-[100px]">
  <Calendar className="h-8 w-8 mb-2 text-[#EAD8AC]" />
  <p className="text-sm font-medium">Minha Agenda</p>
</CardContent>

// DEPOIS
<CardContent className="p-3 sm:p-4 flex flex-col items-center justify-center text-center min-h-[80px] sm:min-h-[100px]">
  <Calendar className="h-6 w-6 sm:h-8 sm:w-8 mb-1 sm:mb-2 text-[#EAD8AC]" />
  <p className="text-xs sm:text-sm font-medium">Minha Agenda</p>
</CardContent>
```

#### Metricas (Linha 428)
```tsx
// ANTES
<div className="grid grid-cols-1 gap-4">

// DEPOIS - Mover para dentro do grid principal se houver mais metricas
// Ou manter compacto se for apenas uma metrica
```

---

### 4. Pagina de Servicos Admin (`src/app/(admin)/admin/servicos/page.tsx`)

#### Lista de Servicos (Linha 267-329)
Converter lista vertical para grid em telas maiores:
```tsx
// ANTES
<div className="space-y-4">
  {services.map((service) => (
    <div className="flex flex-col sm:flex-row ...">

// DEPOIS
<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
  {services.map((service) => (
    <div className="flex flex-col p-3 rounded-lg border ...">
```

---

### 5. Pagina de Financeiro (`src/app/(admin)/admin/financeiro/page.tsx`)

#### Grid de Estatisticas do Mes (Linha 219)
```tsx
// ANTES
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

// DEPOIS
<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
```

#### Resumo por Forma de Pagamento (Linha 298)
```tsx
// ANTES
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

// DEPOIS
<div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
```

Ajustar cards internos:
```tsx
// ANTES
<div className="p-3 rounded-lg bg-secondary/50 text-center">
  <config.icon className="h-5 w-5 mx-auto mb-2" />
  <p className="text-xs text-[#EAD8AC]">{config.label}</p>
  <p className="font-bold">{formatCurrency(value)}</p>
</div>

// DEPOIS
<div className="p-2 sm:p-3 rounded-lg bg-secondary/50 text-center">
  <config.icon className="h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-1" />
  <p className="text-[10px] sm:text-xs text-[#EAD8AC]">{config.label}</p>
  <p className="text-xs sm:text-sm font-bold">{formatCurrency(value)}</p>
</div>
```

---

### 6. Pagina Agendar (`src/app/(cliente)/agendar/page.tsx`)

#### Grid de Servicos - Step 1 (Linha 345)
```tsx
// ANTES
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

// DEPOIS
<div className="grid grid-cols-2 gap-3">
```

#### Cards de Servico (Linha 347-378)
```tsx
// ANTES
<CardContent className="p-4">
  <Badge variant="default" className="text-lg font-bold">

// DEPOIS
<CardContent className="p-3 sm:p-4">
  <Badge variant="default" className="text-sm sm:text-lg font-bold">
```

#### Grid de Profissionais - Step 2 (Linha 395)
```tsx
// ANTES
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

// DEPOIS
<div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
```

#### Avatar do Profissional (Linha 408)
```tsx
// ANTES
<Avatar className="h-16 w-16 mx-auto mb-3">

// DEPOIS
<Avatar className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-2 sm:mb-3">
```

#### Grid de Datas - Step 3 (Linha 438)
```tsx
// ANTES
<div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-[400px]">

// DEPOIS
<div className="grid grid-cols-5 sm:grid-cols-6 gap-1.5 sm:gap-2 max-h-[300px] sm:max-h-[400px]">
```

#### Grid de Horarios (Linha 513)
```tsx
// ANTES
<div className="grid grid-cols-3 gap-2 max-h-[400px]">

// DEPOIS
<div className="grid grid-cols-4 sm:grid-cols-3 gap-1.5 sm:gap-2 max-h-[300px] sm:max-h-[400px]">
```

---

### 7. Pagina do Clube (`src/app/(cliente)/clube/page.tsx`)

#### Grid de Planos (Linha 320)
```tsx
// ANTES
<div className="grid md:grid-cols-3 gap-6">

// DEPOIS
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
```

Nota: Em mobile, os planos devem continuar em coluna unica para melhor legibilidade,
mas com espacamento reduzido.

#### Cards de Plano (Linha 348)
```tsx
// ANTES
<CardContent className="p-6 flex-1 flex flex-col">

// DEPOIS
<CardContent className="p-4 sm:p-6 flex-1 flex flex-col">
```

---

### 8. Pagina Meus Agendamentos (`src/app/(cliente)/meus-agendamentos/page.tsx`)

#### AppointmentCard (Linha 394)
```tsx
// ANTES
<CardContent className="p-6">

// DEPOIS
<CardContent className="p-4 sm:p-6">
```

---

## Componentes Globais a Ajustar

### Card Component (`src/components/ui/card.tsx`)
Considerar adicionar variantes compactas:
```tsx
// Sugestao: Adicionar prop variant="compact"
const cardVariants = cva("...", {
  variants: {
    size: {
      default: "",
      compact: "[&_.card-content]:p-3 [&_.card-header]:p-3",
    }
  }
})
```

### Button Component
Verificar se ha variante `size="sm"` sendo usada consistentemente.

---

## Checklist de Implementacao

### Fase 1: Dashboards (Prioridade Alta)
- [ ] Dashboard Cliente - Grid 2x2 acoes rapidas
- [ ] Dashboard Cliente - Estatisticas compactas
- [ ] Dashboard Admin - Grid 2x2 metricas
- [ ] Dashboard Admin - Acoes rapidas compactas
- [ ] Dashboard Profissional - Grid 2x2 acoes rapidas
- [ ] Dashboard Profissional - Metricas compactas

### Fase 2: Paginas de Listagem (Prioridade Media)
- [ ] Admin Servicos - Grid em cards
- [ ] Admin Financeiro - Metricas compactas
- [ ] Admin Financeiro - Grid formas de pagamento
- [ ] Meus Agendamentos - Cards compactos

### Fase 3: Wizards e Formularios (Prioridade Media)
- [ ] Agendar - Grid servicos
- [ ] Agendar - Grid profissionais
- [ ] Agendar - Grid datas/horarios

### Fase 4: Paginas de Conteudo (Prioridade Baixa)
- [ ] Clube - Grid de planos
- [ ] Clube - FAQ compacto

---

## Metricas de Sucesso

| Metrica | Antes | Meta |
|---------|-------|------|
| Rolagens para ver acoes rapidas (mobile) | 2-3 | 0 |
| Cards visiveis sem scroll (dashboard mobile) | 2-3 | 4+ |
| Altura da secao de acoes rapidas | ~400px | ~200px |

---

## Notas Importantes

1. **Nao alterar**: Copys, imagens, icones, funcionalidades, logicas de negocio
2. **Manter**: Consistencia de cores (#EAD8AC, #013648), fontes, componentes shadcn/ui
3. **Testar**: Cada mudanca em viewport 375px (iPhone SE), 390px (iPhone 14), 768px (iPad)
4. **Acessibilidade**: Manter tamanhos de toque minimos de 44x44px

---

## Classes Utilitarias Sugeridas

Adicionar em `globals.css` se necessario:
```css
/* Grid 2x2 padrao mobile */
.grid-actions {
  @apply grid grid-cols-2 lg:grid-cols-4 gap-3;
}

/* Card compacto */
.card-compact {
  @apply [&_.card-content]:p-3 [&_.card-header]:p-3 [&_.card-header]:pb-2;
}

/* Texto responsivo */
.text-responsive-sm {
  @apply text-xs sm:text-sm;
}

.text-responsive-base {
  @apply text-sm sm:text-base;
}
```

---

*Documento criado em: Fevereiro 2026*
*Escopo: Refatoracao de Design - Mobile-First*
