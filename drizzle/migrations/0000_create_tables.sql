-- Este é um exemplo de arquivo de migração que o Drizzle Kit iria gerar
-- O arquivo real seria gerado automaticamente pelo comando "drizzle-kit generate:pg"

-- Criação inicial das tabelas
CREATE TABLE IF NOT EXISTS "users" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "password" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'user',
  "authorized" BOOLEAN DEFAULT false,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "expiration_date" TIMESTAMP,
  "profile_picture" TEXT,
  "preferred_language" TEXT DEFAULT 'pt',
  "theme" TEXT DEFAULT 'default',
  "accent_color" TEXT DEFAULT '#3498db',
  "layout" TEXT DEFAULT 'sidebar',
  "two_factor_code" TEXT,
  "two_factor_code_expires" TIMESTAMP,
  "reset_password_token" TEXT,
  "reset_password_expires" TIMESTAMP
);