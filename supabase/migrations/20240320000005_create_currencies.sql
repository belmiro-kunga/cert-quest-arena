-- Create currencies table
CREATE TABLE IF NOT EXISTS currencies (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  symbol TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default currencies
INSERT INTO currencies (code, name, symbol) VALUES
  ('BRL', 'Real Brasileiro', 'R$'),
  ('USD', 'Dólar Americano', '$'),
  ('EUR', 'Euro', '€')
ON CONFLICT (code) DO NOTHING;

-- Create RLS policies
ALTER TABLE currencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Currencies are viewable by everyone"
  ON currencies FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert currencies"
  ON currencies FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can update currencies"
  ON currencies FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete currencies"
  ON currencies FOR DELETE
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  ); 