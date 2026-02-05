-- ============================================
-- BARBEARIA DO MOURA - SCHEMA INICIAL
-- ============================================
-- Execute este arquivo no Supabase SQL Editor
-- Ou use: supabase db push

-- ============================================
-- EXTENSÕES
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================
CREATE TYPE user_role AS ENUM ('cliente', 'barbeiro', 'admin');
CREATE TYPE appointment_status AS ENUM ('agendado', 'em_andamento', 'concluido', 'cancelado', 'nao_compareceu');
CREATE TYPE payment_status AS ENUM ('pendente', 'pago', 'reembolsado', 'cancelado');
CREATE TYPE payment_method AS ENUM ('pix', 'cartao_credito', 'cartao_debito', 'dinheiro', 'assinatura');
CREATE TYPE subscription_status AS ENUM ('ativa', 'cancelada', 'suspensa', 'expirada');

-- ============================================
-- TABELA: users (perfis de usuário)
-- ============================================
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    role user_role NOT NULL DEFAULT 'cliente',
    nome TEXT NOT NULL,
    telefone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================
-- TABELA: professionals (barbeiros)
-- ============================================
CREATE TABLE professionals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    foto_url TEXT,
    ativo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Índices
CREATE INDEX idx_professionals_user_id ON professionals(user_id);
CREATE INDEX idx_professionals_ativo ON professionals(ativo);

-- ============================================
-- TABELA: services (serviços)
-- ============================================
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    descricao TEXT,
    preco DECIMAL(10, 2) NOT NULL CHECK (preco >= 0),
    duracao_minutos INTEGER NOT NULL CHECK (duracao_minutos > 0),
    ativo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice
CREATE INDEX idx_services_ativo ON services(ativo);

-- ============================================
-- TABELA: packages (pacotes de serviços)
-- ============================================
CREATE TABLE packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    descricao TEXT,
    preco DECIMAL(10, 2) NOT NULL CHECK (preco >= 0),
    servicos_ids UUID[] NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice
CREATE INDEX idx_packages_ativo ON packages(ativo);

-- ============================================
-- TABELA: subscription_plans (planos de assinatura)
-- ============================================
CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    descricao TEXT,
    preco_mensal DECIMAL(10, 2) NOT NULL CHECK (preco_mensal >= 0),
    servicos_inclusos UUID[] NOT NULL,
    dias_permitidos INTEGER[], -- null = todos os dias, [1,2,3] = seg, ter, qua
    ativo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice
CREATE INDEX idx_subscription_plans_ativo ON subscription_plans(ativo);

-- ============================================
-- TABELA: subscriptions (assinaturas dos clientes)
-- ============================================
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cliente_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plano_id UUID NOT NULL REFERENCES subscription_plans(id) ON DELETE RESTRICT,
    status subscription_status NOT NULL DEFAULT 'ativa',
    mp_subscription_id TEXT, -- ID da assinatura no Mercado Pago
    data_inicio DATE NOT NULL DEFAULT CURRENT_DATE,
    proxima_cobranca DATE,
    data_cancelamento TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_subscriptions_cliente_id ON subscriptions(cliente_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_mp_id ON subscriptions(mp_subscription_id);

-- ============================================
-- TABELA: appointments (agendamentos)
-- ============================================
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cliente_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    profissional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE RESTRICT,
    servico_id UUID NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
    data_hora_inicio TIMESTAMPTZ NOT NULL,
    data_hora_fim TIMESTAMPTZ NOT NULL,
    status appointment_status NOT NULL DEFAULT 'agendado',
    valor_servico DECIMAL(10, 2) NOT NULL CHECK (valor_servico >= 0),
    valor_cobrado DECIMAL(10, 2) NOT NULL CHECK (valor_cobrado >= 0),
    coberto_assinatura BOOLEAN NOT NULL DEFAULT false,
    assinatura_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
    payment_status payment_status NOT NULL DEFAULT 'pendente',
    payment_method payment_method,
    observacoes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Constraint para evitar sobreposição de horários
    CONSTRAINT check_horario CHECK (data_hora_fim > data_hora_inicio)
);

-- Índices
CREATE INDEX idx_appointments_cliente_id ON appointments(cliente_id);
CREATE INDEX idx_appointments_profissional_id ON appointments(profissional_id);
CREATE INDEX idx_appointments_data_hora ON appointments(data_hora_inicio);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_data_prof ON appointments(profissional_id, data_hora_inicio);

-- ============================================
-- TABELA: payments (pagamentos)
-- ============================================
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agendamento_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    assinatura_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
    valor DECIMAL(10, 2) NOT NULL CHECK (valor >= 0),
    metodo payment_method NOT NULL,
    status payment_status NOT NULL DEFAULT 'pendente',
    mp_payment_id TEXT, -- ID do pagamento no Mercado Pago
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_payments_agendamento_id ON payments(agendamento_id);
CREATE INDEX idx_payments_assinatura_id ON payments(assinatura_id);
CREATE INDEX idx_payments_mp_id ON payments(mp_payment_id);
CREATE INDEX idx_payments_status ON payments(status);

-- ============================================
-- TABELA: commissions (comissões)
-- ============================================
CREATE TABLE commissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profissional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
    agendamento_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    valor_servico DECIMAL(10, 2) NOT NULL,
    percentual DECIMAL(5, 2) NOT NULL CHECK (percentual >= 0 AND percentual <= 100),
    valor_comissao DECIMAL(10, 2) NOT NULL,
    pago BOOLEAN NOT NULL DEFAULT false,
    data_pagamento DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(agendamento_id) -- Uma comissão por agendamento
);

-- Índices
CREATE INDEX idx_commissions_profissional_id ON commissions(profissional_id);
CREATE INDEX idx_commissions_pago ON commissions(pago);
CREATE INDEX idx_commissions_data ON commissions(created_at);

-- ============================================
-- TABELA: commission_rates (taxas de comissão por serviço)
-- ============================================
CREATE TABLE commission_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profissional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
    servico_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    percentual DECIMAL(5, 2) NOT NULL CHECK (percentual >= 0 AND percentual <= 100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(profissional_id, servico_id)
);

-- ============================================
-- TABELA: business_hours (horário de funcionamento da barbearia)
-- ============================================
CREATE TABLE business_hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dia_semana INTEGER NOT NULL CHECK (dia_semana >= 0 AND dia_semana <= 6), -- 0=Dom, 6=Sab
    abertura TIME NOT NULL,
    fechamento TIME NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT true,
    UNIQUE(dia_semana),
    CONSTRAINT check_horario_funcionamento CHECK (fechamento > abertura)
);

-- ============================================
-- TABELA: professional_hours (horário de trabalho do profissional)
-- ============================================
CREATE TABLE professional_hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profissional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
    dia_semana INTEGER NOT NULL CHECK (dia_semana >= 0 AND dia_semana <= 6),
    abertura TIME NOT NULL,
    fechamento TIME NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT true,
    UNIQUE(profissional_id, dia_semana),
    CONSTRAINT check_horario_profissional CHECK (fechamento > abertura)
);

-- Índice
CREATE INDEX idx_professional_hours_prof ON professional_hours(profissional_id);

-- ============================================
-- TABELA: blocked_slots (bloqueios de horários)
-- ============================================
CREATE TABLE blocked_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profissional_id UUID REFERENCES professionals(id) ON DELETE CASCADE, -- null = barbearia toda
    data_inicio TIMESTAMPTZ NOT NULL,
    data_fim TIMESTAMPTZ NOT NULL,
    motivo TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT check_bloqueio CHECK (data_fim > data_inicio)
);

-- Índices
CREATE INDEX idx_blocked_slots_profissional ON blocked_slots(profissional_id);
CREATE INDEX idx_blocked_slots_data ON blocked_slots(data_inicio, data_fim);

-- ============================================
-- TRIGGERS: updated_at automático
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger em todas as tabelas com updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_professionals_updated_at BEFORE UPDATE ON professionals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_packages_updated_at BEFORE UPDATE ON packages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON subscription_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_commission_rates_updated_at BEFORE UPDATE ON commission_rates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TRIGGER: Criar perfil ao registrar usuário
-- ============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, nome, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'nome', split_part(NEW.email, '@', 1)),
        'cliente'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- TRIGGER: Calcular comissão ao concluir agendamento
-- ============================================
CREATE OR REPLACE FUNCTION calculate_commission()
RETURNS TRIGGER AS $$
DECLARE
    v_percentual DECIMAL(5,2);
BEGIN
    -- Só calcula quando status muda para 'concluido'
    IF NEW.status = 'concluido' AND OLD.status != 'concluido' THEN
        -- Busca percentual de comissão configurado
        SELECT percentual INTO v_percentual
        FROM commission_rates
        WHERE profissional_id = NEW.profissional_id
        AND servico_id = NEW.servico_id;
        
        -- Se não encontrou configuração específica, usa 50% como padrão
        IF v_percentual IS NULL THEN
            v_percentual := 50.00;
        END IF;
        
        -- Insere comissão
        INSERT INTO commissions (
            profissional_id,
            agendamento_id,
            valor_servico,
            percentual,
            valor_comissao
        ) VALUES (
            NEW.profissional_id,
            NEW.id,
            NEW.valor_cobrado,
            v_percentual,
            ROUND(NEW.valor_cobrado * v_percentual / 100, 2)
        )
        ON CONFLICT (agendamento_id) DO NOTHING;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_commission
    AFTER UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION calculate_commission();

-- ============================================
-- DADOS INICIAIS
-- ============================================

-- Horários de funcionamento padrão
INSERT INTO business_hours (dia_semana, abertura, fechamento, ativo) VALUES
    (0, '09:00', '13:00', false),  -- Domingo (fechado)
    (1, '09:00', '20:00', false),  -- Segunda (fechado)
    (2, '09:00', '20:00', true),   -- Terça
    (3, '09:00', '20:00', true),   -- Quarta
    (4, '09:00', '20:00', true),   -- Quinta
    (5, '09:00', '20:00', true),   -- Sexta
    (6, '09:00', '18:00', true);   -- Sábado

-- Serviços exemplo
INSERT INTO services (nome, descricao, preco, duracao_minutos) VALUES
    ('Corte de Cabelo', 'Corte masculino tradicional ou moderno', 45.00, 30),
    ('Barba', 'Barba completa com navalha e toalha quente', 35.00, 20),
    ('Corte + Barba', 'Combo corte de cabelo e barba completa', 70.00, 45),
    ('Sobrancelha', 'Design e limpeza de sobrancelha', 15.00, 10),
    ('Pigmentação', 'Pigmentação de barba ou cabelo', 80.00, 60),
    ('Hidratação', 'Tratamento de hidratação capilar', 40.00, 30);

-- Planos de assinatura exemplo
INSERT INTO subscription_plans (nome, descricao, preco_mensal, servicos_inclusos, dias_permitidos) VALUES
    (
        'Plano Básico',
        'Ideal para quem mantém o visual em dia. Cortes ilimitados de terça a quinta.',
        89.90,
        (SELECT ARRAY_AGG(id) FROM services WHERE nome = 'Corte de Cabelo'),
        ARRAY[2, 3, 4]  -- Terça, Quarta, Quinta
    ),
    (
        'Plano Premium',
        'Para quem não abre mão do melhor. Corte + Barba ilimitados, qualquer dia.',
        149.90,
        (SELECT ARRAY_AGG(id) FROM services WHERE nome IN ('Corte de Cabelo', 'Barba', 'Corte + Barba')),
        NULL  -- Todos os dias
    ),
    (
        'Plano VIP',
        'Experiência completa. Todos os serviços inclusos, qualquer dia.',
        199.90,
        (SELECT ARRAY_AGG(id) FROM services),
        NULL  -- Todos os dias
    );
