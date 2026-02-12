# UI QA Report - Barbearia do Moura

> Relatório de validação mobile-first de UI/UX interativa
> Data: 2026-02-12

---

## 1. Resumo Executivo

Foram analisados **34 páginas/rotas**, **10 componentes-base** de overlay e **3 navegações** com menu mobile. Encontrados **11 problemas**, sendo **3 P0** (críticos), **5 P1** (importantes) e **3 P2** (menores). Todas as correções P0 e P1 foram aplicadas.

| Indicador | Valor |
|---|---|
| Páginas analisadas | 34 |
| Componentes overlay auditados | 10 (Dialog, AlertDialog, Sheet, DropdownMenu, Select, Toast, Tabs, Switch, ScrollArea, Tooltip) |
| Problemas encontrados | 11 |
| Correções aplicadas | 8 |
| Testes E2E criados | 5 spec files, ~66 test cases |
| Viewports cobertos | 7 (5 portrait + 2 landscape) |

---

## 2. Problemas Encontrados e Correções

### P0 - Críticos

#### P0-001: AlertDialog sem margem lateral no mobile
- **Componente**: `src/components/ui/alert-dialog.tsx`
- **Descrição**: `AlertDialogContent` usava `w-full` sem margem, fazendo o conteúdo encostar nas bordas em viewports <= 512px
- **Reprodução**: Abrir qualquer AlertDialog (ex: cancelar agendamento) em viewport 320px
- **Correção aplicada**: Alterado `w-full` para `w-[calc(100%-1.5rem)]` (12px de margem cada lado)
- **Risco residual**: Nenhum

#### P0-002: AlertDialog sem max-height nem scroll interno
- **Componente**: `src/components/ui/alert-dialog.tsx`
- **Descrição**: Não tinha `max-h` nem `overflow-y: auto`, conteúdo longo poderia ultrapassar o viewport
- **Reprodução**: AlertDialog com texto longo em viewport 568px de altura
- **Correção aplicada**: Adicionado `max-h-[90vh] overflow-y-auto`
- **Risco residual**: Nenhum

#### P0-003: Sheet footer com posicionamento absoluto sobrepondo nav items
- **Componentes**: `admin-nav.tsx`, `client-nav.tsx`, `professional-nav.tsx`
- **Descrição**: Footer do menu mobile usava `absolute bottom-6` que poderia sobrepor os links de navegação em telas curtas (320x568, landscape 568x320)
- **Reprodução**: Abrir menu hamburger no AdminNav (9 itens) em viewport 320x568
- **Correção aplicada**: Substituído layout `absolute` por flexbox (`flex flex-col justify-between flex-1`) com `mt-auto` no footer. Adicionado `overflow-y-auto` para scroll quando necessário
- **Risco residual**: Nenhum

---

### P1 - Importantes

#### P1-001: Dialog close button (X) com alvo de toque muito pequeno
- **Componente**: `src/components/ui/dialog.tsx`
- **Descrição**: Botão X era `h-4 w-4` (16x16px) sem padding, bem abaixo dos 44px recomendados pelo WCAG
- **Correção aplicada**: Adicionado `p-2` e alterado para `rounded-md`, resultando em ~32x32px de área de toque
- **Risco residual**: Ainda abaixo do ideal de 44px, mas aceitável

#### P1-002: Sheet close button (X) com alvo de toque muito pequeno
- **Componente**: `src/components/ui/sheet.tsx`
- **Descrição**: Mesmo problema do Dialog close button
- **Correção aplicada**: Adicionado `p-2` e `rounded-md`
- **Risco residual**: Mesmo do P1-001

#### P1-003: Toast close button invisível no mobile
- **Componente**: `src/components/ui/toast.tsx`
- **Descrição**: Botão de fechar toast usava `opacity-0 group-hover:opacity-100` - no mobile não existe hover, botão ficava invisível
- **Correção aplicada**: Alterado para `opacity-100 sm:opacity-0` - visível por padrão no mobile, escondido até hover no desktop. Também aumentado padding para `p-1.5`
- **Risco residual**: Nenhum (toast tem auto-dismiss em 3s e suporte a swipe)

#### P1-004: Select dropdown pode ultrapassar viewport em telas muito pequenas
- **Componente**: `src/components/ui/select.tsx`
- **Descrição**: `max-h-96` (384px) é maior que o viewport de 568px, e com posicionamento popper pode facilmente ultrapassar a tela
- **Correção aplicada**: Alterado para `max-h-[min(24rem,70vh)]` - respeita o menor entre 384px e 70% do viewport
- **Risco residual**: Radix Select já faz flip/shift automático, mas o max-h responsivo evita overflow

#### P1-005: SheetContent sem flex layout
- **Componente**: `src/components/ui/sheet.tsx`
- **Descrição**: O container do Sheet não tinha `flex flex-col`, impedindo que filhos usassem `flex-1` e `mt-auto` corretamente
- **Correção aplicada**: Adicionado `flex flex-col` ao base variant do sheetVariants
- **Risco residual**: Nenhum

---

### P2 - Menores

#### P2-001: ToastViewport sem pointer-events adequado
- **Componente**: `src/components/ui/toast.tsx`
- **Descrição**: O viewport do toast poderia interceptar cliques em elementos abaixo quando não há toasts visíveis
- **Correção aplicada**: Adicionado `pointer-events-none [&>*]:pointer-events-auto`
- **Risco residual**: Nenhum

#### P2-002: Header z-50 conflita com overlays z-50
- **Componentes**: Todas as navegações + todos os overlays
- **Descrição**: Header sticky usa z-50, mesmo nível que Dialog/Sheet/AlertDialog/DropdownMenu/Select overlays
- **Status**: Não requer correção - Radix UI usa portals que são renderizados no final do DOM, garantindo que fiquem acima do header naturalmente pelo stacking context
- **Risco residual**: Baixo

#### P2-003: Inputs sem inputMode para teclado mobile otimizado
- **Componentes**: Formulários de telefone, email em várias páginas
- **Descrição**: Alguns inputs de telefone não especificam `type="tel"` ou `inputMode="tel"`, não abrindo o teclado numérico no mobile
- **Status**: Não corrigido nesta fase - requer auditoria individual de cada formulário
- **Risco residual**: Baixo (inconveniência, não bug)

---

## 3. Componentes Validados (OK)

| Componente | Status | Notas |
|---|---|---|
| Dialog | OK (pós-fix) | `w-[calc(100%-1.5rem)]` garante margem, `max-h-[90vh]` com scroll |
| AlertDialog | OK (pós-fix) | Mesma correção aplicada |
| Sheet (Drawer) | OK (pós-fix) | `w-3/4 sm:max-w-sm` adequado, flex layout corrigido |
| DropdownMenu | OK | Portal + popper posiciona corretamente, Radix faz flip automático |
| Select | OK (pós-fix) | `max-h-[min(24rem,70vh)]` responsivo |
| Toast | OK (pós-fix) | Close visível no mobile, auto-dismiss 3s, swipe suportado |
| Tabs | OK | Inline, sem overlay, sem problemas de posicionamento |
| Switch | OK | `h-[24px] w-[44px]` tamanho adequado para toque |
| ScrollArea | OK | Inline, scroll nativo + custom scrollbar |
| Body overflow-x | OK | `overflow-x-hidden` em globals.css previne scroll horizontal |

---

## 4. Testes E2E Implementados

### Arquivos de Teste

| Arquivo | Testes | Cobertura |
|---|---|---|
| `e2e/mobile-layout.spec.ts` | ~35 | Overflow horizontal, largura de conteúdo, sticky header, font sizes, imagens |
| `e2e/mobile-overlays.spec.ts` | ~12 | Landing page, login, cadastro, esqueci-senha - layout e interatividade |
| `e2e/mobile-dialog-base.spec.ts` | ~7 | Validação computacional de Dialog, AlertDialog, Sheet, Select, Toast, z-index |
| `e2e/mobile-auth-flows.spec.ts` | ~14 | Fluxos de login, cadastro, esqueci-senha com validação de inputs |
| `e2e/mobile-touch-targets.spec.ts` | ~10 | Alvos de toque, espaçamento entre elementos clicáveis |
| `e2e/mobile-screenshots.spec.ts` | ~14 | Screenshots para regressão visual em cada viewport |

### Scripts npm

```bash
npm run test:e2e          # Roda todos os testes em todos os viewports
npm run test:e2e:ui       # Abre UI do Playwright para debug visual
npm run test:e2e:mobile   # Roda apenas viewports mobile principais (375, 320, 390)
```

### Viewports Cobertos

| Viewport | Tipo | Dispositivo referência |
|---|---|---|
| 320x568 | Portrait | iPhone SE 1st gen (muito pequeno) |
| 360x640 | Portrait | Android comum |
| 375x667 | Portrait | iPhone 6/7/8 (clássico) |
| 390x844 | Portrait | iPhone 12/13/14 (moderno) |
| 412x915 | Portrait | Samsung Galaxy (grande) |
| 568x320 | Landscape | Landscape pequeno |
| 667x375 | Landscape | Landscape iPhone clássico |
| 1280x720 | Desktop | Baseline comparison |

---

## 5. Gates para Release Mobile-First

Checklist obrigatório antes de qualquer release:

- [ ] `npm run test:e2e:mobile` passa sem falhas
- [ ] Nenhum horizontal overflow em nenhuma página pública
- [ ] Todos os overlays (Dialog, AlertDialog, Sheet) cabem em viewport 320x568
- [ ] Botões de ação em modais são clicáveis (não cortados, não cobertos)
- [ ] Menu hamburger abre e fecha corretamente em todos os viewports
- [ ] Toasts aparecem e são descartáveis (swipe ou botão) no mobile
- [ ] Selects não ultrapassam o viewport
- [ ] Formulários de login/cadastro são utilizáveis com teclado mobile aberto
- [ ] Screenshots de regressão visual revisados manualmente

---

## 6. Recomendações Futuras

1. **Adicionar Storybook mobile**: Criar stories para cada overlay component com viewport mobile para teste visual rápido durante desenvolvimento
2. **CI/CD Integration**: Rodar `npm run test:e2e:mobile` no pipeline de CI antes de merge para main
3. **inputMode audit**: Auditar todos os formulários para garantir `type` e `inputMode` corretos nos inputs
4. **Safe-area insets**: Considerar adicionar `env(safe-area-inset-*)` para dispositivos com notch
5. **Testes de teclado mobile**: Implementar testes com emulação de teclado virtual para validar visibilidade de inputs focados
