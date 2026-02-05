** FLUXOS DETALHADOS DE IMPLEMENTAÇÃO **


** FLUXO 1: AGENDAMENTO (CLIENTE)**

1. Cliente acessa /agendar (autenticado)

2. ETAPA 1 - Selecionar Serviço
   - Listar serviços ativos com nome, descrição, preço, duração
   - Card selecionável para cada serviço
   - Mostrar preço normal
   - Se cliente tem assinatura ativa, mostrar badge "Incluso no seu plano" ou "Desconto de X%"

3. ETAPA 2 - Selecionar Profissional
   - Listar profissionais ativos com foto, nome, bio
   - Card selecionável para cada profissional
   - Mostrar disponibilidade genérica ("Disponível hoje", "Próximo horário: amanhã 10h")

4. ETAPA 3 - Selecionar Data e Horário
   - Calendário para selecionar data (próximos 30 dias)
   - Desabilitar dias que a barbearia não funciona
   - Desabilitar dias que o profissional não trabalha
   - Ao selecionar data, carregar horários disponíveis via buscar_horarios_disponiveis()
   - Grid de horários disponíveis (botões)
   - Se agendamento com menos de 1h de antecedência:
     - Mostrar mensagem: "Para agendamentos de última hora, entre em contato via WhatsApp"
     - Botão: "Falar no WhatsApp" → wa.me/5511960234545

5. ETAPA 4 - Confirmação
   - Resumo: Serviço, Profissional, Data/Hora
   - Cálculo de valor:
     a) Verificar se cliente tem assinatura ativa
     b) Se sim, verificar se serviço está incluso no plano
     c) Se serviço incluso E dia permitido pelo plano → valor_cobrado = 0
     d) Se serviço incluso mas dia NÃO permitido → mostrar aviso + valor_cobrado = valor_cheio
     e) Se serviço não incluso → valor_cobrado = valor_cheio
   - Se valor_cobrado > 0:
     - Texto: "Pagamento na barbearia"
     - Mostrar valor a pagar
   - Se valor_cobrado = 0:
     - Texto: "Incluso no seu plano [Nome do Plano]"
   - Botão "Confirmar Agendamento"

6. Ao confirmar:
   - Criar registro em agendamentos
   - Enviar SMS de confirmação (Twilio)
   - Notificar profissional (SMS + Realtime)
   - Notificar admin se pagamento online confirmado
   - Agendar lembretes (24h e 2h antes)
   - Redirecionar para /meus-agendamentos com toast de sucesso


** FLUXO 2: ASSINATURA DO CLUBE (CLIENTE) **

1. Cliente acessa /clube

2. Exibir planos disponíveis:
   - Card para cada plano com:
     - Nome
     - Preço mensal (R$ XX,XX/mês)
     - Descrição
     - Lista de benefícios (serviços inclusos)
     - Restrição de dias (se houver)
     - Botão "Assinar"
   - Destacar plano "Premium" como recomendado

3. Se cliente já tem assinatura ativa:
   - Mostrar plano atual com status
   - Próxima cobrança
   - Botão "Cancelar assinatura" (confirmação obrigatória)
   - Histórico de pagamentos

4. Ao clicar "Assinar":
   - Abrir modal de pagamento (Mercado Pago)
   - Solicitar dados do cartão de crédito
   - Criar assinatura recorrente via API Mercado Pago
   - Webhook confirma pagamento
   - Criar registro em assinaturas
   - Notificar admin (SMS + plataforma)
   - Toast de sucesso


** FLUXO 3: DASHBOARD (ADMIN) **

1. Admin acessa /admin/dashboard

2. Cards de métricas (hoje):
   - Agendamentos do dia (total e por status)
   - Faturamento do dia
   - Ocupação do dia (%)
   - Novos clientes

3. Cards de métricas (mês):
   - Faturamento do mês
   - Total de agendamentos
   - Assinantes ativos
   - Taxa de no-show

4. Agenda do dia:
   - Timeline vertical com agendamentos
   - Cores por profissional
   - Status visual (aguardando, em andamento, concluído)
   - Clique para ver detalhes / confirmar pagamento

5. Próximos agendamentos:
   - Lista dos próximos 5-10 agendamentos
   - Quick actions (confirmar, cancelar)

6. Ações rápidas:
   - Novo agendamento manual
   - Bloquear horário
   - Ver caixa do dia


** FLUXO 4: CONFIRMAÇÃO DE ATENDIMENTO (PROFISSIONAL/ADMIN) **

1. Profissional/Admin vê agendamento com status 'agendado'

2. Quando cliente chega:
   - Clicar em "Iniciar atendimento" → status = 'em_andamento'

3. Ao finalizar:
   - Clicar em "Finalizar atendimento"
   - Se valor_cobrado > 0:
     - Modal para selecionar forma de pagamento: PIX, Débito, Crédito, Dinheiro
     - Confirmar recebimento
   - Se valor_cobrado = 0 (assinatura):
     - Automaticamente marca como pago (payment_method = 'assinatura')
   - status = 'concluido', payment_status = 'pago'
   - Trigger calcula comissão automaticamente

4. Em caso de no-show:
   - Clicar em "Cliente não compareceu"
   - status = 'nao_compareceu'
   - Não gera comissão nem lançamento financeiro