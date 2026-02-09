-- ============================================
-- MIGRAÇÃO: Permitir exclusão de profissionais mantendo histórico
-- ============================================
-- Esta migração altera as constraints de foreign key para permitir
-- que profissionais sejam excluídos enquanto os agendamentos e
-- comissões são mantidos no histórico.

-- 1. Tornar profissional_id nullable em appointments
ALTER TABLE appointments
ALTER COLUMN profissional_id DROP NOT NULL;

-- 2. Remover constraint antiga e adicionar nova com SET NULL
ALTER TABLE appointments
DROP CONSTRAINT appointments_profissional_id_fkey;

ALTER TABLE appointments
ADD CONSTRAINT appointments_profissional_id_fkey
FOREIGN KEY (profissional_id)
REFERENCES professionals(id)
ON DELETE SET NULL;

-- 3. Tornar profissional_id nullable em commissions
ALTER TABLE commissions
ALTER COLUMN profissional_id DROP NOT NULL;

-- 4. Alterar constraint de commissions para SET NULL
ALTER TABLE commissions
DROP CONSTRAINT commissions_profissional_id_fkey;

ALTER TABLE commissions
ADD CONSTRAINT commissions_profissional_id_fkey
FOREIGN KEY (profissional_id)
REFERENCES professionals(id)
ON DELETE SET NULL;

-- 5. Adicionar coluna para guardar o nome do profissional no histórico
-- Isso garante que mesmo após exclusão, saibamos quem foi o profissional
ALTER TABLE appointments
ADD COLUMN IF NOT EXISTS profissional_nome TEXT;

ALTER TABLE commissions
ADD COLUMN IF NOT EXISTS profissional_nome TEXT;

-- 6. Criar função para salvar nome do profissional antes de deletar
CREATE OR REPLACE FUNCTION save_professional_name_before_delete()
RETURNS TRIGGER AS $$
DECLARE
    v_nome TEXT;
BEGIN
    -- Buscar nome do profissional
    SELECT u.nome INTO v_nome
    FROM professionals p
    JOIN users u ON u.id = p.user_id
    WHERE p.id = OLD.id;

    -- Atualizar nome nos agendamentos
    UPDATE appointments
    SET profissional_nome = v_nome
    WHERE profissional_id = OLD.id AND profissional_nome IS NULL;

    -- Atualizar nome nas comissões
    UPDATE commissions
    SET profissional_nome = v_nome
    WHERE profissional_id = OLD.id AND profissional_nome IS NULL;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- 7. Criar trigger para salvar nome antes da exclusão
DROP TRIGGER IF EXISTS trigger_save_professional_name ON professionals;
CREATE TRIGGER trigger_save_professional_name
    BEFORE DELETE ON professionals
    FOR EACH ROW EXECUTE FUNCTION save_professional_name_before_delete();
