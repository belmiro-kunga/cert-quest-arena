-- Create system_settings table
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform_name TEXT NOT NULL DEFAULT 'CertQuest Arena',
    logo_url TEXT,
    favicon_url TEXT,
    primary_color TEXT NOT NULL DEFAULT '#2563eb',
    secondary_color TEXT NOT NULL DEFAULT '#1e40af',
    language TEXT NOT NULL DEFAULT 'pt-BR',
    timezone TEXT NOT NULL DEFAULT 'America/Sao_Paulo',
    currency TEXT NOT NULL DEFAULT 'BRL',
    -- Email Settings
    smtp_host TEXT,
    smtp_port INTEGER,
    smtp_username TEXT,
    smtp_password TEXT,
    smtp_secure BOOLEAN DEFAULT true,
    smtp_from_email TEXT,
    smtp_from_name TEXT,
    email_notifications_enabled BOOLEAN DEFAULT true,
    email_subscriptions_enabled BOOLEAN DEFAULT true,
    spam_protection_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create email_templates table
CREATE TABLE IF NOT EXISTS email_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    variables JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create email_subscriptions table
CREATE TABLE IF NOT EXISTS email_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL,
    name TEXT,
    preferences JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create a trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_system_settings_updated_at
    BEFORE UPDATE ON system_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_templates_updated_at
    BEFORE UPDATE ON email_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_subscriptions_updated_at
    BEFORE UPDATE ON email_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default settings
INSERT INTO system_settings (
    platform_name,
    primary_color,
    secondary_color,
    language,
    timezone,
    currency,
    smtp_from_email,
    smtp_from_name
) VALUES (
    'CertQuest Arena',
    '#2563eb',
    '#1e40af',
    'pt-BR',
    'America/Sao_Paulo',
    'BRL',
    'noreply@certquest.com',
    'CertQuest Arena'
) ON CONFLICT DO NOTHING;

-- Insert default email templates
INSERT INTO email_templates (name, subject, body, variables) VALUES
(
    'welcome',
    'Bem-vindo ao CertQuest Arena!',
    'Olá {{name}},\n\nBem-vindo ao CertQuest Arena! Estamos muito felizes em tê-lo conosco.\n\nAtenciosamente,\nEquipe CertQuest',
    '{"name": "Nome do usuário"}'
),
(
    'password_reset',
    'Redefinição de Senha - CertQuest Arena',
    'Olá {{name}},\n\nVocê solicitou a redefinição de sua senha. Clique no link abaixo para criar uma nova senha:\n\n{{reset_link}}\n\nSe você não solicitou esta redefinição, ignore este email.\n\nAtenciosamente,\nEquipe CertQuest',
    '{"name": "Nome do usuário", "reset_link": "Link de redefinição de senha"}'
),
(
    'exam_result',
    'Resultado do Exame - CertQuest Arena',
    'Olá {{name}},\n\nSeu resultado do exame {{exam_name}} está disponível.\n\nPontuação: {{score}}\nStatus: {{status}}\n\nAcesse sua conta para ver mais detalhes.\n\nAtenciosamente,\nEquipe CertQuest',
    '{"name": "Nome do usuário", "exam_name": "Nome do exame", "score": "Pontuação", "status": "Status"}'
) ON CONFLICT DO NOTHING;

-- Create storage bucket for system files
INSERT INTO storage.buckets (id, name, public) VALUES ('system', 'system', true);

-- Create storage policies
CREATE POLICY "System files are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'system');

CREATE POLICY "Only admins can upload system files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'system' AND
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can update system files"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'system' AND
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete system files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'system' AND
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  ); 