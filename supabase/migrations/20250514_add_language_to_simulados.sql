-- Adiciona a coluna 'language' à tabela simulados, se não existir
ALTER TABLE simulados ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'pt';
