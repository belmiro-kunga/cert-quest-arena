CREATE TABLE IF NOT EXISTS auth_settings (
    id SERIAL PRIMARY KEY,
    provider VARCHAR(50) NOT NULL,
    client_id TEXT,
    client_secret TEXT,
    callback_url TEXT,
    enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
