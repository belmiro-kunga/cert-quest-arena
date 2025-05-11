-- Habilitar RLS para a tabela profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir inserção de novos perfis
CREATE POLICY "Enable insert for authenticated users" ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Criar política para permitir visualização dos próprios dados
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Criar política para permitir atualização dos próprios dados
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Criar política para permitir que admins vejam todos os perfis
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.user_id = auth.uid()
      AND p.role = 'admin'
    )
  );
