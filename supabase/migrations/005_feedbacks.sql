-- ============================================
-- MIGRAÇÃO: Sistema de Feedbacks
-- ============================================
-- Permite que clientes avaliem os atendimentos concluídos

-- Criar tabela de feedbacks
CREATE TABLE feedbacks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agendamento_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    cliente_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    profissional_id UUID REFERENCES professionals(id) ON DELETE SET NULL,
    profissional_nome TEXT,
    nota INTEGER NOT NULL CHECK (nota >= 1 AND nota <= 5),
    comentario TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Um feedback por agendamento
    UNIQUE(agendamento_id)
);

-- Índices para consultas
CREATE INDEX idx_feedbacks_cliente ON feedbacks(cliente_id);
CREATE INDEX idx_feedbacks_profissional ON feedbacks(profissional_id);
CREATE INDEX idx_feedbacks_created_at ON feedbacks(created_at DESC);
CREATE INDEX idx_feedbacks_nota ON feedbacks(nota);

-- Trigger para salvar nome do profissional automaticamente
CREATE OR REPLACE FUNCTION set_feedback_professional_name()
RETURNS TRIGGER AS $$
DECLARE
    v_nome TEXT;
    v_prof_id UUID;
BEGIN
    -- Buscar profissional_id do agendamento
    SELECT a.profissional_id INTO v_prof_id
    FROM appointments a
    WHERE a.id = NEW.agendamento_id;

    -- Se tem profissional, buscar o nome
    IF v_prof_id IS NOT NULL THEN
        SELECT u.nome INTO v_nome
        FROM professionals p
        JOIN users u ON u.id = p.user_id
        WHERE p.id = v_prof_id;

        NEW.profissional_id := v_prof_id;
        NEW.profissional_nome := v_nome;
    ELSE
        -- Usar o nome salvo no agendamento (profissional foi excluído)
        SELECT a.profissional_nome INTO v_nome
        FROM appointments a
        WHERE a.id = NEW.agendamento_id;

        NEW.profissional_nome := v_nome;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_feedback_professional_name
    BEFORE INSERT ON feedbacks
    FOR EACH ROW EXECUTE FUNCTION set_feedback_professional_name();

-- RLS Policies
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;

-- Clientes podem ver e criar seus próprios feedbacks
CREATE POLICY "Clientes podem ver seus feedbacks"
    ON feedbacks FOR SELECT
    USING (auth.uid() = cliente_id);

CREATE POLICY "Clientes podem criar feedbacks"
    ON feedbacks FOR INSERT
    WITH CHECK (auth.uid() = cliente_id);

-- Admins podem ver todos os feedbacks
CREATE POLICY "Admins podem ver todos os feedbacks"
    ON feedbacks FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Profissionais NÃO podem ver os feedbacks (conforme solicitado)
