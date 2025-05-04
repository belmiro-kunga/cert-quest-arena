-- Criação das tabelas principais
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id INT,
    role_id INT,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payment_methods (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    description VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS certifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration_minutes INT NOT NULL,
    passing_score INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Primeiro criamos a tabela orders sem a referência ao payment_transaction_id
CREATE TABLE IF NOT EXISTS orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pendente', 'aprovado', 'cancelado') DEFAULT 'pendente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Agora criamos a tabela payment_transactions que referencia orders
CREATE TABLE IF NOT EXISTS payment_transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    payment_method_id INT NOT NULL,
    transaction_id VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'BRL',
    status ENUM('pending', 'processing', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    payment_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id)
);

-- Agora adicionamos a coluna payment_transaction_id na tabela orders
ALTER TABLE orders 
ADD COLUMN payment_transaction_id INT NULL,
ADD FOREIGN KEY (payment_transaction_id) REFERENCES payment_transactions(id);

CREATE TABLE IF NOT EXISTS simulated_exams (
    id INT PRIMARY KEY AUTO_INCREMENT,
    certification_id INT,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    duration_minutes INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (certification_id) REFERENCES certifications(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS questions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    simulated_exam_id INT,
    question_text TEXT NOT NULL,
    explanation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (simulated_exam_id) REFERENCES simulated_exams(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS alternatives (
    id INT PRIMARY KEY AUTO_INCREMENT,
    question_id INT,
    alternative_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS exam_attempts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    simulated_exam_id INT,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP NULL,
    score INT,
    status ENUM('em_andamento', 'concluido', 'expirado') DEFAULT 'em_andamento',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (simulated_exam_id) REFERENCES simulated_exams(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_answers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    exam_attempt_id INT,
    question_id INT,
    alternative_id INT,
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (exam_attempt_id) REFERENCES exam_attempts(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    FOREIGN KEY (alternative_id) REFERENCES alternatives(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
    read_status BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cart_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    certification_id INT,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (certification_id) REFERENCES certifications(id) ON DELETE CASCADE
);

-- Inserir roles padrão
INSERT INTO roles (name, description) VALUES
('admin', 'Administrador do sistema'),
('user', 'Usuário comum');

-- Inserir métodos de pagamento disponíveis
INSERT INTO payment_methods (name, code, description) VALUES
('Visa', 'VISA', 'Pagamento com cartão Visa'),
('Mastercard', 'MASTERCARD', 'Pagamento com cartão Mastercard'),
('PayPal', 'PAYPAL', 'Pagamento via PayPal'),
('Google Pay', 'GOOGLEPAY', 'Pagamento via Google Pay'),
('Skrill', 'SKRILL', 'Pagamento via Skrill'),
('Stripe', 'STRIPE', 'Pagamento via Stripe');

-- Inserir usuários para teste
INSERT INTO users (name, email, password) VALUES
('Administrador', 'admin@sistema.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Aluno Teste', 'aluno@teste.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Student Example', 'student@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Associar roles aos usuários
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE (u.email = 'admin@sistema.com' AND r.name = 'admin')
   OR ((u.email = 'aluno@teste.com' OR u.email = 'student@example.com') AND r.name = 'user');

-- Inserir certificações
INSERT INTO certifications (name, description, price, duration_minutes, passing_score) VALUES
('Certificação Básica / Basic Certification', 
 'Certificação de nível básico para iniciantes / Basic level certification for beginners',
 199.99,
 60,
 60),
('Certificação Intermediária / Intermediate Certification',
 'Certificação de nível intermediário / Intermediate level certification',
 299.99,
 90,
 70);

-- Inserir simulados
INSERT INTO simulated_exams (certification_id, title, description, duration_minutes) VALUES
(1, 'Simulado Básico 1 / Basic Mock 1',
 'Primeiro simulado básico / First basic mock',
 30),
(2, 'Simulado Intermediário 1 / Intermediate Mock 1',
 'Primeiro simulado intermediário / First intermediate mock',
 40);

-- Inserir questões
INSERT INTO questions (simulated_exam_id, question_text, explanation) VALUES
(1, 'O que é computação em nuvem? / What is cloud computing?',
 'A computação em nuvem fornece recursos de TI pela internet. / Cloud computing provides IT resources over the internet.'),
(1, 'Qual é a capital do Brasil? / What is the capital of Brazil?',
 'Brasília é a capital do Brasil. / Brasilia is the capital of Brazil.'),
(2, 'O que significa BIOS? / What does BIOS mean?',
 'BIOS é o sistema básico de entrada e saída. / BIOS is the basic input/output system.');

-- Inserir alternativas
-- Para Q1
INSERT INTO alternatives (question_id, alternative_text, is_correct) VALUES
(1, 'Serviços de TI fornecidos pela internet / IT services provided over the internet', TRUE),
(1, 'Um tipo de hardware / A type of hardware', FALSE),
(1, 'Um sistema operacional / An operating system', FALSE);

-- Para Q2
INSERT INTO alternatives (question_id, alternative_text, is_correct) VALUES
(2, 'Brasília / Brasilia', TRUE),
(2, 'Rio de Janeiro / Rio de Janeiro', FALSE),
(2, 'São Paulo / Sao Paulo', FALSE);

-- Para Q3
INSERT INTO alternatives (question_id, alternative_text, is_correct) VALUES
(3, 'Basic Input Output System / Basic Input Output System', TRUE),
(3, 'Binary Integrated Operating System / Binary Integrated Operating System', FALSE),
(3, 'Base Input Output Software / Base Input Output Software', FALSE);

-- Inserir algumas notificações de exemplo
INSERT INTO notifications (user_id, title, message, type) 
SELECT u.id, 'Bem-vindo!', 'Bem-vindo ao sistema de certificações!', 'info'
FROM users u
WHERE u.email IN ('aluno@teste.com', 'student@example.com');

-- Inserir alguns itens no carrinho de exemplo
INSERT INTO cart_items (user_id, certification_id, quantity)
SELECT u.id, c.id, 1
FROM users u, certifications c
WHERE u.email = 'aluno@teste.com' AND c.id = 1;

-- Inserir uma ordem de exemplo com pagamento
INSERT INTO orders (user_id, total_amount, status)
SELECT u.id, c.price, 'pendente'
FROM users u, certifications c
WHERE u.email = 'aluno@teste.com' AND c.id = 1;

-- Inserir uma transação de pagamento de exemplo
INSERT INTO payment_transactions (order_id, payment_method_id, transaction_id, amount, status, payment_data)
SELECT 
    o.id,
    pm.id,
    'TRX123456789',
    o.total_amount,
    'pending',
    '{"card_last4": "1234", "payment_method": "credit_card"}'
FROM orders o
JOIN payment_methods pm ON pm.code = 'VISA'
WHERE o.id = 1;

-- Atualizar a ordem com a referência do pagamento
UPDATE orders o
JOIN payment_transactions pt ON o.id = pt.order_id
SET o.payment_transaction_id = pt.id
WHERE o.id = 1; 