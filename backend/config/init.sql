-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    photo VARCHAR(255),
    admin BOOLEAN DEFAULT FALSE,
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Certificações
CREATE TABLE IF NOT EXISTS certificacoes (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Simulados
CREATE TABLE IF NOT EXISTS simulados (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    qt_questoes INTEGER NOT NULL,
    duracao_minutos INTEGER NOT NULL,
    dificuldade VARCHAR(50),
    preco DECIMAL(10,2),
    preco_desconto DECIMAL(10,2),
    percentual_desconto INTEGER,
    data_fim_desconto TIMESTAMP,
    qt_vendas INTEGER DEFAULT 0,
    avaliacao DECIMAL(3,1),
    nota_aprovacao INTEGER DEFAULT 70,
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Questões
CREATE TABLE IF NOT EXISTS questoes (
    id SERIAL PRIMARY KEY,
    simulado_id INTEGER REFERENCES simulados(id),
    enunciado TEXT NOT NULL,
    explicacao TEXT,
    ativa BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Alternativas
CREATE TABLE IF NOT EXISTS alternativas (
    id SERIAL PRIMARY KEY,
    questao_id INTEGER REFERENCES questoes(id),
    texto TEXT NOT NULL,
    correta BOOLEAN DEFAULT FALSE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Tentativas de Simulado
CREATE TABLE IF NOT EXISTS tentativas_simulado (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id),
    simulado_id INTEGER REFERENCES simulados(id),
    data_inicio TIMESTAMP NOT NULL,
    data_fim TIMESTAMP,
    nota DECIMAL(5,2)
);

-- Tabela de Respostas do Usuário
CREATE TABLE IF NOT EXISTS respostas_usuario (
    id SERIAL PRIMARY KEY,
    tentativa_id INTEGER REFERENCES tentativas_simulado(id),
    questao_id INTEGER REFERENCES questoes(id),
    alternativa_id INTEGER REFERENCES alternativas(id),
    correta BOOLEAN,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Itens do Carrinho
CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES usuarios(id),
    item_type VARCHAR(50) NOT NULL,
    item_id INTEGER NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id),
    valor_total DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    metodo_pagamento VARCHAR(50),
    data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Itens do Pedido
CREATE TABLE IF NOT EXISTS itens_pedido (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER REFERENCES pedidos(id),
    simulado_id INTEGER REFERENCES simulados(id),
    preco DECIMAL(10,2) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Notificações
CREATE TABLE IF NOT EXISTS notificacoes (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id),
    titulo VARCHAR(255) NOT NULL,
    mensagem TEXT NOT NULL,
    lida BOOLEAN DEFAULT FALSE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Pagamentos
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER REFERENCES pedidos(id),
    valor DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    provider_payment_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Configurações do Sistema (inclui reCAPTCHA)
CREATE TABLE IF NOT EXISTS system_settings (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    key VARCHAR(100) NOT NULL,
    value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (category, key)
);

-- Valores padrão para reCAPTCHA
INSERT INTO system_settings (category, key, value)
VALUES 
  ('recaptcha', 'enabled', 'true'),
  ('recaptcha', 'siteKey', '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'),
  ('recaptcha', 'secretKey', '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe'),
  ('recaptcha', 'threshold', '3')
ON CONFLICT (category, key) DO NOTHING; 