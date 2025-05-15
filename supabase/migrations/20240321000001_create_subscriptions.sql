-- Adicionar colunas de subscrição à tabela simulados
ALTER TABLE simulados
ADD COLUMN is_subscription BOOLEAN DEFAULT FALSE,
ADD COLUMN subscription_duration INTEGER DEFAULT 90,
ADD COLUMN subscription_price DECIMAL(10, 2),
ADD COLUMN subscription_currency VARCHAR(3) DEFAULT 'BRL';

-- Criar tabela de subscrições de usuários
CREATE TABLE user_subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    simulado_id INTEGER NOT NULL,
    start_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    payment_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (simulado_id) REFERENCES simulados(id),
    CONSTRAINT unique_active_subscription UNIQUE (user_id, simulado_id, status)
);

-- Criar índice para busca eficiente de subscrições ativas
CREATE INDEX idx_user_subscriptions_active ON user_subscriptions(user_id, simulado_id, status);

-- Função para atualizar o timestamp de atualização
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar o timestamp de atualização
CREATE TRIGGER update_user_subscriptions_updated_at
    BEFORE UPDATE ON user_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Função para verificar subscrições expiradas
CREATE OR REPLACE FUNCTION check_expired_subscriptions()
RETURNS void AS $$
BEGIN
    UPDATE user_subscriptions
    SET status = 'expired'
    WHERE status = 'active'
    AND end_date < CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- Criar job para verificar subscrições expiradas diariamente
SELECT cron.schedule(
    'check-expired-subscriptions',
    '0 0 * * *',  -- Executar à meia-noite todos os dias
    $$SELECT check_expired_subscriptions()$$
); 