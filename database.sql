-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE order_status AS ENUM ('pending', 'approved', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');
CREATE TYPE notification_type AS ENUM ('info', 'success', 'warning', 'error');
CREATE TYPE exam_status AS ENUM ('in_progress', 'completed', 'expired');

-- Create tables with UUID primary keys and timestamps
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE IF NOT EXISTS payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    description VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration_minutes INTEGER NOT NULL,
    passing_score INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    total_amount DECIMAL(10,2) NOT NULL,
    status order_status DEFAULT 'pending',
    payment_transaction_id UUID,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    payment_method_id UUID REFERENCES payment_methods(id),
    transaction_id VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'BRL',
    status payment_status DEFAULT 'pending',
    payment_data JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key constraint after both tables exist
ALTER TABLE orders 
    ADD CONSTRAINT fk_payment_transaction 
    FOREIGN KEY (payment_transaction_id) 
    REFERENCES payment_transactions(id);

CREATE TABLE IF NOT EXISTS simulated_exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    certification_id UUID REFERENCES certifications(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    simulated_exam_id UUID REFERENCES simulated_exams(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    explanation TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS alternatives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    alternative_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exam_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    simulated_exam_id UUID REFERENCES simulated_exams(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMPTZ,
    score INTEGER,
    status exam_status DEFAULT 'in_progress'
);

CREATE TABLE IF NOT EXISTS user_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_attempt_id UUID REFERENCES exam_attempts(id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    alternative_id UUID REFERENCES alternatives(id) ON DELETE CASCADE,
    answered_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    type notification_type DEFAULT 'info',
    read_status BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    certification_id UUID REFERENCES certifications(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS email_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    subject VARCHAR(200) NOT NULL,
    body TEXT NOT NULL,
    variables JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Trigger para atualização automática do updated_at
CREATE TRIGGER update_email_template_updated_at
    BEFORE UPDATE ON email_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_certification_name ON certifications(name);
CREATE INDEX idx_order_user ON orders(user_id);
CREATE INDEX idx_exam_attempt_user ON exam_attempts(user_id);
CREATE INDEX idx_notification_user ON notifications(user_id);
CREATE INDEX idx_cart_user ON cart_items(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own data" ON users
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can view own orders" ON orders
    FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view own exam attempts" ON exam_attempts
    FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own answers" ON user_answers
    FOR ALL
    USING (auth.uid() = (SELECT user_id FROM exam_attempts WHERE id = exam_attempt_id));

CREATE POLICY "Users can view own notifications" ON notifications
    FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own cart" ON cart_items
    FOR ALL
    USING (auth.uid() = user_id);

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_user_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_certification_updated_at
    BEFORE UPDATE ON certifications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_order_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_transaction_updated_at
    BEFORE UPDATE ON payment_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Inserir templates de email iniciais
INSERT INTO email_templates (name, subject, body, variables) VALUES
('exam-results', 'Seus Resultados do Exame {{examName}} 📝',
'Olá {{name}},

Os resultados do seu exame {{examName}} estão prontos!

🏅 Pontuação Final: {{score}}/{{totalPoints}}
⏱️ Tempo de Conclusão: {{completionTime}}
✅ Questões Corretas: {{correctAnswers}}/{{totalQuestions}}
📈 Taxa de Acerto: {{accuracyRate}}%

Análise Detalhada:

📗 Áreas de Domínio:
{{strongAreas}}

📋 Áreas para Melhorar:
{{improvementAreas}}

💡 Recomendações de Estudo:
{{studyRecommendations}}

Próximos Passos:
{{nextSteps}}

Você pode revisar suas respostas em detalhes aqui:
{{reviewLink}}

{{passingMessage}}

Continue se dedicando!

Atenciosamente,
Equipe CertQuest Arena',
'{"variables": ["name", "examName", "score", "totalPoints", "completionTime", "correctAnswers", "totalQuestions", "accuracyRate", "strongAreas", "improvementAreas", "studyRecommendations", "nextSteps", "reviewLink", "passingMessage"]}'
) ON CONFLICT (name) DO UPDATE SET
    subject = EXCLUDED.subject,
    body = EXCLUDED.body,
    variables = EXCLUDED.variables;

INSERT INTO email_templates (name, subject, body, variables) VALUES
('milestone-reached', 'Parabéns! Você alcançou um novo marco! 🏆',
'Olá {{name}},

Parabéns! Você acabou de alcançar um marco importante na sua jornada:

🏆 {{milestoneName}}

{{milestoneDescription}}

Com esta conquista, você ganhou:
{{rewards}}

Seu progresso até agora:
- Total de horas estudadas: {{totalHours}}
- Questões respondidas: {{questionsAnswered}}
- Taxa de acerto: {{accuracyRate}}%

Próximo marco:
{{nextMilestone}}

Continue assim! Cada passo é importante na sua jornada de aprendizado.

Atenciosamente,
Equipe CertQuest Arena',
'{"variables": ["name", "milestoneName", "milestoneDescription", "rewards", "totalHours", "questionsAnswered", "accuracyRate", "nextMilestone"]}'
) ON CONFLICT (name) DO UPDATE SET
    subject = EXCLUDED.subject,
    body = EXCLUDED.body,
    variables = EXCLUDED.variables;

INSERT INTO email_templates (name, subject, body, variables) VALUES
('welcome', 'Bem-vindo ao CertQuest Arena - Comece Sua Jornada!',
'Olá {{name}},

Bem-vindo ao CertQuest Arena! Estamos muito felizes em ter você conosco.

Para ajudar você a começar sua jornada de certificação, preparamos um guia inicial:

1. Primeiros Passos:
   - Complete seu perfil em: {{profileLink}}
   - Faça o teste de nivelamento: {{assessmentLink}}
   - Explore nossa biblioteca de recursos: {{resourcesLink}}

2. Certificações Recomendadas para seu perfil:
   {{recommendedCerts}}

3. Próximos Passos:
   - Participe de nossa comunidade: {{communityLink}}
   - Agende sua primeira sessão de estudo
   - Configure suas metas de aprendizado

Dicas importantes:
- Use nosso sistema de flashcards para memorização
- Participe dos simulados semanais
- Acompanhe seu progresso no dashboard

Se precisar de ajuda, nossa equipe está disponível em {{supportEmail}}.

Boa jornada de aprendizado!

Atenciosamente,
Equipe CertQuest Arena',
'{"variables": ["name", "profileLink", "assessmentLink", "resourcesLink", "recommendedCerts", "communityLink", "supportEmail"]}'
) ON CONFLICT (name) DO UPDATE SET
    subject = EXCLUDED.subject,
    body = EXCLUDED.body,
    variables = EXCLUDED.variables;