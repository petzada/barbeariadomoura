-- ============================================
-- MIGRATION: Corrigir trigger de comissão
-- Problemas corrigidos:
-- 1. Usava valor_cobrado para calcular comissão (deveria usar valor_servico)
-- 2. Não tinha SECURITY DEFINER, causando erro de RLS ao inserir comissão
-- ============================================

-- Recriar função de cálculo de comissão corrigida
-- SECURITY DEFINER permite que o trigger insira na tabela commissions
-- mesmo que o usuário não tenha permissão direta de INSERT
CREATE OR REPLACE FUNCTION calculate_commission()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
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
        
        -- Insere comissão usando valor_servico (valor original do serviço)
        -- Isso garante que o profissional recebe comissão mesmo quando
        -- o cliente tem assinatura e valor_cobrado = 0
        INSERT INTO commissions (
            profissional_id,
            agendamento_id,
            valor_servico,
            percentual,
            valor_comissao
        ) VALUES (
            NEW.profissional_id,
            NEW.id,
            NEW.valor_servico,  -- Usar valor original do serviço
            v_percentual,
            ROUND(NEW.valor_servico * v_percentual / 100, 2)  -- Calcular sobre valor original
        )
        ON CONFLICT (agendamento_id) DO NOTHING;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Nota: O trigger já existe, apenas a função foi atualizada
-- CREATE TRIGGER trigger_calculate_commission já existe na migration 001
