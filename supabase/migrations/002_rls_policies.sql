-- ============================================
-- BARBEARIA DO MOURA - POLÍTICAS RLS
-- ============================================
-- Row Level Security (RLS) para segurança em nível de linha
-- Cada tabela tem políticas específicas por role

-- ============================================
-- HABILITAR RLS EM TODAS AS TABELAS
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_slots ENABLE ROW LEVEL SECURITY;

-- ============================================
-- FUNÇÃO AUXILIAR: Verificar role do usuário
-- ============================================
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS user_role AS $$
    SELECT role FROM users WHERE id = user_id;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- ============================================
-- FUNÇÃO AUXILIAR: Verificar se é admin
-- ============================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid()
        AND role = 'admin'
    );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- ============================================
-- FUNÇÃO AUXILIAR: Verificar se é barbeiro
-- ============================================
CREATE OR REPLACE FUNCTION is_barbeiro()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid()
        AND role = 'barbeiro'
    );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- ============================================
-- FUNÇÃO AUXILIAR: Obter professional_id do usuário
-- ============================================
CREATE OR REPLACE FUNCTION get_professional_id()
RETURNS UUID AS $$
    SELECT id FROM professionals WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- ============================================
-- POLÍTICAS: users
-- ============================================

-- Todos podem ver perfis públicos
CREATE POLICY "users_select_public" ON users
    FOR SELECT
    USING (true);

-- Usuário pode atualizar próprio perfil
CREATE POLICY "users_update_own" ON users
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Admin pode atualizar qualquer perfil
CREATE POLICY "users_update_admin" ON users
    FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

-- Admin pode deletar usuários (exceto ele mesmo)
CREATE POLICY "users_delete_admin" ON users
    FOR DELETE
    USING (is_admin() AND auth.uid() != id);

-- ============================================
-- POLÍTICAS: professionals
-- ============================================

-- Todos podem ver profissionais ativos
CREATE POLICY "professionals_select_active" ON professionals
    FOR SELECT
    USING (ativo = true OR is_admin());

-- Admin pode inserir profissionais
CREATE POLICY "professionals_insert_admin" ON professionals
    FOR INSERT
    WITH CHECK (is_admin());

-- Admin ou próprio profissional pode atualizar
CREATE POLICY "professionals_update" ON professionals
    FOR UPDATE
    USING (is_admin() OR user_id = auth.uid())
    WITH CHECK (is_admin() OR user_id = auth.uid());

-- Admin pode deletar profissionais
CREATE POLICY "professionals_delete_admin" ON professionals
    FOR DELETE
    USING (is_admin());

-- ============================================
-- POLÍTICAS: services
-- ============================================

-- Todos podem ver serviços ativos
CREATE POLICY "services_select_active" ON services
    FOR SELECT
    USING (ativo = true OR is_admin());

-- Admin pode inserir serviços
CREATE POLICY "services_insert_admin" ON services
    FOR INSERT
    WITH CHECK (is_admin());

-- Admin pode atualizar serviços
CREATE POLICY "services_update_admin" ON services
    FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

-- Admin pode deletar serviços
CREATE POLICY "services_delete_admin" ON services
    FOR DELETE
    USING (is_admin());

-- ============================================
-- POLÍTICAS: packages
-- ============================================

-- Todos podem ver pacotes ativos
CREATE POLICY "packages_select_active" ON packages
    FOR SELECT
    USING (ativo = true OR is_admin());

-- Admin pode gerenciar pacotes
CREATE POLICY "packages_insert_admin" ON packages
    FOR INSERT
    WITH CHECK (is_admin());

CREATE POLICY "packages_update_admin" ON packages
    FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "packages_delete_admin" ON packages
    FOR DELETE
    USING (is_admin());

-- ============================================
-- POLÍTICAS: subscription_plans
-- ============================================

-- Todos podem ver planos ativos
CREATE POLICY "subscription_plans_select_active" ON subscription_plans
    FOR SELECT
    USING (ativo = true OR is_admin());

-- Admin pode gerenciar planos
CREATE POLICY "subscription_plans_insert_admin" ON subscription_plans
    FOR INSERT
    WITH CHECK (is_admin());

CREATE POLICY "subscription_plans_update_admin" ON subscription_plans
    FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "subscription_plans_delete_admin" ON subscription_plans
    FOR DELETE
    USING (is_admin());

-- ============================================
-- POLÍTICAS: subscriptions
-- ============================================

-- Cliente vê próprias assinaturas, admin vê todas
CREATE POLICY "subscriptions_select" ON subscriptions
    FOR SELECT
    USING (cliente_id = auth.uid() OR is_admin());

-- Cliente pode criar assinatura para si
CREATE POLICY "subscriptions_insert_cliente" ON subscriptions
    FOR INSERT
    WITH CHECK (cliente_id = auth.uid());

-- Admin pode criar assinatura para qualquer cliente
CREATE POLICY "subscriptions_insert_admin" ON subscriptions
    FOR INSERT
    WITH CHECK (is_admin());

-- Cliente pode cancelar própria assinatura
CREATE POLICY "subscriptions_update_cliente" ON subscriptions
    FOR UPDATE
    USING (cliente_id = auth.uid())
    WITH CHECK (cliente_id = auth.uid());

-- Admin pode atualizar qualquer assinatura
CREATE POLICY "subscriptions_update_admin" ON subscriptions
    FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

-- ============================================
-- POLÍTICAS: appointments
-- ============================================

-- Cliente vê próprios agendamentos
CREATE POLICY "appointments_select_cliente" ON appointments
    FOR SELECT
    USING (cliente_id = auth.uid());

-- Barbeiro vê agendamentos onde é o profissional
CREATE POLICY "appointments_select_barbeiro" ON appointments
    FOR SELECT
    USING (profissional_id = get_professional_id());

-- Admin vê todos os agendamentos
CREATE POLICY "appointments_select_admin" ON appointments
    FOR SELECT
    USING (is_admin());

-- Cliente pode criar agendamento para si
CREATE POLICY "appointments_insert_cliente" ON appointments
    FOR INSERT
    WITH CHECK (cliente_id = auth.uid());

-- Admin pode criar agendamento para qualquer cliente
CREATE POLICY "appointments_insert_admin" ON appointments
    FOR INSERT
    WITH CHECK (is_admin());

-- Cliente pode atualizar (cancelar) próprio agendamento
CREATE POLICY "appointments_update_cliente" ON appointments
    FOR UPDATE
    USING (cliente_id = auth.uid())
    WITH CHECK (cliente_id = auth.uid());

-- Barbeiro pode atualizar agendamentos onde é o profissional
CREATE POLICY "appointments_update_barbeiro" ON appointments
    FOR UPDATE
    USING (profissional_id = get_professional_id())
    WITH CHECK (profissional_id = get_professional_id());

-- Admin pode atualizar qualquer agendamento
CREATE POLICY "appointments_update_admin" ON appointments
    FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

-- ============================================
-- POLÍTICAS: payments
-- ============================================

-- Cliente vê próprios pagamentos
CREATE POLICY "payments_select_cliente" ON payments
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM appointments a
            WHERE a.id = agendamento_id
            AND a.cliente_id = auth.uid()
        )
        OR
        EXISTS (
            SELECT 1 FROM subscriptions s
            WHERE s.id = assinatura_id
            AND s.cliente_id = auth.uid()
        )
    );

-- Admin vê todos os pagamentos
CREATE POLICY "payments_select_admin" ON payments
    FOR SELECT
    USING (is_admin());

-- Admin pode gerenciar pagamentos
CREATE POLICY "payments_insert_admin" ON payments
    FOR INSERT
    WITH CHECK (is_admin());

CREATE POLICY "payments_update_admin" ON payments
    FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

-- ============================================
-- POLÍTICAS: commissions
-- ============================================

-- Barbeiro vê próprias comissões
CREATE POLICY "commissions_select_barbeiro" ON commissions
    FOR SELECT
    USING (profissional_id = get_professional_id());

-- Admin vê todas as comissões
CREATE POLICY "commissions_select_admin" ON commissions
    FOR SELECT
    USING (is_admin());

-- Comissões são criadas por trigger, admin pode atualizar
CREATE POLICY "commissions_update_admin" ON commissions
    FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

-- ============================================
-- POLÍTICAS: commission_rates
-- ============================================

-- Barbeiro pode ver suas taxas de comissão
CREATE POLICY "commission_rates_select_barbeiro" ON commission_rates
    FOR SELECT
    USING (profissional_id = get_professional_id());

-- Admin vê e gerencia todas as taxas
CREATE POLICY "commission_rates_select_admin" ON commission_rates
    FOR SELECT
    USING (is_admin());

CREATE POLICY "commission_rates_insert_admin" ON commission_rates
    FOR INSERT
    WITH CHECK (is_admin());

CREATE POLICY "commission_rates_update_admin" ON commission_rates
    FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "commission_rates_delete_admin" ON commission_rates
    FOR DELETE
    USING (is_admin());

-- ============================================
-- POLÍTICAS: business_hours
-- ============================================

-- Todos podem ver horário de funcionamento
CREATE POLICY "business_hours_select_all" ON business_hours
    FOR SELECT
    USING (true);

-- Admin pode gerenciar horários
CREATE POLICY "business_hours_insert_admin" ON business_hours
    FOR INSERT
    WITH CHECK (is_admin());

CREATE POLICY "business_hours_update_admin" ON business_hours
    FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "business_hours_delete_admin" ON business_hours
    FOR DELETE
    USING (is_admin());

-- ============================================
-- POLÍTICAS: professional_hours
-- ============================================

-- Todos podem ver horários dos profissionais
CREATE POLICY "professional_hours_select_all" ON professional_hours
    FOR SELECT
    USING (true);

-- Barbeiro pode gerenciar próprios horários
CREATE POLICY "professional_hours_insert_barbeiro" ON professional_hours
    FOR INSERT
    WITH CHECK (profissional_id = get_professional_id());

CREATE POLICY "professional_hours_update_barbeiro" ON professional_hours
    FOR UPDATE
    USING (profissional_id = get_professional_id())
    WITH CHECK (profissional_id = get_professional_id());

-- Admin pode gerenciar horários de todos
CREATE POLICY "professional_hours_insert_admin" ON professional_hours
    FOR INSERT
    WITH CHECK (is_admin());

CREATE POLICY "professional_hours_update_admin" ON professional_hours
    FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "professional_hours_delete_admin" ON professional_hours
    FOR DELETE
    USING (is_admin());

-- ============================================
-- POLÍTICAS: blocked_slots
-- ============================================

-- Todos podem ver bloqueios (para validar agendamentos)
CREATE POLICY "blocked_slots_select_all" ON blocked_slots
    FOR SELECT
    USING (true);

-- Barbeiro pode criar bloqueios para si
CREATE POLICY "blocked_slots_insert_barbeiro" ON blocked_slots
    FOR INSERT
    WITH CHECK (profissional_id = get_professional_id());

CREATE POLICY "blocked_slots_update_barbeiro" ON blocked_slots
    FOR UPDATE
    USING (profissional_id = get_professional_id())
    WITH CHECK (profissional_id = get_professional_id());

CREATE POLICY "blocked_slots_delete_barbeiro" ON blocked_slots
    FOR DELETE
    USING (profissional_id = get_professional_id());

-- Admin pode gerenciar todos os bloqueios
CREATE POLICY "blocked_slots_insert_admin" ON blocked_slots
    FOR INSERT
    WITH CHECK (is_admin());

CREATE POLICY "blocked_slots_update_admin" ON blocked_slots
    FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "blocked_slots_delete_admin" ON blocked_slots
    FOR DELETE
    USING (is_admin());

-- ============================================
-- REALTIME: Habilitar para tabelas necessárias
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE appointments;
ALTER PUBLICATION supabase_realtime ADD TABLE subscriptions;
