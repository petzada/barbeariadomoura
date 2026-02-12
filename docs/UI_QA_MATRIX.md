# UI QA Matrix - Barbearia do Moura

> Matriz de cobertura de testes para validação mobile-first.
> Gerado em: 2026-02-12

---

## Viewports de Teste

| ID | Viewport | Descrição | Orientação |
|---|---|---|---|
| VP1 | 320x568 | Muito pequeno (iPhone SE 1st gen) | Portrait |
| VP2 | 360x640 | Android comum | Portrait |
| VP3 | 375x667 | iPhone clássico (6/7/8) | Portrait |
| VP4 | 390x844 | iPhone moderno (12/13/14) | Portrait |
| VP5 | 412x915 | Android grande (Samsung Galaxy) | Portrait |
| VP6 | 568x320 | Landscape pequeno | Landscape |
| VP7 | 667x375 | Landscape iPhone clássico | Landscape |

---

## Matriz de Testes

### 1. Navegação Mobile (Sheet/Drawer)

| # | Tela/Fluxo | Componente | Interação | Cenário | Sev | Validação |
|---|---|---|---|---|---|---|
| N01 | Todas (admin) | AdminNav Sheet | Abrir/fechar menu | VP1-VP5: Sheet cabe na tela | P0 | E2E |
| N02 | Todas (admin) | AdminNav Sheet | Scroll nav items | VP1: 9 itens + footer cabem? | P1 | E2E |
| N03 | Todas (admin) | AdminNav Sheet | Tap outside fecha | VP1-VP5: overlay fecha ao tap fora | P0 | E2E |
| N04 | Todas (admin) | AdminNav Sheet | Footer posicionamento | VP1,VP6: footer nao sobrepoe itens | P1 | E2E |
| N05 | Todas (cliente) | ClientNav Sheet | Abrir/fechar menu | VP1-VP5: Sheet cabe na tela | P0 | E2E |
| N06 | Todas (cliente) | ClientNav Sheet | Nav items visiveis | VP1: 6 itens + footer cabem | P1 | E2E |
| N07 | Todas (prof) | ProfNav Sheet | Abrir/fechar menu | VP1-VP5: Sheet cabe na tela | P0 | E2E |
| N08 | Todas | UserNav Dropdown | Abrir/fechar | VP4-VP5: dropdown dentro do viewport | P1 | E2E |
| N09 | Todas | Header sticky | Scroll page | VP1-VP5: header fixo no topo | P1 | E2E |

### 2. Dialogs/Modais

| # | Tela/Fluxo | Componente | Interação | Cenário | Sev | Validação |
|---|---|---|---|---|---|---|
| D01 | /admin/agenda | Dialog detalhes | Abrir/fechar | VP1: modal dentro do viewport | P0 | E2E |
| D02 | /admin/agenda | Dialog novo agendamento | Formulário completo | VP1: form com scroll interno | P0 | E2E |
| D03 | /admin/agenda | Dialog novo agendamento | Teclado mobile | VP1: inputs visiveis com teclado | P1 | Manual |
| D04 | /admin/servicos | Dialog criar servico | Formulário | VP1: campos acessiveis | P0 | E2E |
| D05 | /admin/servicos | Dialog editar servico | Formulário | VP1: scroll interno funciona | P0 | E2E |
| D06 | /admin/profissionais | Dialog criar prof | Formulário | VP1: campos acessiveis | P0 | E2E |
| D07 | /admin/bloqueios | Dialog criar bloqueio | Formulário data/hora | VP1: inputs de data/hora | P0 | E2E |
| D08 | /admin/comissoes | Dialog ajustar taxa | Formulário | VP1: input number | P1 | E2E |
| D09 | /admin/assinantes | Dialog detalhes | Conteúdo longo | VP1: scroll interno | P1 | E2E |
| D10 | /admin/feedbacks | Dialog detalhes | Conteúdo longo | VP1: texto longo nao quebra | P1 | E2E |
| D11 | /agendar | Dialog confirmar | Resumo agendamento | VP1: botoes acessiveis | P0 | E2E |
| D12 | /meus-agendamentos | Dialog detalhes | Ver detalhes | VP1: conteúdo dentro viewport | P1 | E2E |
| D13 | /feedback | Dialog nova avaliacao | Formulário | VP1: estrelas + textarea | P0 | E2E |
| D14 | /clube | Dialog assinar | Confirmação | VP1: botoes acessiveis | P0 | E2E |
| D15 | /clube | Dialog cancelar | Confirmação | VP1: botoes acessiveis | P0 | E2E |
| D16 | /prof/bloqueios | Dialog criar bloqueio | Formulário | VP1: campos acessiveis | P1 | E2E |
| D17 | /prof/dashboard | Dialog detalhes | Ver agendamento | VP1: dentro do viewport | P1 | E2E |
| D18 | Todos os Dialogs | Dialog close (X) | Tap no X | VP1-VP5: alvo toque >= 44px | P1 | E2E |
| D19 | Todos os Dialogs | Dialog | Conteúdo longo | VP1: max-h-[90vh] + scroll | P0 | E2E |
| D20 | Todos os Dialogs | Dialog | Overlay backdrop | VP1-VP5: backdrop cobre tela | P1 | E2E |

### 3. AlertDialogs (Confirmações)

| # | Tela/Fluxo | Componente | Interação | Cenário | Sev | Validação |
|---|---|---|---|---|---|---|
| A01 | /admin/agenda | AlertDialog cancelar | Confirmar/cancelar | VP1: w-full nao ultrapassa viewport | P0 | E2E |
| A02 | /admin/agenda | AlertDialog concluir | Confirmar | VP1: botoes empilhados acessiveis | P0 | E2E |
| A03 | /admin/servicos | AlertDialog excluir | Confirmar exclusão | VP1: texto + botoes cabem | P0 | E2E |
| A04 | /admin/profissionais | AlertDialog excluir | Confirmar exclusão | VP1: layout correto | P0 | E2E |
| A05 | /dashboard | AlertDialog cancelar | Cancelar agendamento | VP1: botoes acessiveis | P0 | E2E |
| A06 | /meus-agendamentos | AlertDialog cancelar | Cancelar agendamento | VP1: layout correto | P0 | E2E |
| A07 | /perfil/config | AlertDialog excluir conta | Ação destrutiva | VP1: botoes claros | P0 | E2E |
| A08 | /prof/dashboard | AlertDialog concluir | Marcar concluido | VP1: layout correto | P1 | E2E |
| A09 | Todos AlertDialogs | AlertDialog | Sem margin lateral | VP1: `w-full` pode tocar bordas | P0 | E2E |

### 4. Selects/Dropdowns

| # | Tela/Fluxo | Componente | Interação | Cenário | Sev | Validação |
|---|---|---|---|---|---|---|
| S01 | /admin/agenda | Select profissional | Abrir/selecionar | VP1: dropdown dentro viewport | P0 | E2E |
| S02 | /admin/agenda | Select status | Abrir/selecionar | VP1: posicionamento correto | P1 | E2E |
| S03 | /admin/assinantes | Select filtro | Abrir/selecionar | VP1: lista nao ultrapassa tela | P1 | E2E |
| S04 | /admin/comissoes | Select profissional | Abrir/selecionar | VP1: posicionamento | P1 | E2E |
| S05 | /agendar | Select servico | Abrir/selecionar | VP1: lista de serviços longa | P0 | E2E |
| S06 | /agendar | Select profissional | Abrir/selecionar | VP1: lista de profissionais | P0 | E2E |
| S07 | /admin/bloqueios | Select profissional | Abrir/selecionar | VP1: posicionamento | P1 | E2E |
| S08 | Todos Selects | Select | Lista longa | VP1: max-h-96 pode ser > viewport | P1 | E2E |
| S09 | Todos Selects | Select | Scroll interno | VP1: scroll suave na lista | P1 | E2E |

### 5. Formulários com Teclado Mobile

| # | Tela/Fluxo | Componente | Interação | Cenário | Sev | Validação |
|---|---|---|---|---|---|---|
| F01 | /login | Form login | Input email + senha | VP1: teclado nao esconde input | P0 | Manual |
| F02 | /cadastro | Form cadastro | Múltiplos inputs | VP1: scroll entre campos | P0 | Manual |
| F03 | /perfil | Form perfil | Editar nome/email/tel | VP1: teclado nao esconde | P1 | Manual |
| F04 | /agendar | Form agendamento | Selects + botoes | VP1: fluxo completo funcional | P0 | E2E |
| F05 | Dialog (servicos) | Form criar servico | Inputs dentro do modal | VP1: scroll do modal com teclado | P0 | Manual |
| F06 | Dialog (bloqueios) | Form bloqueio | Inputs data/hora | VP1: inputs de data funcionais | P1 | Manual |
| F07 | /feedback | Form avaliacao | Textarea + rating | VP1: textarea com teclado | P1 | Manual |
| F08 | Todos os forms | Input types | type correto | email/tel/password abrem teclado certo | P2 | Manual |

### 6. Toasts/Notificações

| # | Tela/Fluxo | Componente | Interação | Cenário | Sev | Validação |
|---|---|---|---|---|---|---|
| T01 | Todas | Toast | Exibição | VP1-VP5: toast dentro do viewport | P1 | E2E |
| T02 | Todas | Toast | Swipe dismiss | VP1: swipe funciona para fechar | P2 | Manual |
| T03 | Todas | Toast close | Tap close | VP1: botão close visivel (sem hover) | P1 | E2E |
| T04 | Todas | Toast | Nao bloqueia UI | VP1: elementos abaixo acessiveis | P2 | E2E |

### 7. Tabs

| # | Tela/Fluxo | Componente | Interação | Cenário | Sev | Validação |
|---|---|---|---|---|---|---|
| TB01 | /meus-agendamentos | Tabs | Switch tabs | VP1: tabs cabem na largura | P1 | E2E |
| TB02 | /admin/financeiro | Tabs | Switch tabs | VP1: labels nao truncados | P1 | E2E |
| TB03 | /clube | Tabs | Switch tabs | VP1: tabs responsivos | P1 | E2E |
| TB04 | Todos Tabs | Tabs | Touch target | VP1: alvos >= 44px | P2 | E2E |

### 8. Scroll & Layout

| # | Tela/Fluxo | Componente | Interação | Cenário | Sev | Validação |
|---|---|---|---|---|---|---|
| L01 | Todas | Body | Overflow-x | VP1-VP5: sem scroll horizontal | P0 | E2E |
| L02 | Todas | Modal aberto | Body scroll lock | VP1: body nao rola com modal aberto | P0 | E2E |
| L03 | Todas | Modal aberto | Scroll interno | VP1: scroll interno do modal suave | P1 | E2E |
| L04 | Todas | Modal fechado | Restore scroll | VP1: scroll restaurado apos fechar | P1 | E2E |
| L05 | /admin/agenda | Conteúdo longo | Page scroll | VP1: tabela/lista com scroll | P1 | E2E |
| L06 | Todas | Landscape | Layout landscape | VP6-VP7: layout nao quebra | P1 | E2E |

### 9. Touch Targets & Acessibilidade

| # | Tela/Fluxo | Componente | Interação | Cenário | Sev | Validação |
|---|---|---|---|---|---|---|
| TT01 | Todas | Buttons | Touch target | VP1: todos botoes >= 44x44px | P1 | E2E |
| TT02 | Todas | Dialog X button | Touch target | VP1: X btn muito pequeno (16px) | P1 | E2E |
| TT03 | Todas | Nav links | Touch target | VP1: links com padding adequado | P2 | E2E |
| TT04 | Todas | Select trigger | Touch target | VP1: h-11 (44px) OK | P2 | E2E |
| TT05 | Todas | Switch | Touch target | VP1: area de toque adequada | P2 | Manual |

---

## Resumo de Cobertura

| Categoria | Total Testes | P0 | P1 | P2 | E2E | Manual |
|---|---|---|---|---|---|---|
| Navegação | 9 | 3 | 6 | 0 | 9 | 0 |
| Dialogs | 20 | 8 | 12 | 0 | 20 | 0 |
| AlertDialogs | 9 | 7 | 2 | 0 | 9 | 0 |
| Selects | 9 | 3 | 6 | 0 | 9 | 0 |
| Formulários | 8 | 4 | 3 | 1 | 2 | 6 |
| Toasts | 4 | 0 | 2 | 2 | 3 | 1 |
| Tabs | 4 | 0 | 3 | 1 | 4 | 0 |
| Scroll/Layout | 6 | 2 | 4 | 0 | 6 | 0 |
| Touch Targets | 5 | 0 | 2 | 3 | 4 | 1 |
| **TOTAL** | **74** | **27** | **40** | **7** | **66** | **8** |
