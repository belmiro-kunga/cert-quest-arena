-- Migração para garantir que o campo tipo existe na tabela questoes
-- e atualizar questões existentes sem tipo para 'single_choice'

-- 1. Verificar se a coluna tipo já existe e, caso não exista, criar:
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'questoes' AND column_name = 'tipo'
    ) THEN
        -- Adiciona a coluna tipo caso ela não exista
        ALTER TABLE questoes ADD COLUMN tipo VARCHAR(50) DEFAULT 'single_choice';
        RAISE NOTICE 'Coluna tipo adicionada à tabela questoes com sucesso.';
    ELSE
        RAISE NOTICE 'Coluna tipo já existe na tabela questoes.';
    END IF;
END $$;

-- 2. Atualizar registros existentes que estão com o campo nulo ou vazio
UPDATE questoes 
SET tipo = 'single_choice' 
WHERE tipo IS NULL OR tipo = '';

-- 3. Adicionar restrição NOT NULL se ela não existe
DO $$
BEGIN
    -- Primeiro verifica se a coluna existe e se já é NOT NULL
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'questoes' 
        AND column_name = 'tipo'
        AND is_nullable = 'YES' -- Coluna permite NULL
    ) THEN
        -- Torna a coluna NOT NULL
        ALTER TABLE questoes ALTER COLUMN tipo SET NOT NULL;
        RAISE NOTICE 'Restrição NOT NULL adicionada à coluna tipo.';
    ELSE
        RAISE NOTICE 'Coluna tipo já é NOT NULL ou não existe.';
    END IF;
END $$;

-- 4. Verificar se existem valores inválidos para tipo e corrigi-los
UPDATE questoes 
SET tipo = 'single_choice' 
WHERE tipo NOT IN ('single_choice', 'multiple_choice', 'drag_and_drop', 'practical_scenario', 'fill_in_blank', 'command_line', 'network_topology');

-- 5. Adicionar um comentário à coluna para documentar os valores válidos
COMMENT ON COLUMN questoes.tipo IS 'Tipo da questão: single_choice, multiple_choice, drag_and_drop, practical_scenario, fill_in_blank, command_line, network_topology';

-- 6. Reportar quantas questões foram atualizadas
DO $$
DECLARE
    updated_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO updated_count FROM questoes WHERE tipo = 'single_choice';
    RAISE NOTICE 'Total de questões com tipo single_choice: %', updated_count;
    
    SELECT COUNT(*) INTO updated_count FROM questoes WHERE tipo = 'multiple_choice';
    RAISE NOTICE 'Total de questões com tipo multiple_choice: %', updated_count;
END $$; 