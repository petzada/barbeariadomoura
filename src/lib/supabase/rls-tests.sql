-- =====================================================
-- TESTES DE ROW LEVEL SECURITY (RLS)
-- Execute estes testes no Supabase SQL Editor
-- =====================================================

-- =====================================================
-- PREPARAÇÃO: Criar usuários de teste
-- =====================================================

-- Inserir usuários de teste (ajuste os IDs conforme necessário)
-- Cliente: auth.uid() = 'cliente-test-id'
-- Barbeiro: auth.uid() = 'barbeiro-test-id'  
-- Admin: auth.uid() = 'admin-test-id'

-- =====================================================
-- TESTE 1: Tabela USERS
-- =====================================================

-- 1.1 - Cliente só pode ver seu próprio perfil
-- SET request.jwt.claims.sub = 'cliente-test-id';
-- SELECT * FROM users; -- Deve retornar apenas 1 registro

-- 1.2 - Cliente pode atualizar seu próprio perfil
-- UPDATE users SET nome = 'Teste Update' WHERE id = 'cliente-test-id';
-- Deve funcionar

-- 1.3 - Cliente NÃO pode atualizar perfil de outro usuário
-- UPDATE users SET nome = 'Hacker' WHERE id = 'outro-user-id';
-- Deve falhar ou não afetar nenhum registro

-- 1.4 - Admin pode ver todos os usuários
-- SET request.jwt.claims.sub = 'admin-test-id';
-- SELECT * FROM users; -- Deve retornar todos os registros

-- =====================================================
-- TESTE 2: Tabela PROFESSIONALS
-- =====================================================

-- 2.1 - Qualquer usuário pode ver profissionais ativos
-- SELECT * FROM professionals WHERE ativo = true;
-- Deve funcionar para qualquer role

-- 2.2 - Apenas admin pode criar profissional
-- INSERT INTO professionals (user_id, especialidades, ativo) 
-- VALUES ('novo-user-id', ARRAY['corte'], true);
-- Deve funcionar apenas para admin

-- =====================================================
-- TESTE 3: Tabela SERVICES
-- =====================================================

-- 3.1 - Qualquer usuário pode ver serviços ativos
-- SELECT * FROM services WHERE ativo = true;
-- Deve funcionar

-- 3.2 - Apenas admin pode criar/editar serviços
-- INSERT INTO services (nome, descricao, preco, duracao_minutos, ativo)
-- VALUES ('Teste', 'Desc', 50.00, 30, true);
-- Deve funcionar apenas para admin

-- =====================================================
-- TESTE 4: Tabela APPOINTMENTS (Crítico)
-- =====================================================

-- 4.1 - Cliente só pode ver seus próprios agendamentos
-- SET request.jwt.claims.sub = 'cliente-test-id';
-- SELECT * FROM appointments;
-- Deve retornar apenas agendamentos do cliente

-- 4.2 - Cliente pode criar agendamento para si mesmo
-- INSERT INTO appointments (
--   cliente_id, profissional_id, servico_id, 
--   data_hora_inicio, data_hora_fim, valor_servico, valor_cobrado
-- ) VALUES (
--   'cliente-test-id', 'prof-id', 'servico-id',
--   NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day 30 minutes',
--   50.00, 50.00
-- );
-- Deve funcionar

-- 4.3 - Cliente NÃO pode criar agendamento para outro usuário
-- INSERT INTO appointments (cliente_id, ...) VALUES ('outro-cliente-id', ...);
-- Deve falhar

-- 4.4 - Barbeiro pode ver agendamentos onde é o profissional
-- SET request.jwt.claims.sub = 'barbeiro-test-id';
-- SELECT * FROM appointments;
-- Deve retornar apenas agendamentos do barbeiro

-- 4.5 - Barbeiro pode atualizar status dos seus agendamentos
-- UPDATE appointments 
-- SET status = 'em_andamento' 
-- WHERE profissional_id = (SELECT id FROM professionals WHERE user_id = 'barbeiro-test-id');
-- Deve funcionar

-- 4.6 - Admin pode ver todos os agendamentos
-- SET request.jwt.claims.sub = 'admin-test-id';
-- SELECT * FROM appointments;
-- Deve retornar todos os registros

-- =====================================================
-- TESTE 5: Tabela SUBSCRIPTIONS
-- =====================================================

-- 5.1 - Cliente só pode ver suas próprias assinaturas
-- SET request.jwt.claims.sub = 'cliente-test-id';
-- SELECT * FROM subscriptions;
-- Deve retornar apenas assinaturas do cliente

-- 5.2 - Cliente NÃO pode atualizar status da assinatura
-- UPDATE subscriptions SET status = 'ativa' WHERE cliente_id = 'cliente-test-id';
-- Deve falhar (apenas service_role pode)

-- =====================================================
-- TESTE 6: Tabela COMMISSIONS
-- =====================================================

-- 6.1 - Barbeiro só pode ver suas comissões
-- SET request.jwt.claims.sub = 'barbeiro-test-id';
-- SELECT * FROM commissions;
-- Deve retornar apenas comissões do barbeiro

-- 6.2 - Barbeiro NÃO pode inserir/editar comissões
-- INSERT INTO commissions (...) VALUES (...);
-- Deve falhar

-- =====================================================
-- TESTE 7: Tabela PAYMENTS
-- =====================================================

-- 7.1 - Cliente só pode ver pagamentos dos seus agendamentos
-- SET request.jwt.claims.sub = 'cliente-test-id';
-- SELECT p.* FROM payments p
-- JOIN appointments a ON p.appointment_id = a.id
-- WHERE a.cliente_id = 'cliente-test-id';
-- Deve funcionar

-- 7.2 - Admin pode ver todos os pagamentos
-- SET request.jwt.claims.sub = 'admin-test-id';
-- SELECT * FROM payments;
-- Deve retornar todos

-- =====================================================
-- TESTE 8: Tabelas de Horários
-- =====================================================

-- 8.1 - Qualquer usuário pode ver business_hours
-- SELECT * FROM business_hours;
-- Deve funcionar

-- 8.2 - Apenas admin pode editar business_hours
-- UPDATE business_hours SET abertura = '08:00' WHERE dia_semana = 1;
-- Deve funcionar apenas para admin

-- 8.3 - Barbeiro pode ver/editar seus próprios horários
-- SET request.jwt.claims.sub = 'barbeiro-test-id';
-- SELECT * FROM professional_hours WHERE profissional_id = 'meu-prof-id';
-- Deve funcionar

-- =====================================================
-- RESUMO DE EXPECTATIVAS POR ROLE
-- =====================================================

/*
CLIENTE:
- users: SELECT/UPDATE próprio registro
- appointments: SELECT/INSERT/UPDATE próprios (com restrições)
- subscriptions: SELECT próprias
- services: SELECT ativos
- professionals: SELECT ativos
- subscription_plans: SELECT ativos
- payments: SELECT via appointment próprio

BARBEIRO:
- Tudo do cliente +
- appointments: SELECT/UPDATE onde é profissional
- commissions: SELECT próprias
- professional_hours: SELECT/UPDATE próprios
- blocked_slots: INSERT/UPDATE/DELETE próprios

ADMIN:
- FULL ACCESS em todas as tabelas
*/

-- =====================================================
-- QUERIES PARA DEBUG
-- =====================================================

-- Ver políticas de uma tabela específica
-- SELECT pol.polname, pol.polcmd, pg_get_expr(pol.polqual, pol.polrelid) as qual
-- FROM pg_policy pol
-- JOIN pg_class cls ON pol.polrelid = cls.oid
-- WHERE cls.relname = 'appointments';

-- Verificar role do usuário atual
-- SELECT get_user_role(auth.uid());

-- Verificar se é admin
-- SELECT is_admin(auth.uid());

-- Verificar ID do profissional do usuário atual
-- SELECT get_professional_id(auth.uid());
