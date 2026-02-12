# UI Interaction Map - Barbearia do Moura

> Inventário completo de componentes interativos de UI para validação mobile-first.
> Gerado em: 2026-02-12

---

## 1. Componentes-Base Reutilizáveis

### Biblioteca: Radix UI + shadcn/ui

| Componente | Arquivo | Primitivo Radix | Posicionamento | Z-Index | Focus Trap | Scroll Lock |
|---|---|---|---|---|---|---|
| **Dialog** | `src/components/ui/dialog.tsx` | `@radix-ui/react-dialog` | Portal + fixed center (`translate -50%`) | `z-50` | Sim (Radix built-in) | Sim (Radix built-in) |
| **AlertDialog** | `src/components/ui/alert-dialog.tsx` | `@radix-ui/react-alert-dialog` | Portal + fixed center (`translate -50%`) | `z-50` | Sim | Sim |
| **Sheet (Drawer)** | `src/components/ui/sheet.tsx` | `@radix-ui/react-dialog` | Portal + fixed (inset-y/inset-x por lado) | `z-50` | Sim | Sim |
| **DropdownMenu** | `src/components/ui/dropdown-menu.tsx` | `@radix-ui/react-dropdown-menu` | Portal + popper (relativo ao trigger) | `z-50` | Sim | Nao |
| **Select** | `src/components/ui/select.tsx` | `@radix-ui/react-select` | Portal + popper | `z-50` | Sim | Nao |
| **Toast** | `src/components/ui/toast.tsx` | `@radix-ui/react-toast` | Fixed (viewport position) | `z-[100]` | Nao | Nao |
| **Tabs** | `src/components/ui/tabs.tsx` | `@radix-ui/react-tabs` | Inline (sem overlay) | N/A | Nao | Nao |
| **Switch** | `src/components/ui/switch.tsx` | `@radix-ui/react-switch` | Inline | N/A | Nao | Nao |
| **ScrollArea** | `src/components/ui/scroll-area.tsx` | `@radix-ui/react-scroll-area` | Inline | N/A | Nao | Nao |

### Overlay System Summary
- **Portal**: Dialog, AlertDialog, Sheet, DropdownMenu, Select usam Portal (renderizam fora da arvore DOM)
- **Backdrop**: Dialog e Sheet usam `DialogOverlay`/`SheetOverlay` com `fixed inset-0 bg-[#013648]/95 backdrop-blur-sm`
- **AlertDialog** usa backdrop proprio com mesmas classes
- **Toasts**: viewport z-[100], posicionado via `Toaster` component com positions configuráveis (bottom-right default)
- **Z-index hierarchy**: Toasts (100) > Overlays/Modals/Sheets/Dropdowns/Selects (50) > Header (50) > Floating actions (40)

### Dimensionamento Mobile - Dialog
```
w-[calc(100%-1.5rem)] max-w-lg max-h-[90vh] overflow-y-auto
```
- Bom: usa `calc(100%-1.5rem)` para margem lateral
- Bom: `max-h-[90vh]` com `overflow-y-auto`

### Dimensionamento Mobile - AlertDialog
```
w-full max-w-lg
```
- **PROBLEMA**: usa `w-full` sem margem lateral (sem `calc(100%-...)`)
- **Nao tem** `max-h` nem `overflow-y: auto`

### Dimensionamento Mobile - Sheet
```
w-3/4 sm:max-w-sm (lado right/left)
inset-x-0 (lado top/bottom)
```
- Bom para mobile: 75% da largura

### Dimensionamento Mobile - Toast
```
w-full p-4 sm:flex-col md:max-w-[420px]
```
- **PROBLEMA**: `ToastViewport` nao tem posição explícita definida no componente base - depende do `Toaster`

---

## 2. Inventário por Rota/Página

### 2.1 Navegações (presentes em TODAS as páginas autenticadas)

#### AdminNav (`src/components/layout/admin-nav.tsx`)
| Componente | Tipo | Mobile | Desktop |
|---|---|---|---|
| Sheet (hamburger menu) | Drawer right, w-[280px] | `lg:hidden` | oculto |
| DropdownMenu (user avatar) | Dropdown w-56, align="end" | oculto | `hidden lg:flex` |
| Links nav (9 itens) | Links inline | dentro do Sheet | `hidden lg:flex` |
| Logo link | Link | sempre visivel | sempre visivel |

#### ClientNav (`src/components/layout/client-nav.tsx`)
| Componente | Tipo | Mobile | Desktop |
|---|---|---|---|
| Sheet (hamburger menu) | Drawer right, w-[280px] | `md:hidden` | oculto |
| DropdownMenu (user avatar) | Dropdown w-56, align="end" | oculto | `hidden md:flex` |
| Links nav (6 itens) | Links inline | dentro do Sheet | `hidden md:flex` |

#### ProfessionalNav (`src/components/layout/professional-nav.tsx`)
| Componente | Tipo | Mobile | Desktop |
|---|---|---|---|
| Sheet (hamburger menu) | Drawer right, w-[280px] | `md:hidden` | oculto |
| DropdownMenu (user avatar) | Dropdown w-56, align="end" | oculto | `hidden md:flex` |
| Links nav (4 itens) | Links inline | dentro do Sheet | `hidden md:flex` |

#### UserNav (`src/components/layout/user-nav.tsx`)
| Componente | Tipo |
|---|---|
| DropdownMenu | Dropdown w-56, align="end", forceMount |

**Nota sobre Sheets mobile**: Todos usam footer com `absolute bottom-6 left-6 right-6` - pode causar sobreposição com itens de navegação em telas muito pequenas (320px altura).

---

### 2.2 Admin Pages

#### `/admin/dashboard` - Dashboard Admin
| Componente | Tipo | Detalhes |
|---|---|---|
| Select (filtro período) | Select/Dropdown | Filtro de período dos KPIs |
| Tabs | Tabs inline | Abas de seções do dashboard |
| Buttons | Actions | Links para sub-páginas |
| Toast | Notificação | Feedback de ações |

#### `/admin/agenda` - Agenda Admin
| Componente | Tipo | Detalhes |
|---|---|---|
| Select (profissional) | Select/Dropdown | Filtro por profissional |
| Select (status) | Select/Dropdown | Filtro por status |
| Dialog (detalhes agendamento) | Modal | Ver/editar detalhes do agendamento |
| Dialog (novo agendamento) | Modal | Formulario de criacao |
| AlertDialog (cancelar) | Confirmação | Confirmar cancelamento |
| AlertDialog (concluir) | Confirmação | Confirmar conclusão |
| Input (data) | Date input | Seleção de data |
| Tabs | Tabs inline | Visualização dia/semana |
| Toast | Notificação | Feedback de ações |

#### `/admin/servicos` - Servicos Admin
| Componente | Tipo | Detalhes |
|---|---|---|
| Dialog (criar servico) | Modal | Formulario com Input, Textarea, Select |
| Dialog (editar servico) | Modal | Formulario de edição |
| AlertDialog (excluir) | Confirmação | Confirmar exclusão |
| Switch (ativo/inativo) | Toggle | Status do servico |
| Toast | Notificação | Feedback de CRUD |

#### `/admin/profissionais` - Profissionais Admin
| Componente | Tipo | Detalhes |
|---|---|---|
| Dialog (criar profissional) | Modal | Formulário com inputs |
| Dialog (editar profissional) | Modal | Formulário de edição |
| AlertDialog (excluir) | Confirmação | Confirmar exclusão |
| Switch (ativo/inativo) | Toggle | Status do profissional |
| Select (especialidades) | Select | Multi-seleção de servicos |
| Toast | Notificação | Feedback de CRUD |

#### `/admin/assinantes` - Assinantes Admin
| Componente | Tipo | Detalhes |
|---|---|---|
| Select (filtro status) | Select/Dropdown | Filtro por status da assinatura |
| Select (filtro plano) | Select/Dropdown | Filtro por tipo de plano |
| Dialog (detalhes assinatura) | Modal | Ver detalhes do assinante |
| AlertDialog (cancelar assinatura) | Confirmação | Cancelamento de assinatura |
| Toast | Notificação | Feedback de ações |

#### `/admin/comissoes` - Comissoes Admin
| Componente | Tipo | Detalhes |
|---|---|---|
| Select (profissional) | Select | Filtro por profissional |
| Select (período) | Select | Filtro por período |
| Dialog (detalhes comissao) | Modal | Ver detalhes de comissão |
| Dialog (ajustar taxa) | Modal | Formulário com Input number |
| Toast | Notificação | Feedback de ações |

#### `/admin/financeiro` - Financeiro Admin
| Componente | Tipo | Detalhes |
|---|---|---|
| Select (período) | Select | Filtro por período |
| Tabs | Tabs inline | Receitas/Despesas/Resumo |
| Toast | Notificação | Feedback |

#### `/admin/bloqueios` - Bloqueios Admin
| Componente | Tipo | Detalhes |
|---|---|---|
| Dialog (criar bloqueio) | Modal | Formulário com inputs de data/hora |
| Dialog (editar bloqueio) | Modal | Edição de bloqueio |
| AlertDialog (excluir bloqueio) | Confirmação | Confirmar exclusão |
| Select (profissional) | Select | Seleção de profissional |
| Select (tipo) | Select | Tipo de bloqueio |
| Input (data inicio/fim) | Date inputs | Campos de data |
| Input (hora inicio/fim) | Time inputs | Campos de hora |
| Textarea (motivo) | Textarea | Motivo do bloqueio |
| Toast | Notificação | Feedback de CRUD |

#### `/admin/feedbacks` - Feedbacks Admin
| Componente | Tipo | Detalhes |
|---|---|---|
| Select (filtro) | Select | Filtro por profissional/período |
| Dialog (detalhes feedback) | Modal | Ver feedback completo |
| Toast | Notificação | Feedback |

---

### 2.3 Cliente Pages

#### `/dashboard` - Dashboard Cliente
| Componente | Tipo | Detalhes |
|---|---|---|
| AlertDialog (cancelar agendamento) | Confirmação | Cancelar próximo agendamento |
| Toast | Notificação | Feedback de cancelamento |
| Buttons | Links | Links rápidos para agendar, clube, etc. |

#### `/agendar` - Agendar (Fluxo Principal)
| Componente | Tipo | Detalhes |
|---|---|---|
| Select (servico) | Select | Seleção de servico |
| Select (profissional) | Select | Seleção de profissional |
| Input (data) | Date input | Seleção de data |
| Buttons (horarios) | Grid de botoes | Seleção de horário disponível |
| Dialog (confirmar agendamento) | Modal | Resumo e confirmação |
| AlertDialog (conflito horario) | Alerta | Aviso de conflito |
| Toast | Notificação | Feedback de agendamento |

#### `/meus-agendamentos` - Meus Agendamentos
| Componente | Tipo | Detalhes |
|---|---|---|
| Tabs | Tabs inline | Próximos/Histórico |
| AlertDialog (cancelar) | Confirmação | Cancelar agendamento |
| Dialog (detalhes) | Modal | Ver detalhes do agendamento |
| Toast | Notificação | Feedback de cancelamento |

#### `/feedback` - Avaliacoes Cliente
| Componente | Tipo | Detalhes |
|---|---|---|
| Dialog (nova avaliacao) | Modal | Formulário de avaliação |
| Select (agendamento) | Select | Selecionar agendamento para avaliar |
| Textarea (comentario) | Textarea | Texto da avaliação |
| Buttons (estrelas) | Rating | Classificação por estrelas |
| Toast | Notificação | Feedback |

#### `/perfil` - Perfil Cliente
| Componente | Tipo | Detalhes |
|---|---|---|
| Input (nome, email, telefone) | Formulário | Edição de dados pessoais |
| Button (salvar) | Action | Salvar perfil |
| Toast | Notificação | Feedback de atualização |

#### `/perfil/configuracoes` - Configuracoes Cliente
| Componente | Tipo | Detalhes |
|---|---|---|
| Input (senha atual, nova senha) | Password inputs | Troca de senha |
| AlertDialog (excluir conta) | Confirmação | Exclusão de conta |
| Switch | Toggle | Preferências de notificação |
| Toast | Notificação | Feedback |

#### `/clube` - Clube do Moura
| Componente | Tipo | Detalhes |
|---|---|---|
| Dialog (assinar plano) | Modal | Formulário/confirmação de assinatura |
| Dialog (cancelar assinatura) | Modal | Cancelamento com confirmação |
| Tabs | Tabs inline | Planos disponíveis |
| Toast | Notificação | Feedback de ações |

---

### 2.4 Profissional Pages

#### `/profissional/dashboard` - Dashboard Profissional
| Componente | Tipo | Detalhes |
|---|---|---|
| Select (data) | Select | Filtro por data |
| AlertDialog (concluir atendimento) | Confirmação | Marcar como concluído |
| AlertDialog (cancelar atendimento) | Confirmação | Cancelar atendimento |
| Dialog (detalhes) | Modal | Ver detalhes do agendamento |
| Toast | Notificação | Feedback de ações |

#### `/profissional/perfil` - Perfil Profissional
| Componente | Tipo | Detalhes |
|---|---|---|
| Input (nome, telefone, bio) | Formulário | Edição de dados |
| Textarea (bio) | Textarea | Biografia |
| Button (salvar) | Action | Salvar |
| Toast | Notificação | Feedback |

#### `/profissional/perfil/configuracoes` - Config Profissional
| Componente | Tipo | Detalhes |
|---|---|---|
| Input (senhas) | Password inputs | Troca de senha |
| Switch | Toggle | Preferências |
| Toast | Notificação | Feedback |

#### `/profissional/comissoes` - Comissoes Profissional
| Componente | Tipo | Detalhes |
|---|---|---|
| Select (período) | Select | Filtro por período |
| Dialog (detalhes) | Modal | Ver detalhes de comissão |
| Toast | Notificação | Feedback |

#### `/profissional/bloqueios` - Bloqueios Profissional
| Componente | Tipo | Detalhes |
|---|---|---|
| Dialog (criar bloqueio) | Modal | Formulário de bloqueio |
| AlertDialog (excluir) | Confirmação | Confirmar exclusão |
| Input (data, hora) | Date/Time inputs | Campos de data/hora |
| Textarea (motivo) | Textarea | Motivo |
| Toast | Notificação | Feedback |

---

### 2.5 Auth Pages

#### `/login` - Login
| Componente | Tipo | Detalhes |
|---|---|---|
| Input (email) | type="email" | Campo de email |
| Input (senha) | type="password" | Campo de senha |
| Button (entrar) | Submit | Botão de login |
| Link (esqueci senha) | Link | Recuperação |
| Toast | Notificação | Feedback de erro |

#### `/cadastro` - Cadastro
| Componente | Tipo | Detalhes |
|---|---|---|
| Input (nome, email, telefone, senha) | Formulário | Dados de cadastro |
| Button (cadastrar) | Submit | Botão de registro |
| Toast | Notificação | Feedback |

#### `/esqueci-senha` - Esqueci Senha
| Componente | Tipo | Detalhes |
|---|---|---|
| Input (email) | type="email" | Campo de email |
| Button (enviar) | Submit | Enviar link |
| Toast | Notificação | Feedback |

#### `/resetar-senha` - Resetar Senha
| Componente | Tipo | Detalhes |
|---|---|---|
| Input (nova senha, confirmar) | type="password" | Campos de senha |
| Button (resetar) | Submit | Confirmar reset |
| Toast | Notificação | Feedback |

---

### 2.6 Public Pages

#### `/` - Landing Page
| Componente | Tipo | Detalhes |
|---|---|---|
| Buttons (CTA) | Links | Botões de ação hero |
| Links (nav header) | Navigation | Menu do header |
| Sheet (mobile menu) | Drawer | Menu hamburger mobile (se existir no header) |

#### `/sobre/profissionais` - Profissionais Publico
| Componente | Tipo | Detalhes |
|---|---|---|
| Buttons | Links | Links para agendamento |

#### `/sobre/servicos` - Servicos Publico
| Componente | Tipo | Detalhes |
|---|---|---|
| Cards | Display | Cards de serviços |

#### `/sobre/clube` - Clube Publico
| Componente | Tipo | Detalhes |
|---|---|---|
| Cards | Display | Cards de planos |
| Buttons | Links | CTAs de assinatura |

#### `/pagamento/*` - Resultado Pagamento
| Componente | Tipo | Detalhes |
|---|---|---|
| Buttons | Links | Voltar ao dashboard |

---

## 3. Problemas Potenciais Identificados (Pre-Teste)

### P0 - Críticos
1. **AlertDialogContent usa `w-full` sem margem lateral** - pode encostar nas bordas em mobile 320px
2. **ToastViewport sem posição explícita no componente base** - depende do Toaster para posicionamento
3. **Header z-50 conflita com overlays z-50** - ambos no mesmo nível

### P1 - Importantes
4. **Sheet footer com `absolute bottom-6`** - pode sobrepor itens de nav em telas curtas (568px)
5. **Dialog close button `h-4 w-4`** - alvo de toque muito pequeno (16px < 44px recomendado)
6. **AlertDialog close button inexistente** - depende apenas dos botões Action/Cancel
7. **Select max-h-96 (384px)** - pode ser muito alto em viewport 568px
8. **DropdownMenu sem max-height** - com muitos itens pode ultrapassar viewport

### P2 - Menores
9. **Toast close button `opacity-0` até hover** - no mobile nao existe hover, depende de swipe
10. **AdminNav com 9 itens** - Sheet com scroll pode ser necessário em telas pequenas
11. **Inputs sem `inputMode`** - telefone e email podem nao abrir teclado correto no mobile
