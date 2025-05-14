-- Adiciona coluna language à tabela questoes para suporte a múltiplos idiomas
ALTER TABLE questoes ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT 'pt';
-- Opcional: criar índice para busca eficiente por idioma
CREATE INDEX IF NOT EXISTS idx_questoes_language ON questoes(language);
